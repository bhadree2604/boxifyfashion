'use client';

import { useCustomerAuth } from './customer-auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function GatedLink({
  href,
  className,
  children,
  target,
  rel,
  ...props
}) {
  const { customer } = useCustomerAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = useCallback(
    (e) => {
      if (!customer) {
        e.preventDefault();
        const redirect = pathname || '/products';
        router.push(`/signin?redirect=${encodeURIComponent(redirect)}`);
      }
      // else let default navigation happen
    },
    [customer, router, pathname]
  );

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}