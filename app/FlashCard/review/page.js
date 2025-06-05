import { Suspense } from 'react';
import ReviewClient from './reviewClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading Review...</div>}>
      <ReviewClient />
    </Suspense>
  );
}
