"use client";
import React from 'react';
import SigninPage, { FormData } from '@/components/view/signin';
import { useGlobalState } from '@/contexts/GlobalStateContext';

export default function Page() {
    const { method } = useGlobalState();
    
    const submitForm = (data: FormData) => {
        console.log('submit', data);   
    }

    return (
        <SigninPage type={method} onContinue={submitForm} />
    )
}