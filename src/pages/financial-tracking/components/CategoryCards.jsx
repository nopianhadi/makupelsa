import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { mobileClasses, cn } from '../../../utils/mobileOptimization';
import { subscribeToStorageEvent, STORAGE_EVENTS } from '../../../utils/storageEvents';

const CategoryCards = ({ incomes = [], expenses = [], onCategoryFilter }) => {
  const [activeType, setActiveType] = useState('expense'); // 'expense' or 'income'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState({});
  const [incomeCategories, setIncomeCategories] = useState({});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Icon mapping untuk kategori
  const categoryIconMap = {
    cosmetics: { icon: 'Sparkles', color: 'text-secondary', bgColor: 'bg-secondary/10', borderColor: 'border-secondary/20' },
    salary: { icon: 'Users', color: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-primary/20' },
    transport: { icon: 'Car', color: 'text-accent', bgColor: 'bg-accent/10', borderColor: 'border-accent/20' },
    equipment: { icon: 'Package', color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning/20' },
    marketing: { icon: 'Megaphone', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/20' },
    other: { icon: 'MoreHorizontal', color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-muted' }
  };

  const serviceIconMap = {
    akad: { icon: 'Heart', color: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-primary/20' },
    resepsi: { icon: 'PartyPopper', color: 'text-secondary', bgColor: 'bg-secondary/10', borderColor: 'border-secondary/20' },
    wisuda: { icon: 'GraduationCap', color: 'text-accent', bgColor: 'bg-accent/10', borderColor: 'border-accent/20' },
    other: { icon: 'Briefcase', color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning/20' }
  };

  // Load expense categories from localStorage
  const loadExpenseCategories = () => {
    const savedCategories = localStorage.getItem('expense_categories');
    const categories = savedCategories ? JSON.parse(savedCategories) : [
      { id: 'cosmetics', name: 'Pembelian Kosmetik' },
      { id: 'salary', name: 'Gaji Asisten' },
      { id: 'transport', name: 'Biaya Transportasi' },
      { id: 'equipment', name: 'Peralatan Makeup' },
      { id: 'marketing', name: 'Marketing & Promosi' },
      { id: 'other', name: 'Lainnya' }
    ];

    const categoriesConfig = {};
    categories.forEach(cat => {
      const iconConfig = categoryIconMap[cat.id] || categoryIconMap.other;
      categoriesConfig[cat.id] = {
        label: cat.name,
        ...iconConfig
      };
    });

    setExpenseCategories(categoriesConfig);
  };

  // Load income categories (service types) from localStorage
  const loadIncomeCategories = () => {
    const savedServiceTypes = localStorage.getItem('service_types');
    const serviceTypes = savedServiceTypes ? JSON.parse(savedServiceTypes) : [
      { id: 'akad', name: 'Akad' },
      { id: 'resepsi', name: 'Resepsi' },
      { id: 'wisuda', name: 'Wisuda' },
      { id: 'other', name: 'Lainnya' }
    ];

    const categoriesConfig = {};
    serviceTypes.forEach(st => {
      const iconConfig = serviceIconMap[st.id] || serviceIconMap.other;
      categoriesConfig[st.id] = {
        label: st.name,
        ...iconConfig
      };
    });

    setIncomeCategories(categoriesConfig);
  };

  // Load categories on mount and listen for updates
  useEffect(() => {
    loadExpenseCategories();
    loadIncomeCategories();

    const unsubscribeExpense = subscribeToStorageEvent(
      STORAGE_EVENTS.EXPENSE_CATEGORIES_UPDATED,
      loadExpenseCategories
    );
    const unsubscribeIncome = subscribeToStorageEvent(
      STORAGE_EVENTS.SERVICE_TYPES_UPDATED,
      loadIncomeCategories
    );

    return () => {
      unsubscribeExpense();
      unsubscribeIncome();
    };
  }, []);

  // Calculate expense totals by category
  const expenseTotals = useMemo(() => {
    const totals = {};
    Object.keys(expenseCategories).forEach(key => {
      totals[key] = {
        total: 0,
        count: 0,
        percentage: 0
      };
    });

    expenses.forEach(expense => {
      const category = expense.category || 'other';
      if (totals[category]) {
        totals[category].total += expense.amount;
        totals[category].count += 1;
      }
    });

    const grandTotal = Object.values(totals).reduce((sum, cat) => sum + cat.total, 0);
    Object.keys(totals).forEach(key => {
      totals[key].percentage = grandTotal > 0 ? (totals[key].total / grandTotal * 100).toFixed(1) : 0;
    });

    return totals;
  }, [expenses, expenseCategories]);

  // Calculate income totals by service type
  const incomeTotals = useMemo(() => {
    const totals = {};
    Object.keys(incomeCategories).forEach(key => {
      totals[key] = {
        total: 0,
        count: 0,
        percentage: 0
      };
    });

    incomes.forEach(income => {
      const category = income.serviceType || 'other';
      if (totals[category]) {
        totals[category].total += income.amount;
        totals[category].count += 1;
      }
    });

    const grandTotal = Object.values(totals).reduce((sum, cat) => sum + cat.total, 0);
    Object.keys(totals).forEach(key => {
      totals[key].percentage = grandTotal > 0 ? (totals[key].total / grandTotal * 100).toFixed(1) : 0;
    });

    return totals;
  }, [incomes, incomeCategories]);

  const handleCategoryClick = (categoryKey) => {
    if (selectedCategory === categoryKey) {
      // Deselect
      setSelectedCategory(null);
      onCategoryFilter && onCategoryFilter(null, activeType);
    } else {
      // Select
      setSelectedCategory(categoryKey);
      onCategoryFilter && onCategoryFilter(categoryKey, activeType);
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setSelectedCategory(null);
    onCategoryFilter && onCategoryFilter(null, type);
  };

  const currentCategories = activeType === 'expense' ? expenseCategories : incomeCategories;
  const currentTotals = activeType === 'expense' ? expenseTotals : incomeTotals;

  return (
    <div className={cn("mb-6", mobileClasses.marginBottom)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn("font-heading font-semibold text-foreground", mobileClasses.heading3)}>
          Kategori {activeType === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
        </h3>
        
        {/* Type Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          <button
            onClick={() => handleTypeChange('expense')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-smooth",
              activeType === 'expense'
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon name="TrendingDown" size={14} className="inline mr-1" />
            Pengeluaran
          </button>
          <button
            onClick={() => handleTypeChange('income')}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-smooth",
              activeType === 'income'
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon name="TrendingUp" size={14} className="inline mr-1" />
            Pemasukan
          </button>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(currentCategories).map(([key, config]) => {
          const data = currentTotals[key];
          const isSelected = selectedCategory === key;
          
          return (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all duration-200",
                "hover:elevation-2 active:scale-95",
                isSelected
                  ? `${config.bgColor} ${config.borderColor} elevation-2`
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className={cn(
                  "absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center",
                  config.bgColor
                )}>
                  <Icon name="Check" size={12} className={config.color} strokeWidth={3} />
                </div>
              )}

              <div className="flex flex-col items-center text-center gap-2">
                {/* Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isSelected ? config.bgColor : "bg-muted"
                )}>
                  <Icon 
                    name={config.icon} 
                    size={20} 
                    className={isSelected ? config.color : "text-muted-foreground"}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Label */}
                <div className="w-full">
                  <p className={cn(
                    "text-xs font-medium mb-1 truncate",
                    isSelected ? config.color : "text-foreground"
                  )}>
                    {config.label}
                  </p>
                  
                  {/* Amount */}
                  <p className={cn(
                    "text-sm font-bold font-mono truncate",
                    activeType === 'expense' ? "text-error" : "text-success"
                  )}>
                    {data.total > 0 ? formatCurrency(data.total) : '-'}
                  </p>
                  
                  {/* Count & Percentage */}
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {data.count} item
                    </span>
                    {data.percentage > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {data.percentage}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Clear Filter Button */}
      {selectedCategory && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handleCategoryClick(selectedCategory)}
            className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-smooth flex items-center gap-2"
          >
            <Icon name="X" size={16} />
            Hapus Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryCards;
