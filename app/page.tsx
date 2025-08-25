"use client";
import WelcomePage from '@/components/view/welcome';
import { useRouter } from 'next/navigation';

export default function VehicleInspectionPage() {
    const router = useRouter();
    const continueHandler = () => {
      router.push('/signin');
    }
  
    return <WelcomePage onContinue={continueHandler} />
}
