import Image from 'next/image';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

type FormMaintenanceProps = {
    vehicleType: string;
}

type FormData = {
    nik: string;
    fullName: string;
    shift: string;
    noUnit: string;
    line: string;
    tanggal: string;
    waktuPengisian: string;
}

type FormErrors = {
    nik?: string;
    fullName?: string;
    shift?: string;
    noUnit?: string;
    line?: string;
    tanggal?: string;
    waktuPengisian?: string;
}

export default function FormMaintenance({ vehicleType }: FormMaintenanceProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        nik: '',
        fullName: '',
        shift: '',
        noUnit: '',
        line: '',
        tanggal: '',
        waktuPengisian: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSaved, setIsSaved] = useState<boolean>(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // NIK validation
        if (!formData.nik.trim()) {
            newErrors.nik = 'NIK is required';
        } else if (!/^\d{16}$/.test(formData.nik)) {
            newErrors.nik = 'NIK must be 16 digits';
        }

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Shift validation
        if (!formData.shift.trim()) {
            newErrors.shift = 'Shift is required';
        }

        // No Unit validation
        if (!formData.noUnit.trim()) {
            newErrors.noUnit = 'No Unit is required';
        }

        // Line validation
        if (!formData.line.trim()) {
            newErrors.line = 'Line is required';
        }

        // Tanggal validation
        if (!formData.tanggal) {
            newErrors.tanggal = 'Date is required';
        }

        // Waktu Pengisian validation
        if (!formData.waktuPengisian) {
            newErrors.waktuPengisian = 'Time is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            router.push('/maintenance/services')
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            setIsSaved(true);
        }
    }

    return (
        <div className="min-h-screen max-h-screen bg-secondary flex flex-col items-center px-6 py-8 overflow-hidden">
            {/* Menu */}
            <div className="flex w-full items-start cursor-pointer pb-8">
                <Image src="/images/menu.svg" alt="Menu" width={26} height={26} />
            </div>

            {/* Image */}
            <div className="border-2 border-solid border-primary rounded-full py-6 px-6 mb-8">
                {vehicleType?.toLowerCase() === "towing" && (
                    <Image
                        src="/images/tuktuk.svg"
                        alt="Menu"
                        width={65}
                        height={65}
                    />)}
                {vehicleType?.toLowerCase() === "forklift" && (
                    <Image
                        src="/images/forklift_img.svg"
                        alt="Menu"
                        width={80}
                        height={80}
                    />)}
                {vehicleType?.toLowerCase() === "truck" && (
                    <Image
                        src="/images/truck_img.svg"
                        alt="Menu"
                        width={80}
                        height={80}
                    />)}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                {/* NIK */}
                <div>
                    <Input
                        id="nik"
                        type="text"
                        value={formData.nik}
                        onChange={(e) => handleInputChange('nik', e.target.value)}
                        placeholder="NIK"
                        aria-invalid={!!errors.nik}
                        disabled={isSaved}
                        className={`bg-white shadow-md ${errors.nik ? 'border-red-500 ' : ''}`}
                    />
                    {errors.nik && (
                        <p className="text-red-500 text-sm mt-1">{errors.nik}</p>
                    )}
                </div>

                {/* Full Name */}
                <div>
                    <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Full Name"
                        aria-invalid={!!errors.fullName}
                        disabled={isSaved}
                        className={`bg-white shadow-md ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                </div>

                {/* Shift */}
                <div>
                    <Input
                        id="shift"
                        type="text"
                        value={formData.shift}
                        onChange={(e) => handleInputChange('shift', e.target.value)}
                        placeholder="Shift"
                        aria-invalid={!!errors.shift}
                        disabled={isSaved}
                        className={`bg-white shadow-md ${errors.shift ? 'border-red-500' : ''}`}
                    />
                    {errors.shift && (
                        <p className="text-red-500 text-sm mt-1">{errors.shift}</p>
                    )}
                </div>

                {/* No Unit */}
                <div>
                    <Input
                        id="noUnit"
                        type="text"
                        value={formData.noUnit}
                        onChange={(e) => handleInputChange('noUnit', e.target.value)}
                        placeholder="No Unit"
                        aria-invalid={!!errors.noUnit}
                        disabled={isSaved}
                        className={`bg-white shadow-md ${errors.noUnit ? 'border-red-500' : ''}`}
                    />
                    {errors.noUnit && (
                        <p className="text-red-500 text-sm mt-1">{errors.noUnit}</p>
                    )}
                </div>

                {/* Line */}
                <div>
                    <Input
                        id="line"
                        type="text"
                        value={formData.line}
                        onChange={(e) => handleInputChange('line', e.target.value)}
                        placeholder="Line"
                        aria-invalid={!!errors.line}
                        disabled={isSaved}
                        className={`bg-white shadow-md ${errors.line ? 'border-red-500' : ''}`}
                    />
                    {errors.line && (
                        <p className="text-red-500 text-sm mt-1">{errors.line}</p>
                    )}
                </div>

                {/* Tanggal */}
                <div>
                    <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => handleInputChange('tanggal', e.target.value)}
                        aria-invalid={!!errors.tanggal}
                        disabled={isSaved}
                        className={`bg-white shadow-md ${errors.tanggal ? 'border-red-500' : ''}`}
                    />
                    {errors.tanggal && (
                        <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>
                    )}
                </div>

                {/* Waktu Pengisian */}
                <div>
                    <Input
                        id="waktuPengisian"
                        type="time"
                        value={formData.waktuPengisian}
                        onChange={(e) => handleInputChange('waktuPengisian', e.target.value)}
                        aria-invalid={!!errors.waktuPengisian}
                        disabled={isSaved}
                        className={`bg-white shadow-md ${errors.waktuPengisian ? 'border-red-500' : ''}`}
                    />
                    {errors.waktuPengisian && (
                        <p className="text-red-500 text-sm mt-1">{errors.waktuPengisian}</p>
                    )}
                </div>

                {/* Edit Save Button */}
                <div className="w-full flex justify-between mb-8">
                    <button
                        type="button"
                        onClick={() => setIsSaved(false)}
                        className="cursor-pointer w-24 bg-primary text-white py-2 px-4 rounded-full hover:bg-primary/90 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="cursor-pointer w-24 bg-primary text-white py-2 px-4 rounded-full hover:bg-primary/90 transition-colors"
                    >
                        Save
                    </button>
                </div>
                {/* Submit Button */}
                <div className="w-full flex justify-center">
                    <button
                        type="submit"
                        className="cursor-pointer w-1/2 bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};
