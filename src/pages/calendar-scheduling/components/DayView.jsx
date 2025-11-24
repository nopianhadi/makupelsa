import React from 'react';
import CalendarEventCard from '../../../components/ui/CalendarEventCard';

const DayView = ({ currentDate, events, onEventClick }) => {
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })?.format(date);
  };

  const getEventsForTime = (time) => {
    return events?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate?.toDateString() === currentDate?.toDateString() && 
             event?.time?.startsWith(time?.substring(0, 2));
    });
  };

  const dayEvents = events?.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate?.toDateString() === currentDate?.toDateString();
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="bg-surface px-4 py-3 border-b border-border sticky top-0 z-10">
            <h3 className="text-sm font-heading font-semibold text-foreground">
              {formatDate(currentDate)}
            </h3>
          </div>

          <div className="divide-y divide-border">
            {timeSlots?.map((time) => {
              const timeEvents = getEventsForTime(time);
              
              return (
                <div key={time} className="flex">
                  <div className="w-20 flex-shrink-0 bg-surface px-3 py-4 border-r border-border">
                    <span className="text-xs font-mono text-muted-foreground">
                      {time}
                    </span>
                  </div>
                  <div className="flex-1 p-3 min-h-[80px]">
                    {timeEvents?.length > 0 ? (
                      <div className="space-y-2">
                        {timeEvents?.map((event) => (
                          <CalendarEventCard
                            key={event?.id}
                            clientName={event?.clientName}
                            serviceType={event?.serviceType}
                            time={event?.time}
                            paymentStatus={event?.paymentStatus}
                            amount={event?.amount}
                            location={event?.location}
                            notes={event?.notes}
                            onClick={() => onEventClick(event)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground font-caption">
                          Tidak ada jadwal
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg border border-border p-4 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-heading font-semibold text-foreground">
              Ringkasan Hari Ini
            </h3>
            <span className="text-xs font-caption font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
              {dayEvents?.length} Jadwal
            </span>
          </div>

          {dayEvents?.length > 0 ? (
            <div className="space-y-3">
              {dayEvents?.map((event) => (
                <CalendarEventCard
                  key={event?.id}
                  clientName={event?.clientName}
                  serviceType={event?.serviceType}
                  time={event?.time}
                  paymentStatus={event?.paymentStatus}
                  amount={event?.amount}
                  notes={event?.notes}
                  location={event?.location}
                  variant="compact"
                  onClick={() => onEventClick(event)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-sm text-muted-foreground font-caption">
                Tidak ada jadwal hari ini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayView;