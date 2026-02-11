import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { Trainer, Availability, Booking } from '../../types/interfaces';
import { BookingStatus, DayOfWeek } from '../../types/enums';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../../components/Layout/Layout';
import './BookSession.css';

const BookSession: React.FC = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const { client } = useAuth();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(
    null
  );
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState<{ startTime: string; endTime: string }[]>(
    []
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (trainerId) {
      const trainerData = storageService.getTrainerById(trainerId);
      setTrainer(trainerData || null);

      const availabilityData = storageService.getAvailabilityByTrainerId(trainerId);
      setAvailability(availabilityData);
    }
  }, [trainerId]);

  useEffect(() => {
    if (selectedDate && trainer) {
      const date = new Date(selectedDate);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      const dayAvailability = availability.find((a) => a.dayOfWeek === dayName as DayOfWeek);

      if (dayAvailability) {
        // Filter out already booked slots
        const available = dayAvailability.timeSlots.filter(
          (slot) => !storageService.isSlotBooked(trainer.id, selectedDate, slot)
        );
        setAvailableSlots(available);
      } else {
        setAvailableSlots([]);
      }
      setSelectedSlot(null);
    }
  }, [selectedDate, trainer, availability]);

  if (!client || !trainer) return null;

  const handleBooking = () => {
    setError('');

    if (!selectedDate || !selectedSlot) {
      setError('Please select a date and time slot');
      return;
    }

    // Double-check if slot is available
    if (storageService.isSlotBooked(trainer.id, selectedDate, selectedSlot)) {
      setError('This slot has just been booked. Please select another.');
      return;
    }

    const booking: Booking = {
      id: uuidv4(),
      trainerId: trainer.id,
      clientId: client.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: BookingStatus.CONFIRMED,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.createBooking(booking);
    setSuccess(true);

    setTimeout(() => {
      navigate('/my-bookings');
    }, 2000);
  };

  // Get min date (today) and max date (3 months from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Layout>
      <div className="book-session-page">
        <div className="booking-header">
          <button onClick={() => navigate('/trainers')} className="back-button">
            ← Back to Trainers
          </button>
          <h1>Book Session with {trainer.profile.fullName}</h1>
        </div>

        {success ? (
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Your session has been booked successfully.</p>
            <p className="redirect-text">Redirecting to your bookings...</p>
          </div>
        ) : (
          <div className="booking-content">
            <div className="booking-form">
              <div className="form-section">
                <h2>Select Date & Time</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={today}
                    max={maxDateStr}
                  />
                </div>

                {selectedDate && (
                  <div className="form-group">
                    <label>Available Time Slots *</label>
                    {availableSlots.length > 0 ? (
                      <div className="slots-grid">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            className={`slot-button ${
                              selectedSlot === slot ? 'selected' : ''
                            }`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot.startTime} - {slot.endTime}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="no-slots">
                        No available slots for this date. Please choose another day.
                      </p>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Any specific goals or requirements for this session..."
                  />
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedSlot}
                  className="book-button"
                >
                  Confirm Booking
                </button>
              </div>
            </div>

            <div className="trainer-summary">
              <h2>Trainer Details</h2>
              <div className="trainer-info">
                <h3>{trainer.profile.fullName}</h3>
                <p className="trainer-bio">{trainer.profile.bio}</p>
                
                <div className="trainer-details">
                  <div className="detail-item">
                    <strong>Experience:</strong>
                    <span>{trainer.profile.yearsOfExperience} years</span>
                  </div>
                  {trainer.profile.pricing && (
                    <div className="detail-item">
                      <strong>Pricing:</strong>
                      <span>
                        {trainer.profile.pricing.perSession && 
                          `$${trainer.profile.pricing.perSession}/session`}
                        {trainer.profile.pricing.monthly && 
                          ` | $${trainer.profile.pricing.monthly}/month`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="expertise-tags">
                  {trainer.profile.areasOfExpertise.map((exp) => (
                    <span key={exp} className="tag">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookSession;
