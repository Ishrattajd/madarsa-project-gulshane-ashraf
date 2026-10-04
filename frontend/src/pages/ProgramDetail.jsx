import { useParams, Link } from 'react-router-dom';
import { useProgram } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';

export default function ProgramDetail() {
  const { id } = useParams();
  const { t, getField } = useLang();
  const { data: program, loading, error } = useProgram(id);

  if (loading) {
    return (
      <div className="container section text-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="container section text-center">
        <div className="alert alert-danger" style={{ maxWidth: 500, margin: '0 auto 2rem' }}>
          {t('common.error')}
        </div>
        <Link to="/programs" className="btn btn-outline">
          ← {t('nav.programs')}
        </Link>
      </div>
    );
  }

  const title = getField(program, 'title');
  const description = getField(program, 'description');

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <Link to="/programs" style={{ color: 'var(--clr-accent)', fontSize: '0.9rem', display: 'inline-block', marginBottom: '0.5rem' }}>
            ← {t('nav.programs')}
          </Link>
          <h1>{title}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {program.age_group && (
                  <span className="badge badge-green" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                    {t('programs.age_group')}: {program.age_group}
                  </span>
                )}
                {program.duration && (
                  <span className="badge badge-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                    {t('programs.duration')}: {program.duration}
                  </span>
                )}
                <span className="badge badge-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  {program.fee == null ? t('programs.fee_free') : `₹${program.fee}`}
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--clr-accent)' }}>
                About this Program
              </h2>

              <p style={{ color: 'var(--clr-text-muted)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                {description}
              </p>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem' }}>
                <Link to="/admissions" className="btn btn-primary btn-lg">
                  {t('programs.enroll_cta')} →
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  {t('nav.contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
