const values = [
  {
    title: 'Quality Assurance',
    text: 'Fabric testing, pattern alignment, seam checks, finishing.',
  },
  {
    title: 'Custom Branding',
    text: 'Print/embroidery, labels, tags, and packaging per spec.',
  },
  {
    title: 'Competitive Pricing',
    text: 'Factory-direct rates with predictable costs.',
  },
  {
    title: 'Reliable Delivery',
    text: 'On-time dispatch with transparent updates.',
  },
];

const timeline = [
  { year: '2018', text: 'Factory launched; first bulk tracksuit order shipped.' },
  { year: '2020', text: 'Expanded cutting/stitching lines; fleece/knit specialization.' },
  { year: '2022', text: '30K+ units/month capacity; upgraded QA + finishing.' },
  { year: '2024', text: 'Serving global B2B buyers with custom branding and rapid lead times.' },
];

const gallery = [
  { type: 'video', src: '/videos/video1.mov', alt: 'Factory video 1' },
  { type: 'image', src: '/images/about1.jpg', alt: 'Stitching closeup' },
  { type: 'image', src: '/images/about2.jpg', alt: 'Machine detail' },
  { type: 'image', src: '/images/about3.jpg', alt: 'Cutting floor' },
  { type: 'video', src: '/videos/video2.mov', alt: 'Factory video 2' },
  { type: 'image', src: '/images/about1.jpg', alt: 'Stitching repeat' },
  { type: 'video', src: '/videos/video3.mov', alt: 'Factory video 3' },
  { type: 'image', src: '/images/about2.jpg', alt: 'Machine repeat' },
  { type: 'image', src: '/images/about3.jpg', alt: 'Cutting repeat' },
  { type: 'video', src: '/videos/video1.mov', alt: 'Factory video 1 repeat' },
];

const ownerHistory = [
  { year: '2015', title: 'Apprentice tailor', desc: 'Learned cutting and stitching on the factory floor.' },
  { year: '2018', title: 'Founded Boxify Fashion', desc: 'Set up own cutting + stitching lines with QA steps.' },
  { year: '2021', title: 'Scaling production', desc: 'Reached 20K+ units/month with custom branding requests.' },
  { year: '2024', title: 'B2B expansion', desc: 'Serving global resellers with faster lead times and labeling.' },
];

export default function AboutPage() {
  return (
    <main style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
      <section className="grid">
        <h1>About Boxify Fashion</h1>
        <p>
          Boxify Fashion is a B2B-first manufacturer with its own tailoring floor—cutting, stitching, branding, and
          finishing under one roof for consistent wholesale quality. We ship bulk tracksuits, lowers, tees, polos,
          hoodies, and uniforms for retailers and resellers worldwide.
        </p>
      </section>

      <section className="split">
        <div className="text">
          <h2>Why us</h2>
          <div className="value-grid">
            {values.map((v) => (
              <div className="pill-card" key={v.title}>
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
          <div className="timeline">
            {timeline.map((t) => (
              <div className="timeline-row" key={t.year}>
                <div className="year">{t.year}</div>
                <div className="line" />
                <div className="text">{t.text}</div>
              </div>
            ))}
          </div>
          <div className="owner-detail">
            <div className="owner-photo" style={{ backgroundImage: "url('/images/owner.jpg')" }} />
            <div>
              <p className="pill subtle">Founder</p>
              <h3>Naveen Saroya</h3>
              <p className="muted">Founder, Boxify Fashion. Leads production and delivery—fabric selection, cutting accuracy, QC, and on-time dispatch for every lot.</p>
              <div className="owner-meta">
                <span className="pill subtle">10+ yrs in manufacturing</span>
                <span className="pill subtle">30+ team</span>
                <span className="pill subtle">Global B2B</span>
              </div>
              <div className="owner-history">
                {ownerHistory.map((item) => (
                  <div className="owner-history-row" key={item.year}>
                    <div className="year">{item.year}</div>
                    <div className="text"><strong>{item.title}</strong> — {item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="section-header">
          <h2>Gallery</h2>
          <p>On-floor shots and production clips.</p>
        </div>
        <div className="gallery-grid">
          {gallery.map((item, idx) => (
            <div className="gallery-card" key={idx}>
              {item.type === 'image' ? (
                <div className="about-photo" style={{ backgroundImage: `url(${item.src})` }} aria-label={item.alt} />
              ) : (
                <div className="video-card">
                  <video controls muted playsInline preload="metadata" poster={gallery.find((g) => g.type === 'image')?.src || ''}>
                    <source src={item.src} type="video/quicktime" />
                    Your browser may not support this video.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
