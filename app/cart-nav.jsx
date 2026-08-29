'use client';
import Link from 'next/link';
import { useCart } from './cart-provider';

export default function CartNav() {
  const { cart } = useCart();
  const count = cart.length || 0;
  return (
    <Link href="/cart" className={`cart-link ${count === 0 ? 'hidden' : ''}`} aria-hidden={count === 0}>
      Cart {count > 0 && <span className="cart-badge">{count}</span>}
    </Link>
  );
}
