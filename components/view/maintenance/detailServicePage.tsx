import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/sidebar';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type FormData = {
    kilometer: string;
    tipeBarang: string;
};

type ServiceItem = {
    jenisServis: string;
    keterangan: string;
    photoSebelum: File | null;
    photoSesudah: File | null;
    previewSebelum: string | null;
    previewSesudah: string | null;
};

export default function DetailServicePage() {
    const router = useRouter();
    const tipeBarang = sessionStorage.getItem('maintenance_current_type');
    const { vehicleType } = useGlobalState();
    const [formData, setFormData] = useState<FormData>({ kilometer: '', tipeBarang: tipeBarang || '' });
    const [services, setServices] = useState<ServiceItem[]>([
        {
            jenisServis: '',
            keterangan: 'Isi Catatan disini',
            photoSebelum: null,
            photoSesudah: null,
            previewSebelum: null,
            previewSesudah: null,
        },
    ]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleServiceChange = <K extends keyof ServiceItem>(index: number, field: K, value: ServiceItem[K]) => {
        setServices(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value } as ServiceItem;
            return next;
        });
    };

    const handlePhotoUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleServiceChange(index, 'photoSebelum', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                handleServiceChange(index, 'previewSebelum', (e.target?.result as string) || null);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = (index: number) => {
        handleServiceChange(index, 'photoSebelum', null);
        handleServiceChange(index, 'previewSebelum', null);
    };

    const handlePhotoUploadAfter = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleServiceChange(index, 'photoSesudah', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                handleServiceChange(index, 'previewSesudah', (e.target?.result as string) || null);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhotoAfter = (index: number) => {
        handleServiceChange(index, 'photoSesudah', null);
        handleServiceChange(index, 'previewSesudah', null);
    };

    const addServiceType = () => {
        setServices(prev => ([
            ...prev,
            {
                jenisServis: '',
                keterangan: 'Isi Catatan disini',
                photoSebelum: null,
                photoSesudah: null,
                previewSebelum: null,
                previewSesudah: null,
            }
        ]));
    };

    const removeService = (index: number) => {
        setServices(prev => prev.filter((_, i) => i !== index));
    };

    const supabase = useMemo(() => createSupabaseBrowserClient(), []);

    const handleNextClick = async () => {
        // Validation
        if (!formData.kilometer && vehicleType !== 'lain-lain') {
            toast.error('Kilometer wajib diisi');
            return;
        }
        if (vehicleType === 'lain-lain' && !formData.kilometer) {
            toast.error('Tipe Barang wajib diisi');
            return;
        }
        if (services.length === 0) {
            toast.error('Tambahkan minimal 1 detail servis');
            return;
        }
        for (let i = 0; i < services.length; i++) {
            if (!services[i].jenisServis) {
                toast.error(`Jenis Servis #${i + 1} wajib diisi`);
                return;
            }
        }

        // Get maintenance id
        let maintenanceId: string | number | null = null;
        try {
            maintenanceId = sessionStorage.getItem('maintenance_current_id');
        } catch { }
        if (!maintenanceId) {
            toast.error('Maintenance ID tidak ditemukan. Mohon kembali dan submit form utama terlebih dahulu.');
            return;
        }

        // Upload photos and build detailServis array
        const bucket = 'maintenance_photo';
        const uploads: { beforeUrl: string; afterUrl: string; jenisServis: string; keterangan: string }[] = [];
        for (let i = 0; i < services.length; i++) {
            const svc = services[i];
            let beforeUrl = '';
            let afterUrl = '';

            if (svc.photoSebelum) {
                const ext = svc.photoSebelum.name.split('.').pop() || 'jpg';
                const path = `${maintenanceId}/${Date.now()}_${i}_before.${ext}`;
                const { error: upErr } = await supabase.storage.from(bucket).upload(path, svc.photoSebelum, { contentType: svc.photoSebelum.type });
                if (upErr) { toast.error(`Upload foto sebelum gagal (#${i + 1}): ${upErr.message}`); return; }
                beforeUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
            }

            if (svc.photoSesudah) {
                const ext = svc.photoSesudah.name.split('.').pop() || 'jpg';
                const path = `${maintenanceId}/${Date.now()}_${i}_after.${ext}`;
                const { error: upErr } = await supabase.storage.from(bucket).upload(path, svc.photoSesudah, { contentType: svc.photoSesudah.type });
                if (upErr) { toast.error(`Upload foto sesudah gagal (#${i + 1}): ${upErr.message}`); return; }
                afterUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
            }

            uploads.push({
                beforeUrl,
                afterUrl,
                jenisServis: svc.jenisServis,
                keterangan: svc.keterangan,
            });
        }

        const detailServis = uploads.map(u => ({
            jenisServis: u.jenisServis,
            keterangan: u.keterangan,
            beforePhoto: u.beforeUrl,
            afterPhoto: u.afterUrl,
        }));

        const payload = {
            tipeBarang: vehicleType === 'lain-lain' ? formData.kilometer : '',
            kilometer: vehicleType !== 'lain-lain' ? formData.kilometer : '',
            detailServis,
            maintenance_id: maintenanceId,
        } as const;

        const { error } = await supabase.from('maintenance_detail').insert([payload]);
        if (error) {
            toast.error(`Gagal menyimpan detail: ${error.message}`);
            return;
        }

        router.push('/maintenance/confirm');
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

                    {/* Step 2 - Active */}
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

                    {/* Connector Line - Inactive */}
                    <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

                    {/* Step 3 - Inactive */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 font-semibold text-sm">03</p>
                            <p className="text-gray-400 font-medium text-xs">Konfirmasi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="px-6 space-y-6">
                {/* Kilometer Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center">
                        {vehicleType !== 'lain-lain' ? (
                            <div className="flex-1">

                                <label className="block text-primary font-medium text-sm mb-2">
                                    Kilometer Saat Ini
                                </label>
                                <input
                                    type="text"
                                    value={formData.kilometer}
                                    onChange={(e) => handleInputChange('kilometer', e.target.value)}
                                    className="w-full text-lg font-medium text-gray-600 bg-transparent border-solid border-b-2 outline-none"
                                    placeholder="0"
                                />
                            </div>
                        ) : (
                            <div className="flex-1">

                                <label className="block text-primary font-medium text-sm mb-2">
                                    Type Barang
                                </label>
                                <input
                                    type="text"
                                    value={formData.tipeBarang}
                                    onChange={(e) => handleInputChange('tipeBarang', e.target.value)}
                                    className="w-full text-lg font-medium text-gray-600 bg-transparent border-solid border-b-2 outline-none"
                                    placeholder="0"
                                />
                            </div>
                        )}
                        {vehicleType !== 'lain-lain' && (
                            <div className="text-right">
                                <span className="text-lg font-bold text-primary">KM</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end mb-4 gap-2">
                    <label className="block text-primary font-medium text-sm">
                        Add New Servis
                    </label>
                    <button
                        onClick={addServiceType}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
                        type="button"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
                {/* Detail Servis List */}
                {services.map((svc, index) => (
                    <div className="bg-white rounded-2xl p-6 shadow-sm" key={index}>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-primary font-medium text-sm">
                                Detail Servis
                            </label>
                            <button
                                type="button"
                                onClick={() => removeService(index)}
                                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-red-600"
                                aria-label="Remove Service"
                                title="Remove this service"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4 border border-gray-100 rounded-xl p-4">
                                {/* Jenis Servis */}
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                                        <Image
                                            src="/icons/part.svg"
                                            alt="Service"
                                            width={32}
                                            height={32}
                                            className="object-contain"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={svc.jenisServis}
                                        onChange={(e) => handleServiceChange(index, 'jenisServis', e.target.value)}
                                        placeholder="Jenis Part - Servis"
                                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* Keterangan */}
                                <div>
                                    <label className="block text-primary font-medium text-sm mb-2">
                                        Keterangan
                                    </label>
                                    <textarea
                                        value={svc.keterangan}
                                        onChange={(e) => handleServiceChange(index, 'keterangan', e.target.value)}
                                        rows={3}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-600"
                                    />
                                </div>

                                {/* Photo Sebelum */}
                                <div>
                                    <label className="block text-primary font-medium text-sm mb-4">
                                        Photo Sebelum Perbaikan
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                        {svc.previewSebelum ? (
                                            <div className="space-y-4">
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={svc.previewSebelum}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex justify-center space-x-4">
                                                    <label
                                                        htmlFor={`photo-upload-${index}`}
                                                        className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors text-sm"
                                                    >
                                                        Edit
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoUpload(index, e)}
                                                    className="hidden"
                                                    id={`photo-upload-${index}`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoUpload(index, e)}
                                                    className="hidden"
                                                    id={`photo-upload-${index}`}
                                                />
                                                <label
                                                    htmlFor={`photo-upload-${index}`}
                                                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                                                >
                                                    Upload
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Photo Sesudah */}
                                <div>
                                    <label className="block text-primary font-medium text-sm mb-4">
                                        Photo Sesudah Perbaikan
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                        {svc.previewSesudah ? (
                                            <div className="space-y-4">
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={svc.previewSesudah}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex justify-center space-x-4">
                                                    <label
                                                        htmlFor={`photo-upload-after-${index}`}
                                                        className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors text-sm"
                                                    >
                                                        Edit
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhotoAfter(index)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoUploadAfter(index, e)}
                                                    className="hidden"
                                                    id={`photo-upload-after-${index}`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoUploadAfter(index, e)}
                                                    className="hidden"
                                                    id={`photo-upload-after-${index}`}
                                                />
                                                <label
                                                    htmlFor={`photo-upload-after-${index}`}
                                                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                                                >
                                                    Upload
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Next Button */}
                <div className="px-6 py-8">
                    <Button type="primary" onClick={handleNextClick}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
