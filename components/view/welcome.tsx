import Button from '@/components/ui/Button';
import Image from 'next/image';
import React from 'react';

type WelcomePageProps = {
    onContinue: () => void;
}

export default function WelcomePage({ onContinue }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b flex flex-col items-center px-6 py-8 overflow-hidden" style={{background: 'linear-gradient(to bottom, #9FB1EB, #3A3CB8)'}}>
      {/* Logo */}
      <div className="flex w-full items-start">
      <Image src="/images/logo_new.svg" alt="Logo" width={100} height={100} />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white mb-16 text-center">
        Pengecekan<br />Kendaraan
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
      <div className="text-center mb-12">
        <h2 className="text-xl font-bold text-primary mb-4">
          Check Sheet Digital Kendaraan<br />Operasional
        </h2>
        <p className="text-white font-semibold text-sm leading-relaxed max-w-xs">
          Proses inspeksi harian kendaraan pabrik. Cek kondisi, catat temuan, dan pantau performa kendaraan.
        </p>
      </div>

      {/* Continue Button */}
     <Button type="secondary" onClick={onContinue}>
        Continue
     </Button>
    </div>
  );
}