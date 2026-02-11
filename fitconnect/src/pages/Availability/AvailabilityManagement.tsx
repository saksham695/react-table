import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { DayOfWeek } from '../../types/enums';
import { Availability, TimeSlot } from '../../types/interfaces';
import { hasTimeSlotOverlap } from '../../utils/calculations';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../../components/Layout/Layout';
import './AvailabilityManagement.css';

const AvailabilityManagement: React.FC = () => {
  const { trainer } = useAuth();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.MONDAY);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState('');

  if (!trainer) return null;

  const allAvailability = storageService.getAvailabilityByTrainerId(trainer.id);

  const handleAddSlot = () => {
    setError('');

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    const newSlot: TimeSlot = { startTime, endTime };
    
    // Check if this day already has availability
    const existingAvailability = allAvailability.find((a) => a.dayOfWeek === selectedDay);
    
    if (existingAvailability) {
      // Check for overlaps
      if (hasTimeSlotOverlap(newSlot, existingAvailability.timeSlots)) {
        setError('This time slot overlaps with an existing slot');
        return;
      }
      
      // Add to existing
      existingAvailability.timeSlots.push(newSlot);
      storageService.updateAvailability(existingAvailability);
    } else {
      // Create new availability for this day
      const newAvailability: Availability = {
        id: uuidv4(),
        trainerId: trainer.id,
        dayOfWeek: selectedDay,
        timeSlots: [newSlot],
        isRecurring: true,
        createdAt: new Date().toISOString(),
      };
      storageService.createAvailability(newAvailability);
    }

    // Reset form
    setStartTime('09:00');
    setEndTime('10:00');
  };

  const handleRemoveSlot = (day: DayOfWeek, slotIndex: number) => {
    const availability = allAvailability.find((a) => a.dayOfWeek === day);
    if (availability) {
      availability.timeSlots.splice(slotIndex, 1);
      if (availability.timeSlots.length === 0) {
        storageService.deleteAvailability(availability.id);
      } else {
        storageService.updateAvailability(availability);
      }
    }
  };

  const daysOfWeek = Object.values(DayOfWeek);

  return (
    <Layout>
      <div className="availability-page">
        <h1>Manage Availability</h1>
        <p className="page-subtitle">Set your weekly availability for client bookings</p>

        <div className="availability-content">
          {/* Add New Slot */}
          <div className="add-slot-section">
            <h2>Add Time Slot</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Day of Week</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="time-inputs">
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <button onClick={handleAddSlot} className="add-button">
              Add Time Slot
            </button>
          </div>

          {/* Current Availability */}
          <div className="current-availability">
            <h2>Your Weekly Schedule</h2>
            {allAvailability.length > 0 ? (
              <div className="schedule-list">
                {daysOfWeek.map((day) => {
                  const dayAvailability = allAvailability.find((a) => a.dayOfWeek === day);
                  return (
                    <div key={day} className="day-schedule">
                      <div className="day-name">{day}</div>
                      <div className="day-slots">
                        {dayAvailability && dayAvailability.timeSlots.length > 0 ? (
                          dayAvailability.timeSlots.map((slot, index) => (
                            <div key={index} className="time-slot">
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <button
                                onClick={() => handleRemoveSlot(day, index)}
                                className="remove-slot"
                                title="Remove slot"
                              >
                                ×
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="no-slots">No availability</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>No availability set yet. Add your first time slot above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AvailabilityManagement;
