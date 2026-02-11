import { UserRole, FitnessLevel, CourseDifficulty, ConnectionStatus, DayOfWeek, BookingStatus, TrainingType } from './enums';

export interface User {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  role: UserRole;
  createdAt: string;
}

export interface Trainer extends User {
  role: UserRole.TRAINER;
  profile: TrainerProfile;
  courses: string[]; // Array of course IDs
  clients: string[]; // Array of client IDs
}

export interface Client extends User {
  role: UserRole.CLIENT;
  profile: ClientProfile;
  trainers: string[]; // Array of trainer IDs
  goals: string[];
  enrolledCourses: string[]; // Array of course IDs
}

export interface TrainerProfile {
  fullName: string;
  age?: number;
  phoneNumber?: string;
  bio: string;
  profilePhoto?: string;
  areasOfExpertise: string[];
  yearsOfExperience: number;
  achievements: Achievement[];
  certifications: Certification[];
  totalClientsTrained?: number;
  pricing?: Pricing;
  physicalDetails?: PhysicalDetails;
}

export interface Certification {
  id: string;
  title: string;
  issuedBy?: string;
  date?: string;
  certificateUrl?: string;
}

export interface Pricing {
  perSession?: number;
  monthly?: number;
  currency: string;
}

export interface PhysicalDetails {
  height?: number; // in cm
  weight?: number; // in kg
  bmi?: number; // auto-calculated
}

export interface ClientProfile {
  fullName: string;
  age?: number;
  phoneNumber?: string;
  profilePhoto?: string;
  fitnessLevel: FitnessLevel;
  physicalDetails?: PhysicalDetails;
  medicalConditions?: string;
  preferredTrainingType?: TrainingType[];
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
}

export interface Course {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  difficulty: CourseDifficulty;
  targetGoals: string[];
  duration: string; // e.g., "4 weeks"
  createdAt: string;
  enrolledClients: string[]; // Array of client IDs enrolled in this course
}

export interface Connection {
  id: string;
  trainerId: string;
  clientId: string;
  status: ConnectionStatus;
  createdAt: string;
}

export interface TimeSlot {
  startTime: string; // HH:MM format (e.g., "09:00")
  endTime: string; // HH:MM format (e.g., "10:00")
}

export interface Availability {
  id: string;
  trainerId: string;
  dayOfWeek: DayOfWeek;
  timeSlots: TimeSlot[];
  isRecurring: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  trainerId: string;
  clientId: string;
  date: string; // ISO date string
  timeSlot: TimeSlot;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
