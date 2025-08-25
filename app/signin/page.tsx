"use client";
import React, { useState } from 'react';
import SigninPage, { FormData } from '@/components/view/signin';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const submitForm = async (data: FormData) => {
        try {
            setIsLoading(true);
            const supabase = createSupabaseBrowserClient();

            const name = data.name?.trim() ?? '';
            const nik = data.nik?.trim() ?? '';

            if (!name || !nik) {
                toast.error('NIK atau Nama tidak valid');
                return;
            }

            const { data: user, error } = await supabase
                .from('user')
                .select('id, fullName, nik')
                .ilike('fullName', name)
                .eq('nik', nik)
                .single();

            if (error || !user) {
                toast.error('NIK atau Nama tidak valid');
                return;
            }

            localStorage.setItem('user', JSON.stringify(user));
            router.push('/method');
        } catch (e) {
            console.error(e);
            toast.error('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SigninPage onContinue={submitForm} isLoading={isLoading} />
    )
}