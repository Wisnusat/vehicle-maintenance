/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Sidebar } from '@/components/ui/sidebar';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';

type HistoryItem = {
    id: string;
    noUnit: string;
    waktuPengisian: string;
    tanggal: string;
    vehicleType: string;
    noPolisi: string;
    noKendaraan: string;
};

// Date input that opens picker when any area is clicked
function DateClickableInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openPicker = () => {
        const el = inputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
        if (!el) return;
        if (typeof el.showPicker === 'function') {
            el.showPicker();
        } else {
            el.focus();
            el.click();
        }
    };

    return (
        <div onClick={openPicker} className="bg-white shadow-md rounded-md cursor-pointer">
            <Input
                id={id}
                ref={inputRef}
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            />
        </div>
    );
}

export default function HistoryList() {
    const router = useRouter();
    const { method } = useGlobalState();
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [vehicleType, setVehicleType] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    // const [endDate, setEndDate] = useState<string>('');
    const pageSize = 10;
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    // Download drawer state
    const [downloadStartDate, setDownloadStartDate] = useState<string>('');
    const [downloadEndDate, setDownloadEndDate] = useState<string>('');
    const [downloading, setDownloading] = useState(false);

    const fetchData = useCallback(async (pageToLoad = 0, opts?: { vehicleType?: string; startDate?: string; endDate?: string }) => {
        const supabase = createSupabaseBrowserClient();
        const isMaintenance = method === 'maintenance';

        const vt = opts?.vehicleType ?? vehicleType;
        const sd = opts?.startDate ?? startDate;
        // const ed = opts?.endDate ?? endDate;

        setLoading(true);
        const from = pageToLoad * pageSize;
        const to = from + pageSize - 1;

        if (isMaintenance) {
            // Fetch from maintenance table
            let query = supabase
                .from('maintenance')
                .select('*')
                .order('id', { ascending: false })
                .range(from, to);

            if (vt && vt !== 'all') {
                query = query.eq('vehicleType', vt);
            }
            if (sd) {
                query = query.eq('tanggal', sd);
            }

            const { data, error } = await query;
            if (error || !data) {
                toast.error('Gagal mengambil data. Coba lagi.');
                setLoading(false);
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped: HistoryItem[] = data.map((row: any) => ({
                id: String(row.id),
                noUnit: row.jenis_barang || '',
                waktuPengisian: row.waktu || '-',
                tanggal: row.tanggal || '-',
                vehicleType: row?.vehicleType || '',
                noPolisi: row.noPolisi || '',
                noKendaraan: row.noKendaraan || '',
            }));
            if (pageToLoad === 0) {
                setHistoryItems(mapped);
            } else {
                setHistoryItems((prev) => [...prev, ...mapped]);
            }
            setHasMore(mapped.length === pageSize);
            setLoading(false);
        } else {
            // Legacy checksheet history
            let query = supabase
                .from('checksheetProfile')
                .select('*')
                .order('id', { ascending: false })
                .range(from, to);

            if (vt && vt !== 'all') {
                query = query.eq('vehicleType', vt);
            }
            if (sd) {
                query = query.eq('tanggal', sd);
            }
            // if (ed) {
            //     query = query.lte('tanggal', ed);
            // }

            const { data, error } = await query;

            if (error || !data) {
                toast.error('Gagal mengambil data. Coba lagi.');
                setLoading(false);
                return;
            }

            if (pageToLoad === 0) {
                setHistoryItems(data as unknown as HistoryItem[]);
            } else {
                setHistoryItems((prev) => [...prev, ...(data as unknown as HistoryItem[])]);
            }
            setHasMore((data as unknown[]).length === pageSize);
            setLoading(false);
        }
    }, [vehicleType, startDate, method]);

    useEffect(() => {
        // Reset when filters or method change
        setPage(0);
        setHasMore(true);
        fetchData(0);
    }, [fetchData]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !loading && hasMore) {
                const next = page + 1;
                setPage(next);
                fetchData(next);
            }
        });
        observer.observe(el);
        return () => {
            observer.disconnect();
        };
    }, [loading, hasMore, page, fetchData]);

    const handleDownload = useCallback(async () => {
        if (!downloadStartDate || !downloadEndDate) {
            toast.error('Pilih tanggal mulai dan akhir terlebih dahulu.');
            return;
        }
        if (downloadStartDate > downloadEndDate) {
            toast.error('Tanggal mulai tidak boleh melebihi tanggal akhir.');
            return;
        }

        try {
            setDownloading(true);
            const supabase = createSupabaseBrowserClient();
            const isMaintenance = method === 'maintenance';

            if (isMaintenance) {
                let query = supabase
                    .from('maintenance')
                    .select('*')
                    .order('id', { ascending: false })
                    .gte('tanggal', downloadStartDate)
                    .lte('tanggal', downloadEndDate);

                if (vehicleType && vehicleType !== 'all') {
                    query = query.eq('vehicleType', vehicleType);
                }

                const { data: headers, error: headerErr } = await query;
                if (headerErr || !headers) throw headerErr || new Error('No data');

                const ids = headers.map((h: any) => h.id);
                let detailsExpanded: any[] = [];
                if (ids.length) {
                    const { data: details, error: detailErr } = await supabase
                        .from('maintenance_detail')
                        .select('*')
                        .in('maintenance_id', ids);
                    if (detailErr) throw detailErr;

                    // Normalize and expand detailServis
                    detailsExpanded = (details || []).flatMap((d: any) => {
                        const raw = d.detailServis;
                        let parsed: any[] = [];
                        try {
                            if (Array.isArray(raw)) {
                                if (raw.length > 0 && typeof raw[0] === 'string') {
                                    parsed = (raw as string[]).map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean) as any[];
                                } else {
                                    parsed = raw as any[];
                                }
                            } else if (typeof raw === 'string') {
                                const maybe = JSON.parse(raw);
                                parsed = Array.isArray(maybe) ? maybe : [maybe];
                            }
                        } catch {
                            parsed = [];
                        }
                        return parsed.map((srv) => ({
                            maintenance_id: d.maintenance_id,
                            kilometer: d.kilometer ?? null,
                            tipeBarang: d.tipeBarang ?? null,
                            jenisServis: srv?.jenisServis ?? '',
                            keterangan: srv?.keterangan ?? '',
                            beforePhoto: srv?.beforePhoto ?? '',
                            afterPhoto: srv?.afterPhoto ?? '',
                        }));
                    });
                }

                const wb = XLSX.utils.book_new();
                const wsHeader = XLSX.utils.json_to_sheet(headers);
                XLSX.utils.book_append_sheet(wb, wsHeader, 'Header');
                const wsDetail = XLSX.utils.json_to_sheet(detailsExpanded);
                XLSX.utils.book_append_sheet(wb, wsDetail, 'Detail');
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `history_maintenance_${downloadStartDate}_to_${downloadEndDate}.xlsx`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Report berhasil diunduh.');
            } else {
                let query = supabase
                    .from('checksheetProfile')
                    .select('*')
                    .order('id', { ascending: false })
                    .gte('tanggal', downloadStartDate)
                    .lte('tanggal', downloadEndDate);

                if (vehicleType && vehicleType !== 'all') {
                    query = query.eq('vehicleType', vehicleType);
                }

                const { data: profiles, error: profileErr } = await query;
                if (profileErr || !profiles) throw profileErr || new Error('No data');

                const ids = profiles.map((p: any) => p.id);
                let partsExpanded: any[] = [];
                if (ids.length) {
                    const { data: parts, error: partsErr } = await supabase
                        .from('checksheetParts')
                        .select('*')
                        .in('id_checksheet', ids);
                    if (partsErr) throw partsErr;

                    partsExpanded = (parts || []).flatMap((p: any) => {
                        const raw = p.pengecekan;
                        let parsed: any[] = [];
                        try {
                            if (Array.isArray(raw)) {
                                parsed = raw.map((item: any) => {
                                    if (typeof item === 'string') { try { return JSON.parse(item); } catch { return null; } }
                                    return item;
                                }).filter(Boolean);
                            } else if (typeof raw === 'string') {
                                const maybe = JSON.parse(raw);
                                parsed = Array.isArray(maybe) ? maybe : [maybe];
                            }
                        } catch {
                            parsed = [];
                        }
                        return parsed.map((cek: any) => ({
                            id_checksheet: p.id_checksheet,
                            partId: p.id,
                            partName: p.partName,
                            text: cek?.text ?? '',
                            kondisi: cek?.kondisi ?? '',
                            note: p.note ?? '',
                        }));
                    });
                }

                const wb = XLSX.utils.book_new();
                const wsHeader = XLSX.utils.json_to_sheet(profiles);
                XLSX.utils.book_append_sheet(wb, wsHeader, 'Header');
                const wsDetail = XLSX.utils.json_to_sheet(partsExpanded);
                XLSX.utils.book_append_sheet(wb, wsDetail, 'Detail');
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([wbout], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `history_checksheet_${downloadStartDate}_to_${downloadEndDate}.xlsx`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Report berhasil diunduh.');
            }
        } catch (e) {
            console.error(e);
            toast.error('Gagal membuat report. Coba lagi.');
        } finally {
            setDownloading(false);
        }
    }, [downloadStartDate, downloadEndDate, method, vehicleType]);

    return (
        <div className="min-h-screen bg-secondary">
            <div className="bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center p-6">
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">History</h1>
                </div>
            </div>
            <div className="px-6 py-8 h-full">
                {/* Header with gradient background */}
                {/* Top Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Sidebar />
                    <Drawer direction="right">
                        <DrawerTrigger asChild>
                            <button aria-label="Open Filter" className="p-2 rounded-lg hover:bg-gray-100">
                                <Image src="/images/filter.svg" alt="Filter" width={26} height={26} />
                            </button>
                        </DrawerTrigger>
                        <DrawerContent className="bg-primary">
                            <DrawerHeader className="border-b">
                                <DrawerTitle className="text-lg text-white">Filter</DrawerTitle>
                            </DrawerHeader>

                            <div className="p-4 space-y-4">
                                {/* Vehicle Type Selection */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-white">Vehicle Type</label>
                                    <select
                                        value={vehicleType}
                                        onChange={(e) => setVehicleType(e.target.value)}
                                        className="bg-white shadow-md p-2 rounded-lg"
                                    >
                                        <option value="all">All</option>
                                        <option value="forklift">Forklift</option>
                                        <option value="towing">Towing</option>
                                        <option value="truck">Truck</option>
                                        <option value="lain-lain">Lain-Lain</option>
                                    </select>
                                </div>

                                {/* Date Range */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="startDate" className="text-sm text-white">From</label>
                                        <DateClickableInput
                                            id="startDate"
                                            value={startDate}
                                            onChange={(v) => setStartDate(v)}
                                        />
                                    </div>
                                    {/* <div className="flex flex-col gap-1">
                                        <label htmlFor="endDate" className="text-sm text-white">To</label>
                                        <DateClickableInput
                                            id="endDate"
                                            value={endDate}
                                            onChange={(v) => setEndDate(v)}
                                        />
                                    </div> */}
                                </div>
                            </div>

                            <DrawerFooter className="border-t">
                                {/* <DrawerClose asChild>
                                    <button
                                        onClick={() => fetchData({ vehicleType, startDate, endDate })}
                                        className="w-full bg-primary text-white py-2 rounded-full font-medium"
                                    >
                                        Apply
                                    </button>
                                </DrawerClose> */}
                                <DrawerClose asChild>
                                    <button
                                        onClick={() => {
                                            setVehicleType('all');
                                            setStartDate('');
                                            setPage(0);
                                            setHasMore(true);
                                            fetchData(0, { vehicleType: 'all', startDate: '', endDate: '' });
                                        }}
                                        className="w-full bg-gray-200 text-primary py-2 rounded-full font-medium"
                                    >
                                        Clear
                                    </button>
                                </DrawerClose>
                                <DrawerClose asChild>
                                    <button className="w-full py-2 rounded-full bg-red-500">Close</button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>

                {/* History List */}
                <div className="px-6 py-6 space-y-4 -mt-6">
                    {historyItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Image src="/images/gear.svg" alt="Empty" width={100} height={100} />
                            <p className="text-gray-500 text-center font-medium mt-6">
                                {`Belum ada ${method === 'maintenance' ? 'maintenance' : 'pengecekan'}`}
                            </p>
                        </div>
                    ) : (
                        historyItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center rounded-3xl p-6 shadow-lg"
                                onClick={() => router.push(`/history/detail/${item.id}`)}
                            >
                                <div className="bg-white rounded-2xl p-4 flex items-center space-x-4">
                                    {/* Icon */}
                                    {item.vehicleType?.toLowerCase() === 'forklift' && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/forklift.svg"
                                                alt="Forklift"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {item.vehicleType?.toLowerCase() === 'towing' && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/towing.svg"
                                                alt="Towing"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {item.vehicleType?.toLowerCase() === 'truck' && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/truk.svg"
                                                alt="Truck"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {item.vehicleType?.toLowerCase() === 'lain-lain' && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/lorry_illus.svg"
                                                alt="Forklift"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-primary mb-1">
                                            {item.noUnit || item.noKendaraan || item.noPolisi || '-'}
                                        </h3>
                                        <div className="text-sm text-gray-600">
                                            <p>Check Time:</p>
                                            <p className="font-medium">
                                                {item.waktuPengisian}, {item.tanggal}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {/* Loading & Sentinel */}
                    {loading && (
                        <div className="py-4 text-center text-sm text-gray-500">Loading...</div>
                    )}
                    <div ref={sentinelRef} className="h-4" />
                </div>
            </div>
            {/* Floating Download Button + Drawer */}
            <Drawer direction="right">
                <DrawerTrigger asChild>
                    <div className="fixed w-full bottom-6 z-40 px-6">
                        <button
                            aria-label="Download Report"
                            className="w-full rounded-full bg-primary text-white px-5 py-3 shadow-lg hover:opacity-90"
                        >
                            Download
                        </button>
                    </div>
                </DrawerTrigger>
                <DrawerContent className="bg-primary">
                    <DrawerHeader className="border-b">
                        <DrawerTitle className="text-lg text-white">Download Report</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="dlStart" className="text-sm text-white">From</label>
                            <Input
                                id="dlStart"
                                type="date"
                                value={downloadStartDate}
                                onChange={(e) => setDownloadStartDate(e.target.value)}
                                className="bg-white shadow-md p-2 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="dlEnd" className="text-sm text-white">To</label>
                            <Input
                                id="dlEnd"
                                type="date"
                                value={downloadEndDate}
                                onChange={(e) => setDownloadEndDate(e.target.value)}
                                className="bg-white shadow-md p-2 rounded-lg"
                            />
                        </div>
                    </div>
                    <DrawerFooter className="border-t">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full bg-white text-primary py-2 rounded-full font-medium disabled:opacity-50"
                        >
                            {downloading ? 'Preparing...' : 'Download'}
                        </button>
                        <DrawerClose asChild>
                            <button className="w-full py-2 rounded-full bg-red-500 text-white">Close</button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
