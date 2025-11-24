import { useState, useEffect } from 'react';
import { validateAllData, autoFixAllData } from '../utils/dataValidation';
import { syncAllData } from '../utils/paymentSync';

/**
 * Hook untuk validasi data otomatis
 */
export const useDataValidation = (autoFix = false) => {
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const runValidation = (applyFix = false) => {
    setIsValidating(true);
    
    const results = validateAllData();
    
    if (applyFix && !results.summary.isValid) {
      const fixResults = autoFixAllData();
      const syncResults = syncAllData();
      
      const revalidated = validateAllData();
      setValidationResults({
        ...revalidated,
        fixApplied: true,
        fixCount: fixResults.fixedCount,
        syncMessage: syncResults.message
      });
    } else {
      setValidationResults(results);
    }
    
    setIsValidating(false);
    setHasValidated(true);
  };

  useEffect(() => {
    if (!hasValidated) {
      const timer = setTimeout(() => runValidation(autoFix), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasValidated, autoFix]);

  return {
    validationResults,
    isValidating,
    runValidation,
    hasIssues: validationResults && (
      validationResults.summary.totalErrors > 0 || 
      validationResults.summary.totalWarnings > 0
    )
  };
};

/**
 * Hook untuk auto-sync data saat ada perubahan
 */
export const useAutoSync = () => {
  useEffect(() => {
    const handlePaymentRecorded = () => {
      const results = syncAllData();
      console.log('Data synced:', results);
    };

    const handleAssistantAdded = () => {
      const results = syncAllData();
      console.log('Data synced after assistant added:', results);
    };

    window.addEventListener('paymentRecorded', handlePaymentRecorded);
    window.addEventListener('assistantAdded', handleAssistantAdded);

    return () => {
      window.removeEventListener('paymentRecorded', handlePaymentRecorded);
      window.removeEventListener('assistantAdded', handleAssistantAdded);
    };
  }, []);
};

export default useDataValidation;
