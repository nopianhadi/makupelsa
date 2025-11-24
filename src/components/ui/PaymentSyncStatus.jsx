import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import { validatePaymentConsistency, fixPaymentInconsistency } from '../../utils/paymentSync';
import { dataStore } from '../../utils/dataStore';

const PaymentSyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState({ isChecking: false, issues: [] });
  const [showDetails, setShowDetails] = useState(false);

  const checkConsistency = () => {
    setSyncStatus({ isChecking: true, issues: [] });
    
    const clients = dataStore.getClients();
    const issues = [];
    
    clients.forEach(client => {
      const validation = validatePaymentConsistency(client.id);
      if (!validation.isValid) {
        issues.push({
          clientId: client.id,
          clientName: client.name,
          errors: validation.errors
        });
      }
    });
    
    setSyncStatus({ isChecking: false, issues });
  };

  const fixAllIssues = () => {
    const clients = dataStore.getClients();
    let fixedCount = 0;
    
    clients.forEach(client => {
      const result = fixPaymentInconsistency(client.id);
      if (result.success) {
        fixedCount++;
      }
    });
    
    // Trigger update
    window.dispatchEvent(new CustomEvent('paymentRecorded'));
    
    // Re-check
    checkConsistency();
    
    alert(`✅ Berhasil memperbaiki ${fixedCount} data klien`);
  };

  useEffect(() => {
    checkConsistency();
    
    // Listen for payment updates
    const handleUpdate = () => checkConsistency();
    window.addEventListener('paymentRecorded', handleUpdate);
    
    return () => window.removeEventListener('paymentRecorded', handleUpdate);
  }, []);

  if (syncStatus.isChecking) {
    return (
      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
        <div className="flex items-center gap-2">
          <div className="animate-spin">
            <Icon name="RefreshCw" size={16} color="var(--color-blue-600)" />
          </div>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Memeriksa konsistensi data...
          </span>
        </div>
      </div>
    );
  }

  if (syncStatus.issues.length === 0) {
    return (
      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle2" size={16} color="var(--color-green-600)" />
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              Data pembayaran tersinkronisasi dengan baik
            </span>
          </div>
          <button
            onClick={checkConsistency}
            className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
          >
            Periksa Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="AlertTriangle" size={16} color="var(--color-amber-600)" />
            <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
              Ditemukan {syncStatus.issues.length} inkonsistensi data pembayaran
            </span>
          </div>
          
          {showDetails && (
            <div className="mt-3 space-y-2">
              {syncStatus.issues.map((issue, index) => (
                <div key={index} className="p-2 bg-white dark:bg-gray-900 rounded border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-medium text-foreground mb-1">
                    {issue.clientName}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                    {issue.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline whitespace-nowrap"
          >
            {showDetails ? 'Sembunyikan' : 'Lihat Detail'}
          </button>
          <button
            onClick={fixAllIssues}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-md font-medium transition-colors whitespace-nowrap"
          >
            Perbaiki Semua
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSyncStatus;
