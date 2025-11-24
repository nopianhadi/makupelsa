import React, { useState } from 'react';
import QuickActionButton from '../../components/ui/QuickActionButton';
import CalendarHeader from './components/CalendarHeader';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import AppointmentModal from './components/AppointmentModal';
import EventDetailModal from './components/EventDetailModal';

const CalendarScheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const mockEvents = [
    {
      id: 1,
      clientName: 'Siti Nurhaliza',
      serviceType: 'akad',
      date: '2025-11-22',
      time: '09:00',
      location: 'Masjid Agung Jakarta',
      notes: 'Makeup natural dengan hijab syar\'i',
      amount: 3500000,
      paymentStatus: 'paid'
    },
    {
      id: 2,
      clientName: 'Dewi Lestari',
      serviceType: 'resepsi',
      date: '2025-11-23',
      time: '14:00',
      location: 'Grand Ballroom Hotel Mulia',
      notes: 'Makeup glamour dengan gaun putih',
      amount: 5000000,
      paymentStatus: 'partial'
    },
    {
      id: 3,
      clientName: 'Rina Wijaya',
      serviceType: 'wisuda',
      date: '2025-11-25',
      time: '07:00',
      location: 'Universitas Indonesia, Depok',
      notes: 'Makeup fresh untuk foto wisuda',
      amount: 1500000,
      paymentStatus: 'pending'
    },
    {
      id: 4,
      clientName: 'Maya Sari',
      serviceType: 'akad',
      date: '2025-11-28',
      time: '10:00',
      location: 'Gedung Pernikahan Syariah',
      notes: 'Makeup soft dengan tema pastel',
      amount: 3000000,
      paymentStatus: 'partial'
    },
    {
      id: 5,
      clientName: 'Putri Ayu',
      serviceType: 'resepsi',
      date: '2025-11-30',
      time: '18:00',
      location: 'The Ritz-Carlton Jakarta',
      notes: 'Makeup bold dengan tema gold',
      amount: 6000000,
      paymentStatus: 'paid'
    },
    {
      id: 6,
      clientName: 'Indah Permata',
      serviceType: 'wisuda',
      date: '2025-12-02',
      time: '08:00',
      location: 'Universitas Gadjah Mada, Yogyakarta',
      notes: 'Makeup natural untuk dokumentasi',
      amount: 1200000,
      paymentStatus: 'pending'
    },
    {
      id: 7,
      clientName: 'Laila Sari',
      serviceType: 'akad',
      date: '2025-12-05',
      time: '11:00',
      location: 'Masjid Istiqlal',
      notes: 'Makeup elegan dengan hijab modern',
      amount: 4000000,
      paymentStatus: 'partial'
    },
    {
      id: 8,
      clientName: 'Ayu Ting Ting',
      serviceType: 'resepsi',
      date: '2025-12-08',
      time: '16:00',
      location: 'Balai Kartini Jakarta',
      notes: 'Makeup glamour dengan tema merah',
      amount: 4500000,
      paymentStatus: 'paid'
    }
  ];

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
              events={mockEvents}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}

          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={mockEvents}
              onEventClick={handleEventClick}
            />
          )}

          {view === 'day' && (
            <DayView
              currentDate={currentDate}
              events={mockEvents}
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