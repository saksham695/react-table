import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import Layout from '../../components/Layout/Layout';
import './TrainerList.css';

const TrainerList: React.FC = () => {
  const { client } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');

  if (!client) return null;

  const allTrainers = storageService.getTrainers();
  const allExpertise = Array.from(
    new Set(allTrainers.flatMap((t) => t.profile.areasOfExpertise))
  );

  const filteredTrainers = allTrainers.filter((trainer) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      trainer.profile.fullName.toLowerCase().includes(searchLower) ||
      trainer.profile.bio.toLowerCase().includes(searchLower) ||
      trainer.profile.areasOfExpertise.some(exp => exp.toLowerCase().includes(searchLower));
    const matchesExpertise =
      !selectedExpertise || trainer.profile.areasOfExpertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const isConnected = (trainerId: string) => client.trainers.includes(trainerId);

  return (
    <Layout>
      <div className="trainer-list-page">
        <h1>Find Trainers</h1>
        <p className="page-subtitle">Discover fitness professionals to help you reach your goals</p>

        <div className="trainer-list-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search trainers by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="filter-select"
            >
              <option value="">All Expertise</option>
              {allExpertise.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredTrainers.length > 0 ? (
          <div className="trainers-grid">
            {filteredTrainers.map((trainer) => (
              <div key={trainer.id} className="trainer-card">
                <div className="trainer-card-header">
                  <h3>{trainer.profile.fullName}</h3>
                  {isConnected(trainer.id) && (
                    <span className="connected-badge">Connected</span>
                  )}
                </div>
                <p className="trainer-experience">
                  {trainer.profile.yearsOfExperience} years of experience
                </p>
                <p className="trainer-bio">
                  {trainer.profile.bio || 'No bio available'}
                </p>
                <div className="trainer-expertise">
                  {trainer.profile.areasOfExpertise.map((exp) => (
                    <span key={exp} className="expertise-tag">
                      {exp}
                    </span>
                  ))}
                </div>
                <div className="trainer-card-actions">
                  <Link
                    to={`/trainers/${trainer.id}`}
                    className="view-profile-button"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No trainers found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrainerList;
