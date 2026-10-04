import ProgramCard from '../components/ProgramCard.jsx';
import { usePrograms } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';

export default function Programs() {
  const { t } = useLang();
  const { data, loading, error } = usePrograms({ is_active: true });
  const programs = data?.results || data || [];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>{t('programs.heading')}</h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading && <div className="spinner" />}
          {error   && <div className="alert alert-danger">{t('common.error')}</div>}
          {!loading && programs.length === 0 && (
            <p className="text-center text-muted">{t('admin.no_items')}</p>
          )}
          <div className="grid-3">
            {programs.map((p) => <ProgramCard key={p.id} program={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
