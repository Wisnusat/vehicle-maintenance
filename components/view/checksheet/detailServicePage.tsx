import Image from 'next/image';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/sidebar';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { useRouter } from 'next/navigation';

type FormData = {
    kilometer: string;
    jenisServis: string;
    keterangan: string;
    photoSebelum: File | null;
    keteranganPhoto: string;
    photoSesudah: File | null;
    keteranganPhotoAfter: string;
};

export default function DetailServicePage() {
    const router = useRouter();
    const { vehicleType } = useGlobalState();
    const [formData, setFormData] = useState<FormData>({
        kilometer: '',
        jenisServis: '',
        keterangan: 'Isi Catatan disini',
        photoSebelum: null,
        photoSesudah: null,
        keteranganPhoto: 'Isi Catatan disini',
        keteranganPhotoAfter: 'Isi Catatan disini'
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imagePreview2, setImagePreview2] = useState<string | null>(null);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photoSebelum: file
            }));
            
            // Create image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setFormData(prev => ({
            ...prev,
            photoSebelum: null
        }));
        setImagePreview(null);
    };

    const handlePhotoUploadAfter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photoSesudah: file
            }));
            
            // Create image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview2(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhotoAfter = () => {
        setFormData(prev => ({
            ...prev,
            photoSesudah: null
        }));
        setImagePreview2(null);
    };

    const addServiceType = () => {
        // Handle adding new service type
        console.log('Add service type');
    };

    const handleNextClick = () => {
        router.push('/checksheet/confirm');
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
                        <div className="flex-1">
                            <label className="block text-primary font-medium text-sm mb-2">
                                {vehicleType !== 'lain-lain' ? 'Kilometer Saat Ini' : 'Type Barang'}
                            </label>
                            <input
                                type="text"
                                value={formData.kilometer}
                                onChange={(e) => handleInputChange('kilometer', e.target.value)}
                                className="w-full text-lg font-medium text-gray-600 bg-transparent border-solid border-b-2 outline-none"
                                placeholder="0"
                            />
                        </div>
                        {vehicleType !== 'lain-lain' && (
                            <div className="text-right">
                                <span className="text-lg font-bold text-primary">KM</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Jenis Servis Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="mb-4">
                        <label className="block text-primary font-medium text-sm mb-4">
                            Jenis Servis
                        </label>
                        
                        {/* Service Type Input with Add Button */}
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
                                value={formData.jenisServis}
                                onChange={(e) => handleInputChange('jenisServis', e.target.value)}
                                placeholder="Jenis Part - Servis"
                                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button
                                onClick={addServiceType}
                                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="block text-primary font-medium text-sm mb-2">
                            Keterangan
                        </label>
                        <textarea
                            value={formData.keterangan}
                            onChange={(e) => handleInputChange('keterangan', e.target.value)}
                            rows={3}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-600"
                        />
                    </div>
                </div>

                {/* Photo Upload Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="mb-4">
                        <label className="block text-primary font-medium text-sm mb-4">
                            Photo Sebelum Perbaikan
                        </label>
                        
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                            {imagePreview ? (
                                /* Image Preview */
                                <div className="space-y-4">
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex justify-center space-x-4">
                                        <label
                                            htmlFor="photo-upload"
                                            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors text-sm"
                                        >
                                            Change Photo
                                        </label>
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                </div>
                            ) : (
                                /* Upload Placeholder */
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        id="photo-upload"
                                    />
                                    <label
                                        htmlFor="photo-upload"
                                        className="inline-block bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                                    >
                                        Upload
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Keterangan Photo */}
                    <div>
                        <label className="block text-primary font-medium text-sm mb-2">
                            Keterangan
                        </label>
                        <textarea
                            value={formData.keteranganPhoto}
                            onChange={(e) => handleInputChange('keteranganPhoto', e.target.value)}
                            rows={3}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-600"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="mb-4">
                        <label className="block text-primary font-medium text-sm mb-4">
                            Photo Sesudah Perbaikan
                        </label>
                        
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                            {imagePreview2 ? (
                                /* Image Preview */
                                <div className="space-y-4">
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src={imagePreview2}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex justify-center space-x-4">
                                        <label
                                            htmlFor="photo-upload-after"
                                            className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors text-sm"
                                        >
                                            Change Photo
                                        </label>
                                        <button
                                            type="button"
                                            onClick={removePhotoAfter}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUploadAfter}
                                        className="hidden"
                                        id="photo-upload-after"
                                    />
                                </div>
                            ) : (
                                /* Upload Placeholder */
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUploadAfter}
                                        className="hidden"
                                        id="photo-upload-after"
                                    />
                                    <label
                                        htmlFor="photo-upload-after"
                                        className="inline-block bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                                    >
                                        Upload
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Keterangan Photo */}
                    <div>
                        <label className="block text-primary font-medium text-sm mb-2">
                            Keterangan
                        </label>
                        <textarea
                            value={formData.keteranganPhotoAfter}
                            onChange={(e) => handleInputChange('keteranganPhotoAfter', e.target.value)}
                            rows={3}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* Next Button */}
            <div className="px-6 py-8">
                <Button type="primary" onClick={handleNextClick}>
                    Next
                </Button>
            </div>
        </div>
    );
};
