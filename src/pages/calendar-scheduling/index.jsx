import React, { useState, useEffect } from 'react';
import QuickActionButton from '../../components/ui/QuickActionButton';
import CalendarHeader from './components/CalendarHeader';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import AppointmentModal from './components/AppointmentModal';
import EventDetailModal from './components/EventDetailModal';
import ReminderManager from './components/ReminderManager';
import GoogleCalendarSync from './components/GoogleCalendarSync';
import Icon from '../../components/AppIcon';
import { dataStore } from '../../utils/dataStore';

const CalendarScheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isGoogleSyncModalOpen, setIsGoogleSyncModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadEventsFromClients = () => {
    const clients = dataStore.getClients();
    const events = [];
    
    clients.forEach(client => {
      if (client.events && Array.isArray(client.events)) {
        client.events.forEach((event, index) => {
          events.push({
            id: `${client.id}-${index}`,
            clientId: client.id,
            clientName: client.name,
            serviceType: event.serviceType || 'other',
            date: event.eventDate,
            time: event.eventTime || '00:00',
            location: event.venue || '',
            notes: event.notes || '',
            amount: event.totalAmount || 0,
            paymentStatus: event.paymentStatus || 'pending'
          });
        });
      }
    });
    
    return events;
  };

  const [events, setEvents] = useState(loadEventsFromClients());

  useEffect(() => {
    const handleClientUpdate = () => {
      setEvents(loadEventsFromClients());
    };

    window.addEventListener('clientUpdated', handleClientUpdate);
    window.addEventListener('clientAdded', handleClientUpdate);
    window.addEventListener('clientDeleted', handleClientUpdate);
    window.addEventListener('paymentRecorded', handleClientUpdate);

    return () => {
      window.removeEventListener('clientUpdated', handleClientUpdate);
      window.removeEventListener('clientAdded', handleClientUpdate);
      window.removeEventListener('clientDeleted', handleClientUpdate);
      window.removeEventListener('paymentRecorded', handleClientUpdate);
    };
  }, []);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate?.setMonth(currentDate?.getMonth() - 1);
    } else if (view === 'week') {
      newDate?.setDate(currentDate?.getDate() - 7);
    } else {
      newDate?.setDate(currentDate?.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate?.setMonth(currentDate?.getMonth() + 1);
    } else if (view === 'week') {
      newDate?.setDate(currentDate?.getDate() + 7);
    } else {
      newDate?.setDate(currentDate?.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
    setView('day');
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailModalOpen(true);
  };

  const handleCreateAppointment = () => {
    setEditingEvent(null);
    setIsAppointmentModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsAppointmentModalOpen(true);
  };

  const handleSaveAppointment = (formData) => {
    console.log('Saving appointment:', formData);
    setIsAppointmentModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    console.log('Deleting event:', eventId);
    setIsEventDetailModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 lg:pb-6">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          view={view}
          onViewChange={setView}
        />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary" />
                <span className="text-xs font-caption text-muted-foreground">Akad</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary/20 border-2 border-secondary" />
                <span className="text-xs font-caption text-muted-foreground">Resepsi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent/20 border-2 border-accent" />
                <span className="text-xs font-caption text-muted-foreground">Wisuda</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <QuickActionButton
                label="Pengingat"
                icon="Bell"
                variant="outline"
                onClick={() => setIsReminderModalOpen(true)}
              />
              <QuickActionButton
                label="Google Calendar"
                icon="Calendar"
                variant="outline"
                onClick={() => setIsGoogleSyncModalOpen(true)}
              />
              <QuickActionButton
                label="Buat Jadwal"
                icon="Plus"
                variant="primary"
                onClick={handleCreateAppointment}
              />
            </div>
          </div>

          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}

          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}

          {view === 'day' && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </main>


      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setEditingEvent(null);
        }}
        appointment={editingEvent}
        onSave={handleSaveAppointment}
      />

      <EventDetailModal
        isOpen={isEventDetailModalOpen}
        onClose={() => {
          setIsEventDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Reminder Manager Modal */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-bold text-foreground">
                Pengingat Acara
              </h2>
              <button 
                onClick={() => setIsReminderModalOpen(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <Icon name="X" size={20} sm:size={24} />
              </button>
            </div>
            <ReminderManager
              eventId={selectedEvent?.id || ''}
              onClose={() => setIsReminderModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Google Calendar Sync Modal */}
      {isGoogleSyncModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-3 sm:p-4 lg:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-bold text-foreground">
                Sinkronisasi Google Calendar
              </h2>
              <button 
                onClick={() => setIsGoogleSyncModalOpen(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <Icon name="X" size={20} sm:size={24} />
              </button>
            </div>
            <GoogleCalendarSync
              onClose={() => setIsGoogleSyncModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarScheduling;