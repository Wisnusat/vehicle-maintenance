"use client";
import React from 'react';
import SigninPage, { FormData } from '@/components/view/signin';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Page() {
    const router = useRouter();
    const { method } = useGlobalState();
    
    const submitForm = (data: FormData) => {
        if (data.name === "user" && data.nik === "1234567890") {
            if (method === 'maintenance') {
                router.push('/maintenance');
            } else {
                router.push('/checksheet');
            }
        } else {
            toast.error('NIK atau Nama tidak valid');
        }
    }

    return (
        <SigninPage type={method} onContinue={submitForm} />
    )
}