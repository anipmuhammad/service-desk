import { Suspense } from 'react';
import SuccessClient from './SuccessClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
