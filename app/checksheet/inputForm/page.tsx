"use client";

import FormMaintenance from '@/components/view/checksheet/formMaintenance';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import React from 'react';

export default function InputFormPage() {
    const { vehicleType } = useGlobalState();
    
    return (
        <FormMaintenance vehicleType={vehicleType} />
    )
};
