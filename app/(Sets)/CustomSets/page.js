// app/Sets/page.js

import { Suspense } from 'react';
import SetsPageContent from '../../common_components/SetsPageContent';

export default function SetsPage() {
  return (
    <Suspense fallback={<p className="p-4 text-center">Loading sets...</p>}>
      <SetsPageContent />
    </Suspense>
  );
}
