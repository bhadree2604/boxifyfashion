const whatsappNumber = '9817197390';
const email = 'info@boxifyfashion.com';
const makeWhatsAppUrl = (text) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

const socialIcons = {
  Instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm11.25 1.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0zM12 8.5A3.5 3.5 0 1 1 8.5 12A3.5 3.5 0 0 1 12 8.5zm0 2a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 10.5z"/></svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 10.5H15V8h-1.5A3 3 0 0 0 10.5 11v1.5H9V15h1.5v6h2.5v-6H15l.5-2.5h-2V11a.5.5 0 0 1 .5-.5z"/></svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.06 5 12 5 12 5s-6.06 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2A26.9 26.9 0 0 0 2 12a26.9 26.9 0 0 0 .4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.94 19 12 19 12 19s6.06 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.9 26.9 0 0 0 22 12a26.9 26.9 0 0 0-.4-4.8zM10 15.5v-7l6 3.5z"/></svg>
  ),
  WhatsApp: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2A9.9 9.9 0 0 0 2 11.93c0 1.77.46 3.49 1.33 5.01L2 22l5.2-1.3A9.98 9.98 0 1 0 12.04 2Zm5.58 14.48c-.23.65-1.37 1.23-1.9 1.3c-.49.07-1.1.1-1.77-.11c-.41-.13-.94-.3-1.62-.59c-2.85-1.23-4.7-4.1-4.85-4.29c-.14-.19-1.16-1.54-1.16-2.94c0-1.4.72-2.08.98-2.36c.26-.28.58-.35.78-.35h.56c.18 0 .42-.07.66.5c.23.56.77 1.93.84 2.07c.07.14.12.3.02.49c-.1.19-.15.3-.3.46c-.15.16-.32.36-.46.48c-.15.12-.3.26-.13.55c.17.28.76 1.25 1.63 2.02c1.12.99 2.06 1.3 2.35 1.46c.29.16.46.14.64-.08c.18-.21.74-.86.93-1.16c.19-.3.39-.25.66-.15c.26.09 1.68.8 1.97.94c.29.14.48.21.55.32c.07.12.07.68-.16 1.34Z"/></svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2m0 2v.51l8 4.99l8-4.99V8H4m0 8h16V9.69l-7.4 4.62a1 1 0 0 1-1.09 0L4 9.69V16Z"/></svg>
  ),
};

export default function ContactPage() {
  return (
    <main style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
      <section className="grid">
        <h1>Contact</h1>
        <p>Share your article, colors, sizes, and quantity (MOQ 10). Fast quotes on WhatsApp or email.</p>
      </section>

      <section className="grid">
        <div className="cta-wide" style={{ color: 'white' }}>
          <div>
            <p className="eyebrow">Let’s start your next run</p>
            <h2>Custom orders · bulk pricing · fast delivery</h2>
            <p className="muted">Track pants, t-shirts, joggers, jackets, custom teamwear with labeling/packing on request.</p>
          </div>
          <div className="cta-row">
            <a className="btn solid" href={makeWhatsAppUrl('Hi, I want to place a wholesale order with Boxify Fashion. Please connect.')} target="_blank" rel="noreferrer">
              WhatsApp +91 {whatsappNumber}
            </a>
            <a className="btn ghost" href={`mailto:${email}`}>Email {email}</a>
          </div>
          <div className="contact-meta">
            <span>MOQ 10 · Volume discounts</span>
            <span>Custom branding & packing</span>
            <span>Factory-owned production</span>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="section-header">
          <h3>Talk to our team</h3>
          <p>Fast replies on WhatsApp; detailed quotes over email.</p>
        </div>
        <div className="contact-grid">
          <div className="info-card">
            <span className="pill subtle">Fastest</span>
            <h4>WhatsApp</h4>
            <p className="muted">Under 30 mins during working hours.</p>
            <a className="btn solid small" href={makeWhatsAppUrl('Hi, I need wholesale pricing and lead times.')} target="_blank" rel="noreferrer">Chat now</a>
          </div>
          <div className="info-card">
            <span className="pill subtle">Quotes & PO</span>
            <h4>Email</h4>
            <p className="muted">Attachments, specs, branding files.</p>
            <a className="btn ghost small" href={`mailto:${email}`}>Email {email}</a>
          </div>
          <div className="info-card">
            <span className="pill subtle">Business hours</span>
            <h4>Mon–Sat</h4>
            <p className="muted">9:30 AM – 7:00 PM IST · MOQ 10+</p>
            <div className="contact-meta mini">
              <span>Custom branding</span>
              <span>Bulk dispatch</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid">
        <h3>Direct details</h3>
        <div className="info-card">
          <ul className="direct-list">
            <li><strong>WhatsApp:</strong> <a className="social-link" href={makeWhatsAppUrl('Hi, need pricing and timelines.')} target="_blank" rel="noreferrer"><span className="social-icon" aria-hidden="true">{socialIcons.WhatsApp}</span>+91 {whatsappNumber}</a></li>
            <li><strong>Email:</strong> <a className="social-link" href={`mailto:${email}`}><span className="social-icon" aria-hidden="true">{socialIcons.Email}</span>{email}</a></li>
            <li><strong>Instagram:</strong> <a className="social-link" href="https://www.instagram.com/boxifyfashion" target="_blank" rel="noreferrer"><span className="social-icon" aria-hidden="true">{socialIcons.Instagram}</span>@boxifyfashion</a></li>
            <li><strong>Facebook:</strong> <a className="social-link" href="https://www.facebook.com/boxifyfashion" target="_blank" rel="noreferrer"><span className="social-icon" aria-hidden="true">{socialIcons.Facebook}</span>boxifyfashion</a></li>
            <li><strong>YouTube:</strong> <a className="social-link" href="https://www.youtube.com/@boxifyfashion" target="_blank" rel="noreferrer"><span className="social-icon" aria-hidden="true">{socialIcons.YouTube}</span>@boxifyfashion</a></li>
            <li><strong>Location:</strong> <a className="social-link" href="https://maps.app.goo.gl/kS9i11DCVksHnotN6?g_st=iwb" target="_blank" rel="noreferrer">View on Google Maps</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
