import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ projects, onProjectClick, onEditProject, onDeleteProject }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    
    // Previous month's trailing days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    
    return days;
  }, [currentDate]);

  const getProjectsForDate = (day) => {
    if (!day) return [];
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return projects.filter(project => project.date === dateStr);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const getStatusColor = (status) => {
    const colors = {
      'upcoming': 'bg-blue-500',
      'in-progress': 'bg-yellow-500',
      'completed': 'bg-green-500'
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hari Ini
          </Button>
          <Button variant="ghost" size="icon" onClick={previousMonth}>
            <Icon name="ChevronLeft" size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
          <div key={day} className="text-center py-2 text-sm font-semibold text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          const dayProjects = getProjectsForDate(day);
          const hasProjects = dayProjects.length > 0;
          
          return (
            <div
              key={index}
              className={`
                min-h-[100px] p-2 border border-border rounded-lg
                ${day ? 'bg-surface hover:bg-muted cursor-pointer' : 'bg-muted/30'}
                ${isToday(day) ? 'ring-2 ring-primary' : ''}
                transition-smooth
              `}
            >
              {day && (
                <>
                  <div className={`
                    text-sm font-medium mb-1
                    ${isToday(day) ? 'text-primary font-bold' : 'text-foreground'}
                  `}>
                    {day}
                  </div>
                  
                  {hasProjects && (
                    <div className="space-y-1">
                      {dayProjects.slice(0, 2).map((project) => (
                        <div
                          key={project.id}
                          className="text-xs p-1.5 rounded bg-card border border-border hover:shadow-sm transition-smooth group relative"
                        >
                          <div 
                            className="cursor-pointer"
                            onClick={() => onProjectClick(project)}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                              <span className="font-medium text-foreground truncate">
                                {project.title.length > 12 ? project.title.substring(0, 12) + '...' : project.title}
                              </span>
                            </div>
                            <div className="text-muted-foreground truncate text-[10px]">
                              {project.client}
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProject(project);
                              }}
                              className="p-0.5 bg-surface rounded hover:bg-primary/10"
                              title="Edit"
                            >
                              <Icon name="Edit" size={12} color="var(--color-primary)" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject(project.id);
                              }}
                              className="p-0.5 bg-surface rounded hover:bg-error/10"
                              title="Hapus"
                            >
                              <Icon name="Trash2" size={12} color="var(--color-error)" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {dayProjects.length > 2 && (
                        <div className="text-xs text-primary font-medium pl-1">
                          +{dayProjects.length - 2} lainnya
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-muted-foreground">Akan Datang</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-muted-foreground">Sedang Berjalan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-muted-foreground">Selesai</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
