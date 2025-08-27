/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Button from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '@/contexts/GlobalStateContext';

type VehicleDetail = {
    name: string;
    line: string;
    nik: string;
    tanggal: string;
    shift: string;
    waktuPengisian: string;
    noUnit: string;
    vehicleType?: string;
    ruteDelivery?: string;
    sioDepnaker: string;
    stnk: string;
    stickerKir: string;
    ibm: string;
};

type Pengecekan = {
    text: string;
    kondisi: string;
};

type ChecksheetPartRow = {
    id: string;
    partName: string;
    pengecekan: Pengecekan[];
    note: string;
};

// Maintenance types
type MaintenanceRow = {
    id: number | string;
    nama: string;
    nik: string;
    noKendaraan: string;
    jenis_barang: string;
    tanggal: string;
    waktu: string;
    vehicleType?: string;
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

export default function HistoryDetail({ id }: { id?: string }) {
    const router = useRouter();
    const { changeVehicleType, method } = useGlobalState();
    const [vehicleDetail, setVehicleDetail] = useState<VehicleDetail | null>(null);
    const [partsDetails, setPartsDetails] = useState<ChecksheetPartRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [profileRaw, setProfileRaw] = useState<any | null>(null);
    const [maintenanceHeader, setMaintenanceHeader] = useState<MaintenanceRow | null>(null);
    const [maintenanceDetail, setMaintenanceDetail] = useState<MaintenanceDetailRow | null>(null);

    const vehicleType = useMemo(() => {
        return vehicleDetail?.vehicleType || maintenanceHeader?.vehicleType;
    }, [vehicleDetail, maintenanceHeader]);

    const isPengecekan = (v: any): v is Pengecekan =>
        v && typeof v === "object" && typeof v.text === "string" && typeof v.kondisi === "string";

    /** Accepts: Pengecekan[], string[], JSON string of array, or null; returns Pengecekan[] */
    const normalizePengecekan = (raw: unknown): Pengecekan[] => {
        if (!raw) return [];

        // If it's already an array
        if (Array.isArray(raw)) {
            return raw
                .map((item) => {
                    if (isPengecekan(item)) return item;                // already object
                    if (typeof item === "string") {
                        try {
                            const parsed = JSON.parse(item);
                            return isPengecekan(parsed) ? parsed : null;    // stringified object
                        } catch {
                            return null;
                        }
                    }
                    return null;
                })
                .filter((x): x is Pengecekan => x !== null);
        }

        // If it's a single JSON string (maybe an array or a single object)
        if (typeof raw === "string") {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    return parsed.filter(isPengecekan);
                }
                return isPengecekan(parsed) ? [parsed] : [];
            } catch {
                return [];
            }
        }

        return [];
    };

    const handleEdit = () => {
        if (!profileRaw) return;
        try {
            // Mark edit mode and persist current data for prefill
            localStorage.setItem('editMode', 'true');
            localStorage.setItem('editChecksheetId', id || '');
            localStorage.setItem('editProfile', JSON.stringify(profileRaw));
            localStorage.setItem('editParts', JSON.stringify(partsDetails));

            // Ensure vehicle type matches the record for subsequent pages
            if (profileRaw?.vehicleType) {
                changeVehicleType(String(profileRaw.vehicleType));
            }

            // Go to input form to edit, then proceed to services
            router.push('/checksheet/inputForm');
        } catch {
            toast.error('Tidak dapat memulai mode ubah.');
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const supabase = createSupabaseBrowserClient();

                if (method === 'maintenance') {
                    // Fetch maintenance header
                    const { data: headerData, error: headerErr } = await supabase
                        .from('maintenance')
                        .select('*')
                        .eq('id', id)
                        .single();
                    if (headerErr) {
                        toast.error('Gagal mengambil detail maintenance.');
                    } else if (headerData) {
                        setMaintenanceHeader(headerData as MaintenanceRow);
                    }

                    // Fetch maintenance detail and normalize detailServis
                    const { data: detailData, error: detailErr } = await supabase
                        .from('maintenance_detail')
                        .select('*')
                        .eq('maintenance_id', id)
                        .single();
                    if (detailErr) {
                        toast.error('Gagal mengambil detail servis.');
                    } else if (detailData) {
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
                        setMaintenanceDetail(detailData as MaintenanceDetailRow);
                    }
                } else {
                    // Legacy checksheet detail
                    const { data: profile, error: profileErr } = await supabase
                        .from('checksheetProfile')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (profileErr || !profile) {
                        toast.error('Gagal mengambil detail riwayat.');
                        setIsLoading(false);
                        return;
                    }

                    const mappedVehicle: VehicleDetail = {
                        name: profile.fullName ?? '-',
                        line: profile.line ?? '-',
                        nik: profile.nik ?? '-',
                        tanggal: profile.tanggal ?? '-',
                        shift: profile.shift ?? '-',
                        waktuPengisian: profile.waktuPengisian ?? '-',
                        noUnit: (profile.noUnit || profile.noPolisi || '-') as string,
                        vehicleType: profile.vehicleType ?? undefined,
                        ruteDelivery: profile.ruteDelivery ?? '',
                        sioDepnaker: profile.sioDepnaker ?? '',
                        stnk: profile.stnk ?? '',
                        stickerKir: profile.stickerKir ?? '',
                        ibm: profile.ibm ?? '',
                    };
                    setVehicleDetail(mappedVehicle);
                    setProfileRaw(profile);

                    const { data: parts, error: partsErr } = await supabase
                        .from('checksheetParts')
                        .select('*')
                        .eq('id_checksheet', id);

                    if (partsErr || !parts) {
                        setPartsDetails([]);
                    } else {
                        const parsed: ChecksheetPartRow[] = parts.map((p: any) => ({
                            id: p.id,
                            partName: p.partName,
                            pengecekan: normalizePengecekan(p.pengecekan),
                            note: p.note,
                        }));
                        setPartsDetails(parsed);
                    }
                }
            } catch {
                toast.error('Terjadi kesalahan saat mengambil data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [id, method]);

    const handleDelete = async () => {
        if (!id) return;
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus riwayat ini? Tindakan ini tidak dapat dibatalkan.');
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            const supabase = createSupabaseBrowserClient();

            if (method === 'maintenance') {
                // Delete maintenance detail first
                const { error: detErr } = await supabase
                    .from('maintenance_detail')
                    .delete()
                    .eq('maintenance_id', id);
                if (detErr) {
                    toast.error('Gagal menghapus detail maintenance.');
                    setIsDeleting(false);
                    return;
                }
                // Then delete maintenance header
                const { error: headErr } = await supabase
                    .from('maintenance')
                    .delete()
                    .eq('id', id);
                if (headErr) {
                    toast.error('Gagal menghapus data maintenance.');
                    setIsDeleting(false);
                    return;
                }
            } else {
                // Delete dependent parts first (checksheet)
                const { error: partsDelErr } = await supabase
                    .from('checksheetParts')
                    .delete()
                    .eq('id_checksheet', id);
                if (partsDelErr) {
                    toast.error('Gagal menghapus detail parts.');
                    setIsDeleting(false);
                    return;
                }
                // Then delete the profile
                const { error: profileDelErr } = await supabase
                    .from('checksheetProfile')
                    .delete()
                    .eq('id', id);
                if (profileDelErr) {
                    toast.error('Gagal menghapus riwayat.');
                    setIsDeleting(false);
                    return;
                }
            }

            toast.success('Riwayat berhasil dihapus.');
            router.push('/history');
        } catch {
            toast.error('Terjadi kesalahan saat menghapus.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading && !vehicleDetail) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center">
                <p className="text-primary">Loading...</p>
            </div>
        );
    }

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
                        src={
                            vehicleType?.toLowerCase() === 'truck' ? '/images/truck_img.svg' :
                                vehicleType?.toLowerCase() === 'towing' ? '/images/tuktuk.svg' :
                                    '/images/forklift_img.svg'
                        }
                        alt={vehicleType || 'Vehicle'}
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Type Unit</p>
                    <p className="text-primary font-semibold text-lg">{vehicleType || '-'}</p>
                    {/* Optional: show id for debugging */}
                    {/* {id && (
                        <p className="text-xs text-gray-500 mt-1">ID: {id}</p>
                    )} */}
                </div>
            </div>

            {/* Detail Unit Card */
            }
            <div className="mx-6 mb-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-primary font-semibold text-lg">Detail Unit</h3>
                        {method !== 'maintenance' && (
                            <button onClick={handleEdit} className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                                UBAH
                            </button>
                        )}
                    </div>

                    {method === 'maintenance' ? (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Nama</p>
                                <p className="text-primary font-medium">{maintenanceHeader?.nama || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">{maintenanceDetail?.tipeBarang ? 'Tipe Barang' : 'Kilometer'}</p>
                                <p className="text-primary font-medium">{maintenanceDetail?.tipeBarang || maintenanceDetail?.kilometer || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">NIK</p>
                                <p className="text-primary font-medium">{maintenanceHeader?.nik || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Tanggal</p>
                                <p className="text-primary font-medium">{maintenanceHeader?.tanggal || '-'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 mb-1">No Unit/Polisi</p>
                                <p className="text-primary font-medium">{maintenanceHeader?.noKendaraan || maintenanceHeader?.jenis_barang || '-'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Nama</p>
                                <p className="text-primary font-medium">{vehicleDetail?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">{vehicleType !== 'truck' ? 'Line' : 'Rute Delivery'}</p>
                                <p className="text-primary font-medium">{vehicleDetail?.line || vehicleDetail?.ruteDelivery || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">NIK</p>
                                <p className="text-primary font-medium">{vehicleDetail?.nik || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Tanggal</p>
                                <p className="text-primary font-medium">{vehicleDetail?.tanggal || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Shift</p>
                                <p className="text-primary font-medium">{vehicleDetail?.shift || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Waktu Pengisian</p>
                                <p className="text-primary font-medium">{vehicleDetail?.waktuPengisian || '-'}</p>
                            </div>
                            <div className={`${vehicleType !== 'truck' && 'col-span-2'}`}>
                                <p className="text-gray-500 mb-1">No {vehicleType === 'truck' ? 'Polisi' : 'Unit'}</p>
                                <p className="text-primary font-medium">{vehicleDetail?.noUnit || '-'}</p>
                            </div>
                            {vehicleType === 'truck' && (
                                <>
                                    <div>
                                        <p className="text-gray-500 mb-1">SIO Depnaker</p>
                                        <p className="text-primary font-medium">{vehicleDetail?.sioDepnaker || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">STNK</p>
                                        <p className="text-primary font-medium">{vehicleDetail?.stnk || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Sticker KIR</p>
                                        <p className="text-primary font-medium">{vehicleDetail?.stickerKir || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Surat Izin Bongkar Muat</p>
                                        <p className="text-primary font-medium">{vehicleDetail?.ibm || '-'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Details Section */}
            {method === 'maintenance' ? (
                <div className="mx-6 mb-4 space-y-4">
                    {(maintenanceDetail?.detailServis || []).map((item, idx) => (
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
                    {(!maintenanceDetail || (maintenanceDetail?.detailServis || []).length === 0) && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm text-center text-gray-500">Tidak ada detail servis</div>
                    )}
                </div>
            ) : (
                <div className="mx-6 space-y-4">
                    {partsDetails.map((part) => (
                        <div key={part.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-primary font-semibold text-lg">Detail Parts</h3>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Nama</p>
                                    <p className="text-primary font-medium">{part.partName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Pengecekan</p>
                                    <div className="text-primary font-medium leading-relaxed flex-col gap-2">{part?.pengecekan?.map((pengecekan, i) => <div key={i}>{pengecekan.text} (<span className={`font-medium ${pengecekan.kondisi === 'Baik' ? 'text-green-600' :
                                            pengecekan.kondisi === 'Problem' ? 'text-red-600' : 'text-orange-500'
                                        }`}>
                                        {pengecekan.kondisi || 'Belum Diisi'}
                                    </span>)</div>)}</div>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Note</p>
                                    <p className="text-primary font-medium">{part.note || '-'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete button */}
            <div className="w-full mt-6 px-6">
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`px-4 py-2 w-full rounded-md text-white ${isDeleting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                >
                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                </button>
            </div>

            {/* Download Button */}
            {/* <div className="w-2/3 mx-auto mt-20">
                <Button type="primary">
                    Download
                </Button>
            </div> */}
            <div className="h-8"></div>
        </div>
    );
};
