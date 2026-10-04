/**
 * AdminLogin.jsx — phone + OTP authentication ONLY.
 * NO email/password login — this was a hard requirement.
 *
 * Flow:
 *   1. Enter admin phone → POST /api/v1/auth/otp/send/ (purpose='admin')
 *   2. Enter OTP → POST /api/v1/auth/otp/verify/ (purpose='admin')
 *   3. On success: store JWT access+refresh, redirect to /admin
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/index.jsx';
import api from '../api/client.js';

import { useSiteSettings } from '../hooks/index.js';
import logoImg from '../assets/logo/logo-source.png';

export default function AdminLogin() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();

  const [phone, setPhone]     = useState('');
  const [otp, setOtp]         = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/otp/send/', { phone, purpose: 'admin' });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/verify/', { phone, otp, purpose: 'admin' });
      localStorage.setItem('madarsa_access',  res.data.access);
      localStorage.setItem('madarsa_refresh', res.data.refresh);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--clr-bg)',
      padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo / brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src={settings?.logo_url || logoImg}
            alt="Logo"
            style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 1rem', borderRadius: 8 }}
          />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{t('admin.login_heading')}</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>
            Phone + OTP authentication
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label" htmlFor="al-phone">{t('admin.phone_label')}</label>
                  <input
                    id="al-phone"
                    className="form-input"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    autoFocus
                    required
                  />
                  <small style={{ color: 'var(--clr-text-dim)', fontSize: '0.75rem' }}>
                    Must be registered as an admin staff account.
                  </small>
                </div>
                <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                  {loading ? t('common.loading') : t('admin.send_otp')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="alert" style={{ background: 'rgba(63,185,80,0.1)', border: '1px solid var(--clr-success)', color: 'var(--clr-success)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
                  OTP sent to {phone}
                </div>
                <div className="form-group mt-2">
                  <label className="form-label" htmlFor="al-otp">{t('admin.otp_label')}</label>
                  <input
                    id="al-otp"
                    className="form-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    autoFocus
                    required
                  />
                </div>
                <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                  {loading ? t('common.loading') : t('admin.verify_login')}
                </button>
                <button
                  type="button"
                  className="btn btn-outline w-full mt-2"
                  onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                >
                  ← Change Number
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
