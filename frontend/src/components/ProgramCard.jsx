import { Link } from 'react-router-dom';
import { useLang } from '../i18n/index.jsx';

export default function ProgramCard({ program }) {
  const { t, getField } = useLang();
  return (
    <div className="card">
      <div className="card-body">
        <h3 style={{ marginBottom: '0.75rem', color: 'var(--clr-accent)' }}>
          {getField(program, 'title')}
        </h3>
        <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          {getField(program, 'description')?.slice(0, 150)}
          {getField(program, 'description')?.length > 150 ? '…' : ''}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {program.age_group && (
            <span className="badge badge-green">
              {t('programs.age_group')}: {program.age_group}
            </span>
          )}
          {program.duration && (
            <span className="badge badge-gold">
              {t('programs.duration')}: {program.duration}
            </span>
          )}
          <span className="badge badge-gold">
            {program.fee == null ? t('programs.fee_free') : `₹${program.fee}`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to={`/programs/${program.id}`} className="btn btn-outline btn-sm">
            {t('common.read_more')}
          </Link>
          <Link to="/admissions" className="btn btn-primary btn-sm">
            {t('programs.enroll_cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
