import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

type VehicleDetail = {
    name: string;
    kilometer: string;
    nik: string;
    tanggal: string;
    noUnit: string;
};

export default function ConfirmService() {
    const router = useRouter();

    // Sample vehicle data
    const vehicleDetail: VehicleDetail = {
        name: 'XXX',
        kilometer: 'XXX',
        nik: 'XXX',
        tanggal: 'XXXXXX',
        noUnit: 'XXX'
    };

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imagePreview2, setImagePreview2] = useState<string | null>(null);

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setImagePreview(null);
    };

    const handlePhotoUploadAfter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create image preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview2(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhotoAfter = () => {
        setImagePreview2(null);
    };

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

            {/* Detail Unit Card */}
            <div className="mx-6 mb-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-primary font-semibold text-lg">Detail Unit</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500 mb-1">Nama</p>
                            <p className="text-primary font-medium">{vehicleDetail.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Kilometer</p>
                            <p className="text-primary font-medium">{vehicleDetail.kilometer}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">NIK</p>
                            <p className="text-primary font-medium">{vehicleDetail.nik}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Tanggal</p>
                            <p className="text-primary font-medium">{vehicleDetail.tanggal}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 mb-1">No Unit/Polisi</p>
                            <p className="text-primary font-medium">{vehicleDetail.noUnit}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Servis Card */}
            <div className="mx-6 mb-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-primary font-semibold text-lg">Detail Servis</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Servis</label>
                            <input
                                type="text"
                                placeholder='Jenis Servis'
                                className="w-full p-3 border-b-1 border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                            <input
                                type="text"
                                placeholder='Keterangan'
                                className="w-full p-3 border-b-1 border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mx-6 mb-4">
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
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-600"
                    />
                </div>
            </div>

            {/* Photo Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mx-6 mb-8">
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
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-600"
                    />
                </div>
            </div>
            {/* Next Button */}
            <div className="px-6 pb-8">
                <Button type="primary" onClick={handleNextClick}>
                    Next
                </Button>
            </div>
        </div>
    );
};
