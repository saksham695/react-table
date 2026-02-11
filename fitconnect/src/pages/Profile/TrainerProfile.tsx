import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { calculateBMI, getBMICategory } from '../../utils/calculations';
import Layout from '../../components/Layout/Layout';
import './TrainerProfile.css';

const TrainerProfile: React.FC = () => {
  const { trainer, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Basic Info
  const [fullName, setFullName] = useState(trainer?.profile.fullName || '');
  const [age, setAge] = useState(trainer?.profile.age?.toString() || '');
  const [phoneNumber, setPhoneNumber] = useState(trainer?.profile.phoneNumber || '');
  const [bio, setBio] = useState(trainer?.profile.bio || '');

  // Professional Details
  const [yearsOfExperience, setYearsOfExperience] = useState(
    trainer?.profile.yearsOfExperience || 0
  );
  const [areasOfExpertise, setAreasOfExpertise] = useState<string[]>(
    trainer?.profile.areasOfExpertise || []
  );
  const [totalClientsTrained, setTotalClientsTrained] = useState(
    trainer?.profile.totalClientsTrained?.toString() || ''
  );

  // Physical Details
  const [height, setHeight] = useState(
    trainer?.profile.physicalDetails?.height?.toString() || ''
  );
  const [weight, setWeight] = useState(
    trainer?.profile.physicalDetails?.weight?.toString() || ''
  );
  const [bmi, setBmi] = useState(trainer?.profile.physicalDetails?.bmi || 0);

  // Pricing
  const [perSession, setPerSession] = useState(
    trainer?.profile.pricing?.perSession?.toString() || ''
  );
  const [monthly, setMonthly] = useState(
    trainer?.profile.pricing?.monthly?.toString() || ''
  );

  // Auto-calculate BMI
  useEffect(() => {
    if (height && weight) {
      const calculatedBMI = calculateBMI(parseFloat(weight), parseFloat(height));
      setBmi(calculatedBMI);
    }
  }, [height, weight]);

  if (!trainer) return null;

  const handleSave = () => {
    trainer.profile = {
      ...trainer.profile,
      fullName,
      age: age ? parseInt(age) : undefined,
      phoneNumber: phoneNumber || undefined,
      bio,
      yearsOfExperience,
      areasOfExpertise,
      totalClientsTrained: totalClientsTrained ? parseInt(totalClientsTrained) : undefined,
      physicalDetails: height && weight ? {
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi,
      } : undefined,
      pricing: perSession || monthly ? {
        perSession: perSession ? parseFloat(perSession) : undefined,
        monthly: monthly ? parseFloat(monthly) : undefined,
        currency: 'USD',
      } : undefined,
    };
    storageService.updateTrainer(trainer);
    updateUser(trainer);
    setIsEditing(false);
  };

  const addExpertise = () => {
    const expertise = prompt('Enter area of expertise:');
    if (expertise && !areasOfExpertise.includes(expertise)) {
      setAreasOfExpertise([...areasOfExpertise, expertise]);
    }
  };

  const removeExpertise = (expertise: string) => {
    setAreasOfExpertise(areasOfExpertise.filter((e) => e !== expertise));
  };

  return (
    <Layout>
      <div className="trainer-profile-page">
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
                {trainer.profile.age && (
                  <div className="info-item">
                    <strong>Age:</strong>
                    <span>{trainer.profile.age}</span>
                  </div>
                )}
                {trainer.profile.phoneNumber && (
                  <div className="info-item">
                    <strong>Phone:</strong>
                    <span>{trainer.profile.phoneNumber}</span>
                  </div>
                )}
                <div className="info-item">
                  <strong>Email:</strong>
                  <span>{trainer.email}</span>
                </div>
              </div>
              {trainer.profile.bio && (
                <div className="bio-section">
                  <strong>About Me:</strong>
                  <p>{trainer.profile.bio}</p>
                </div>
              )}
            </div>

            {/* Professional Details */}
            <div className="profile-section">
              <h2>Professional Details</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Years of Experience:</strong>
                  <span>{yearsOfExperience}</span>
                </div>
                {trainer.profile.totalClientsTrained && (
                  <div className="info-item">
                    <strong>Total Clients Trained:</strong>
                    <span>{trainer.profile.totalClientsTrained}</span>
                  </div>
                )}
              </div>
              <div className="expertise-section">
                <strong>Areas of Expertise:</strong>
                <div className="tags-container">
                  {areasOfExpertise.map((exp) => (
                    <span key={exp} className="tag">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing */}
            {trainer.profile.pricing && (
              <div className="profile-section">
                <h2>Pricing</h2>
                <div className="pricing-grid">
                  {trainer.profile.pricing.perSession && (
                    <div className="pricing-card">
                      <div className="pricing-amount">
                        ${trainer.profile.pricing.perSession}
                      </div>
                      <div className="pricing-label">Per Session</div>
                    </div>
                  )}
                  {trainer.profile.pricing.monthly && (
                    <div className="pricing-card">
                      <div className="pricing-amount">
                        ${trainer.profile.pricing.monthly}
                      </div>
                      <div className="pricing-label">Monthly</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Physical Details */}
            {trainer.profile.physicalDetails && (
              <div className="profile-section">
                <h2>Physical Details</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Height:</strong>
                    <span>{trainer.profile.physicalDetails.height} cm</span>
                  </div>
                  <div className="info-item">
                    <strong>Weight:</strong>
                    <span>{trainer.profile.physicalDetails.weight} kg</span>
                  </div>
                  <div className="info-item">
                    <strong>BMI:</strong>
                    <span>
                      {trainer.profile.physicalDetails.bmi} (
                      {getBMICategory(trainer.profile.physicalDetails.bmi || 0)})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Certifications */}
            {trainer.profile.certifications.length > 0 && (
              <div className="profile-section">
                <h2>Certifications</h2>
                <div className="certifications-list">
                  {trainer.profile.certifications.map((cert) => (
                    <div key={cert.id} className="certification-item">
                      <strong>{cert.title}</strong>
                      {cert.issuedBy && <p>Issued by: {cert.issuedBy}</p>}
                      {cert.date && <span className="cert-date">{cert.date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {trainer.profile.achievements.length > 0 && (
              <div className="profile-section">
                <h2>Achievements</h2>
                <div className="achievements-list">
                  {trainer.profile.achievements.map((ach) => (
                    <div key={ach.id} className="achievement-item">
                      <strong>{ach.title}</strong>
                      {ach.description && <p>{ach.description}</p>}
                      {ach.date && <span className="achievement-date">{ach.date}</span>}
                    </div>
                  ))}
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
                    min="18"
                    max="100"
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
              <div className="form-group">
                <label>Bio / About Me</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell clients about yourself, your training philosophy, and experience..."
                />
              </div>
            </div>

            {/* Professional Details */}
            <div className="form-section">
              <h2>Professional Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Years of Experience *</label>
                  <input
                    type="number"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Clients Trained</label>
                  <input
                    type="number"
                    value={totalClientsTrained}
                    onChange={(e) => setTotalClientsTrained(e.target.value)}
                    min="0"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Areas of Expertise</label>
                <div className="tags-container">
                  {areasOfExpertise.map((exp) => (
                    <span key={exp} className="tag">
                      {exp}
                      <button
                        type="button"
                        onClick={() => removeExpertise(exp)}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button type="button" onClick={addExpertise} className="tag-add">
                    + Add Expertise
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section">
              <h2>Pricing (Optional)</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Per Session ($)</label>
                  <input
                    type="number"
                    value={perSession}
                    onChange={(e) => setPerSession(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="75.00"
                  />
                </div>
                <div className="form-group">
                  <label>Monthly ($)</label>
                  <input
                    type="number"
                    value={monthly}
                    onChange={(e) => setMonthly(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="250.00"
                  />
                </div>
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
                    placeholder="180"
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
                    placeholder="75"
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

export default TrainerProfile;
