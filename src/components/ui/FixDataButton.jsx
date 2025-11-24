import React, { useState } from 'react';
import { fixClientData, isDataFixed } from '../../utils/fixClientData';

const FixDataButton = ({ onFixed }) => {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFix = async () => {
    setIsFixing(true);
    
    // Simulasi delay untuk UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fixResult = fixClientData();
    setResult(fixResult);
    setIsFixing(false);
    
    if (fixResult.success && onFixed) {
      // Tunggu sebentar lalu reload
      setTimeout(() => {
        onFixed();
        window.location.reload();
      }, 2000);
    }
  };

  if (result?.success) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="font-semibold mb-1">Perbaikan Berhasil!</h3>
            <p className="text-sm opacity-90">{result.message}</p>
            <p className="text-xs mt-2 opacity-75">Halaman akan di-refresh...</p>
          </div>
        </div>
      </div>
    );
  }

  if (result?.success === false) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <h3 className="font-semibold mb-1">Perbaikan Gagal</h3>
            <p className="text-sm opacity-90">{result.message}</p>
            <button
              onClick={() => setResult(null)}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleFix}
      disabled={isFixing}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      {isFixing ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Memperbaiki...</span>
        </>
      ) : (
        <>
          <span>🔧</span>
          <span>Perbaiki Otomatis</span>
        </>
      )}
    </button>
  );
};

export default FixDataButton;
