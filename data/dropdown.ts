import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export const zonaForklift = [
    { label: "Receiving O/H", value: "Receiving O/H" },
    { label: "Receiving Material", value: "Receiving Material" },
    { label: "Preparation", value: "Preparation" },
    { label: "Delivery", value: "Delivery" },
    { label: "Lain-Lain", value: "Lain-Lain" }
]

export const zonaTowing = [
    { label: "Storing", value: "Storing" },
    { label: "Supply", value: "Supply" },
    { label: "Collect", value: "Collect" },
    { label: "Lain-Lain", value: "Lain-Lain" },
]

export const lines = [
    { label: "Zona A", value: "Zona A" },
    { label: "Zona B", value: "Zona B" },
    { label: "Zona C", value: "Zona C" },
    { label: "Zona D", value: "Zona D" },
    { label: "Zona E", value: "Zona E" },
    { label: "Zona F", value: "Zona F" },
    { label: "Free", value: "Free" }
]

export const shift = [
    { label: "Red-Shift", value: "Red-Shift" },
    { label: "Blue-Shift", value: "Blue-Shift" },
    { label: "Non-Shift", value: "Non-Shift" },
]

export const listForklift = [
    { label: "PCD-F.02", value: "PCD-F.02" },
    { label: "PCD-F.03", value: "PCD-F.03" },
    { label: "PCD-F.05", value: "PCD-F.05" },
    { label: "PCD-F.06", value: "PCD-F.06" },
    { label: "PCD-F.07", value: "PCD-F.07" },
    { label: "PCD-F.08", value: "PCD-F.08" },
    { label: "PCD-F.10", value: "PCD-F.10" },
    { label: "PCD-F.11", value: "PCD-F.11" },
    { label: "PCD-F.12", value: "PCD-F.12" },
    { label: "PCD-F.13", value: "PCD-F.13" },
    { label: "Lain-Lain", value: "Lain-Lain" }
]

export const listTowing = [
    { label: "PCD-T.01", value: "PCD-T.01" },
    { label: "PCD-T.02", value: "PCD-T.02" },
    { label: "PCD-T.03", value: "PCD-T.03" },
    { label: "PCD-T.04", value: "PCD-T.04" },
    { label: "PCD-T.05", value: "PCD-T.05" },
    { label: "PCD-T.07", value: "PCD-T.07" },
    { label: "PCD-T.08", value: "PCD-T.08" },
    { label: "PCD-T.09", value: "PCD-T.09" },
    { label: "PCD-T.10", value: "PCD-T.10" },
    { label: "PCD-T.11", value: "PCD-T.11" },
    { label: "PCD-T.12", value: "PCD-T.12" },
    { label: "PCD-T.13", value: "PCD-T.13" },
    { label: "PCD-T.14", value: "PCD-T.14" },
    { label: "PCD-T.15", value: "PCD-T.15" },
    { label: "PCD-T.16", value: "PCD-T.16" },
    { label: "Lain-Lain", value: "Lain-Lain" }
]

export const listSim = [
    { label: "SIM B", value: "SIM B" },
    { label: "SIM B1", value: "SIM B1" },
    { label: "SIM B2", value: "SIM B2" },
    { label: "Lain-lain", value: "Lain-lain" },
]

export const noPolisiList = [
    { label: 'B 9809 FCD', value: 'B 9809 FCD' },
    { label: 'B 9029 FCE', value: 'B 9029 FCE' },
    { label: 'B 9774 FCL', value: 'B 9774 FCL' },
    { label: 'B 9193 FCM', value: 'B 9193 FCM' },
    { label: 'B 9231 FCM', value: 'B 9231 FCM' },
    { label: 'B 9030 FCE', value: 'B 9030 FCE' },
    { label: 'B 9221 FCE', value: 'B 9221 FCE' },
    { label: 'B 9297 FCM', value: 'B 9297 FCM' },
    { label: 'B 9224 FCE', value: 'B 9224 FCE' },
    { label: 'B 9226 FCE', value: 'B 9226 FCE' },
    { label: 'B 9783 FCL', value: 'B 9783 FCL' },
    { label: 'B 9801 FCD', value: 'B 9801 FCD' },
    { label: 'B 9803 FCD', value: 'B 9803 FCD' },
    { label: 'B 9426 FCC', value: 'B 9426 FCC' },
    { label: 'B 9794 FCB', value: 'B 9794 FCB' },
    { label: 'B 9619 DO', value: 'B 9619 DO' },
    { label: 'B 9802 FCD', value: 'B 9802 FCD' },
    { label: 'B 9804 FCD', value: 'B 9804 FCD' },
];

