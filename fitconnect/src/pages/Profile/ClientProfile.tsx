import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { FitnessLevel, TrainingType } from '../../types/enums';
import { calculateBMI, getBMICategory } from '../../utils/calculations';
import Layout from '../../components/Layout/Layout';
import './ClientProfile.css';

const ClientProfile: React.FC = () => {
  const { client, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Basic Info
  const [fullName, setFullName] = useState(client?.profile.fullName || '');
  const [age, setAge] = useState(client?.profile.age?.toString() || '');
  const [phoneNumber, setPhoneNumber] = useState(client?.profile.phoneNumber || '');

  // Fitness Details
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(
    client?.profile.fitnessLevel || FitnessLevel.BEGINNER
  );
  const [goals, setGoals] = useState<string[]>(client?.goals || []);
  const [currentGoal, setCurrentGoal] = useState('');
  const [medicalConditions, setMedicalConditions] = useState(
    client?.profile.medicalConditions || ''
  );
  const [preferredTrainingType, setPreferredTrainingType] = useState<TrainingType[]>(
    client?.profile.preferredTrainingType || []
  );

  // Physical Details
  const [height, setHeight] = useState(
    client?.profile.physicalDetails?.height?.toString() || ''
  );
  const [weight, setWeight] = useState(
    client?.profile.physicalDetails?.weight?.toString() || ''
  );
  const [bmi, setBmi] = useState(client?.profile.physicalDetails?.bmi || 0);

  // Auto-calculate BMI
  useEffect(() => {
    if (height && weight) {
      const calculatedBMI = calculateBMI(parseFloat(weight), parseFloat(height));
      setBmi(calculatedBMI);
    }
  }, [height, weight]);

  if (!client) return null;

  const handleSave = () => {
    client.profile = {
      ...client.profile,
      fullName,
      age: age ? parseInt(age) : undefined,
      phoneNumber: phoneNumber || undefined,
      fitnessLevel,
      medicalConditions: medicalConditions || undefined,
      preferredTrainingType: preferredTrainingType.length > 0 ? preferredTrainingType : undefined,
      physicalDetails: height && weight ? {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi,
      } : undefined,
    };
    client.goals = goals;
    storageService.updateClient(client);
    updateUser(client);
    setIsEditing(false);
  };

  const addGoal = () => {
    if (currentGoal && !goals.includes(currentGoal)) {
      setGoals([...goals, currentGoal]);
      setCurrentGoal('');
    }
  };

  const removeGoal = (goal: string) => {
    setGoals(goals.filter((g) => g !== goal));
  };

  const toggleTrainingType = (type: TrainingType) => {
    if (preferredTrainingType.includes(type)) {
      setPreferredTrainingType(preferredTrainingType.filter((t) => t !== type));
    } else {
      setPreferredTrainingType([...preferredTrainingType, type]);
    }
  };

  return (
    <Layout>
      <div className="client-profile-page">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit Profile
            </button>
          ) : (
            <div className="profile-actions">
              <button onClick={() => setIsEditing(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSave} className="save-button">
                Save Changes
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="profile-view">
            {/* Basic Information */}
            <div className="profile-section">
              <h2>Basic Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Full Name:</strong>
                  <span>{fullName || 'Not set'}</span>
                </div>
                {client.profile.age && (
                  <div className="info-item">
                    <strong>Age:</strong>
                    <span>{client.profile.age}</span>
                  </div>
                )}
                {client.profile.phoneNumber && (
                  <div className="info-item">
                    <strong>Phone:</strong>
                    <span>{client.profile.phoneNumber}</span>
                  </div>
                )}
                <div className="info-item">
                  <strong>Email:</strong>
                  <span>{client.email}</span>
                </div>
              </div>
            </div>

            {/* Fitness Details */}
            <div className="profile-section">
              <h2>Fitness Details</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Fitness Level:</strong>
                  <span className="fitness-level-badge">{fitnessLevel}</span>
                </div>
                {client.profile.medicalConditions && (
                  <div className="info-item">
                    <strong>Medical Conditions:</strong>
                    <span>{client.profile.medicalConditions}</span>
                  </div>
                )}
              </div>
              {client.profile.preferredTrainingType && client.profile.preferredTrainingType.length > 0 && (
                <div className="training-types-section">
                  <strong>Preferred Training Types:</strong>
                  <div className="tags-container">
                    {client.profile.preferredTrainingType.map((type) => (
                      <span key={type} className="tag">
                        {type.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fitness Goals */}
            <div className="profile-section">
              <h2>Fitness Goals</h2>
              {goals.length > 0 ? (
                <div className="goals-container">
                  {goals.map((goal) => (
                    <div key={goal} className="goal-card">
                      {goal}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No goals set</p>
              )}
            </div>

            {/* Physical Details */}
            {client.profile.physicalDetails && (
              <div className="profile-section">
                <h2>Physical Details</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Height:</strong>
                    <span>{client.profile.physicalDetails.height} cm</span>
                  </div>
                  <div className="info-item">
                    <strong>Weight:</strong>
                    <span>{client.profile.physicalDetails.weight} kg</span>
                  </div>
                  <div className="info-item">
                    <strong>BMI:</strong>
                    <span>
                      {client.profile.physicalDetails.bmi} (
                      {getBMICategory(client.profile.physicalDetails.bmi || 0)})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="profile-edit">
            {/* Basic Information */}
            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1-555-0100"
                  />
                </div>
              </div>
            </div>

            {/* Fitness Details */}
            <div className="form-section">
              <h2>Fitness Details</h2>
              <div className="form-group">
                <label>Fitness Level *</label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as FitnessLevel)}
                  required
                >
                  <option value={FitnessLevel.BEGINNER}>Beginner</option>
                  <option value={FitnessLevel.INTERMEDIATE}>Intermediate</option>
                  <option value={FitnessLevel.ADVANCED}>Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Medical Conditions (if any)</label>
                <textarea
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  rows={3}
                  placeholder="Any medical conditions your trainer should know about..."
                />
              </div>
              <div className="form-group">
                <label>Preferred Training Types</label>
                <div className="training-type-selector">
                  {Object.values(TrainingType).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`type-button ${
                        preferredTrainingType.includes(type) ? 'active' : ''
                      }`}
                      onClick={() => toggleTrainingType(type)}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fitness Goals */}
            <div className="form-section">
              <h2>Fitness Goals</h2>
              <div className="goals-input">
                <input
                  type="text"
                  value={currentGoal}
                  onChange={(e) => setCurrentGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                  placeholder="Enter a fitness goal..."
                />
                <button type="button" onClick={addGoal}>
                  Add
                </button>
              </div>
              <div className="tags-container">
                {goals.map((goal) => (
                  <span key={goal} className="tag">
                    {goal}
                    <button
                      type="button"
                      onClick={() => removeGoal(goal)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Physical Details */}
            <div className="form-section">
              <h2>Physical Details (Optional)</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="0"
                    step="0.1"
                    placeholder="165"
                  />
                </div>
                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="0"
                    step="0.1"
                    placeholder="65"
                  />
                </div>
              </div>
              {height && weight && bmi > 0 && (
                <div className="bmi-display">
                  <strong>BMI: </strong>
                  <span className="bmi-value">{bmi}</span>
                  <span className="bmi-category">({getBMICategory(bmi)})</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClientProfile;
