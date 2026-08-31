'use client';

import { useCustomerAuth } from './customer-auth-provider';
import { useRouter } from 'next/navigation';
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

  const handleClick = useCallback(
    (e) => {
      if (!customer) {
        e.preventDefault();
        router.push('/signin');
      }
      // else let default navigation happen
    },
    [customer, router]
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