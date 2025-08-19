import Button from '@/components/ui/Button';
import Image from 'next/image';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Eye, EyeOff } from 'lucide-react';

type SigninPageProps = {
    onContinue: (data: FormData) => void;
    type: string;
    isLoading: boolean;
}

export type FormData = {
    name: string;
    nik: string;
}

export default function SigninPage({ onContinue, type, isLoading }: SigninPageProps) {
  const [name, setName] = useState<string>("");
  const [nik, setNik] = useState<string>("");
  const [showNik, setShowNik] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name?: string; nik?: string }>({});
  
  const validateForm = () => {
    const newErrors: { name?: string; nik?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Nama harus diisi";
    }
    
    if (!nik.trim()) {
      newErrors.nik = "NIK harus diisi";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (validateForm()) {
      onContinue({ name, nik });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b flex flex-col items-center px-6 py-8 overflow-hidden" style={{background: 'linear-gradient(to bottom, #9FB1EB, #3A3CB8)'}}>
      {/* Logo */}
      <div className="flex w-full items-start">
      <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white mb-16 text-left">
        {type === 'maintenance' ? 'Maintenance' : 'Check Sheet'}<br /><span className='ml-12'>Kendaraan</span>
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
      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full mb-2">
          <Input 
            type="text" 
            placeholder="Nama" 
            className={`text-black bg-white p-6 ${errors.name ? 'border-red-500' : ''}`}
            value={name} 
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && <p className="text-red-300 text-sm mt-1 ml-1">{errors.name}</p>}
        </div>
        
        <div className="w-full mb-2">
          <div className="relative">
            <Input 
              type={showNik ? "text" : "password"} 
              placeholder="NIK" 
              className={`text-black bg-white p-6 pr-12 ${errors.nik ? 'border-red-500' : ''}`}
              value={nik} 
              onChange={(e) => {
                setNik(e.target.value);
                if (errors.nik) setErrors(prev => ({ ...prev, nik: undefined }));
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNik(!showNik)}
            >
              {showNik ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.nik && <p className="text-red-300 text-sm mt-1 ml-1">{errors.nik}</p>}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Button type="secondary" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>
  );
}