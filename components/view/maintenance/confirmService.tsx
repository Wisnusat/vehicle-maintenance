/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type MaintenanceRow = {
    id: number | string;
    nama: string;
    nik: string;
    noKendaraan: string;
    jenis_barang: string;
    tanggal: string;
    waktu: string;
    vehicleType: string;
};

type DetailServisItem = {
    jenisServis: string;
    keterangan: string;
    beforePhoto?: string | null;
    afterPhoto?: string | null;
};

type MaintenanceDetailRow = {
    id: number | string;
    maintenance_id: number | string;
    kilometer?: string | null;
    tipeBarang?: string | null;
    detailServis: DetailServisItem[];
};

export default function ConfirmService() {
    const router = useRouter();
    const supabase = useMemo(() => createSupabaseBrowserClient(), []);

    const [loading, setLoading] = useState(true);
    const [header, setHeader] = useState<MaintenanceRow | null>(null);
    const [detail, setDetail] = useState<MaintenanceDetailRow | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            let maintenanceId: string | null = null;
            try {
                maintenanceId = sessionStorage.getItem('maintenance_current_id');
            } catch {}
            if (!maintenanceId) {
                toast.error('Maintenance ID tidak ditemukan.');
                setLoading(false);
                return;
            }

            // Fetch header (maintenance)
            const { data: headerData, error: headerErr } = await supabase
                .from('maintenance')
                .select('*')
                .eq('id', maintenanceId)
                .single();
            if (headerErr) {
                toast.error(`Gagal mengambil data maintenance: ${headerErr.message}`);
            } else {
                setHeader(headerData as MaintenanceRow);
            }

            // Fetch detail (maintenance_detail)
            const { data: detailData, error: detailErr } = await supabase
                .from('maintenance_detail')
                .select('*')
                .eq('maintenance_id', maintenanceId)
                .single();

            // Normalize/parse detailServis into array of objects
            if (!detailErr && detailData) {
                let parsed: DetailServisItem[] = [];
                const raw = (detailData as any).detailServis;
                try {
                    if (Array.isArray(raw)) {
                        if (raw.length > 0 && typeof raw[0] === 'string') {
                            parsed = (raw as string[]).map((s) => {
                                try { return JSON.parse(s); } catch { return null; }
                            }).filter(Boolean) as DetailServisItem[];
                        } else {
                            parsed = raw as DetailServisItem[];
                        }
                    } else if (typeof raw === 'string') {
                        const maybe = JSON.parse(raw);
                        parsed = Array.isArray(maybe) ? maybe as DetailServisItem[] : [maybe as DetailServisItem];
                    }
                } catch {}

                (detailData as any).detailServis = parsed;
            }
            if (detailErr) {
                toast.error(`Gagal mengambil detail servis: ${detailErr.message}`);
            } else if (detailData) {
                setDetail(detailData as MaintenanceDetailRow);
            }

            setLoading(false);
        };
        fetchData();
    }, [supabase]);

    const handleNextClick = () => {
        router.push('/history');
    };

    return (
        <div className="min-h-screen bg-secondary">
            {/* Header */}
            <div className="flex justify-start items-center p-6">
                <Sidebar />
            </div>

            {/* Progress Steps */}
            <div className="px-6 mb-8 mt-6">
                <div className="flex items-center justify-between">
                    {/* Step 1 - Completed */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-primary font-semibold text-sm">01</p>
                            <p className="text-primary font-medium text-xs">Pilih Servis</p>
                        </div>
                    </div>

                    {/* Connector Line - Active */}
                    <div className="flex-1 h-0.5 bg-primary mx-4"></div>

                    {/* Step 2 - Completed */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-primary font-semibold text-sm">02</p>
                            <p className="text-primary font-medium text-xs">Detail Servis</p>
                        </div>
                    </div>

                    {/* Connector Line - Active */}
                    <div className="flex-1 h-0.5 bg-primary mx-4"></div>

                    {/* Step 3 - Active */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-primary font-semibold text-sm">03</p>
                            <p className="text-primary font-medium text-xs">Konfirmasi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading / Content */}
            {loading ? (
                <div className="px-6 pb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-500">Loading...</div>
                </div>
            ) : (
                <>
                    {/* Detail Unit Card */}
                    <div className="mx-6 mb-4">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-primary font-semibold text-lg">Detail Unit</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Nama</p>
                                    <p className="text-primary font-medium">{header?.nama || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">{header?.vehicleType === 'lain-lain' ? 'Tipe Barang' : 'Kilometer'}</p>
                                    <p className="text-primary font-medium">{header?.vehicleType === 'lain-lain' ? (header?.jenis_barang || '-') : (detail?.kilometer || '-')}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">NIK</p>
                                    <p className="text-primary font-medium">{header?.nik || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Tanggal</p>
                                    <p className="text-primary font-medium">{header?.tanggal || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500 mb-1">No Unit/Polisi</p>
                                    <p className="text-primary font-medium">{header?.noKendaraan || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detail Servis List */}
                    <div className="mx-6 mb-4 space-y-4">
                        {(detail?.detailServis || []).map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-primary font-semibold text-lg">Detail Servis #{idx + 1}</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-500 mb-1">Jenis Servis</p>
                                        <p className="text-primary font-medium">{item.jenisServis || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Keterangan</p>
                                        <p className="text-primary font-medium whitespace-pre-wrap">{item.keterangan || '-'}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-500 mb-2">Photo Sebelum</p>
                                            {item.beforePhoto ? (
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                                    <Image src={item.beforePhoto} alt={`before-${idx}`} fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">No photo</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-2">Photo Sesudah</p>
                                            {item.afterPhoto ? (
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                                    <Image src={item.afterPhoto} alt={`after-${idx}`} fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">No photo</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!detail || (detail?.detailServis || []).length === 0) && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-500">Tidak ada detail servis</div>
                        )}
                    </div>

                    {/* Next Button */}
                    <div className="px-6 pb-8">
                        <Button type="primary" onClick={handleNextClick}>
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
