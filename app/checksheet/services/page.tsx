"use client";

import VehicleServices from '@/components/view/checksheet/vehicleServices';
import React from 'react';
import { useGlobalState } from '@/contexts/GlobalStateContext';

export default function ServicesPage() {
    const { vehicleType } = useGlobalState();

    return (
        <VehicleServices vehicleType={vehicleType} />
    );
};