export const ruteDeliveryList = [
    { label: 'FTI', value: 'FTI' },
    { label: 'TMMIN KRW 4U', value: 'TMMIN KRW 4U' },
    { label: 'TMMIN KRW 4P', value: 'TMMIN KRW 4P' },
    { label: 'TMMIN KRW CEVD', value: 'TMMIN KRW CEVD' },
    { label: 'NTC - 1', value: 'NTC 1' },
    { label: 'WAREHOUSE 3', value: 'WAREHOUSE 3' },
    { label: 'SAFETY STOCK', value: 'SAFETY STOCK' },
    { label: 'Suzuki Indo Mobil (SIM)', value: 'Suzuki Indo Mobil (SIM)' },
    { label: 'IPPI', value: 'IPPI' },
    { label: 'ASKA', value: 'ASKA' },
    { label: 'HYUNDAI', value: 'HYUNDAI' },
];

export const jenisBarang = [
    { label: "Dolly Pallet A", value: "Dolly Pallet A" },
    { label: "Dolly Pallet B", value: "Dolly Pallet B" },
    { label: "Dolly SP", value: "Dolly SP" },
    { label: "Minomi", value: "Minomi" },
    { label: "Pallet A", value: "Pallet A" },
    { label: "Pallet A1", value: "Pallet A1" },
    { label: "Pallet B", value: "Pallet B" },
    { label: "Pallet B1", value: "Pallet B1" },
    { label: "Pallet B2", value: "Pallet B2" },
    { label: "Pallet SP", value: "Pallet SP" },
    { label: "Pallet SPX", value: "Pallet SPX" }
]

// ---- Types ----
export type Option = { label: string; value: string }
export type DropdownType =
  | 'zonaforklift'
  | 'zonatowing'
  | 'lines'
  | 'shift'
  | 'unitforklift'
  | 'unittowing'
  | 'sim'
  | 'nopol'
  | 'rute'
  | 'jenisbarang'

// ---- Fallback map (keeps app resilient if API empty/down) ----
const fallbackMap: Record<DropdownType, Option[]> = {
  zonaforklift: zonaForklift,
  zonatowing: zonaTowing,
  lines: lines,
  shift: shift,
  unitforklift: listForklift,
  unittowing: listTowing,
  sim: listSim,
  nopol: noPolisiList,
  rute: ruteDeliveryList,
  jenisbarang: jenisBarang,
}

// ---- In-memory cache to avoid repeated fetches ----
const cache: Partial<Record<DropdownType, Option[]>> = {}

// ---- Plain fetcher (can be used outside React if needed) ----
export async function getDropdownOptions(type: DropdownType): Promise<Option[]> {
  if (cache[type]) return cache[type] as Option[]

  try {
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase
      .from('dropdownData')
      .select('label, value')
      .eq('type', type)
      .order('label', { ascending: true })

    if (error) throw error

    const options = (data ?? []) as Option[]
    if (options.length > 0) {
      cache[type] = options
      return options
    }
  } catch {
    // swallow and fallback
  }

  // fallback if API fails or returns empty
  const fb = fallbackMap[type] ?? []
  cache[type] = fb
  return fb
}

// ---- React hook for components ----
export function useDropdownOptions(
  type: DropdownType,
  fallback?: Option[],
) {
  const [options, setOptions] = useState<Option[]>(() => cache[type] ?? fallback ?? fallbackMap[type])
  const [loading, setLoading] = useState<boolean>(!cache[type])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const run = async () => {
      setLoading(!cache[type])
      setError(null)
      try {
        const opts = await getDropdownOptions(type)
        if (active) setOptions(opts)
      } catch {
        if (active) {
          setError('Failed to load options')
          setOptions(fallback ?? fallbackMap[type] ?? [])
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [type, fallback])

  return { options, loading, error }
}