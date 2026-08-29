'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../cart-provider';
import { useProfile } from '../profile-provider';

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

  // Use profile name if available
  const userName = profileName || 'Customer';
  const cartMessagePlain = (() => {
    if (!cart.length) return 'No items in cart.';
    if (cart.length === 1) {
      const i = cart[0];
      return `From: ${userName}\nOrder request: ${i.name} (Article ${i.article}) | Color: ${i.color} | Size: ${i.size} | Qty: ${i.qty || 1}`;
    }
    const lines = cart.map((item, idx) => `${idx + 1}. ${item.name} (Article ${item.article}) | Color: ${item.color} | Size: ${item.size} | Qty: ${item.qty || 1}`);
    return `From: ${userName}\nOrder request:\n${lines.join('\n')}`;
  })();

  const waLink = makeWhatsAppUrl(cartMessagePlain);
  const mailLink = `mailto:${email}?subject=${encodeURIComponent('Cart selections')}&body=${encodeURIComponent(cartMessagePlain)}`;

  return (
    <main style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
      <section className="grid">
        <div className="section-header">
          <h1>Cart (preview)</h1>
          <p>Selections are stored locally. Share your article, color, size, and quantity to place order.</p>
        </div>
        <div className="cta-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="pills" style={{ gap: '0.35rem' }}>
            <span>Items: {cart.length}</span>
          </div>
          <div className="cta-row" style={{ gap: '0.35rem' }}>
            <a className="btn solid" href={waLink} target="_blank" rel="noreferrer" aria-disabled={cart.length===0}>Share on WhatsApp</a>
            <a className="btn ghost" href={mailLink} aria-disabled={cart.length===0}>Email cart</a>
            <button className="btn outline" type="button" onClick={handleClear} disabled={cart.length === 0}>Clear</button>
          </div>
        </div>
      </section>

      <section className="grid">
        {cart.length === 0 ? (
          <p className="muted">No items yet. Go to <Link href="/products">Products</Link> and add items.</p>
        ) : (
          <div className="cart-list">
            {cart.map((item, idx) => (
              <div className="cart-row" key={`${item.id}-${item.color}-${item.size}-${idx}`}>
                <div className="cart-thumb" style={{ backgroundImage: `url(${item.image})` }} aria-label={item.name} />
                <div className="cart-info">
                  <p className="pill subtle">{item.category}</p>
                  <h4>{item.name}</h4>
                  <p className="muted">Article {item.article}</p>
                  <div className="chip-row">
                    <div>
                      <p className="muted" style={{ marginBottom: '0.35rem' }}>Color</p>
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
                      <p className="muted" style={{ marginBottom: '0.35rem' }}>Size</p>
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
                  <div className="qty">
                    <button type="button" onClick={() => updateQty(item, -1)}>-</button>
                    <span>{item.qty || 1}</span>
                    <button type="button" onClick={() => updateQty(item, 1)}>+</button>
                  </div>
                  <button className="btn ghost small" type="button" onClick={() => removeItem(item)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
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
    </main>
  );
}
