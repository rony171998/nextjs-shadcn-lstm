import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Binance Exchange Info',
  description: 'View detailed information about Binance exchange including markets and rate limits',
};

export default function ExchangeInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Binance Exchange Information</h1>
      {children}
    </div>
  );
}
