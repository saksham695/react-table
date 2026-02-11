import { User, Trainer, Client } from '../types/interfaces';
import { UserRole } from '../types/enums';
import { storageService } from './storageService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Auth Service - Handles authentication logic
 * In a real app, this would communicate with a backend API
 */
class AuthService {
  login(email: string, password: string): User | null {
    const user = storageService.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  signup(
    email: string,
    password: string,
    role: UserRole,
    profileData?: any
  ): User {
    const existingUser = storageService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };

    if (role === UserRole.TRAINER) {
      const trainer: Trainer = {
        ...newUser,
        role: UserRole.TRAINER,
        profile: {
          fullName: profileData?.fullName || '',
          bio: profileData?.bio || '',
          areasOfExpertise: profileData?.areasOfExpertise || [],
          yearsOfExperience: profileData?.yearsOfExperience || 0,
          achievements: [],
          certifications: [],
        },
        courses: [],
        clients: [],
      };
      storageService.createUser(trainer);
      return trainer;
    } else {
      const client: Client = {
        ...newUser,
        role: UserRole.CLIENT,
        profile: {
          fullName: profileData?.fullName || '',
          fitnessLevel: profileData?.fitnessLevel || 'BEGINNER',
        },
        trainers: [],
        goals: [],
        enrolledCourses: [],
      };
      storageService.createUser(client);
      return client;
    }
  }

  getCurrentUser(): User | null {
    const userId = localStorage.getItem('fitconnect_current_user_id');
    if (!userId) return null;
    return storageService.getUserById(userId) || null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem('fitconnect_current_user_id', user.id);
    } else {
      localStorage.removeItem('fitconnect_current_user_id');
    }
  }

  logout(): void {
    this.setCurrentUser(null);
  }
}

export const authService = new AuthService();
