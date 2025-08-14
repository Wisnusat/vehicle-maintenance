import Image from 'next/image';
import React, { useState } from 'react';
import { towingParts, forkliftParts, truckParts } from '@/data/parts';
import { useRouter } from 'next/navigation';

type Part = {
    name: string;
    image: string;
};

type VehicleServicesProps = {
    vehicleType?: string;
};

export default function VehicleServices({ vehicleType = 'forklift' }: VehicleServicesProps) {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedPart, setSelectedPart] = useState<string>('');
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        kerusakan: '',
        kelengkapan: '',
        note: ''
    });
    const [isSaved, setIsSaved] = useState(false);

    // Get parts based on vehicle type
    const getParts = (): Part[] => {
        switch (vehicleType.toLowerCase()) {
            case 'towing':
                return towingParts;
            case 'forklift':
                return forkliftParts;
            case 'truck':
                return truckParts;
            default:
                return forkliftParts;
        }
    };

    const parts = getParts();
    const partsPerSlide = 6;
    const totalSlides = Math.ceil(parts.length / partsPerSlide);

    // Minimum swipe distance (in px) to trigger slide change
    const minSwipeDistance = 50;

    // Group parts into slides of 6
    const getPartsForSlide = (slideIndex: number): Part[] => {
        const startIndex = slideIndex * partsPerSlide;
        return parts.slice(startIndex, startIndex + partsPerSlide);
    };

    const handlePartSelect = (partName: string) => {
        setSelectedPart(partName);
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        setIsSaved(true);
    };

    const handleEdit = () => {
        setIsSaved(false);
    };

    const handleNext = () => {
        router.push('/history');
    };

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
    };

    // Touch event handlers for swipe gestures
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset touchEnd
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentSlide < totalSlides - 1) {
            nextSlide();
        }
        if (isRightSwipe && currentSlide > 0) {
            prevSlide();
        }
    };

    // Mouse event handlers for desktop drag support
    const [mouseStart, setMouseStart] = useState<number | null>(null);
    const [mouseEnd, setMouseEnd] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const onMouseDown = (e: React.MouseEvent) => {
        setMouseEnd(null);
        setMouseStart(e.clientX);
        setIsDragging(true);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setMouseEnd(e.clientX);
    };

    const onMouseUp = () => {
        if (!isDragging || !mouseStart || !mouseEnd) {
            setIsDragging(false);
            return;
        }

        const distance = mouseStart - mouseEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentSlide < totalSlides - 1) {
            nextSlide();
        }
        if (isRightSwipe && currentSlide > 0) {
            prevSlide();
        }

        setIsDragging(false);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="min-h-screen bg-secondary flex flex-col px-6 py-8 overflow-hidden">
            {/* Menu */}
            <div className="flex w-full items-start cursor-pointer pb-2">
                <Image src="/images/menu.svg" alt="Menu" width={26} height={26} />
            </div>

            <div className="p-4">
                {/* Title */}
                <h1 className="text-2xl font-bold text-primary">Select Service(s)</h1>
            </div>

            {/* Parts Grid Container */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-lg">
                    {/* Slides Container */}
                    <div
                        className="overflow-hidden"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseLeave}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                        <div
                            className="flex transition-transform duration-300 ease-in-out select-none"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div key={slideIndex} className="w-full flex-shrink-0">
                                    <div className="grid grid-cols-2 gap-4 p-4">
                                        {getPartsForSlide(slideIndex).map((part, index) => (
                                            <div
                                                key={`${slideIndex}-${index}`}
                                                onClick={() => handlePartSelect(part.name)}
                                                className={`
                                                    relative cursor-pointer rounded-3xl p-6 flex flex-col items-center justify-center
                                                    min-h-[120px] transition-all duration-200 shadow-md
                                                    ${selectedPart === part.name
                                                        ? 'bg-primary/10 border-2 border-primary'
                                                        : 'bg-white hover:bg-gray-50'
                                                    }
                                                `}
                                            >
                                                {/* Selection Checkmark */}
                                                {selectedPart === part.name && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}

                                                {/* Part Image */}
                                                <div className="mb-3">
                                                    <Image
                                                        src={part.image}
                                                        alt={part.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-contain"
                                                    />
                                                </div>

                                                {/* Part Name */}
                                                <h3 className="text-sm font-semibold text-primary text-center leading-tight">
                                                    {part.name}
                                                </h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Pagination Dots */}
                {totalSlides > 1 && (
                    <div className="flex justify-center space-x-2 mt-6">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Form Section */}
                <div className="w-full mt-6 bg-[#9FB1EB] rounded-3xl p-6 text-white">
                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Selected Service with Checkmark */}
                        <div className="relative">
                            <div className="w-full p-3 rounded-2xl text-primary bg-white border-2 border-primary font-medium">
                                {selectedPart || "Component"}
                            </div>
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <textarea
                                placeholder="Note:"
                                value={formData.note}
                                onChange={(e) => handleFormChange('note', e.target.value)}
                                disabled={isSaved}
                                rows={3}
                                className="w-full p-3 rounded-2xl text-primary bg-white placeholder-gray-500 resize-none disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-6 space-x-4">
                        <button
                            onClick={handleEdit}
                            className="flex-1 bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
