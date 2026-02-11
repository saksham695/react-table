import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/enums';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout, trainer, client } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const displayName =
    user.role === UserRole.TRAINER
      ? trainer?.profile.fullName || user.email
      : client?.profile.fullName || user.email;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/dashboard" className="header-logo">
          FitConnect
        </Link>
        <nav className="header-nav">
          {user.role === UserRole.TRAINER ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/clients">My Clients</Link>
              <Link to="/courses">My Courses</Link>
              <Link to="/availability">Availability</Link>
              <Link to="/my-bookings">Bookings</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/trainers">Find Trainers</Link>
              <Link to="/my-courses">My Courses</Link>
              <Link to="/goals">My Goals</Link>
              <Link to="/my-bookings">My Bookings</Link>
            </>
          )}
        </nav>
        <div className="header-user">
          <button
            className="header-user-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            {displayName}
            <span className="header-user-arrow">▼</span>
          </button>
          {showMenu && (
            <div className="header-dropdown">
              <Link to="/profile" onClick={() => setShowMenu(false)}>
                My Profile
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
