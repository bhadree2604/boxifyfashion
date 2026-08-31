import './globals.css';
import { CustomerAuthProvider } from './customer-auth-provider';

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
        <CustomerAuthProvider>{children}</CustomerAuthProvider>
      </body>
    </html>
  );
}