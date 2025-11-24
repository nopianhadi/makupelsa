import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarHeader = ({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth, 
  onToday,
  view,
  onViewChange 
}) => {
  const formatMonthYear = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      month: 'long',
      year: 'numeric'
    })?.format(date);
  };

  const views = [
    { value: 'month', label: 'Bulan', icon: 'Calendar' },
    { value: 'week', label: 'Minggu', icon: 'CalendarDays' },
    { value: 'day', label: 'Hari', icon: 'CalendarClock' }
  ];

  return (
    <div className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrevMonth}
                className="w-9 h-9 rounded-md flex items-center justify-center
                  bg-surface hover:bg-muted text-muted-foreground hover:text-foreground
                  transition-smooth"
                aria-label="Bulan sebelumnya"
              >
                <Icon name="ChevronLeft" size={20} strokeWidth={2.5} />
              </button>
              <button
                onClick={onNextMonth}
                className="w-9 h-9 rounded-md flex items-center justify-center
                  bg-surface hover:bg-muted text-muted-foreground hover:text-foreground
                  transition-smooth"
                aria-label="Bulan berikutnya"
              >
                <Icon name="ChevronRight" size={20} strokeWidth={2.5} />
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              {formatMonthYear(currentDate)}
            </h2>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onToday}
              iconName="CalendarCheck"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              Hari Ini
            </Button>

            <div className="hidden sm:flex items-center gap-1 p-1 bg-surface rounded-md border border-border">
              {views?.map((viewOption) => (
                <button
                  key={viewOption?.value}
                  onClick={() => onViewChange(viewOption?.value)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md
                    text-sm font-medium transition-smooth
                    ${view === viewOption?.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  aria-label={`Tampilan ${viewOption?.label}`}
                  aria-pressed={view === viewOption?.value}
                >
                  <Icon name={viewOption?.icon} size={16} strokeWidth={2.5} />
                  <span>{viewOption?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-1 mt-3 p-1 bg-surface rounded-md border border-border">
          {views?.map((viewOption) => (
            <button
              key={viewOption?.value}
              onClick={() => onViewChange(viewOption?.value)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md
                text-sm font-medium transition-smooth
                ${view === viewOption?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              aria-label={`Tampilan ${viewOption?.label}`}
              aria-pressed={view === viewOption?.value}
            >
              <Icon name={viewOption?.icon} size={16} strokeWidth={2.5} />
              <span>{viewOption?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;