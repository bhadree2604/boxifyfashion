'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { logSiteVisit } from '@/lib/analytics';

export default function VisitTracker() {
  const pathname = usePathname();
  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) return;
    hasLogged.current = true;
    logSiteVisit(pathname || '/');
  }, [pathname]);

  return null;
}
