"use client";
import React from 'react';
import SigninPage, { FormData } from '@/components/view/signin';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const { method } = useGlobalState();
    
    const submitForm = (data: FormData) => {
        console.log('submit', data);   
        router.push('/maintenance');
    }

    return (
        <SigninPage type={method} onContinue={submitForm} />
    )
}