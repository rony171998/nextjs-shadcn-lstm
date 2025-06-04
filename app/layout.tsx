import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import { EnhancedChatInterface } from '@/components/chat/enhanced-chat-interface';
import { SimpleChatInterface } from '@/components/chat/simple-chat-interface';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Analytics Market AI',
  description: 'Análisis de mercados financieros con inteligencia artificial',
  keywords: ['Analytics Market AI', 'Análisis de mercados financieros', 'Inteligencia artificial','Next','Machine Lerning'],
  authors: [{ name: 'Rony Puche' }],
  creator: "Rony Puche",
  metadataBase: new URL('https://vercel.com/rony171998s-projects/nextjs-shadcn-lstm/BSuLwGUGcntpttN8YLGHjEUU8nmY'),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <main>{children}</main>
          {/* <EnhancedChatInterface /> */}
          <SimpleChatInterface />
        </LanguageProvider>
      </body>
    </html>
  );
}