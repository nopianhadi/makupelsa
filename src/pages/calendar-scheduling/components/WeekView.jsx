import React from 'react';


const WeekView = ({ currentDate, events, onEventClick }) => {
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek?.getDay();
    const diff = startOfWeek?.getDate() - day;
    startOfWeek?.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay?.setDate(startOfWeek?.getDate() + i);
      weekDays?.push(currentDay);
    }
    return weekDays;
  };

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const weekDays = getWeekDays(currentDate);
  const weekDayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const getEventsForDateTime = (date, time) => {
    return events?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate?.toDateString() === date?.toDateString() && 
             event?.time?.startsWith(time?.substring(0, 2));
    });
  };

  const serviceTypeColors = {
    akad: 'bg-primary/10 border-l-4 border-primary text-primary',
    resepsi: 'bg-secondary/10 border-l-4 border-secondary text-secondary',
    wisuda: 'bg-accent/10 border-l-4 border-accent text-accent'
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-px bg-border sticky top-0 z-10">
            <div className="bg-surface px-3 py-3">
              <span className="text-xs font-caption font-semibold text-muted-foreground">
                Waktu
              </span>
            </div>
            {weekDays?.map((date, index) => {
              const isCurrentDay = isToday(date);
              return (
                <div
                  key={index}
                  className={`
                    bg-surface px-2 py-3 text-center
                    ${isCurrentDay ? 'bg-primary/5' : ''}
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-caption font-semibold text-muted-foreground uppercase">
                      {weekDayNames?.[index]}
                    </span>
                    <span className={`
                      text-sm font-medium
                      ${isCurrentDay 
                        ? 'w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold' 
                        : 'text-foreground'
                      }
                    `}>
                      {date?.getDate()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-8 gap-px bg-border">
            {timeSlots?.map((time) => (
              <React.Fragment key={time}>
                <div className="bg-surface px-3 py-4 border-t border-border">
                  <span className="text-xs font-mono text-muted-foreground">
                    {time}
                  </span>
                </div>
                {weekDays?.map((date, dayIndex) => {
                  const dayEvents = getEventsForDateTime(date, time);
                  const isCurrentDay = isToday(date);

                  return (
                    <div
                      key={`${time}-${dayIndex}`}
                      className={`
                        bg-card min-h-[60px] p-1 border-t border-border
                        ${isCurrentDay ? 'bg-primary/5' : ''}
                      `}
                    >
                      {dayEvents?.map((event) => (
                        <button
                          key={event?.id}
                          onClick={() => onEventClick(event)}
                          className={`
                            w-full text-left px-2 py-1.5 rounded-md mb-1
                            ${serviceTypeColors?.[event?.serviceType]}
                            hover:elevation-3 transition-smooth
                          `}
                        >
                          <p className="text-[10px] font-medium truncate">
                            {event?.clientName}
                          </p>
                          <p className="text-[9px] font-caption opacity-80 truncate">
                            {event?.location}
                          </p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;