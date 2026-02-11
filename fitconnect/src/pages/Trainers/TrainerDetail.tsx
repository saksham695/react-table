import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import Layout from '../../components/Layout/Layout';
import './TrainerDetail.css';

const TrainerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client } = useAuth();

  if (!id) {
    navigate('/trainers');
    return null;
  }

  const trainer = storageService.getTrainerById(id);
  const courses = storageService.getCoursesByTrainerId(id);

  if (!trainer) {
    return (
      <Layout>
        <div className="error-state">
          <p>Trainer not found</p>
          <Link to="/trainers">Back to Trainers</Link>
        </div>
      </Layout>
    );
  }

  const isConnected = client?.trainers.includes(trainer.id) || false;

  const handleConnect = () => {
    if (!client) return;
    storageService.createConnection(trainer.id, client.id);
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="trainer-detail">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="trainer-detail-header">
          <div className="trainer-info">
            <h1>{trainer.profile.fullName}</h1>
            <p className="trainer-experience">
              {trainer.profile.yearsOfExperience} years of experience
            </p>
            {isConnected && <span className="connected-badge">Connected</span>}
          </div>
          {client && (
            <div className="trainer-action-buttons">
              {!isConnected && (
                <button onClick={handleConnect} className="connect-button">
                  Connect with Trainer
                </button>
              )}
              {isConnected && (
                <button
                  onClick={() => navigate(`/book-session/${trainer.id}`)}
                  className="book-session-button"
                >
                  Book Session
                </button>
              )}
            </div>
          )}
        </div>

        <div className="trainer-detail-content">
          <div className="detail-section">
            <h2>About</h2>
            <p className="trainer-bio">{trainer.profile.bio || 'No bio available'}</p>
          </div>

          <div className="detail-section">
            <h2>Areas of Expertise</h2>
            <div className="expertise-list">
              {trainer.profile.areasOfExpertise.map((exp) => (
                <span key={exp} className="expertise-tag">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {trainer.profile.achievements.length > 0 && (
            <div className="detail-section">
              <h2>Achievements & Certifications</h2>
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

          <div className="detail-section">
            <h2>Courses</h2>
            {courses.length > 0 ? (
              <div className="courses-list">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="course-card"
                  >
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span className="course-difficulty">{course.difficulty}</span>
                      <span className="course-duration">{course.duration}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty-text">No courses available yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrainerDetail;
