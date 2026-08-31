'use client';
import { useEffect, useRef, useState } from 'react';
import FeaturedCarousel from '../featured-carousel';
import ScrollReveal from '../scroll-reveal';
import Image from 'next/image';
import { fetchProducts } from '@/lib/products-service';
import GatedLink from '../gated-link';


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
];

const makeWhatsAppUrl = (text) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

/** Hero video — only starts loading once the section scrolls into view */
function LazyHeroVideo() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!video.src && !video.querySelector('source[src]')) {
              const sources = video.querySelectorAll('source[data-src]');
              sources.forEach((s) => {
                s.src = s.dataset.src;
              });
              video.load();
            }
            video.play().catch(() => { });
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ position: 'absolute', inset: 0 }}>
      <video
        ref={videoRef}
        className="hero-video"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source data-src="https://videos.pexels.com/video-files/5741335/5741335-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        <source data-src="/images/boxy3.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default function Page() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchProducts()
      .then((data) => {
        if (isMounted) {
          setProductsList(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const featured = productsList.slice(0, 3);

  return (
    <div className="page">
      <ScrollReveal />
      <div className="page-main">
        <section className="hero" id="hero" data-reveal>
          <div className="hero-overlay" />
          <LazyHeroVideo />
          <div className="hero-content">
            <p className="eyebrow">Factory-first · MOQ 10</p>
            <h1>Boxify — Quality &amp; Casuals Manufacturer</h1>
            <p className="lede">
              Premium track pants, t-shirts, joggers, jackets, and custom teamwear. Custom orders, bulk pricing, fast delivery.
            </p>
            <div className="hero-actions">
              <GatedLink className="btn solid" href={makeWhatsAppUrl('Hi Boxify Fashion, I want to place a wholesale order.')} target="_blank" rel="noreferrer">
                Order on WhatsApp
              </GatedLink>
              <GatedLink className="btn ghost" href={`mailto:${email}`}>Email info@boxifyfashion.com</GatedLink>
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

          {loading ? (
            <div className="product-grid">
              {[1, 2, 3].map((n) => (
                <div className="product skeleton-card" key={n}>
                  <div className="skeleton-thumb" />
                  <div className="skeleton-body">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line medium" />
                    <div className="skeleton-line long" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="muted" style={{ padding: '1rem 0' }}>No featured products available.</p>
          ) : (
            <>
              <div className="product-grid featured-desktop">
                {featured.map((p) => (
                  <article className="product" key={p.id}>
                    <div className="product-image" style={{ height: 200, position: 'relative' }} aria-label={p.name}>
                      <Image
                        src={p.image || (p.images && p.images[0]) || '/images/art-201.jpeg'}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                      {!p.inStock && (
                        <span className="badge out-of-stock card-badge">Out of stock</span>
                      )}
                    </div>
                    <div className="product-body compact">
                      <p className="pill subtle">{p.category}</p>
                      <h3>{p.name}</h3>
                      <p className="product-meta">Article {p.article} · {p.fabric}</p>
                      <div className="product-footer compact">
                        <GatedLink
                          className="btn solid small"
                          href={makeWhatsAppUrl(`Hi, I want to order ${p.name} (Article ${p.article}) from Boxify Fashion. Please share pricing and lead time.`)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp
                        </GatedLink>
                        <a className="btn ghost small" href={`mailto:${email}?subject=${encodeURIComponent('Enquiry: ' + p.name)}&body=${encodeURIComponent(`Hi, I want wholesale details for ${p.name} (Article ${p.article}). MOQ 10+.`)}`}>
                          Email
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="featured-mobile">
                <FeaturedCarousel items={featured} whatsappNumber={whatsappNumber} email={email} />
              </div>
            </>
          )}

          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <a className="btn solid" href="/products">View all products</a>
            <GatedLink className="btn ghost" href={makeWhatsAppUrl('Hi, share full product catalog and pricing for Boxify Fashion.')}>WhatsApp catalog</GatedLink>
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
                  <div className="tl-text">{t.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="media">
            <div className="media-grid">
              <div className="about-photo-wrap">
                <Image src="/images/about1.jpg" alt="Boxify Fashion factory floor" fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
              </div>
              <div className="about-photo-wrap">
                <Image src="/images/about2.jpg" alt="Stitching machine detail" fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
              </div>
              <div className="about-photo-wrap">
                <Image src="/images/about3.jpg" alt="Cutting floor" fill sizes="(max-width: 768px) 50vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
              </div>
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
            <p className="eyebrow">Let&#39;s start your next run</p>
            <h2>Share your article, colors, sizes, and quantity (MOQ 10)</h2>
            <p className="muted">Fast quotes on WhatsApp. Branding, labels, packaging on request.</p>
          </div>
          <div className="cta-row">
            <GatedLink className="btn solid" href={makeWhatsAppUrl('Hi, I want to place a wholesale order with Boxify Fashion. Please connect.')} target="_blank" rel="noreferrer">
              WhatsApp +91 9817197390
            </GatedLink>
            <GatedLink className="btn ghost" href={`mailto:${email}`}>Email info@boxifyfashion.com</GatedLink>
          </div>
          <div className="contact-meta">
            <span>MOQ 10 · Volume discounts</span>
            <span>Custom branding &amp; packing</span>
            <span>Factory-owned production</span>
          </div>
          <div className="socials">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
