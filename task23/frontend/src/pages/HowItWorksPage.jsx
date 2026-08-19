import React, { useState } from 'react';
import HowItWorksModal from '../components/HowItWorksModal';

export default function HowItWorksPage() {
  return (
    <div className="w-full">
      <HowItWorksModal isOpen={true} onClose={() => {}} />
    </div>
  );
}
