"use client";
import WelcomePage from '@/components/view/welcome';
import ActivityPage from '@/components/view/activity';
import { useState } from 'react';
import { useGlobalState } from '@/contexts/GlobalStateContext';

export default function VehicleInspectionPage() {
  const [step, setStep] = useState(0);
  const { method, changeMethod } = useGlobalState();
  
  if (step === 0) {
    return <WelcomePage onContinue={() => setStep(step + 1)} />
  } else {
    return <ActivityPage onContinue={() => setStep(step + 1)} selectMethod={changeMethod} type={method} />;
  }
}
