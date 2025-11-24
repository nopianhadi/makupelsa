import React from 'react';


const MonthView = ({ currentDate, events, onDateClick, onEventClick }) => {
  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days?.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate?.toDateString() === date?.toDateString();
    });
  };

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const days = getDaysInMonth(currentDate);

  const serviceTypeColors = {
    akad: 'bg-primary/20 border-primary/40',
    resepsi: 'bg-secondary/20 border-secondary/40',
    wisuda: 'bg-accent/20 border-accent/40'
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-border">
        {weekDays?.map((day) => (
          <div
            key={day}
            className="bg-surface px-2 py-3 text-center"
          >
            <span className="text-xs font-caption font-semibold text-muted-foreground uppercase">
              {day}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border">
        {days?.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={index}
              onClick={() => date && onDateClick(date)}
              className={`
                bg-card min-h-[100px] sm:min-h-[120px] p-2
                ${date ? 'cursor-pointer hover:bg-muted transition-smooth' : 'bg-surface/50'}
              `}
            >
              {date && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`
                      text-sm font-medium
                      ${isCurrentDay 
                        ? 'w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold' 
                        : 'text-foreground'
                      }
                    `}>
                      {date?.getDate()}
                    </span>
                    {dayEvents?.length > 0 && (
                      <span className="text-[10px] font-caption font-semibold text-muted-foreground">
                        {dayEvents?.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayEvents?.slice(0, 2)?.map((event) => (
                      <button
                        key={event?.id}
                        onClick={(e) => {
                          e?.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`
                          w-full text-left px-2 py-1 rounded-md border
                          ${serviceTypeColors?.[event?.serviceType]}
                          hover:elevation-3 transition-smooth
                        `}
                      >
                        <p className="text-[10px] font-medium text-foreground truncate">
                          {event?.clientName}
                        </p>
                        <p className="text-[9px] font-caption text-muted-foreground truncate">
                          {event?.time}
                        </p>
                      </button>
                    ))}
                    {dayEvents?.length > 2 && (
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onDateClick(date);
                        }}
                        className="w-full text-center py-1 text-[10px] font-caption font-semibold text-primary hover:text-primary/80 transition-smooth"
                      >
                        +{dayEvents?.length - 2} lainnya
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;