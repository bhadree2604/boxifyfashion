'use client';
import Link from 'next/link';
import { useCart } from './cart-provider';

const whatsappNumber = '9817197390';
const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Boxify Fashion, I have a general enquiry about your products.')}`;

// WhatsApp SVG icon
function WhatsAppIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 2A9.9 9.9 0 0 0 2 11.93c0 1.77.46 3.49 1.33 5.01L2 22l5.2-1.3A9.98 9.98 0 1 0 12.04 2Zm5.58 14.48c-.23.65-1.37 1.23-1.9 1.3c-.49.07-1.1.1-1.77-.11c-.41-.13-.94-.3-1.62-.59c-2.85-1.23-4.7-4.1-4.85-4.29c-.14-.19-1.16-1.54-1.16-2.94c0-1.4.72-2.08.98-2.36c.26-.28.58-.35.78-.35h.56c.18 0 .42-.07.66.5c.23.56.77 1.93.84 2.07c.07.14.12.3.02.49c-.1.19-.15.3-.3.46c-.15.16-.32.36-.46.48c-.15.12-.3.26-.13.55c.17.28.76 1.25 1.63 2.02c1.12.99 2.06 1.3 2.35 1.46c.29.16.46.14.64-.08c.18-.21.74-.86.93-1.16c.19-.3.39-.25.66-.15c.26.09 1.68.8 1.97.94c.29.14.48.21.55.32c.07.12.07.68-.16 1.34Z"
      />
    </svg>
  );
}

// Cart bag icon
function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zm1.5 0h9L19 5H5l2.5-3zM12 10a4 4 0 0 1-4 4V8a4 4 0 0 1 4 2zm0 0a4 4 0 0 0 4 4V8a4 4 0 0 0-4 2z"
      />
    </svg>
  );
}

export default function FloatingButtons() {
  const { cart } = useCart();
  const count = cart.length || 0;

  return (
    <>
      {/* Floating WhatsApp — bottom-right, all pages, general enquiries */}
      <a
        id="floating-wa-btn"
        className="floating-wa"
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon />
        <span className="floating-wa-label">WhatsApp</span>
      </a>

      {/* Floating Cart — bottom-left on mobile, visible when cart has items */}
      {count > 0 && (
        <Link
          id="floating-cart-btn"
          className="floating-cart"
          href="/cart"
          aria-label={`View cart — ${count} item${count !== 1 ? 's' : ''}`}
          title="View cart"
        >
          <CartIcon />
          <span>Cart</span>
          <span className="floating-cart-badge">{count}</span>
        </Link>
      )}
    </>
  );
}
