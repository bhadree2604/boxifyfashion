import Link from 'next/link';
import Image from 'next/image';
import SplashProvider from '../splash-provider';
import { CartProvider } from '../cart-provider';
import CartNav from '../cart-nav';
import { ProfileProvider } from '../profile-provider';
import NavToggle from '../nav-toggle';
import { ToastProvider } from '../toast-provider';
import FloatingButtons from '../floating-buttons';
import { CustomerAuthProvider } from '../customer-auth-provider';
import HeaderAuth from '../header-auth';
import MapSection from '../map-section';
import VisitTracker from '../visit-tracker';

const whatsappNumber = '9817197390';
const email = 'info@boxifyfashion.com';
const socials = [
    { label: 'Instagram', href: 'https://www.instagram.com/boxifyfashion' },
    { label: 'Facebook', href: 'https://www.facebook.com/boxifyfashion' },
    { label: 'YouTube', href: 'https://www.youtube.com/@boxifyfashion' },
];

const socialIcons = {
    Instagram: (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0 2-2H7zm11.25 1.25a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0zM12 8.5A3.5 3.5 0 1 1 8.5 12A3.5 3.5 0 0 1 12 8.5zm0 2a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 10.5z" /></svg>
    ),
    Facebook: (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 10.5H15V8h-1.5A3 3 0 0 0 10.5 11v1.5H9V15h1.5v6h2.5v-6H15l.5-2.5h-2V11a.5.5 0 0 1 .5-.5z" /></svg>
    ),
    YouTube: (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.06 5 12 5 12 5s-6.06 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2A26.9 26.9 0 0 0 .4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.94 19 12 19 12 19s6.06 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.9 26.9 0 0 0 22 12a26.9 26.9 0 0 0-.4-4.8zM10 15.5v-7l6 3.5z" /></svg>
    ),
};

const makeWhatsAppUrl = (text) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

export default function SiteLayout({ children }) {
    return (
        <CustomerAuthProvider>
            <ProfileProvider>
                <CartProvider>
                    <ToastProvider>
                        <SplashProvider>
                            <div className="shell">
                                <header className="topbar">
                                    <div className="brand">
                                        <Link href="/">
                                            <Image
                                                src="/logo-2026.png"
                                                alt="Boxify Fashion"
                                                width={120}
                                                height={72}
                                                className="brand-logo"
                                                priority
                                            />
                                        </Link>
                                    </div>
                                    <nav className="nav desktop-nav" aria-label="Main navigation">
                                        <Link href="/">Home</Link>
                                        <Link href="/products">Products</Link>
                                        <Link href="/about">About</Link>
                                        <Link href="/contact">Contact</Link>
                                    </nav>
                                    <div className="topbar-actions">
                                        <CartNav />
                                        <HeaderAuth />
                                        <div className="mobile-only">
                                            <NavToggle />
                                        </div>
                                    </div>
                                </header>

                                <main>{children}</main>
                            <VisitTracker />

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
                                    <MapSection />
<div className="footer-bottom">
          <span>© 2026 Boxify Fashion. All rights reserved.</span>
        </div>
                                </footer>
                            </div>
                            <FloatingButtons />
                        </SplashProvider>
                    </ToastProvider>
                </CartProvider>
            </ProfileProvider>
        </CustomerAuthProvider>
    );
}