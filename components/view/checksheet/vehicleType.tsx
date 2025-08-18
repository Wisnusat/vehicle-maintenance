import Button from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type VehicleTypeProps = {
    vehicleType: string;
    changeVehicleType: (type: string) => void;
}

export default function VehicleType({ vehicleType, changeVehicleType }: VehicleTypeProps) {
    return (
        <div className="min-h-screen max-h-screen bg-secondary flex flex-col items-center px-6 pt-8">
            {/* Menu */}
            <div className="flex w-full items-start cursor-pointer">
                <Sidebar />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-primary py-8">Vehicle Details</h1>

            {/* Content */}
            <div
                className="w-full max-w-md mx-auto rounded-xl bg-[linear-gradient(to_right,rgba(58,60,184,0.8),rgba(159,177,235,0.8)),url('/images/vehicle_bg.svg')] bg-cover bg-center flex justify-center mb-6 md:mb-12 p-4"
            >
                <div className="relative w-full h-40 md:h-60 flex items-end justify-center">
                    {vehicleType?.toLowerCase() === "towing" && (
                        <Image
                            className="object-contain max-h-full w-auto"
                            src="/images/tuktuk.svg"
                            alt="Towing Vehicle"
                            width={200}
                            height={200}
                            priority
                        />
                    )}
                    {vehicleType?.toLowerCase() === "forklift" && (
                        <Image
                            className="object-contain max-h-full w-auto"
                            src="/images/forklift_img.svg"
                            alt="Forklift Vehicle"
                            width={250}
                            height={250}
                            priority
                        />
                    )}
                    {vehicleType?.toLowerCase() === "truck" && (
                        <Image
                            className="object-contain max-h-full w-auto"
                            src="/images/truck_img.svg"
                            alt="Truck Vehicle"
                            width={280}
                            height={280}
                            priority
                        />
                    )}
                </div>
            </div>

            <h1 className="text-xl font-bold text-primary py-8">{vehicleType}</h1>
            <div className="w-screen p-8 h-[calc(100vh-200px)] flex flex-col items-center justify-center rounded-t-4xl bg-gradient-to-tl from-[#3A3CB8] to-[#9FB1EB]">
                <div className="flex flex-row gap-12 mb-6 mt-6">
                    <div className={`relative cursor-pointer bg-white py-4 px-6 flex justify-center items-center rounded-xl border-2 border-solid ${vehicleType?.toLowerCase() === "towing" ? "border-primary" : "border-white"}`} onClick={() => changeVehicleType("Towing")}>
                        {vehicleType?.toLowerCase() === "towing" && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <Image src="/images/towing.svg" alt="Menu" width={70} height={70} />
                    </div>
                    <div className={`relative cursor-pointer bg-white py-4 px-6 flex justify-center items-center rounded-xl border-2 border-solid ${vehicleType?.toLowerCase() === "forklift" ? "border-primary" : "border-white"}`} onClick={() => changeVehicleType("Forklift")}>
                        {vehicleType?.toLowerCase() === "forklift" && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <Image src="/images/forklift.svg" alt="Menu" width={70} height={70} />
                    </div>
                </div>
                <div className={`relative cursor-pointer bg-white py-4 px-6 flex justify-center items-center rounded-xl border-2 border-solid ${vehicleType?.toLowerCase() === "truck" ? "border-primary" : "border-white"}`} onClick={() => changeVehicleType("Truck")}>
                    {vehicleType?.toLowerCase() === "truck" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    <Image src="/images/truk.svg" alt="Menu" width={70} height={70} />
                </div>
                <div className="flex flex-col h-full items-end justify-end w-full mt-4">
                    <Link className="w-full" href="/checksheet/inputForm">
                        <Button type='primary'>Next</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}