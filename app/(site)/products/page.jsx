'use client';
import { useState, useEffect } from 'react';
import { useCart } from '../../cart-provider';
import { useProfile } from '../../profile-provider';
import { useToast } from '../../toast-provider';
import { fetchProducts } from '@/lib/products-service';
import Image from 'next/image';

const whatsappNumber = '9817197390';
const email = 'info@boxifyfashion.com';
const makeWhatsAppUrl = (text) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export default function ProductsPage() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardColor, setCardColor] = useState({});
  const [cardSize, setCardSize] = useState({});

  const { cart, addItem } = useCart();
  const { name: profileName } = useProfile();
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    fetchProducts()
      .then((data) => {
        if (!isMounted) return;
        const items = data || [];
        setProductsList(items);
        setCardColor(Object.fromEntries(items.map((p) => [p.id, p.colors?.[0] || ''])));
        setCardSize(Object.fromEntries(items.map((p) => [p.id, p.sizes?.[0] || ''])));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (p) => {
    setSelected(p);
    setColor(cardColor[p.id] || p.colors?.[0] || '');
    setSize(cardSize[p.id] || p.sizes?.[0] || '');
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelected(null);
  };

  const waText = (p, c, s) => {
    const user = profileName || 'Customer';
    return `From: ${user} | Order: ${p.name} (Article ${p.article}) | Color: ${c} | Size: ${s}. Please share pricing and lead time.`;
  };

  const addToCart = (p, fromList = false) => {
    if (!p.inStock) return;
    const colorToUse = fromList
      ? (cardColor[p.id] || p.colors?.[0])
      : (p.id === selected?.id ? color : cardColor[p.id] || p.colors?.[0]);
    const sizeToUse = fromList
      ? (cardSize[p.id] || p.sizes?.[0])
      : (p.id === selected?.id ? size : cardSize[p.id] || p.sizes?.[0]);
    if (!colorToUse || !sizeToUse) return;
    addItem({ ...p, color: colorToUse, size: sizeToUse });
    showToast(`Added to cart — ${p.name} (${colorToUse}, ${sizeToUse})`);
  };

  return (
    <div className="page-main">
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
        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div className="product skeleton-card" key={n}>
                <div className="skeleton-thumb" />
                <div className="skeleton-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line long" />
                  <div className="skeleton-line short" style={{ marginTop: '0.5rem' }} />
                </div>
              </div>
            ))}
          </div>
        ) : productsList.length === 0 ? (
          <div className="empty-products-state" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <h3>No products found</h3>
            <p className="muted">Check back soon or contact us directly on WhatsApp for custom orders.</p>
          </div>
        ) : (
          <div className="product-grid">
            {productsList.map((p) => (
              <article className="product" key={p.id}>
                <div
                  className="product-image as-button"
                  style={{ height: 190, position: 'relative' }}
                  aria-label={`View ${p.name}`}
                  onClick={() => openModal(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openModal(p)}
                >
                  <Image
                    src={p.image || (p.images && p.images[0]) || '/images/art-201.jpeg'}
                    alt={p.name}
                    fill
                    sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  {!p.inStock && (
                    <span className="badge out-of-stock card-badge">Out of stock</span>
                  )}
                </div>
                <div className="product-body">
                  <p className="pill subtle">{p.category}</p>
                  <h3>{p.name}</h3>
                  <p className="muted">Article {p.article} · {p.fabric}</p>
                  <div className="chip-row">
                    <div>
                      <p className="muted chip-label">Color</p>
                      <div className="chip-group">
                        {p.colors?.map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={`chip ${cardColor[p.id] === c ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setCardColor((prev) => ({ ...prev, [p.id]: c })); }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="muted chip-label">Size</p>
                      <div className="chip-group">
                        {p.sizes?.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`chip ${cardSize[p.id] === s ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setCardSize((prev) => ({ ...prev, [p.id]: s })); }}
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
                        href={makeWhatsAppUrl(waText(p, cardColor[p.id] || p.colors?.[0], cardSize[p.id] || p.sizes?.[0]))}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                      <button
                        className={`btn outline small${!p.inStock ? ' disabled' : ''}`}
                        type="button"
                        onClick={() => addToCart(p, true)}
                        disabled={!p.inStock}
                      >
                        {!p.inStock ? 'Out of stock' : 'Add to cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-product-name">
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="modal-card">
            <button className="modal-close-top" onClick={closeModal} aria-label="Close modal">×</button>
            <div className="modal-body">
              <div className="modal-image-container">
                <div className="modal-main-image">
                  <Image
                    src={selected.images?.[currentImageIndex] || selected.image || '/images/art-201.jpeg'}
                    alt={`${selected.name} — view ${currentImageIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 420px"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </div>
                {selected.images && selected.images.length > 1 && (
                  <div className="modal-thumbnails">
                    {selected.images.map((img, idx) => (
                      <button
                        key={idx}
                        className={`thumb${currentImageIndex === idx ? ' active' : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <div className="thumb-img-wrap">
                          <Image
                            src={img}
                            alt={`${selected.name} thumbnail ${idx + 1}`}
                            fill
                            sizes="72px"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-info">
                <p className="pill subtle">{selected.category}</p>
                <h3 id="modal-product-name">{selected.name}</h3>
                {!selected.inStock && <span className="badge out-of-stock">Out of Stock</span>}
                <p className="muted">Article {selected.article} · {selected.fabric}</p>
                {selected.description && <p className="description">{selected.description}</p>}
                <div className="chip-row">
                  <div>
                    <p className="muted chip-label">Color</p>
                    <div className="chip-group">
                      {selected.colors?.map((c) => (
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
                    <p className="muted chip-label">Size</p>
                    <div className="chip-group">
                      {selected.sizes?.map((s) => (
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
                      className={`btn outline${!selected.inStock ? ' disabled' : ''}`}
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
    </div>
  );
}