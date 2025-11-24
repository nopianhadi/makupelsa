import React, { useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

const DataValidationAlert = ({ validationResults, onClose, onRunFix }) => {
  const [isFixing, setIsFixing] = useState(false);
  if (!validationResults || !validationResults.summary) return null;

  const { summary } = validationResults;

  if (summary.isValid && summary.totalWarnings === 0) {
    return null;
  }

  const handleRunFix = async () => {
    setIsFixing(true);
    try {
      await onRunFix();
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[500] max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className={`rounded-xl border shadow-lg p-4 ${
        summary.totalErrors > 0 
          ? 'bg-error/5 border-error/20' 
          : 'bg-warning/5 border-warning/20'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            summary.totalErrors > 0 
              ? 'bg-error/10' 
              : 'bg-warning/10'
          }`}>
            <Icon 
              name={summary.totalErrors > 0 ? 'AlertTriangle' : 'Info'} 
              size={24} 
              color={summary.totalErrors > 0 ? 'var(--color-error)' : 'var(--color-warning)'} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground mb-1">
              {summary.totalErrors > 0 ? 'Ditemukan Kesalahan Data' : 'Peringatan Data'}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {summary.totalErrors > 0 && (
                <span className="block">{summary.totalErrors} error ditemukan</span>
              )}
              {summary.totalWarnings > 0 && (
                <span className="block">{summary.totalWarnings} peringatan ditemukan</span>
              )}
              {validationResults.fixApplied && (
                <span className="block text-success mt-1">
                  ✓ {validationResults.fixCount} perbaikan telah diterapkan
                </span>
              )}
            </p>
            
            <div className="flex gap-2">
              {(summary.totalErrors > 0 || summary.totalWarnings > 0) && !validationResults.fixApplied && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRunFix}
                  disabled={isFixing}
                  iconName="Wrench"
                  iconPosition="left"
                >
                  {isFixing ? 'Memperbaiki...' : 'Perbaiki Otomatis'}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
              >
                Tutup
              </Button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth flex-shrink-0"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {(validationResults.clients?.errors?.length > 0 || 
          validationResults.projects?.errors?.length > 0 || 
          validationResults.invoices?.errors?.length > 0) && (
          <div className="mt-4 pt-4 border-t border-border">
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground font-medium mb-2">
                Lihat Detail
              </summary>
              <div className="space-y-2 mt-2">
                {validationResults.clients?.errors?.map((error, index) => (
                  <div key={index} className="p-2 rounded bg-surface border border-border">
                    <p className="font-medium text-foreground">Klien: {error.name}</p>
                    <ul className="list-disc list-inside text-muted-foreground mt-1">
                      {error.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {validationResults.projects?.errors?.map((error, index) => (
                  <div key={index} className="p-2 rounded bg-surface border border-border">
                    <p className="font-medium text-foreground">Proyek: {error.title}</p>
                    <ul className="list-disc list-inside text-muted-foreground mt-1">
                      {error.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {validationResults.invoices?.errors?.map((error, index) => (
                  <div key={index} className="p-2 rounded bg-surface border border-border">
                    <p className="font-medium text-foreground">Invoice: {error.invoiceNumber}</p>
                    <ul className="list-disc list-inside text-muted-foreground mt-1">
                      {error.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataValidationAlert;
