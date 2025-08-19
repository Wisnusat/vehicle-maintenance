import { Sidebar } from '@/components/ui/sidebar';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useGlobalState } from '@/contexts/GlobalStateContext';

type HistoryItem = {
    id: string;
    noUnit: string;
    waktuPengisian: string;
    tanggal: string;
    vehicleType: string;
};

export default function HistoryList() {
    const dataUser = JSON.parse(localStorage.getItem('user') || '{}');
    const router = useRouter();
    const { method } = useGlobalState();
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

    const fetchData = async () => {
        const supabase = createSupabaseBrowserClient();

        const { data, error } = await supabase
            .from('checksheetProfile')
            .select()
            .ilike('fullName', dataUser.fullName)
            .eq('nik', dataUser.nik);

        if (error || !data) {
            toast.error('Gagal mengambil data. Coba lagi.');
            return;
        }

        setHistoryItems(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-secondary">
            <div className="bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center p-6">
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">History</h1>
                </div>
            </div>
            <div className="px-6 py-8 h-full">
                {/* Header with gradient background */}
                {/* Top Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Sidebar />
                    <Image src="/images/filter.svg" alt="Filter" width={26} height={26} />
                </div>

                {/* History List */}
                <div className="px-6 py-6 space-y-4 -mt-6">
                    {historyItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Image src="/images/gear.svg" alt="Empty" width={100} height={100} />
                            <p className="text-gray-500 text-center font-medium mt-6">
                                {`Belum ada ${method === 'maintenance' ? 'maintenance' : 'pengecekan'}`}
                            </p>
                        </div>
                    ) : (
                        historyItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center rounded-3xl p-6 shadow-lg"
                                onClick={() => router.push(`/history/detail/${item.id}`)}
                            >
                                <div className="bg-white rounded-2xl p-4 flex items-center space-x-4">
                                    {/* Icon */}
                                    {item.vehicleType?.toLowerCase() === 'forklift' && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/forklift.svg"
                                                alt="Forklift"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {item.vehicleType?.toLowerCase() === 'towing' && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/towing.svg"
                                                alt="Forklift"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {item.vehicleType?.toLowerCase() === 'truck' && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/truk.svg"
                                                alt="Forklift"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {item.vehicleType?.toLowerCase() === 'lain-lain' && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/lorry_illus.svg"
                                                alt="Forklift"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-primary mb-1">
                                            {item.noUnit}
                                        </h3>
                                        <div className="text-sm text-gray-600">
                                            <p>Check Time:</p>
                                            <p className="font-medium">
                                                {item.waktuPengisian}, {item.tanggal}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
