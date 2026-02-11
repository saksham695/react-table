import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { Booking } from '../../types/interfaces';
import { BookingStatus } from '../../types/enums';
import Layout from '../../components/Layout/Layout';
import './ClientBookings.css';

const ClientBookings: React.FC = () => {
  const { client } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming');

  useEffect(() => {
    if (client) {
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const loadBookings = () => {
    if (!client) return;
    const allBookings = storageService.getBookingsByClientId(client.id);
    setBookings(allBookings);
  };

  if (!client) return null;

  const getTrainerName = (trainerId: string): string => {
    const trainer = storageService.getTrainerById(trainerId);
    return trainer?.profile.fullName || 'Unknown Trainer';
  };

  const getTrainerEmail = (trainerId: string): string => {
    const trainer = storageService.getTrainerById(trainerId);
    return trainer?.email || '';
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      storageService.cancelBooking(bookingId);
      loadBookings();
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'upcoming':
        return bookingDate >= today && booking.status === BookingStatus.CONFIRMED;
      case 'past':
        return bookingDate < today || booking.status === BookingStatus.COMPLETED;
      case 'cancelled':
        return booking.status === BookingStatus.CANCELLED;
      default:
        return true;
    }
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.timeSlot.startTime);
    const dateB = new Date(b.date + ' ' + b.timeSlot.startTime);
    return dateA.getTime() - dateB.getTime();
  });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(
      (b) => new Date(b.date) >= new Date() && b.status === BookingStatus.CONFIRMED
    ).length,
    completed: bookings.filter((b) => b.status === BookingStatus.COMPLETED).length,
    cancelled: bookings.filter((b) => b.status === BookingStatus.CANCELLED).length,
  };

  return (
    <Layout>
      <div className="client-bookings-page">
        <div className="page-header">
          <h1>My Bookings</h1>
          <button onClick={() => navigate('/trainers')} className="book-new-button">
            Book New Session
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.upcoming}</div>
            <div className="stat-label">Upcoming</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={filter === 'past' ? 'active' : ''}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
          <button
            className={filter === 'cancelled' ? 'active' : ''}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-container">
          {sortedBookings.length > 0 ? (
            sortedBookings.map((booking) => (
              <div key={booking.id} className={`booking-card ${booking.status.toLowerCase()}`}>
                <div className="booking-header">
                  <div>
                    <h3>{getTrainerName(booking.trainerId)}</h3>
                    <p className="trainer-email">{getTrainerEmail(booking.trainerId)}</p>
                  </div>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <strong>Date:</strong>
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Time:</strong>
                    <span>
                      {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                    </span>
                  </div>
                  {booking.notes && (
                    <div className="notes-section">
                      <strong>Notes:</strong>
                      <p>{booking.notes}</p>
                    </div>
                  )}
                </div>

                {booking.status === BookingStatus.CONFIRMED && (
                  <div className="booking-actions">
                    <button
                      onClick={() => navigate(`/trainers/${booking.trainerId}`)}
                      className="view-trainer-button"
                    >
                      View Trainer
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="cancel-button"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No {filter !== 'all' ? filter : ''} bookings found.</p>
              <button onClick={() => navigate('/trainers')} className="cta-button">
                Browse Trainers
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClientBookings;
