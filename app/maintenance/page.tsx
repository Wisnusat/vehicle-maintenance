"use client";
import VehicleType from "@/components/view/maintenance/vehicleType";
import { useGlobalState } from "@/contexts/GlobalStateContext";
import React from "react";

export default function MaintenancePage() {
    const { vehicleType, changeVehicleType } = useGlobalState();
    return (
        <VehicleType vehicleType={vehicleType} changeVehicleType={changeVehicleType} />
    )
}