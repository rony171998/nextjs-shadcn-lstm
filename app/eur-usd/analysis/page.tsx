// Server Component
import { Suspense } from 'react';
import EurUsdAnalysisClient from './client';
import Loading from './loading';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function Page() {
  // Simular carga para mostrar el skeleton
  await sleep(10000);
  
  return (
    <Suspense fallback={<Loading />}>
      <EurUsdAnalysisClient />
    </Suspense>
  );
}
