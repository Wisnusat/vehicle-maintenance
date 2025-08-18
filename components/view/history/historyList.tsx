import { Sidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

type HistoryItem = {
    id: string;
    vehicleCode: string;
    checkTime: string;
    date: string;
};

export default function HistoryList() {
    const router = useRouter();
    // Sample history data
    const historyItems: HistoryItem[] = [
        {
            id: '1',
            vehicleCode: 'F 1X',
            checkTime: '07:32',
            date: 'DD/MM/YYYY'
        },
        {
            id: '2',
            vehicleCode: 'F 1X',
            checkTime: '07:32',
            date: 'DD/MM/YYYY'
        },
        {
            id: '3',
            vehicleCode: 'F 1X',
            checkTime: '07:32',
            date: 'DD/MM/YYYY'
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center p-6">
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">History</h1>
                </div>
            </div>
            <div className="bg-secondary px-6 py-8 h-full">
                {/* Header with gradient background */}
                {/* Top Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Sidebar />
                    <Image src="/images/filter.svg" alt="Filter" width={26} height={26} />
                </div>

                {/* History List */}
                <div className="px-6 py-6 space-y-4 -mt-6">
                    {historyItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center rounded-3xl p-6 shadow-lg"
                            onClick={() => router.push(`/history/detail`)}
                        >
                            <div className="bg-white rounded-2xl p-4 flex items-center space-x-4">
                                {/* Forklift Icon */}
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/images/forklift.svg"
                                        alt="Forklift"
                                        width={60}
                                        height={60}
                                        className="object-contain"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-primary mb-1">
                                        {item.vehicleCode}
                                    </h3>
                                    <div className="text-sm text-gray-600">
                                        <p>Check Time:</p>
                                        <p className="font-medium">
                                            {item.checkTime}, {item.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
