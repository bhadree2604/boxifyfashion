'use client';

import { useCustomerAuth } from './customer-auth-provider';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { logPurchase } from '@/lib/analytics';

/**
 * Auth-gated order button that logs a purchase to Firestore
 * before opening WhatsApp / email.
 *
 * Props:
 *   href       – WhatsApp or mailto link to open after logging
 *   product    – single product snapshot (for product-page orders)
 *   items      – array of cart item snapshots (for cart-page orders)
 *   quantity   – quantity per item (default 1, used for single-product orders)
 *   target     – link target (e.g. "_blank")
 *   rel        – link rel (e.g. "noreferrer")
 *   className  – button class
 *   children   – button label
 *   disabled   – disabled state
 *   ...rest    – any extra props forwarded to <a>
 */
export default function OrderButton({
  href,
  product,
  items,
  quantity = 1,
  target,
  rel,
  className,
  children,
  disabled,
  ...rest
}) {
  const { customer, customerProfile } = useCustomerAuth();
  const router = useRouter();
  const [logging, setLogging] = useState(false);

  const handleClick = useCallback(
    async (e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      if (!customer) {
        e.preventDefault();
        router.push('/signin?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }

      // Log purchase(es) before navigating away
      e.preventDefault();
      setLogging(true);
      try {
        const custSnapshot = {
          id: customer.uid || customer.id || '',
          name: customerProfile?.name || customer.displayName || '',
          email: customer.email || '',
        };

        if (product) {
          // Single product order (from product card / modal)
          await logPurchase({ product, customer: custSnapshot, quantity });
        } else if (items && items.length > 0) {
          // Cart order — log one purchase per cart item
          for (const item of items) {
            await logPurchase({
              product: {
                name: item.name || '',
                article: item.article || '',
                sku: item.sku || '',
                category: item.category || '',
                fabric: item.fabric || '',
                price: item.price || 0,
                image: item.image || '',
                color: item.color || '',
                size: item.size || '',
              },
              customer: custSnapshot,
              quantity: item.qty || 1,
            });
          }
        }
      } catch (err) {
        console.error('Failed to log purchase:', err);
        // Still proceed to WhatsApp even if logging fails
      } finally {
        setLogging(false);
        // Open the link
        window.open(href, target || '_self');
      }
    },
    [customer, customerProfile, href, product, items, quantity, target, router, disabled]
  );

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
      aria-disabled={disabled || logging}
      style={disabled || logging ? { opacity: 0.6, pointerEvents: 'none' } : undefined}
      {...rest}
    >
      {logging ? 'Logging order…' : children}
    </a>
  );
}
