'use client';

import { usePathname } from 'next/navigation';

export default function MapSection() {
  const pathname = usePathname();
  const hideMap = pathname === '/account' || pathname === '/cart';

  if (hideMap) return null;

  return (
    <div className="map-card" style={{ marginTop: '1rem' }}>
      <iframe
        title="Boxify Fashion location"
        src="https://www.google.com/maps?q=Shop+No.+69,+Boxify+Fashion,+Ganpati+Colony,+70/71,+Barwala+Rd,+Agroha,+Haryana+125047&output=embed"
        allowFullScreen
        loading="lazy"
      />
      <a className="map-link" href="https://maps.app.goo.gl/kS9i11DCVksHnotN6?g_st=iwb" target="_blank" rel="noreferrer">Open in Google Maps</a>
    </div>
  );
}