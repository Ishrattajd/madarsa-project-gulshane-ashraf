/**
 * Donate.jsx — Full donor OTP verification flow before checkout.
 *
 * Step 1: Phone → send OTP → (POST /api/v1/auth/otp/send/)
 * Step 2: Enter OTP → verify → get donor_verification_token
 *         (POST /api/v1/auth/otp/verify/ with purpose='donor')
 * Step 3: Fill donation details + pay
 *         POST /api/v1/donations/create-order/ with donor_verification_token
 *         → Razorpay checkout opens
 *         → on success: POST /api/v1/donations/verify-payment/
 *
 * When is_mock_mode is true (from /donations/status/):
 *   - A striped 'TEST MODE — NO REAL PAYMENT' banner is shown
 *   - Razorpay SDK is NOT loaded; a mock success is simulated instead
 */

import { useState, useEffect } from 'react';
import { useDonateStatus, useDonationFunds } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';
import api from '../api/client.js';

const STEP_PHONE   = 0;
const STEP_DETAILS = 1;
const STEP_SUCCESS = 2;

export default function Donate() {
  const { t } = useLang();
  const { data: status }       = useDonateStatus();
  const { data: fundsData }    = useDonationFunds();
  const isMock  = status?.is_mock_mode ?? false;
  const keyId   = status?.razorpay_key_id || '';
  const funds   = fundsData?.results || fundsData || [];

  const [step, setStep]                         = useState(STEP_PHONE);
  const [phone, setPhone]                       = useState('');
  const [otp, setOtp]                           = useState('');
  const [otpSent, setOtpSent]                   = useState(false);
  const [donorToken, setDonorToken]             = useState('');
  const [form, setForm]                         = useState({ donor_name: '', donor_email: '', fund: '', amount: '', currency: 'INR', is_recurring: false });
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState('');
  const [fieldErrors, setFieldErrors]           = useState({});

  // Inject Razorpay checkout script (only when not in mock mode)
  useEffect(() => {
    if (isMock || !keyId) return;
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, [isMock, keyId]);

  // ---- Step 1: Send OTP ----
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/otp/send/', { phone, purpose: 'donor' });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // ---- Step 1: Verify OTP → donor_verification_token ----
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/verify/', { phone, otp, purpose: 'donor' });
      setDonorToken(res.data.donor_verification_token);
      setStep(STEP_DETAILS);
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // ---- Step 2: Create order + Razorpay checkout ----
  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    if (!form.fund)   { setFieldErrors((p) => ({ ...p, fund: 'Please select a fund.' })); return; }
    if (!form.amount || +form.amount < 1) { setFieldErrors((p) => ({ ...p, amount: 'Enter a valid amount.' })); return; }

    setLoading(true);
    try {
      const orderRes = await api.post('/donations/create-order/', {
        ...form,
        donor_phone: phone,
        donor_verification_token: donorToken,
        fund: +form.fund,
        amount: +form.amount,
      });
      const { razorpay_order_id, amount: paise, currency, donation_id } = orderRes.data;

      if (isMock) {
        // Mock mode: simulate payment success without real Razorpay
        await api.post('/donations/verify-payment/', {
          razorpay_order_id,
          razorpay_payment_id: `pay_MOCK_${Date.now()}`,
          razorpay_signature: 'mock_signature',
        });
        setStep(STEP_SUCCESS);
        return;
      }

      // Real Razorpay checkout
      const options = {
        key: keyId,
        amount: paise,
        currency,
        order_id: razorpay_order_id,
        name: 'Gulshan-e-Ashraf Arbi Madarsa',
        description: 'Donation',
        prefill: { name: form.donor_name, email: form.donor_email, contact: phone },
        theme: { color: '#1B4332' },
        handler: async (response) => {
          try {
            await api.post('/donations/verify-payment/', {
              razorpay_order_id:  response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            setStep(STEP_SUCCESS);
          } catch {
            setError('Payment verification failed. Please contact us with your payment ID.');
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mock mode banner — always visible if mock is active */}
      {isMock && (
        <div className="mock-banner" role="alert">
          {t('donate.mock_banner')}
          <div className="mock-banner-subtitle">{t('donate.mock_subtitle')}</div>
        </div>
      )}

      <div className="page-hero">
        <div className="container">
          <h1>{t('donate.heading')}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 600 }}>

          {/* Steps indicator */}
          {step < STEP_SUCCESS && (
            <div className="steps">
              <div className={`step-item${step === STEP_PHONE ? ' active' : ''}${donorToken ? ' done' : ''}`}>
                {t('donate.step_phone')}
              </div>
              <div className={`step-item${step === STEP_DETAILS ? ' active' : ''}`}>
                {t('donate.step_details')}
              </div>
              <div className="step-item">{t('donate.step_pay')}</div>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {/* ===== STEP 0: Phone + OTP ===== */}
          {step === STEP_PHONE && (
            <div className="card">
              <div className="card-body">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="d-phone">{t('donate.phone_label')}</label>
                      <input
                        id="d-phone"
                        className="form-input"
                        type="tel"
                        inputMode="numeric"
                        placeholder="9XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required
                      />
                    </div>
                    <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                      {loading ? t('common.loading') : t('donate.send_otp')}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <p className="text-success mb-2">✓ {t('donate.otp_sent')}</p>
                    <div className="form-group">
                      <label className="form-label" htmlFor="d-otp">{t('donate.otp_label')}</label>
                      <input
                        id="d-otp"
                        className="form-input"
                        type="text"
                        inputMode="numeric"
                        placeholder="123456"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                      />
                    </div>
                    <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                      {loading ? t('common.loading') : t('donate.verify_otp')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline w-full mt-2"
                      onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                    >
                      {t('donate.otp_resend')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ===== STEP 1: Donation details ===== */}
          {step === STEP_DETAILS && (
            <form onSubmit={handlePay}>
              <div className="alert alert-success">{t('donate.phone_verified')}</div>
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label" htmlFor="d-name">{t('donate.name_label')}</label>
                    <input id="d-name" className="form-input" type="text" required
                      value={form.donor_name}
                      onChange={(e) => setForm((p) => ({ ...p, donor_name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="d-email">{t('donate.email_label')}</label>
                    <input id="d-email" className="form-input" type="email"
                      value={form.donor_email}
                      onChange={(e) => setForm((p) => ({ ...p, donor_email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="d-fund">{t('donate.fund_label')}</label>
                    <select id="d-fund" className="form-select" required
                      value={form.fund}
                      onChange={(e) => setForm((p) => ({ ...p, fund: e.target.value }))}>
                      <option value="">— Select Fund —</option>
                      {funds.map((f) => (
                        <option key={f.id} value={f.id}>{f.name_en}</option>
                      ))}
                    </select>
                    {fieldErrors.fund && <span className="form-error">{fieldErrors.fund}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="d-amount">{t('donate.amount_label')}</label>
                    <input id="d-amount" className="form-input" type="number" min="1" step="1" required
                      value={form.amount}
                      onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
                    {fieldErrors.amount && <span className="form-error">{fieldErrors.amount}</span>}
                  </div>
                  <label className="form-checkbox-row">
                    <input type="checkbox"
                      checked={form.is_recurring}
                      onChange={(e) => setForm((p) => ({ ...p, is_recurring: e.target.checked }))} />
                    {t('donate.recurring_label')}
                  </label>
                </div>
              </div>

              {isMock && (
                <div className="alert alert-warning mt-2">
                  {t('donate.mock_banner')} — No real transaction will occur.
                </div>
              )}

              <button className="btn btn-accent w-full mt-3" type="submit" disabled={loading}
                style={{ fontSize: '1.1rem', padding: '0.875rem' }}>
                {loading ? t('common.loading') : t('donate.pay_button')}
              </button>
            </form>
          )}

          {/* ===== STEP 2: Success ===== */}
          {step === STEP_SUCCESS && (
            <div className="card text-center">
              <div className="card-body" style={{ padding: '3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h2 className="text-success">{t('donate.success_heading')}</h2>
                <p style={{ color: 'var(--clr-text-muted)', marginTop: '0.75rem' }}>
                  {t('donate.success_message')}
                </p>
                <button className="btn btn-primary mt-4"
                  onClick={() => { setStep(STEP_PHONE); setPhone(''); setOtp(''); setOtpSent(false); setDonorToken(''); setForm({ donor_name: '', donor_email: '', fund: '', amount: '', currency: 'INR', is_recurring: false }); }}>
                  Make Another Donation
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
