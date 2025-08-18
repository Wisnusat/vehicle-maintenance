import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type ActivityPageProps = {
    onContinue: () => void;
    selectMethod: (type: string) => void;
    type: string;
}

export default function ActivityPage({ onContinue, selectMethod, type }: ActivityPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b flex flex-col items-center px-6 py-8 overflow-hidden" style={{background: 'linear-gradient(to bottom, #9FB1EB, #3A3CB8)'}}>
      {/* Logo */}
      <div className="flex w-full items-start">
      <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
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
      <div className={`bg-[#9FB1EB] ${type === 'maintenance' && 'border-2 border-solid border-primary'} rounded-md text-primary p-4 mb-6 w-3/4 text-center cursor-pointer duration-100`} onClick={() => selectMethod('maintenance')}>
        Maintenance
      </div>
      <div className={`bg-[#9FB1EB] ${type === 'check-sheet' && 'border-2 border-solid border-primary'} rounded-md text-primary p-4 mb-10 w-3/4 text-center cursor-pointer duration-100`} onClick={() => selectMethod('check-sheet')}>
        Check Sheet
      </div>

      {/* Continue Button */}
      <Link href="/signin" className="w-full">
        <Button type="secondary" onClick={onContinue}>
            Next
        </Button>
      </Link>
    </div>
  );
}