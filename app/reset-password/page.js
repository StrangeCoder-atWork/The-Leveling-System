// app/reset-password/page.js
import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
