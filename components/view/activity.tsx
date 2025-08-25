import Button from '@/components/ui/Button';
import Image from 'next/image';
import React from 'react';

type ActivityPageProps = {
  onContinue: () => void;
  selectMethod: (type: string) => void;
  type: string;
}

export default function ActivityPage({ onContinue, selectMethod, type }: ActivityPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b flex flex-col items-center px-6 py-8 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #9FB1EB, #3A3CB8)' }}>
      {/* Logo */}
      <div className="flex w-full items-start">
        <Image src="/images/logo_new.svg" alt="Logo" width={100} height={100} />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white mb-16 text-left">
        Pilih Aktivitas<br /><span className='ml-12'>Yang dilakukan</span>
      </h1>

      {/* Image Placeholder */}
      <div className="relative w-full max-w-[300px] aspect-square">
        <Image
          src="/images/settings.svg"
          alt="Settings"
          fill
          className="object-contain"
        />
      </div>


      {/* Content */}
      <div className={`relative bg-[#9FB1EB] ${type === 'maintenance' && 'border-3 border-solid border-primary'} rounded-md text-primary p-4 mb-6 w-3/4 text-center cursor-pointer duration-100`} onClick={() => selectMethod('maintenance')}>
        {type === 'maintenance' && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        Maintenance
      </div>
      <div className={`relative bg-[#9FB1EB] ${type === 'check-sheet' && 'border-3 border-solid border-primary'} rounded-md text-primary p-4 mb-10 w-3/4 text-center cursor-pointer duration-100`} onClick={() => selectMethod('check-sheet')}>
        {type === 'check-sheet' && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        Check Sheet
      </div>

      {/* Continue Button */}
      <Button type="secondary" onClick={onContinue}>
        Next
      </Button>
    </div>
  );
}