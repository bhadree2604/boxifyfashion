import FeaturedCarousel from './featured-carousel';
import ScrollReveal from './scroll-reveal';
import Image from 'next/image';
import { products } from '@/lib/products';

const whatsappNumber = '9817197390';
const email = 'info@boxifyfashion.com';

const highlights = [
  {
    title: 'Own Factory',
    text: 'Cutting, stitching, branding, packing under one roof.',
  },
  {
    title: 'MOQ 10 (B2B)',
    text: 'Bulk-friendly pricing; volume discounts for resellers.',
  },
  {
    title: 'Fast Turnaround',
    text: 'Clear lead times with expedited runs on request.',
  },
];

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

const steps = [
  { title: 'Brief & fabric', text: 'Lock GSM, blends, colors, sizing before cutting.' },
  { title: 'Cut & stitch', text: 'Pattern-aligned cutting and skilled stitching lines.' },
  { title: 'Branding', text: 'Print/embroidery, labels, tags, custom packing.' },
  { title: 'QC & dispatch', text: 'Stage-wise checks, finishing, bulk packing, dispatch.' },
];

const timeline = [
  { year: '2018', text: 'Factory launched; first bulk tracksuit order shipped.' },
  { year: '2020', text: 'Expanded cutting/stitching lines; fleece/knit specialization.' },
  { year: '2022', text: '30K+ units/month capacity; upgraded QA + finishing.' },
  { year: '2024', text: 'Serving global B2B buyers with custom branding and rapid lead times.' },
];

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/boxifyfashion' },
  { label: 'Facebook', href: 'https://www.facebook.com/boxifyfashion' },
  { label: 'YouTube', href: 'https://www.youtube.com/@boxifyfashion' },
]; // Twitter removed

const makeWhatsAppUrl = (text) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export default function Page() {
  return (
    <div className="page">
      <ScrollReveal />
      <main>
        <section className="hero" id="hero" data-reveal>
          <div className="hero-overlay" />
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="https://videos.pexels.com/video-files/5741335/5741335-uhd_2560_1440_24fps.mp4" type="video/mp4" />
            <source src="/images/boxy3.mp4" type="video/mp4" />
          </video>
          <div className="hero-content">
            <p className="eyebrow">Factory-first · MOQ 10</p>
            <h1>Boxify — Quality & Casuals Manufacturer</h1>
            <p className="lede">
              Premium track pants, t-shirts, joggers, jackets, and custom teamwear. Custom orders, bulk pricing, fast delivery.
            </p>
            <div className="hero-actions">
              <a className="btn solid" href={makeWhatsAppUrl('Hi Boxify Fashion, I want to place a wholesale order.')} target="_blank" rel="noreferrer">
                Order on WhatsApp
              </a>
              <a className="btn ghost" href={`mailto:${email}`}>Email info@boxifyfashion.com</a>
            </div>
            <div className="pills">
              <span>Bulk-ready</span>
              <span>Custom branding</span>
              <span>Fast turnaround</span>
            </div>
          </div>
        </section>

        <section className="grid highlights" aria-labelledby="highlights-heading" data-reveal>
          <div className="section-header">
            <h2 id="highlights-heading">Why partners choose us</h2>
            <p>Factory-owned lines, transparent timelines, consistent QC.</p>
          </div>
          <div className="card-grid">
            {highlights.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid" id="collections" aria-labelledby="collections-heading" data-reveal>
          <div className="section-header">
            <h2 id="collections-heading">Featured collections</h2>
            <p>Top picks. MOQ 10 · Custom colors/sizes on request.</p>
          </div>
          <div className="product-grid featured-desktop">
            {products.slice(0, 3).map((p) => (
              <article className="product" key={p.id}>
                <div className="product-image" style={{ height: 200, position: 'relative' }} aria-label={p.name}>
  <Image
    src={p.image}
    alt={p.name}
    fill
    objectFit="cover"
    objectPosition="center"
  />
</div>
                <div className="product-body compact">
                  <p className="pill subtle">{p.category}</p>
                  <h3>{p.name}</h3>
                  <p className="product-meta">Article {p.article} · {p.fabric}</p>
                  <div className="product-footer compact">
                    <a
                      className="btn solid small"
                      href={makeWhatsAppUrl(`Hi, I want to order ${p.name} (Article ${p.article}) from Boxify Fashion. Please share pricing and lead time.`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                    <a className="btn ghost small" href={`mailto:${email}?subject=${encodeURIComponent('Enquiry: ' + p.name)}&body=${encodeURIComponent(`Hi, I want wholesale details for ${p.name} (Article ${p.article}). MOQ 10+.`)}`}>
                      Email
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="featured-mobile">
            <FeaturedCarousel items={products.slice(0, 3)} whatsappNumber={whatsappNumber} email={email} />
          </div>
          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <a className="btn solid" href="/products">View all products</a>
            <a className="btn ghost" href={makeWhatsAppUrl('Hi, share full product catalog and pricing for Boxify Fashion.')}>WhatsApp catalog</a>
          </div>
        </section>

        <section className="grid" id="process" aria-labelledby="process-heading" data-reveal>
          <div className="section-header">
            <h2 id="process-heading">The way we work</h2>
            <p>From fabric to dispatch—simple, transparent steps.</p>
          </div>
          <div className="card-grid four">
            {steps.map((s) => (
              <div className="card" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="split" id="about" data-reveal>
          <div className="text">
            <h2>About Boxify Fashion</h2>
            <p>Boxify Fashion is a B2B-first manufacturer with its own tailoring floor—cutting, stitching, branding, and finishing under one roof for consistent wholesale quality.</p>
            <p>We ship bulk tracksuits, lowers, tees, polos, hoodies, and uniforms for retailers and resellers worldwide.</p>
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
          </div>
          <div className="media">
            <div className="media-grid">
              <div className="about-photo" style={{ backgroundImage: "url('/images/about1.jpg')" }} />
              <div className="about-photo" style={{ backgroundImage: "url('/images/about2.jpg')" }} />
              <div className="about-photo" style={{ backgroundImage: "url('/images/about3.jpg')" }} />
            </div>
            <div className="owner-card">
              <p className="pill subtle">Founder</p>
              <h3>Naveen Saroya</h3>
              <p>Founder, Boxify Fashion — leads production and delivery, from fabric selection and cutting accuracy to QC and on-time dispatch for every lot.</p>
            </div>
          </div>
        </section>

        <section className="cta-wide" id="contact">
          <div>
            <p className="eyebrow">Let’s start your next run</p>
            <h2>Share your article, colors, sizes, and quantity (MOQ 10)</h2>
            <p className="muted">Fast quotes on WhatsApp. Branding, labels, packaging on request.</p>
          </div>
          <div className="cta-row">
            <a className="btn solid" href={makeWhatsAppUrl('Hi, I want to place a wholesale order with Boxify Fashion. Please connect.')} target="_blank" rel="noreferrer">
              WhatsApp +91 9817197390
            </a>
            <a className="btn ghost" href={`mailto:${email}`}>Email info@boxifyfashion.com</a>
          </div>
          <div className="contact-meta">
            <span>MOQ 10 · Volume discounts</span>
            <span>Custom branding & packing</span>
            <span>Factory-owned production</span>
          </div>
          <div className="socials">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
