import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { jenisBarang, listForklift, listTowing, noPolisiList } from '@/data/dropdown';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type VehicleData = {
    name: string;
    image: string;
    type: string;
};

type FormData = {
    nama: string;
    nik: string;
    noUnitPolisi: string;
    tanggal: string;
    waktuPengisian: string;
    jenisBarang?: string;
};

export default function ChecksheetPage() {
    const router = useRouter();
    const { changeVehicleType, vehicleType } = useGlobalState();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormData>({
        nama: '',
        nik: '',
        noUnitPolisi: '',
        tanggal: '',
        waktuPengisian: '',
        jenisBarang: ''
    });

    // Vehicle data
    const vehicles: VehicleData[] = [
        {
            name: 'Truck',
            image: '/images/truck_img.svg',
            type: 'truck'
        },
        {
            name: 'Forklift',
            image: '/images/forklift_img.svg',
            type: 'forklift'
        },
        {
            name: 'Towing',
            image: '/images/tuktuk.svg',
            type: 'towing'
        },
        {
            name: 'Lain Lain',
            image: '/images/lorry.svg',
            type: 'lain-lain'
        }
    ];

    const totalSlides = vehicles.length;
    const minSwipeDistance = 50;

    // Touch event handlers for swipe gestures
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentSlide < totalSlides - 1) {
            nextSlide();
        }
        if (isRightSwipe && currentSlide > 0) {
            prevSlide();
        }
    };

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
    };

    const handleVehicleSelect = (vehicle: VehicleData) => {
        changeVehicleType(vehicle.type);
    };

    const handleFormChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const unitOptions = useMemo(() => {
        if (vehicleType === 'forklift') return listForklift;
        if (vehicleType === 'towing') return listTowing;
        if (vehicleType === 'truck') return noPolisiList;
        return [];
    }, [vehicleType]);

    const handleNextClick = async () => {
        // Basic required validation
        if (!formData.nama || !formData.nik || !formData.tanggal || !formData.waktuPengisian) {
            toast.error('Nama, NIK, Tanggal, dan Waktu wajib diisi');
            return;
        }
        if (vehicleType === 'lain-lain') {
            if (!formData.jenisBarang) {
                toast.error('Jenis Barang wajib diisi untuk tipe Lain Lain');
                return;
            }
        } else {
            if (!formData.noUnitPolisi) {
                toast.error('No Unit/Polisi wajib dipilih');
                return;
            }
        }

        const supabase = createSupabaseBrowserClient();
        const payload = {
            nama: formData.nama,
            nik: formData.nik,
            noKendaraan: vehicleType === 'lain-lain' ? '' : formData.noUnitPolisi,
            jenis_barang: vehicleType === 'lain-lain' ? (formData.jenisBarang || '') : '',
            tanggal: formData.tanggal,
            waktu: formData.waktuPengisian,
            vehicleType: vehicleType,
        };

        const { data, error } = await supabase
            .from('maintenance')
            .insert([payload])
            .select('id')
            .single();
        if (error) {
            toast.error(`Gagal menyimpan data: ${error.message}`);
            return;
        }

        const maintenanceId = data?.id as string | number | undefined;
        if (maintenanceId) {
            try {
                sessionStorage.setItem('maintenance_current_id', String(maintenanceId));
                sessionStorage.setItem('maintenance_current_type', formData.jenisBarang || '');
            } catch {}
        }

        router.push(`/maintenance/detail`);
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
                    {/* Step 1 - Active */}
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

                    {/* Connector Line */}
                    <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

                    {/* Step 2 - Inactive */}
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 font-semibold text-sm">02</p>
                            <p className="text-gray-400 font-medium text-xs">Detail Servis</p>
                        </div>
                    </div>

                    {/* Connector Line */}
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

            {/* Title */}
            <div className="px-6 mb-6">
                <h1 className="text-2xl font-bold text-primary text-centersz">Maintenance Details</h1>
            </div>

            {/* Vehicle Slider */}
            <div className="px-6 mb-6">
                <div className="relative">
                    <div 
                        className="overflow-hidden rounded-3xl"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <div 
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {vehicles.map((vehicle, index) => (
                                <div key={index} className="w-full flex-shrink-0">
                                    <div 
                                        className="bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center rounded-3xl p-8 cursor-pointer"
                                        onClick={() => handleVehicleSelect(vehicle)}
                                    >
                                        <div className="flex justify-center items-center h-48">
                                            <Image
                                                src={vehicle.image}
                                                alt={vehicle.name}
                                                width={200}
                                                height={200}
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vehicle Type Label */}
                    <div className="text-center mt-4">
                        <h2 className="text-xl font-bold text-primary">
                            {vehicles[currentSlide]?.name}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Vehicle Selection Thumbnails */}
            <div className="px-6 mb-6">
                <div className="flex justify-center space-x-4">
                    {vehicles.map((vehicle, index) => (
                        <button
                            key={index}
                            onClick={() => {goToSlide(index); changeVehicleType(vehicle.type)}}
                            className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center ${
                                index === currentSlide ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'
                            }`}
                        >
                            <Image
                                src={vehicle.image}
                                alt={vehicle.name}
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mb-6">
                {vehicles.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {goToSlide(index); changeVehicleType(_.type)}}
                        className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>

            {/* Form Fields */}
            <div className="px-6 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                            <input
                                type="text"
                                value={formData.nama}
                                onChange={(e) => handleFormChange('nama', e.target.value)}
                                placeholder='Nama'
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
                            <input
                                type="text"
                                value={formData.nik}
                                onChange={(e) => handleFormChange('nik', e.target.value)}
                                placeholder='NIK'
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            {vehicleType === 'lain-lain' ? (
                                <>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Barang</label>
                                    <select
                                        value={formData.jenisBarang}
                                        onChange={(e) => handleFormChange('jenisBarang', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    >
                                        <option value="">Pilih</option>
                                        {jenisBarang.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">No Unit/Polisi</label>
                                    <select
                                        value={formData.noUnitPolisi}
                                        onChange={(e) => handleFormChange('noUnitPolisi', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    >
                                        <option value="">Pilih</option>
                                        {unitOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                            <input
                                type="date"
                                value={formData.tanggal}
                                onChange={(e) => handleFormChange('tanggal', e.target.value)}
                                placeholder='Tanggal'
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <input
                                type="time"
                                value={formData.waktuPengisian}
                                onChange={(e) => handleFormChange('waktuPengisian', e.target.value)}
                                placeholder='Time'
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>
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
