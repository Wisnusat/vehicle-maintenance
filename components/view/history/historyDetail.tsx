import Button from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import React from 'react';

type VehicleDetail = {
    name: string;
    line: string;
    nik: string;
    tanggal: string;
    shift: string;
    waktuPengisian: string;
    noUnit: string;
};

type PartDetail = {
    id: string;
    name: string;
    pengecekan: string;
    kondisi: string;
};

export default function HistoryDetail() {
    // Sample vehicle data
    const vehicleDetail: VehicleDetail = {
        name: 'XXX',
        line: 'XXX',
        nik: 'XXX',
        tanggal: 'XXXXXX',
        shift: 'XXX',
        waktuPengisian: 'XXXX',
        noUnit: 'XXX'
    };

    // Sample parts data
    const partsDetails: PartDetail[] = [
        {
            id: '1',
            name: 'Safety Belt',
            pengecekan: 'Berfungsi Dengan Baik Saat Posisi Terpasang',
            kondisi: 'Baik'
        },
        {
            id: '2',
            name: 'Lampu Sein',
            pengecekan: 'Lampu Sein Depan Kanan Dan Kiri Normal Lampu Sein Belakang Kanan Dan Kiri Normal',
            kondisi: 'Problem'
        }
    ];

    return (
        <div className="min-h-screen bg-secondary">
            {/* Header */}
            <div className="flex justify-start items-center p-6">
                <Sidebar />
            </div>

            {/* Vehicle Image and Type */}
            <div className="flex flex-col items-center px-6 mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-white mb-4">
                    <Image
                        src="/images/forklift_img.svg"
                        alt="Forklift"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Type Unit</p>
                    <p className="text-primary font-semibold text-lg">Forklift</p>
                </div>
            </div>

            {/* Detail Unit Card */}
            <div className="mx-6 mb-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-primary font-semibold text-lg">Detail Unit</h3>
                        <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                            UBAH
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500 mb-1">Nama</p>
                            <p className="text-primary font-medium">{vehicleDetail.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Line</p>
                            <p className="text-primary font-medium">{vehicleDetail.line}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">NIK</p>
                            <p className="text-primary font-medium">{vehicleDetail.nik}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Tanggal</p>
                            <p className="text-primary font-medium">{vehicleDetail.tanggal}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Shift</p>
                            <p className="text-primary font-medium">{vehicleDetail.shift}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Waktu Pengisian</p>
                            <p className="text-primary font-medium">{vehicleDetail.waktuPengisian}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 mb-1">No Unit</p>
                            <p className="text-primary font-medium">{vehicleDetail.noUnit}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Parts Cards */}
            <div className="mx-6 space-y-4">
                {partsDetails.map((part) => (
                    <div key={part.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-primary font-semibold text-lg">Detail Parts</h3>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Nama</p>
                                <p className="text-primary font-medium">{part.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Pengecekan</p>
                                <p className="text-primary font-medium leading-relaxed">{part.pengecekan}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Kondisi</p>
                                <p className={`font-medium ${
                                    part.kondisi === 'Baik' ? 'text-green-600' : 
                                    part.kondisi === 'Problem' ? 'text-red-600' : 'text-primary'
                                }`}>
                                    {part.kondisi}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete button */}
           <div className="flex justify-end mt-6 mx-6">
            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-md">
                Hapus
            </button>
           </div>
           
           {/* Download Button */}
           <div className="w-2/3 mx-auto mt-20">
            <Button type="primary">
                Download
            </Button>
           </div>
           <div className="h-8"></div>
        </div>
    );
};
