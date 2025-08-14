import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type VehicleTypeProps = {
    vehicleType: string;
    changeVehicleType: (type: string) => void;
}

export default function VehicleType({ vehicleType, changeVehicleType }: VehicleTypeProps) {
    return (
        <div className="max-h-screen bg-secondary flex flex-col items-center px-6 py-8 overflow-hidden">
            {/* Menu */}
            <div className="flex w-full items-start cursor-pointer">
                <Image src="/images/menu.svg" alt="Menu" width={26} height={26} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-primary py-8">Vehicle Details</h1>

            {/* Content */}
            <div
                className="w-3/4 rounded-xl bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center flex justify-center mb-12"
            >
                {vehicleType?.toLowerCase() === "towing" && (
                    <Image
                        className="translate-y-12"
                        src="/images/tuktuk.svg"
                        alt="Menu"
                        width={150}
                        height={150}
                    />)}
                {vehicleType?.toLowerCase() === "forklift" && (
                    <Image
                        className="translate-y-12"
                        src="/images/forklift_img.svg"
                        alt="Menu"
                        width={212}
                        height={212}
                    />)}
                {vehicleType?.toLowerCase() === "truck" && (
                    <Image
                        className="translate-y-12"
                        src="/images/truck_img.svg"
                        alt="Menu"
                        width={238}
                        height={238}
                    />)}
            </div>

            <h1 className="text-xl font-bold text-primary py-8">{vehicleType}</h1>
            <div className="w-screen p-8 h-full flex flex-col items-center justify-center rounded-t-4xl bg-gradient-to-tl from-[#3A3CB8] to-[#9FB1EB]">
                <div className="flex flex-row gap-12 mb-6">
                    <div className={`cursor-pointer bg-white py-4 px-6 flex justify-center items-center rounded-xl border-2 border-solid ${vehicleType?.toLowerCase() === "towing" ? "border-primary" : "border-white"}`} onClick={() => changeVehicleType("Towing")}>
                        <Image src="/images/towing.svg" alt="Menu" width={50} height={50} />
                    </div>
                    <div className={`cursor-pointer bg-white py-4 px-6 flex justify-center items-center rounded-xl border-2 border-solid ${vehicleType?.toLowerCase() === "forklift" ? "border-primary" : "border-white"}`} onClick={() => changeVehicleType("Forklift")}>
                        <Image src="/images/forklift.svg" alt="Menu" width={50} height={50} />
                    </div>
                </div>
                <div className={`cursor-pointer bg-white py-4 px-6 flex justify-center items-center rounded-xl mb-8 border-2 border-solid ${vehicleType?.toLowerCase() === "truck" ? "border-primary" : "border-white"}`} onClick={() => changeVehicleType("Truck")}>
                    <Image src="/images/truk.svg" alt="Menu" width={50} height={50} />
                </div>
                <Link className="w-full" href="/maintenance/inputForm">
                    <Button type='primary'>Next</Button>
                </Link>
            </div>
        </div>
    );
}