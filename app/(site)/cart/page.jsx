'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../cart-provider';
import { useProfile } from '../../profile-provider';
import Image from 'next/image';
import GatedLink from '../../gated-link';

const whatsappNumber = '9817197390';
const email = 'info@boxifyfashion.com';
const makeWhatsAppUrl = (text) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export default function CartPage() {
  const { cart, removeItem, clearCart, updateQty, updateVariant } = useCart();
  const { name: profileName } = useProfile();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClear = () => {
    if (cart.length === 0) return;
    setConfirmOpen(true);
  };
  const confirmClear = () => {
    clearCart();
    setConfirmOpen(false);
  };
  const cancelClear = () => setConfirmOpen(false);

  const userName = profileName || 'Customer';

  // Order summary calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  const orderDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Improved WhatsApp message with total + date
  const cartMessagePlain = (() => {
    if (!cart.length) return 'No items in cart.';
    const lines = cart.map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (Article ${item.article}) | Color: ${item.color} | Size: ${item.size} | Qty: ${item.qty || 1} | ₹${(item.price || 0) * (item.qty || 1)}`
    );
    return [
      `From: ${userName}`,
      `Order Date: ${orderDate}`,
      `Order Request:`,
      ...lines,
      ``,
      `Estimated Total: ₹${subtotal.toLocaleString('en-IN')}`,
      `(Prices subject to final confirmation. MOQ 10 units per style.)`,
    ].join('\n');
  })();

  const waLink = makeWhatsAppUrl(cartMessagePlain);
  const mailLink = `mailto:${email}?subject=${encodeURIComponent('Cart Order Request — Boxify Fashion')}&body=${encodeURIComponent(cartMessagePlain)}`;

  return (
    <div className="page-main">
      <section className="grid">
        <div className="section-header">
          <h1>Cart (preview)</h1>
          <p>Selections are stored locally. Share your article, color, size, and quantity to place order.</p>
        </div>
        <div className="cart-bar">
          <div className="pills" style={{ gap: '0.35rem' }}>
            <span>Items: {cart.length}</span>
            {cart.length > 0 && (
              <span className="pill subtle">
                Total: ₹{subtotal.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="cta-row">
            <GatedLink
              id="cart-wa-checkout-btn"
              className="btn solid"
              href={waLink}
              target="_blank"
              rel="noreferrer"
              aria-disabled={cart.length === 0}
            >
              Share on WhatsApp
            </GatedLink>
            <GatedLink
              id="cart-email-checkout-btn"
              className="btn ghost"
              href={mailLink}
              aria-disabled={cart.length === 0}
            >
              Email cart
            </GatedLink>
            <button
              id="cart-clear-btn"
              className="btn outline"
              type="button"
              onClick={handleClear}
              disabled={cart.length === 0}
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <section className="grid">
        {cart.length === 0 ? (
          <p className="muted">No items yet. Go to <Link href="/products">Products</Link> and add items.</p>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item, idx) => (
                <div className="cart-row" key={`${item.id}-${item.color}-${item.size}-${idx}`}>
                  <div className="cart-thumb" style={{ position: 'relative' }} aria-label={item.name}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="120px"
                      style={{ objectFit: 'cover', objectPosition: 'center', borderRadius: '10px' }}
                    />
                  </div>
                  <div className="cart-info">
                    <p className="pill subtle">{item.category}</p>
                    <h4>{item.name}</h4>
                    <p className="muted">Article {item.article}</p>
                    <div className="chip-row">
                      <div>
                        <p className="muted chip-label">Color</p>
                        <div className="chip-group">
                          {item.colors?.map((c) => (
                            <button
                              key={c}
                              type="button"
                              className={`chip ${item.color === c ? 'active' : ''}`}
                              onClick={() => updateVariant(item, c, item.size)}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="muted chip-label">Size</p>
                        <div className="chip-group">
                          {item.sizes?.map((s) => (
                            <button
                              key={s}
                              type="button"
                              className={`chip ${item.size === s ? 'active' : ''}`}
                              onClick={() => updateVariant(item, item.color, s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cart-actions">
                    <div className="price">₹{item.price} / unit</div>
                    <div className="qty" role="group" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" onClick={() => updateQty(item, -1)} aria-label="Decrease quantity">−</button>
                      <span aria-live="polite">{item.qty || 1}</span>
                      <button type="button" onClick={() => updateQty(item, 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <div className="cart-line-total">
                      ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                    </div>
                    <button className="btn ghost small" type="button" onClick={() => removeItem(item)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3 className="order-summary-title">Order Summary</h3>
              <div className="order-summary-lines">
                {cart.map((item, idx) => (
                  <div className="summary-line" key={`sum-${item.id}-${item.color}-${item.size}-${idx}`}>
                    <span className="summary-line-name">
                      {item.name}
                      <span className="summary-variant"> · {item.color} / {item.size} × {item.qty || 1}</span>
                    </span>
                    <span className="summary-line-price">₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span>Estimated Total</span>
                <span className="summary-total-price">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="muted summary-note">Prices subject to final confirmation. MOQ 10 units per style.</p>
              <div className="cta-row" style={{ marginTop: '1rem' }}>
                <a className="btn solid" href={waLink} target="_blank" rel="noreferrer">
                  Checkout on WhatsApp
                </a>
                <a className="btn ghost" href={mailLink}>Email this order</a>
              </div>
            </div>
          </>
        )}
      </section>

      {confirmOpen && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={cancelClear} />
          <div className="modal-card">
            <div className="modal-body" style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <h3>Clear cart?</h3>
                <p className="muted">This will remove all items from your cart.</p>
                <div className="cta-row" style={{ marginTop: '0.5rem' }}>
                  <button className="btn outline" type="button" onClick={cancelClear}>Cancel</button>
                  <button className="btn solid" type="button" onClick={confirmClear}>Yes, clear all</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}