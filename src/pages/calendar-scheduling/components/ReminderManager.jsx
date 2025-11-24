import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { reminderService, ReminderTypes } from '../../../utils/reminderService';

const ReminderManager = ({ eventId, onClose }) => {
  const [reminders, setReminders] = useState([]);
  const [newReminderType, setNewReminderType] = useState(ReminderTypes.BEFORE_1_HOUR);
  const [customMinutes, setCustomMinutes] = useState(30);

  useEffect(() => {
    const currentReminders = reminderService.getReminders(eventId);
    setReminders(currentReminders);
  }, [eventId]);

  const handleAddReminder = () => {
    if (newReminderType === ReminderTypes.CUSTOM && !customMinutes) {
      alert('Masukkan jumlah menit');
      return;
    }
    reminderService.addReminder(
      eventId,
      newReminderType,
      newReminderType === ReminderTypes.CUSTOM ? customMinutes : null
    );
    setReminders(reminderService.getReminders(eventId));
  };

  const handleRemoveReminder = (reminderId) => {
    reminderService.removeReminder(eventId, reminderId);
    setReminders(reminderService.getReminders(eventId));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground mb-3">Tambah Pengingat Baru</h3>
        <div className="space-y-3">
          <select
            value={newReminderType}
            onChange={(e) => setNewReminderType(e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value={ReminderTypes.BEFORE_1_HOUR}>1 jam sebelum</option>
            <option value={ReminderTypes.BEFORE_24_HOURS}>24 jam sebelum</option>
            <option value={ReminderTypes.BEFORE_7_DAYS}>7 hari sebelum</option>
            <option value={ReminderTypes.CUSTOM}>Custom menit</option>
          </select>

          {newReminderType === ReminderTypes.CUSTOM && (
            <input
              type="number"
              min="1"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(parseInt(e.target.value))}
              placeholder="Jumlah menit"
              className="w-full px-3 py-2 bg-surface border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          )}

          <button
            onClick={handleAddReminder}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            <Icon name="Plus" size={14} className="inline mr-2" />
            Tambah Pengingat
          </button>
        </div>
      </div>

      {reminders.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Pengingat Aktif ({reminders.length})</h3>
          <div className="space-y-2">
            {reminders.map(reminder => (
              <div key={reminder.id} className="flex items-center justify-between bg-surface border border-border rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Icon name="Bell" size={16} color="var(--color-primary)" />
                  <span className="text-sm text-foreground">
                    {reminderService.formatReminderText(reminder.type, reminder.customMinutes)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveReminder(reminder.id)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <Icon name="X" size={16} color="var(--color-muted-foreground)" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          Belum ada pengingat. Tambahkan pengingat pertama Anda.
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium text-sm"
      >
        Tutup
      </button>
    </div>
  );
};

export default ReminderManager;
