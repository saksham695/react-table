import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { FitnessLevel } from '../../types/enums';
import Layout from '../../components/Layout/Layout';
import './ClientList.css';

const ClientList: React.FC = () => {
  const { trainer } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState<string>('');

  if (!trainer) return null;

  const allClients = trainer.clients
    .map((clientId) => storageService.getClientById(clientId))
    .filter(Boolean);

  const filteredClients = allClients.filter((client) => {
    if (!client) return false;
    const matchesSearch =
      client.profile.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.goals.some(goal => goal.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFitnessLevel =
      !selectedFitnessLevel || client.profile.fitnessLevel === selectedFitnessLevel;
    return matchesSearch && matchesFitnessLevel;
  });

  return (
    <Layout>
      <div className="client-list-page">
        <h1>My Clients</h1>
        <p className="page-subtitle">Manage your connected clients</p>

        <div className="client-list-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search clients by name, email, or goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <select
              value={selectedFitnessLevel}
              onChange={(e) => setSelectedFitnessLevel(e.target.value)}
              className="filter-select"
            >
              <option value="">All Fitness Levels</option>
              <option value={FitnessLevel.BEGINNER}>Beginner</option>
              <option value={FitnessLevel.INTERMEDIATE}>Intermediate</option>
              <option value={FitnessLevel.ADVANCED}>Advanced</option>
            </select>
          </div>
        </div>

        {filteredClients.length > 0 ? (
          <div className="clients-grid">
            {filteredClients.map((client) => (
              <Link
                key={client!.id}
                to={`/clients/${client!.id}`}
                className="client-card"
              >
                <div className="client-card-header">
                  <h3>{client!.profile.fullName || client!.email}</h3>
                </div>
                <div className="client-card-body">
                  {client!.profile.age && (
                    <p className="client-age">Age: {client!.profile.age}</p>
                  )}
                  <p className="client-level">
                    Fitness Level: <strong>{client!.profile.fitnessLevel}</strong>
                  </p>
                  {client!.goals.length > 0 ? (
                    <div className="client-goals">
                      <strong>Goals:</strong>
                      <div className="goals-list">
                        {client!.goals.map((goal) => (
                          <span key={goal} className="goal-tag">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="no-goals">No goals set</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You don't have any connected clients yet.</p>
            <p>Clients will appear here once they connect with you.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClientList;
