import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yamelatdp.com'),
  title: 'Yamela — The Design Project',
  description: 'Laboratoire d\'architecture et design.',
  icons: { icon: '/yamelogo.png', apple: '/yamelogo.png' },
  openGraph: {
    title: 'Yamela — The Design Project',
    description: 'Laboratoire d\'architecture et design.',
    url: 'https://yamelatdp.com',
    siteName: 'Yamela',
    images: [{ url: '/yamelogo.png', width: 1200, height: 1200, alt: 'Yamela' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yamela — The Design Project',
    description: 'Laboratoire d\'architecture et design.',
    images: ['/yamelogo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
