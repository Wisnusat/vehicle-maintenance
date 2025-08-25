"use client";
import VehicleType from "@/components/view/checksheet/vehicleType";
import { useGlobalState } from "@/contexts/GlobalStateContext";
import React, { useEffect } from "react";

export default function MaintenancePage() {
    const { vehicleType, changeVehicleType } = useGlobalState();
    // Clean transient edit/new-entry data when landing on dashboard
    useEffect(() => {
        try {
            const keys = [
                'editMode',
                'editChecksheetId',
                'editProfile',
                'editParts',
                // Clear last working profile id to avoid linking parts to stale record
                'checksheetProfile',
            ];
            keys.forEach((k) => localStorage.removeItem(k));
        } catch {
            // no-op
        }
    }, []);
    return (
        <VehicleType vehicleType={vehicleType} changeVehicleType={changeVehicleType} />
    )
}