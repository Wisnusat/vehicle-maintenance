"use client";

import FormMaintenance from '@/components/view/checksheet/formMaintenance';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import React from 'react';

export default function InputFormPage() {
    const { vehicleType } = useGlobalState();
    const nik = JSON.parse(localStorage.getItem('user') || '{}')?.nik;
    const fullName = JSON.parse(localStorage.getItem('user') || '{}')?.fullName;
    
    return (
        <FormMaintenance vehicleType={vehicleType} nik={nik} fullName={fullName} />
    )
};
