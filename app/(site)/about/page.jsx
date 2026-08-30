import Image from 'next/image';

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

const ownerHistory = [
  { year: '2015', title: 'Apprentice tailor', desc: 'Learned cutting and stitching on the factory floor.' },
  { year: '2018', title: 'Founded Boxify Fashion', desc: 'Set up own cutting + stitching lines with QA steps.' },
  { year: '2021', title: 'Scaling production', desc: 'Reached 20K+ units/month with custom branding requests.' },
  { year: '2024', title: 'B2B expansion', desc: 'Serving global resellers with faster lead times and labeling.' },
];

// Gallery uses only available images (videos removed — .mov files not present)
const galleryImages = [
  { src: '/images/about1.jpg', alt: 'Stitching closeup' },
  { src: '/images/about2.jpg', alt: 'Machine detail' },
  { src: '/images/about3.jpg', alt: 'Cutting floor' },
  { src: '/images/art-201.jpeg', alt: 'Product sample' },
  { src: '/images/art-202.jpeg', alt: 'Fabric detail' },
  { src: '/images/art-203.jpeg', alt: 'Finished product' },
];

export const metadata = {
  title: 'About Us | Boxify Fashion',
  description: 'Learn about Boxify Fashion — B2B wholesale manufacturer with factory-owned production since 2018. Meet founder Naveen Saroya.',
};

export default function AboutPage() {
  return (
    <div className="page-main">
      <section className="grid">
        <div className="section-header">
          <h1>About Boxify Fashion</h1>
          <p>
            B2B-first manufacturer with its own tailoring floor — cutting, stitching, branding, and finishing under one roof for consistent wholesale quality. We ship bulk tracksuits, lowers, tees, polos, hoodies, and uniforms for retailers and resellers worldwide.
          </p>
        </div>
      </section>

      <section className="split">
        <div className="about-text">
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
                <div className="tl-text">{t.text}</div>
              </div>
            ))}
          </div>
          <div className="owner-detail">
            <div className="owner-photo-wrap">
              <Image
                src="/images/owner.jpg"
                alt="Naveen Saroya — Founder, Boxify Fashion"
                fill
                sizes="(max-width: 768px) 100vw, 240px"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
            <div>
              <p className="pill subtle">Founder</p>
              <h3>Naveen Saroya</h3>
              <p className="muted">Founder, Boxify Fashion. Leads production and delivery — fabric selection, cutting accuracy, QC, and on-time dispatch for every lot.</p>
              <div className="owner-meta">
                <span className="pill subtle">10+ yrs in manufacturing</span>
                <span className="pill subtle">30+ team</span>
                <span className="pill subtle">Global B2B</span>
              </div>
              <div className="owner-history">
                {ownerHistory.map((item) => (
                  <div className="owner-history-row" key={item.year}>
                    <div className="year">{item.year}</div>
                    <div className="tl-text"><strong>{item.title}</strong> — {item.desc}</div>
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
          <p>On-floor shots and production samples.</p>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((item, idx) => (
            <div className="gallery-card" key={idx}>
              <div className="gallery-img-wrap">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 16vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
