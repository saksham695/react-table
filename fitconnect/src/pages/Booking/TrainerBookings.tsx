import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { Booking } from '../../types/interfaces';
import { BookingStatus } from '../../types/enums';
import Layout from '../../components/Layout/Layout';
import './TrainerBookings.css';

const TrainerBookings: React.FC = () => {
  const { trainer } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'past' | 'cancelled' | 'rejected'>('pending');

  useEffect(() => {
    if (trainer) {
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainer]);

  const loadBookings = () => {
    if (!trainer) return;
    const allBookings = storageService.getBookingsByTrainerId(trainer.id);
    setBookings(allBookings);
  };

  if (!trainer) return null;

  const getClientName = (clientId: string): string => {
    const client = storageService.getClientById(clientId);
    return client?.profile.fullName || 'Unknown Client';
  };

  const getClientEmail = (clientId: string): string => {
    const client = storageService.getClientById(clientId);
    return client?.email || '';
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      storageService.cancelBooking(bookingId);
      loadBookings();
    }
  };

  const handleCompleteBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = BookingStatus.COMPLETED;
      booking.updatedAt = new Date().toISOString();
      storageService.updateBooking(booking);
      loadBookings();
    }
  };

  const handleConfirmBooking = (bookingId: string) => {
    storageService.confirmBooking(bookingId);
    loadBookings();
  };

  const handleRejectBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to reject this booking?')) {
      storageService.rejectBooking(bookingId);
      loadBookings();
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'pending':
        return booking.status === BookingStatus.PENDING;
      case 'confirmed':
        return bookingDate >= today && booking.status === BookingStatus.CONFIRMED;
      case 'past':
        return bookingDate < today || booking.status === BookingStatus.COMPLETED;
      case 'cancelled':
        return booking.status === BookingStatus.CANCELLED;
      case 'rejected':
        return booking.status === BookingStatus.REJECTED;
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
    pending: bookings.filter((b) => b.status === BookingStatus.PENDING).length,
    confirmed: bookings.filter(
      (b) => new Date(b.date) >= new Date() && b.status === BookingStatus.CONFIRMED
    ).length,
    completed: bookings.filter((b) => b.status === BookingStatus.COMPLETED).length,
    cancelled: bookings.filter((b) => b.status === BookingStatus.CANCELLED).length,
    rejected: bookings.filter((b) => b.status === BookingStatus.REJECTED).length,
  };

  return (
    <Layout>
      <div className="trainer-bookings-page">
        <h1>My Bookings</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
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
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={filter === 'confirmed' ? 'active' : ''}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={filter === 'past' ? 'active' : ''}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
          <button
            className={filter === 'rejected' ? 'active' : ''}
            onClick={() => setFilter('rejected')}
          >
            Rejected
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
                    <h3>{getClientName(booking.clientId)}</h3>
                    <p className="client-email">{getClientEmail(booking.clientId)}</p>
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
                  {booking.fee && (
                    <div className="detail-item">
                      <strong>Fee:</strong>
                      <span className="fee-amount">
                        ${booking.fee}
                      </span>
                    </div>
                  )}
                  {booking.notes && (
                    <div className="notes-section">
                      <strong>Notes:</strong>
                      <p>{booking.notes}</p>
                    </div>
                  )}
                </div>

                {booking.status === BookingStatus.PENDING && (
                  <div className="booking-actions">
                    <button
                      onClick={() => handleConfirmBooking(booking.id)}
                      className="confirm-button"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => handleRejectBooking(booking.id)}
                      className="reject-button"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {booking.status === BookingStatus.CONFIRMED && (
                  <div className="booking-actions">
                    <button
                      onClick={() => handleCompleteBooking(booking.id)}
                      className="complete-button"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No {filter !== 'all' ? filter : ''} bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrainerBookings;
