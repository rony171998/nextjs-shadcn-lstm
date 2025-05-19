import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import Logo from '@/components/Logo';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Analytics Market AI',
  description: 'Análisis de mercados financieros con inteligencia artificial',
  keywords: ['Analytics Market AI', 'Análisis de mercados financieros', 'Inteligencia artificial','Next','Machine Lerning'],
  authors: [{ name: 'Rony Puche' }],
  creator: "Rony Puche",
  metadataBase: new URL('https://v0-next-js-portfolio-site-one-rho.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}