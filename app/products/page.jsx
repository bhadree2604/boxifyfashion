'use client';
import { useState } from 'react';
import { useCart } from '../cart-provider';
import { useProfile } from '../profile-provider';
import { products } from '@/lib/products';
import Image from 'next/image';

const whatsappNumber = '9817197390';
const email = 'info@boxifyfashion.com';
const makeWhatsAppUrl = (text) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export default function ProductsPage() {
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardColor, setCardColor] = useState(() => Object.fromEntries(products.map((p) => [p.id, p.colors[0] || ''])));
  const [cardSize, setCardSize] = useState(() => Object.fromEntries(products.map((p) => [p.id, p.sizes[0] || ''])));
  const { cart, addItem } = useCart();
  const { name: profileName } = useProfile();

  const openModal = (p) => {
    setSelected(p);
    setZoom(false);
    setColor(cardColor[p.id] || p.colors[0] || '');
    setSize(cardSize[p.id] || p.sizes[0] || '');
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelected(null);
    setZoom(false);
  };

  const waText = (p, c, s) => {
    const user = profileName || 'Customer';
    return `From: ${user} | Order: ${p.name} (Article ${p.article}) | Color: ${c} | Size: ${s}. Please share pricing and lead time.`;
  };

  const addToCart = (p, fromList = false) => {
    const colorToUse = fromList ? (cardColor[p.id] || p.colors[0]) : (p.id === selected?.id ? color : cardColor[p.id] || p.colors[0]);
    const sizeToUse = fromList ? (cardSize[p.id] || p.sizes[0]) : (p.id === selected?.id ? size : cardSize[p.id] || p.sizes[0]);
    if (!colorToUse || !sizeToUse) return;
    addItem({ ...p, color: colorToUse, size: sizeToUse });
  };

  return (
    <main className="products-page" style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
      <section className="grid">
        <div className="section-header">
          <h1>Products</h1>
          <p>MOQ 10 units · Volume discounts available · Custom colors/sizes on request</p>
        </div>
        <div className="cart-bar">
          <span className="pill subtle">Cart items: {cart.length}</span>
          <span className="muted">Local preview only — share article and qty on WhatsApp/Email to order.</span>
        </div>
      </section>

      <section className="grid">
        <div className="product-grid">
          {products.map((p) => (
            <article className="product" key={p.id}>
              <div
                className="product-image as-button"
                style={{ height: 190, position: 'relative' }}
                aria-label={`View ${p.name}`}
                onClick={() => openModal(p)}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
              <div className="product-body">
                <p className="pill subtle">{p.category}</p>
                <h3>{p.name}</h3>
                <p className="muted">Article {p.article} · {p.fabric}</p>
                <div className="chip-row">
                  <div>
                    <p className="muted" style={{ marginBottom: '0.35rem' }}>Color</p>
                    <div className="chip-group">
                      {p.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`chip ${cardColor[p.id] === c ? 'active' : ''}`}
                          onClick={() => setCardColor((prev) => ({ ...prev, [p.id]: c }))}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="muted" style={{ marginBottom: '0.35rem' }}>Size</p>
                    <div className="chip-group">
                      {p.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`chip ${cardSize[p.id] === s ? 'active' : ''}`}
                          onClick={() => setCardSize((prev) => ({ ...prev, [p.id]: s }))}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="product-footer">
                  <div className="price">₹{p.price} / unit</div>
                  <div className="cta-row">
                    <a
                      className="btn solid small"
                      href={makeWhatsAppUrl(waText(p, cardColor[p.id] || p.colors[0], cardSize[p.id] || p.sizes[0]))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                    <button
                      className="btn outline small"
                      type="button"
                      onClick={() => addToCart(p, true)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selected && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="modal-card">
            <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
            <button className="modal-close-top" onClick={closeModal} aria-label="Close">×</button>
            <div className="modal-body">
              <div className="modal-image-container">
                <div className="modal-main-image">
                  <img 
                    src={selected.images?.[currentImageIndex] || selected.image} 
                    alt={`${selected.name} - view ${currentImageIndex + 1}`} 
                    onClick={() => setZoom(!zoom)}
                  />
                  {zoom && <div className="zoom-overlay" />}
                </div>
                {selected.images && selected.images.length > 1 && (
                  <div className="modal-thumbnails">
                    {selected.images.map((img, index) => (
                      <button
                        key={index}
                        className={`thumb ${currentImageIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={img} alt={`${selected.name} thumbnail ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-info">
                <p className="pill subtle">{selected.category}</p>
                <h3>{selected.name}</h3>
                {!selected.inStock && <span className="badge out-of-stock">Out of Stock</span>}
                <p className="muted">Article {selected.article} · {selected.fabric}</p>
                {selected.description && <p className="description">{selected.description}</p>}
                <div className="chip-row">
                  <div>
                    <p className="muted" style={{ marginBottom: '0.35rem' }}>Color</p>
                    <div className="chip-group">
                      {selected.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`chip ${color === c ? 'active' : ''}`}
                          onClick={() => setColor(c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="muted" style={{ marginBottom: '0.35rem' }}>Size</p>
                    <div className="chip-group">
                      {selected.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`chip ${size === s ? 'active' : ''}`}
                          onClick={() => setSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="product-footer">
                  <div className="price">₹{selected.price} / unit</div>
                  <div className="cta-row">
                    <a className="btn solid" href={makeWhatsAppUrl(waText(selected, color, size))} target="_blank" rel="noreferrer">WhatsApp</a>
                    <button
                      className={`btn outline ${!selected.inStock ? 'disabled' : ''}`}
                      type="button"
                      onClick={!selected.inStock ? undefined : () => addToCart(selected)}
                      disabled={!selected.inStock}
                    >
                      {!selected.inStock ? 'Out of Stock' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}