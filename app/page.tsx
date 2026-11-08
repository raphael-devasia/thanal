'use client';

import React from 'react';
import MobileHome from '@/components/MobileHome';
import DesktopHome from '@/components/DesktopHome';

export default function LandingPage() {
  return (
    <main>
      {/* Mobile view: phone layout (Screen 1 to Screen 10 sequence) */}
      <div className="block md:hidden">
        <MobileHome />
      </div>

      {/* Larger devices: rich desktop & tablet layout */}
      <div className="hidden md:block">
        <DesktopHome />
      </div>
    </main>
  );
}
