'use client';
import Link from 'next/link';
import { useCart } from './cart-provider';

export default function CartNav() {
  const { cart } = useCart();
  const count = cart.length || 0;
  return (
    <Link href="/cart" className="cart-link" aria-label={`Cart — ${count} item${count !== 1 ? 's' : ''}`}>
      Cart <span className="cart-badge">{count}</span>
    </Link>
  );
}