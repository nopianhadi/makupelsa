import React, { useState, useEffect } from 'react';
import QuickActionButton from '../../components/ui/QuickActionButton';
import CalendarHeader from './components/CalendarHeader';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import AppointmentModal from './components/AppointmentModal';
import EventDetailModal from './components/EventDetailModal';
import { dataStore } from '../../utils/dataStore';

const CalendarScheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
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

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          view={view}
          onViewChange={setView}
        />

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
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

            <QuickActionButton
              label="Buat Jadwal"
              icon="Plus"
              variant="primary"
              onClick={handleCreateAppointment}
            />
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
    </div>
  );
};

export default CalendarScheduling;