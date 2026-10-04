import { useLang } from '../i18n/index.jsx';

export default function TestimonialCard({ testimonial }) {
  const { getField } = useLang();
  return (
    <div className="testimonial-card">
      <p style={{ marginBottom: '1.25rem', lineHeight: '1.8', fontSize: '0.95rem' }}>
        {getField(testimonial, 'quote')}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {testimonial.photo && (
          <img
            src={testimonial.photo}
            alt={testimonial.author_name}
            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{testimonial.author_name}</div>
          <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem', textTransform: 'capitalize' }}>
            {testimonial.role}
          </div>
        </div>
      </div>
    </div>
  );
}
