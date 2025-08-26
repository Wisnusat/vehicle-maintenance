import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { lines, listForklift, listSim, listTowing, noPolisiList, ruteDeliveryList, shift, zonaForklift, zonaTowing } from '@/data/dropdown';

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
    zona: string;

    // Truck
    noPolisi: string;
    ruteDelivery: string;
    sim: string;
    sioDepnaker: string;
    stnk: string;
    stickerKir: string;
    ibm: string;

    tanggal: string;
    waktuPengisian: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function FormMaintenance({ vehicleType }: FormMaintenanceProps) {
    const router = useRouter();
    const isTruck = vehicleType?.toLowerCase() === 'truck';
    const listNoUnit = vehicleType?.toLowerCase() === 'forklift' ? listForklift : listTowing;
    const listZona = vehicleType?.toLowerCase() === 'forklift' ? zonaForklift : zonaTowing;

    const [formData, setFormData] = useState<FormData>({
        nik: '',
        fullName: '',
        shift: '',

        // Non-truck
        noUnit: '',
        line: '',
        zona: '',

        // Truck
        noPolisi: '',
        ruteDelivery: '',
        sim: '',
        sioDepnaker: '',
        stnk: '',
        stickerKir: '',
        ibm: '',

        tanggal: '',
        waktuPengisian: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSaved, setIsSaved] = useState<boolean>(false);

    // Prefill when editing
    useEffect(() => {
        const editMode = localStorage.getItem('editMode') === 'true';
        if (!editMode) return;
        const raw = localStorage.getItem('editProfile');
        if (!raw) return;
        try {
            const p = JSON.parse(raw);
            setFormData((prev) => ({
                ...prev,
                nik: p.nik ?? prev.nik,
                fullName: p.fullName ?? prev.fullName,
                shift: p.shift ?? prev.shift,
                noUnit: p.noUnit ?? prev.noUnit,
                line: p.line ?? prev.line,
                zona: p.zona ?? prev.zona,
                noPolisi: p.noPolisi ?? prev.noPolisi,
                ruteDelivery: p.ruteDelivery ?? prev.ruteDelivery,
                sim: p.sim ?? prev.sim,
                sioDepnaker: p.sioDepnaker ?? prev.sioDepnaker,
                stnk: p.stnk ?? prev.stnk,
                stickerKir: p.stickerKir ?? prev.stickerKir,
                ibm: p.ibm ?? prev.ibm,
                tanggal: p.tanggal ?? prev.tanggal,
                waktuPengisian: p.waktuPengisian ?? prev.waktuPengisian,
            }));
        } catch {
            // ignore
        }
    }, []);

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
            if (!formData.ruteDelivery) newErrors.ruteDelivery = 'Rute Delivery is required';
            if (!formData.sim) newErrors.sim = 'SIM is required';
            if (!formData.sioDepnaker) newErrors.sioDepnaker = 'SIO Depnaker is required';
            if (!formData.stnk) newErrors.stnk = 'STNK is required';
            if (!formData.stickerKir) newErrors.stickerKir = 'Sticker KIR is required';
            if (!formData.ibm) newErrors.ibm = 'Surat Izin Bongkar Muat is required';
        } else {
            // Non-truck required fields
            if (!formData.noUnit.trim()) newErrors.noUnit = 'No Unit is required';
            if (!formData.line.trim()) newErrors.line = 'Line is required';
            if (!formData.zona.trim()) newErrors.zona = 'Zona is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const supabase = createSupabaseBrowserClient();
            const payload = {
                ...formData,
                vehicleType,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;

            const editMode = localStorage.getItem('editMode') === 'true';
            const editId = localStorage.getItem('editChecksheetId');

            if (editMode && editId) {
                const { data, error } = await supabase
                    .from('checksheetProfile')
                    .update(payload)
                    .eq('id', editId)
                    .select()
                    .single();

                if (error || !data) {
                    console.error('Update error:', error);
                    toast.error('Gagal memperbarui data. Coba lagi.');
                    return;
                }

                // Also set checksheetProfile for downstream consumption
                localStorage.setItem('checksheetProfile', JSON.stringify(data));
            } else {
                const { data, error } = await supabase
                    .from('checksheetProfile')
                    .insert([payload])
                    .select()
                    .single();

                if (error || !data) {
                    console.error('Insert error:', error);
                    toast.error('Gagal menyimpan data. Coba lagi.');
                    return;
                }

                localStorage.setItem('checksheetProfile', JSON.stringify(data));
            }

            toast.success('Data tersimpan');
            router.push('/checksheet/services');
        } catch (err) {
            toast.error('Terjadi kesalahan. Silakan coba lagi.');
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
                <div className="flex flex-col">
                    <label>Shift</label>
                    <select
                        id="shift"
                        value={formData.shift}
                        onChange={(e) => handleInputChange('shift', e.target.value)}
                        disabled={isSaved}
                        className={`bg-white shadow-md p-1.5 rounded-lg ${errors.shift ? 'border-red-500 border border-solid' : ''
                            }`}
                        aria-invalid={!!errors.shift}
                    >
                        <option value="">Pilih Shift</option>
                        {shift.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
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
                                id="ruteDelivery"
                                value={formData.ruteDelivery}
                                onChange={(e) => handleInputChange('ruteDelivery', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md p-1.5 rounded-lg ${errors.ruteDelivery ? 'border-red-500 border border-solid' : ''
                                    }`}
                                aria-invalid={!!errors.ruteDelivery}
                            >
                                <option value="">Pilih Rute Delivery</option>
                                {ruteDeliveryList.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.ruteDelivery && (
                                <p className="text-red-500 text-sm mt-1">{errors.ruteDelivery}</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* No Unit */}
                        <div className="flex flex-col">
                            <label>No Unit</label>
                            <select
                                id="noUnit"
                                value={formData.noUnit}
                                onChange={(e) => handleInputChange('noUnit', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md p-1.5 rounded-lg ${errors.noUnit ? 'border-red-500 border border-solid' : ''
                                    }`}
                                aria-invalid={!!errors.noUnit}
                            >
                                <option value="">Pilih No Unit</option>
                                {listNoUnit.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.noUnit && <p className="text-red-500 text-sm mt-1">{errors.noUnit}</p>}
                        </div>

                        {/* Line */}
                        <div className="flex flex-col">
                            <label>Line</label>
                            <select
                                id="line"
                                value={formData.line}
                                onChange={(e) => handleInputChange('line', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md p-1.5 rounded-lg ${errors.line ? 'border-red-500 border border-solid' : ''
                                    }`}
                                aria-invalid={!!errors.line}
                            >
                                <option value="">Pilih Line</option>
                                {lines.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.line && <p className="text-red-500 text-sm mt-1">{errors.line}</p>}
                        </div>

                        {/* Zona */}
                        <div className="flex flex-col">
                            <label>Zona</label>
                            <select
                                id="zona"
                                value={formData.zona}
                                onChange={(e) => handleInputChange('zona', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md p-1.5 rounded-lg ${errors.zona ? 'border-red-500 border border-solid' : ''
                                    }`}
                                aria-invalid={!!errors.zona}
                            >
                                <option value="">Pilih Zona</option>
                                {listZona.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.zona && <p className="text-red-500 text-sm mt-1">{errors.zona}</p>}
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
                        <div className="flex flex-col">
                            <label>SIM</label>
                            <select
                                id="sim"
                                value={formData.sim}
                                onChange={(e) => handleInputChange('sim', e.target.value)}
                                disabled={isSaved}
                                className={`bg-white shadow-md p-1.5 rounded-lg ${errors.sim ? 'border-red-500 border border-solid' : ''
                                    }`}
                                aria-invalid={!!errors.sim}
                            >
                                <option value="">Pilih SIM</option>
                                {listSim.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.sim && (
                                <p className="text-red-500 text-sm mt-1">{errors.sim}</p>
                            )}
                        </div>
                        <div>
                            <label>SIO Depnaker</label>
                            <div className="flex gap-2 items-center">
                                <div onClick={() => handleInputChange('sioDepnaker', 'Baik')} className={`w-full text-center py-1 px-4 rounded-md text-primary border border-solid border-green-500 font-medium ${formData.sioDepnaker === 'Baik' ? 'bg-green-500' : 'bg-white'} ${isSaved && 'opacity-70'}`}>
                                    OK
                                </div>
                                <div onClick={() => handleInputChange('sioDepnaker', 'Problem')} className={`w-full text-center py-1 px-4 rounded-md text-primary border border-solid border-red-500 font-medium ${formData.sioDepnaker === 'Problem' ? 'bg-red-500' : 'bg-white'} ${isSaved && 'opacity-70'}`}>
                                    NG
                                </div>
                            </div>
                            {errors.sioDepnaker && (
                                <p className="text-red-500 text-sm mt-1">{errors.sioDepnaker}</p>
                            )}
                        </div>
                        <div>
                            <label>STNK</label>
                            <div className="flex gap-2 items-center">
                                <div onClick={() => handleInputChange('stnk', 'Baik')} className={`w-full text-center py-1 px-4 rounded-md text-primary border border-solid border-green-500 font-medium ${formData.stnk === 'Baik' ? 'bg-green-500' : 'bg-white'} ${isSaved && 'opacity-70'}`}>
                                    OK
                                </div>
                                <div onClick={() => handleInputChange('stnk', 'Problem')} className={`w-full text-center py-1 px-4 rounded-md text-primary border border-solid border-red-500 font-medium ${formData.stnk === 'Problem' ? 'bg-red-500' : 'bg-white'} ${isSaved && 'opacity-70'}`}>
                                    NG
                                </div>
                            </div>
                            {errors.stnk && (
                                <p className="text-red-500 text-sm mt-1">{errors.stnk}</p>
                            )}
                        </div>
                        <div>
                            <label>Sticker KIR</label>
                            <div className="flex gap-2 items-center">
                                <div onClick={() => handleInputChange('stickerKir', 'Baik')} className={`w-full text-center py-1 px-4 rounded-md text-primary border border-solid border-green-500 font-medium ${formData.stickerKir === 'Baik' ? 'bg-green-500' : 'bg-white'} ${isSaved && 'opacity-70'}`}>
                                    OK
                                </div>
                                <div onClick={() => handleInputChange('stickerKir', 'Problem')} className={`w-full text-center py-1 px-4 rounded-md text-primary border border-solid border-red-500 font-medium ${formData.stickerKir === 'Problem' ? 'bg-red-500' : 'bg-white'} ${isSaved && 'opacity-70'}`}>
                                    NG
                                </div>
                            </div>
                            {errors.stickerKir && (
                                <p className="text-red-500 text-sm mt-1">{errors.stickerKir}</p>
                            )}
                        </div>
                        <div>
                            <label>Surat Izin Bongkar Muat</label>
                            <div className="flex gap-2 items-center">
                                <div onClick={() => handleInputChange('ibm', 'Baik')} className={`w-full text-center py-1 px-4 rounded-md text-primary border border-solid border-green-500 font-medium ${formData.ibm === 'Baik' ? 'bg-green-500' : 'bg-white'} ${isSaved && 'opacity-70'}`}>
                                    OK
                                </div>
                                <div onClick={() => handleInputChange('ibm', 'Problem')} className={`w-full text-center py-1 px-4 rounded-md text-primary border border-solid border-red-500 font-medium ${formData.ibm === 'Problem' ? 'bg-red-500' : 'bg-white'} ${isSaved && 'opacity-70'}`}>
                                    NG
                                </div>
                            </div>
                            {errors.ibm && (
                                <p className="text-red-500 text-sm mt-1">{errors.ibm}</p>
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
