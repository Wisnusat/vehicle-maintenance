import Image from 'next/image';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';

type FormMaintenanceProps = {
    vehicleType: string;
};

type FormData = {
    nik: string;
    fullName: string;
    shift: string;

    // Non-truck
    noUnit: string;
    line: string;

    // Truck
    noPolisi: string;
    rutePengiriman: string;
    sim: string;
    sioDepnaker: string;
    stnk: string;
    stickerKir: string;
    suratIzinBongkarMuat: string;

    tanggal: string;
    waktuPengisian: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const noPolisiList = [
    { label: 'B 9809 FCD', value: 'B9809FCD' },
    { label: 'B 9029 FCE', value: 'B9029FCE' },
    { label: 'B 9774 FCL', value: 'B9774FCL' },
    { label: 'B 9193 FCM', value: 'B9193FCM' },
    { label: 'B 9231 FCM', value: 'B9231FCM' },
    { label: 'B 9030 FCE', value: 'B9030FCE' },
    { label: 'B 9221 FCE', value: 'B9221FCE' },
    { label: 'B 9297 FCM', value: 'B9297FCM' },
    { label: 'B 9224 FCE', value: 'B9224FCE' },
    { label: 'B 9226 FCE', value: 'B9226FCE' },
    { label: 'B 9783 FCL', value: 'B9783FCL' },
    { label: 'B 9801 FCD', value: 'B9801FCD' },
    { label: 'B 9803 FCD', value: 'B9803FCD' },
    { label: 'B 9426 FCC', value: 'B9426FCC' },
    { label: 'B 9794 FCB', value: 'B9794FCB' },
    { label: 'B 9619 DO', value: 'B9619DO' },
    { label: 'B 9802 FCD', value: 'B9802FCD' },
    { label: 'B 9804 FCD', value: 'B9804FCD' },
];

const rutePengirimanList = [
    { label: 'FTI', value: 'FTI' },
    { label: 'TMMIN KRW 4U', value: 'TMMIN_KRW_4U' },
    { label: 'TMMIN KRW 4P', value: 'TMMIN_KRW_4P' },
    { label: 'TMMIN KRW CEVD', value: 'TMMIN_KRW_CEVD' },
    { label: 'NTC - 1', value: 'NTC_1' },
    { label: 'WAREHOUSE 3', value: 'WAREHOUSE_3' },
    { label: 'SAFETY STOCK', value: 'SAFETY_STOCK' },
    { label: 'Suzuki Indo Mobil (SIM)', value: 'SUZUKI_SIM' },
    { label: 'IPPI', value: 'IPPI' },
    { label: 'ASKA', value: 'ASKA' },
    { label: 'HYUNDAI', value: 'HYUNDAI' },
];

export default function FormMaintenance({ vehicleType }: FormMaintenanceProps) {
    const router = useRouter();
    const isTruck = vehicleType?.toLowerCase() === 'truck';

    const [formData, setFormData] = useState<FormData>({
        nik: '',
        fullName: '',
        shift: '',

        // Non-truck
        noUnit: '',
        line: '',

        // Truck
        noPolisi: '',
        rutePengiriman: '',
        sim: '',
        sioDepnaker: '',
        stnk: '',
        stickerKir: '',
        suratIzinBongkarMuat: '',

        tanggal: '',
        waktuPengisian: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSaved, setIsSaved] = useState<boolean>(false);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Common validations
        if (!formData.nik.trim()) newErrors.nik = 'NIK is required';

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        else if (formData.fullName.trim().length < 2)
            newErrors.fullName = 'Full name must be at least 2 characters';

        if (!formData.shift.trim()) newErrors.shift = 'Shift is required';

        if (!formData.tanggal) newErrors.tanggal = 'Date is required';
        if (!formData.waktuPengisian) newErrors.waktuPengisian = 'Time is required';

        // Branch by vehicle type
        if (isTruck) {
            // Truck-specific required fields
            if (!formData.noPolisi) newErrors.noPolisi = 'No Polisi is required';
            if (!formData.rutePengiriman) newErrors.rutePengiriman = 'Rute Delivery is required';
            if (!formData.sim) newErrors.sim = 'SIM is required';
            if (!formData.sioDepnaker) newErrors.sioDepnaker = 'SIO Depnaker is required';
            if (!formData.stnk) newErrors.stnk = 'STNK is required';
            if (!formData.stickerKir) newErrors.stickerKir = 'Sticker KIR is required';
            if (!formData.suratIzinBongkarMuat) newErrors.suratIzinBongkarMuat = 'Surat Izin Bongkar Muat is required';
        } else {
            // Non-truck required fields
            if (!formData.noUnit.trim()) newErrors.noUnit = 'No Unit is required';
            if (!formData.line.trim()) newErrors.line = 'Line is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            router.push('/checksheet/services');
        }
    };

    const handleSave = () => {
        if (validateForm()) setIsSaved(true);
    };

    return (
        <div className="min-h-screen bg-secondary flex flex-col items-center px-6 py-8">
            {/* Menu */}
            <div className="flex w-full items-start cursor-pointer pb-8">
                <Sidebar />
            </div>

            {/* Image */}
            <div className="border-2 border-solid border-primary rounded-full py-6 px-6 mb-8">
                {vehicleType?.toLowerCase() === 'towing' && (
                    <Image src="/images/tuktuk.svg" alt="Menu" width={65} height={65} />
                )}
                {vehicleType?.toLowerCase() === 'forklift' && (
                    <Image src="/images/forklift_img.svg" alt="Menu" width={80} height={80} />
                )}
                {vehicleType?.toLowerCase() === 'truck' && (
                    <Image src="/images/truck_img.svg" alt="Menu" width={80} height={80} />
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                {/* NIK */}
                <div>
                    <label>NIK</label>
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
                    {errors.nik && <p className="text-red-500 text-sm mt-1">{errors.nik}</p>}
                </div>

                {/* Full Name */}
                <div>
                    <label>Full Name</label>
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
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Shift */}
                <div>
                    <label>Shift</label>
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
                    {errors.shift && <p className="text-red-500 text-sm mt-1">{errors.shift}</p>}
                </div>

                {isTruck ? (
                    <>
                        {/* No Polisi */}
                        <div className="flex flex-col">
                            <label>No Polisi</label>
                            <select
                                id="noPolisi"
                                value={formData.noPolisi}
                                onChange={(e) => handleInputChange('noPolisi', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md p-1.5 rounded-lg ${errors.noPolisi ? 'border-red-500 border border-solid' : ''
                                    }`}
                                aria-invalid={!!errors.noPolisi}
                            >
                                <option value="">Pilih No Polisi</option>
                                {noPolisiList.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.noPolisi && <p className="text-red-500 text-sm mt-1">{errors.noPolisi}</p>}
                        </div>

                        {/* Rute Delivery */}
                        <div className="flex flex-col">
                            <label>Rute Delivery</label>
                            <select
                                id="rutePengiriman"
                                value={formData.rutePengiriman}
                                onChange={(e) => handleInputChange('rutePengiriman', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md p-1.5 rounded-lg ${errors.rutePengiriman ? 'border-red-500 border border-solid' : ''
                                    }`}
                                aria-invalid={!!errors.rutePengiriman}
                            >
                                <option value="">Pilih Rute Delivery</option>
                                {rutePengirimanList.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.rutePengiriman && (
                                <p className="text-red-500 text-sm mt-1">{errors.rutePengiriman}</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* No Unit */}
                        <div>
                            <label>No Unit</label>
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
                            {errors.noUnit && <p className="text-red-500 text-sm mt-1">{errors.noUnit}</p>}
                        </div>

                        {/* Line */}
                        <div>
                            <label>Line</label>
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
                            {errors.line && <p className="text-red-500 text-sm mt-1">{errors.line}</p>}
                        </div>
                    </>
                )}

                {/* Tanggal */}
                <div>
                    <label>Tanggal</label>
                    <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => handleInputChange('tanggal', e.target.value)}
                        aria-invalid={!!errors.tanggal}
                        disabled={isSaved}
                        className={`bg-white shadow-md ${errors.tanggal ? 'border-red-500' : ''}`}
                    />
                    {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
                </div>

                {/* Waktu Pengisian */}
                <div>
                    <label>Waktu Pengisian</label>
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

                {/* Extra Truck Docs (optional) */}
                {isTruck && (
                    <>
                        <div>
                            <label>SIM</label>
                            <Input
                                id="sim"
                                type="text"
                                placeholder="SIM (Min B1)"
                                value={formData.sim}
                                onChange={(e) => handleInputChange('sim', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md ${errors.sim ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.sim}
                            />
                            {errors.sim && (
                                <p className="text-red-500 text-sm mt-1">{errors.sim}</p>
                            )}
                        </div>
                        <div>
                            <label>SIO Depnaker</label>
                            <Input
                                id="sio_depnaker"
                                type="text"
                                placeholder="SIO Depnaker"
                                value={formData.sioDepnaker}
                                onChange={(e) => handleInputChange('sioDepnaker', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md ${errors.sioDepnaker ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.sioDepnaker}
                            />
                            {errors.sioDepnaker && (
                                <p className="text-red-500 text-sm mt-1">{errors.sioDepnaker}</p>
                            )}
                        </div>
                        <div>
                            <label>STNK</label>
                            <Input
                                id="stnk"
                                type="text"
                                placeholder="STNK"
                                value={formData.stnk}
                                onChange={(e) => handleInputChange('stnk', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md ${errors.stnk ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.stnk}
                            />
                            {errors.stnk && (
                                <p className="text-red-500 text-sm mt-1">{errors.stnk}</p>
                            )}
                        </div>
                        <div>
                            <label>Sticker KIR</label>
                            <Input
                                id="sticker_kir"
                                type="text"
                                placeholder="Sticker KIR"
                                value={formData.stickerKir}
                                onChange={(e) => handleInputChange('stickerKir', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md ${errors.stickerKir ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.stickerKir}
                            />
                            {errors.stickerKir && (
                                <p className="text-red-500 text-sm mt-1">{errors.stickerKir}</p>
                            )}
                        </div>
                        <div>
                            <label>Surat Izin Bongkar Muat</label>
                            <Input
                                id="surat_izin_bongkar_muat"
                                type="text"
                                placeholder="Surat Izin Bongkar Muat (IBM)"
                                value={formData.suratIzinBongkarMuat}
                                onChange={(e) => handleInputChange('suratIzinBongkarMuat', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md ${errors.suratIzinBongkarMuat ? 'border-red-500' : ''}`}
                                aria-invalid={!!errors.suratIzinBongkarMuat}
                            />
                            {errors.suratIzinBongkarMuat && (
                                <p className="text-red-500 text-sm mt-1">{errors.suratIzinBongkarMuat}</p>
                            )}
                        </div>
                    </>
                )}

                {/* Edit / Save */}
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

                {/* Submit */}
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
}
