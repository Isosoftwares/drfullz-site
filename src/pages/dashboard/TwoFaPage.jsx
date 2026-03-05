import React from 'react';
import TwoFaAuthPage from './TwoFaAuthPage';

function TwoFaPage() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6">
        <TwoFaAuthPage />
    </div>
  );
}

export default TwoFaPage;