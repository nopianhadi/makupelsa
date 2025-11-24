import React, { useState } from 'react';
import { runFullDataFix } from '../utils/fixDataIssues';
import Button from './ui/Button';

/**
 * Komponen tombol untuk memperbaiki masalah data
 */
const DataFixButton = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFix = () => {
    setIsFixing(true);
    try {
      const fixResult = runFullDataFix();
      setResult(fixResult);
      
      // Reload halaman setelah 2 detik untuk memperbarui UI
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error saat memperbaiki data:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-[500]">
      <Button
        onClick={handleFix}
        disabled={isFixing}
        variant="primary"
        iconName="Wrench"
        iconPosition="left"
      >
        {isFixing ? 'Memperbaiki...' : 'Perbaiki Data'}
      </Button>
      
      {result && (
        <div className={`mt-2 p-3 rounded-lg text-sm ${
          result.success ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        }`}>
          {result.success ? (
            result.fixed ? `✅ ${result.fixed} data diperbaiki` : '✅ Data sudah valid'
          ) : (
            `❌ Error: ${result.error}`
          )}
        </div>
      )}
    </div>
  );
};

export default DataFixButton;
