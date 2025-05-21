import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | Trading Platform',
  description: 'Advanced analytics and trading insights',
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Analytics</h1>
      {children}
    </div>
  );
}
