"use client";

import React from 'react';
import ActivityPage from '@/components/view/activity';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { useRouter } from 'next/navigation';

export default function MethodSelectPage() {
    const router = useRouter();
    const { method, changeMethod } = useGlobalState();
    const continueHandler = () => {
        if (method === 'maintenance') {
            router.push('/maintenance');
        } else {
            router.push('/checksheet');
        }
    }
    return <ActivityPage onContinue={continueHandler} selectMethod={changeMethod} type={method} />;
}