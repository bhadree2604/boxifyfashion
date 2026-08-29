import Link from 'next/link';
import './globals.css';
import SplashProvider from './splash-provider';
import { CartProvider } from './cart-provider';
import CartNav from './cart-nav';
import { ProfileProvider } from './profile-provider';
import NamePrompt from './name-prompt';
import ProfileIcon from './profile-icon';
import NavToggle from './nav-toggle';

const whatsappNumber = '9817197390';
const email = 'info@boxifyfashion.com';
const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/boxifyfashion' },
  { label: 'Facebook', href: 'https://www.facebook.com/boxifyfashion' },
  { label: 'YouTube', href: 'https://www.youtube.com/@boxifyfashion' },
]; // Twitter removed

const socialIcons = {
  Instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm11.25 1.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0zM12 8.5A3.5 3.5 0 1 1 8.5 12A3.5 3.5 0 0 1 12 8.5zm0 2a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 10.5z"/></svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 10.5H15V8h-1.5A3 3 0 0 0 10.5 11v1.5H9V15h1.5v6h2.5v-6H15l.5-2.5h-2V11a.5.5 0 0 1 .5-.5z"/></svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.06 5 12 5 12 5s-6.06 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2A26.9 26.9 0 0 0 2 12a26.9 26.9 0 0 0 .4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.94 19 12 19 12 19s6.06 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.9 26.9 0 0 0 22 12a26.9 26.9 0 0 0-.4-4.8zM10 15.5v-7l6 3.5z"/></svg>
  ),
};
const makeWhatsAppUrl = (text) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export const metadata = {
  metadataBase: new URL('https://boxifyfashion.com'),
  title: 'Boxify Fashion | Wholesale Wear Manufacturer',
  description:
    'Boxify — Quality & casuals manufacturer producing premium track pants, t-shirts, joggers, jackets, and custom teamwear. Custom orders, bulk pricing, fast delivery.',
  openGraph: {
    title: 'Boxify Fashion | Wholesale Wear Manufacturer',
    description:
      'Boxify — Quality & casuals manufacturer producing premium track pants, t-shirts, joggers, jackets, and custom teamwear. Custom orders, bulk pricing, fast delivery.',
    url: 'https://boxifyfashion.com',
    siteName: 'Boxify Fashion',
    images: [
      {
        url: '/images/art-201.jpeg',
        width: 1200,
        height: 630,
        alt: 'Boxify Fashion wholesale sportswear',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: ['/favicon-2026.ico', '/favicon-2026.png', '/favicon.ico', '/favicon.png'],
    shortcut: ['/favicon-2026.ico', '/favicon-2026.png', '/favicon.ico', '/favicon.png'],
    apple: ['/apple-touch-icon-2026.png', '/apple-touch-icon.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>
          <CartProvider>
            <SplashProvider>
              <div className="shell">
                <header className="topbar">
                <div className="brand"><Link href="/"><img src="/logo-2026.png" alt="Boxify Fashion" className="brand-logo" /></Link></div>
                <nav className="nav desktop-nav">
                  <Link href="/">Home</Link>
                  <Link href="/products">Products</Link>
                  <Link href="/about">About</Link>
                  <Link href="/contact">Contact</Link>
                </nav>
                <div className="topbar-actions">
                  <CartNav />
                  <ProfileIcon />
                  <div className="mobile-only">
                    <NavToggle />
                  </div>
                </div>
              </header>

              <main>{children}</main>

              <footer className="footer">
                <div className="footer-grid">
                  <div>
                    <h4>Boxify Fashion</h4>
                    <p>Wholesale wear manufacturer. Factory-first since 2018.</p>
                  </div>
                  <div>
                    <h4>Contact</h4>
                    <ul>
                      <li><a href={makeWhatsAppUrl('Hi, I want to place a wholesale order.')}>WhatsApp: +91 {whatsappNumber}</a></li>
                      <li><a href={`mailto:${email}`}>{email}</a></li>
                      <li><a href="https://maps.app.goo.gl/kS9i11DCVksHnotN6?g_st=iwb" target="_blank" rel="noreferrer">Location: View on Google Maps</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4>Social</h4>
                    <ul>
                      {socials.map((s) => (
                        <li key={s.label}>
                          <a className="social-link" href={s.href} target="_blank" rel="noreferrer">
                            <span className="social-icon" aria-hidden="true">{socialIcons[s.label]}</span>
                            <span>{s.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="map-card" style={{ marginTop: '1rem' }}>
                  <iframe
                    title="Boxify Fashion location"
                    src="https://www.google.com/maps?q=Shop+No.+69,+Boxify+Fashion,+Ganpati+Colony,+70/71,+Barwala+Rd,+Agroha,+Haryana+125047&output=embed"
                    allowFullScreen
                    loading="lazy"
                  />
                  <a className="map-link" href="https://www.google.com/maps?q=Shop+No.+69,+Boxify+Fashion,+Ganpati+Colony,+70/71,+Barwala+Rd,+Agroha,+Haryana+125047&ftid=0x3913d58f3393ec67:0x20bc5e8ecd06bd2&entry=gps&shh=CAE&lucs=,94259550,94297699,94284475,94231188,94280568,47071704,94218641,94282134,94286869&g_ep=CAISEjI2LjEwLjIuODc3MzE3OTEwMBgAINeCAypRLDk0MjU5NTUwLDk0Mjk3Njk5LDk0Mjg0NDc1LDk0MjMxMTg4LDk0MjgwNTY4LDQ3MDcxNzA0LDk0MjE4NjQxLDk0MjgyMTM0LDk0Mjg2ODY5QgJJTg%3D%3D&skid=c7af4c41-a15f-45bb-ac0b-6e197df06694&g_st=iwb" target="_blank" rel="noreferrer">Open in Google Maps</a>
                </div>
                <div className="footer-bottom">© 2026 Boxify Fashion. All rights reserved.</div>
              </footer>
            </div>
            <NamePrompt />
          </SplashProvider>
        </CartProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
