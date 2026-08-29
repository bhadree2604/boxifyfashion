'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeaturedCarousel({ items = [], whatsappNumber, email }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % items.length), 3200);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;

  const go = (i) => setIndex((i + items.length) % items.length);

  const makeWhatsAppUrl = (text) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  const current = items[index];

  return (
    <div className="f-carousel">
      <div className="f-card">
        <div className="product-image" style={{ backgroundImage: `url(${current.image})` }} aria-label={current.name} />
        <div className="product-body compact">
          <p className="pill subtle">{current.category}</p>
          <h3>{current.name}</h3>
          <p className="product-meta">Article {current.article} · {current.fabric}</p>
          <div className="product-footer compact">
            <a
              className="btn solid small"
              href={makeWhatsAppUrl(`Hi, I want to order ${current.name} (Article ${current.article}) from Boxify Fashion. Please share pricing and lead time.`)}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              className="btn ghost small"
              href={`mailto:${email}?subject=${encodeURIComponent('Enquiry: ' + current.name)}&body=${encodeURIComponent(`Hi, I want wholesale details for ${current.name} (Article ${current.article}). MOQ 10+.`)}`}
            >
              Email
            </a>
          </div>
        </div>
      </div>
      <div className="f-controls">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        <div className="f-dots">
          {items.map((_, i) => (
            <button key={i} className={i === index ? 'active' : ''} aria-label={`Slide ${i + 1}`} onClick={() => go(i)} />
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
