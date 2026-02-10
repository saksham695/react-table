import { User, Trainer, Client, Course, Connection } from '../types/interfaces';
import { UserRole, ConnectionStatus, FitnessLevel } from '../types/enums';

/**
 * Storage Service - Manages localStorage operations
 * Acts as a mock database for the frontend-only application
 */
class StorageService {
  private storageKeys = {
    users: 'fitconnect_users',
    courses: 'fitconnect_courses',
    connections: 'fitconnect_connections',
  };

  // Initialize with mock data if storage is empty
  initializeMockData() {
    if (!this.getUsers().length) {
      this.seedMockData();
    }
  }

  private seedMockData() {
    const mockTrainers: Trainer[] = [
      {
        id: 'trainer-1',
        email: 'trainer1@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'John Smith',
          bio: 'Certified personal trainer with 10 years of experience. Specialized in strength training and weight loss.',
          areasOfExpertise: ['Strength Training', 'Weight Loss', 'Bodybuilding'],
          yearsOfExperience: 10,
          achievements: [
            { id: 'ach-1', title: 'NASM Certified Personal Trainer', date: '2014' },
            { id: 'ach-2', title: 'Bodybuilding Competition Winner 2019', date: '2019' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-2',
        email: 'trainer2@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Sarah Johnson',
          bio: 'Yoga instructor and mindfulness coach. Helping clients achieve balance through movement and meditation.',
          areasOfExpertise: ['Yoga', 'Meditation', 'Flexibility'],
          yearsOfExperience: 8,
          achievements: [
            { id: 'ach-3', title: 'RYT 500 Certified Yoga Instructor', date: '2016' },
            { id: 'ach-4', title: 'Mindfulness-Based Stress Reduction Certification', date: '2018' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-3',
        email: 'trainer3@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Mike Davis',
          bio: 'Nutrition coach and fitness expert. Focus on sustainable lifestyle changes.',
          areasOfExpertise: ['Nutrition', 'Weight Management', 'Endurance Training'],
          yearsOfExperience: 12,
          achievements: [
            { id: 'ach-5', title: 'Certified Nutrition Specialist', date: '2012' },
            { id: 'ach-6', title: 'Marathon Coach Certification', date: '2015' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-4',
        email: 'trainer4@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Emma Wilson',
          bio: 'CrossFit coach and functional movement specialist. Passionate about helping people build functional strength.',
          areasOfExpertise: ['CrossFit', 'Functional Training', 'HIIT'],
          yearsOfExperience: 7,
          achievements: [
            { id: 'ach-7', title: 'CrossFit Level 2 Trainer', date: '2017' },
            { id: 'ach-8', title: 'Functional Movement Screen Certified', date: '2019' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-5',
        email: 'trainer5@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'David Martinez',
          bio: 'Professional boxing coach and martial arts instructor. Training athletes and fitness enthusiasts.',
          areasOfExpertise: ['Boxing', 'Martial Arts', 'Cardio Training'],
          yearsOfExperience: 15,
          achievements: [
            { id: 'ach-9', title: 'USA Boxing Certified Coach', date: '2009' },
            { id: 'ach-10', title: 'Black Belt in Brazilian Jiu-Jitsu', date: '2015' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-6',
        email: 'trainer6@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Lisa Chen',
          bio: 'Pilates instructor and rehabilitation specialist. Focus on core strength and injury prevention.',
          areasOfExpertise: ['Pilates', 'Rehabilitation', 'Core Strength'],
          yearsOfExperience: 9,
          achievements: [
            { id: 'ach-11', title: 'Certified Pilates Instructor', date: '2015' },
            { id: 'ach-12', title: 'Physical Therapy Assistant License', date: '2017' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-7',
        email: 'trainer7@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Robert Taylor',
          bio: 'Swimming coach and triathlon trainer. Helping athletes achieve peak performance.',
          areasOfExpertise: ['Swimming', 'Triathlon', 'Endurance'],
          yearsOfExperience: 11,
          achievements: [
            { id: 'ach-13', title: 'USA Swimming Certified Coach', date: '2013' },
            { id: 'ach-14', title: 'Ironman Certified Coach', date: '2018' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-8',
        email: 'trainer8@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Jennifer Lee',
          bio: 'Dance fitness instructor and Zumba specialist. Making workouts fun and engaging.',
          areasOfExpertise: ['Dance Fitness', 'Zumba', 'Cardio'],
          yearsOfExperience: 6,
          achievements: [
            { id: 'ach-15', title: 'Zumba Instructor License', date: '2018' },
            { id: 'ach-16', title: 'Dance Fitness Certification', date: '2020' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-9',
        email: 'trainer9@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'James Anderson',
          bio: 'Powerlifting coach and strength specialist. Training competitive athletes and strength enthusiasts.',
          areasOfExpertise: ['Powerlifting', 'Strength Training', 'Competition Prep'],
          yearsOfExperience: 13,
          achievements: [
            { id: 'ach-17', title: 'USAPL Certified Coach', date: '2011' },
            { id: 'ach-18', title: 'Powerlifting Competition Judge', date: '2016' },
          ],
        },
        courses: [],
        clients: [],
      },
      {
        id: 'trainer-10',
        email: 'trainer10@example.com',
        password: 'password',
        role: UserRole.TRAINER,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Maria Garcia',
          bio: 'Senior fitness specialist and mobility coach. Helping older adults stay active and healthy.',
          areasOfExpertise: ['Senior Fitness', 'Mobility', 'Balance Training'],
          yearsOfExperience: 14,
          achievements: [
            { id: 'ach-19', title: 'Senior Fitness Specialist Certification', date: '2010' },
            { id: 'ach-20', title: 'Fall Prevention Specialist', date: '2018' },
          ],
        },
        courses: [],
        clients: [],
      },
    ];

    const mockClients: Client[] = [
      {
        id: 'client-1',
        email: 'client1@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Alice Brown',
          age: 28,
          fitnessLevel: FitnessLevel.BEGINNER,
        },
        trainers: [],
        goals: ['Lose weight', 'Build strength'],
      },
      {
        id: 'client-2',
        email: 'client2@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Bob Thompson',
          age: 35,
          fitnessLevel: FitnessLevel.INTERMEDIATE,
        },
        trainers: [],
        goals: ['Improve flexibility', 'Reduce stress'],
      },
      {
        id: 'client-3',
        email: 'client3@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Carol White',
          age: 42,
          fitnessLevel: FitnessLevel.ADVANCED,
        },
        trainers: [],
        goals: ['Marathon training', 'Endurance improvement'],
      },
      {
        id: 'client-4',
        email: 'client4@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Daniel Kim',
          age: 25,
          fitnessLevel: FitnessLevel.BEGINNER,
        },
        trainers: [],
        goals: ['Learn boxing basics', 'Cardio fitness'],
      },
      {
        id: 'client-5',
        email: 'client5@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Eva Rodriguez',
          age: 30,
          fitnessLevel: FitnessLevel.INTERMEDIATE,
        },
        trainers: [],
        goals: ['Core strength', 'Posture improvement'],
      },
      {
        id: 'client-6',
        email: 'client6@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Frank Miller',
          age: 45,
          fitnessLevel: FitnessLevel.BEGINNER,
        },
        trainers: [],
        goals: ['Weight loss', 'Better nutrition'],
      },
      {
        id: 'client-7',
        email: 'client7@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Grace Park',
          age: 22,
          fitnessLevel: FitnessLevel.ADVANCED,
        },
        trainers: [],
        goals: ['Competition prep', 'Strength gains'],
      },
      {
        id: 'client-8',
        email: 'client8@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Henry Davis',
          age: 38,
          fitnessLevel: FitnessLevel.INTERMEDIATE,
        },
        trainers: [],
        goals: ['Swimming technique', 'Triathlon training'],
      },
      {
        id: 'client-9',
        email: 'client9@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Isabella Martinez',
          age: 27,
          fitnessLevel: FitnessLevel.BEGINNER,
        },
        trainers: [],
        goals: ['Fun workouts', 'Stay active'],
      },
      {
        id: 'client-10',
        email: 'client10@example.com',
        password: 'password',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Jack Wilson',
          age: 50,
          fitnessLevel: FitnessLevel.BEGINNER,
        },
        trainers: [],
        goals: ['Mobility improvement', 'Balance training'],
      },
    ];

    const allUsers = [...mockTrainers, ...mockClients];
    localStorage.setItem(this.storageKeys.users, JSON.stringify(allUsers));
    localStorage.setItem(this.storageKeys.courses, JSON.stringify([]));
    
    // Create mock connections between clients and trainers
    const connections: Connection[] = [];
    let connectionCounter = 1;
    
    const createConnection = (trainerId: string, clientId: string) => {
      const connection: Connection = {
        id: `conn-${connectionCounter++}`,
        trainerId,
        clientId,
        status: ConnectionStatus.CONNECTED,
        createdAt: new Date().toISOString(),
      };
      connections.push(connection);
      
      // Update trainer's clients array
      const trainer = mockTrainers.find(t => t.id === trainerId);
      if (trainer && !trainer.clients.includes(clientId)) {
        trainer.clients.push(clientId);
      }

      // Update client's trainers array
      const client = mockClients.find(c => c.id === clientId);
      if (client && !client.trainers.includes(trainerId)) {
        client.trainers.push(trainerId);
      }
    };
    
    // Client 1 connected to Trainer 1 and Trainer 3
    createConnection('trainer-1', 'client-1');
    createConnection('trainer-3', 'client-1');
    
    // Client 2 connected to Trainer 2
    createConnection('trainer-2', 'client-2');
    
    // Client 3 connected to Trainer 3 and Trainer 7
    createConnection('trainer-3', 'client-3');
    createConnection('trainer-7', 'client-3');
    
    // Client 4 connected to Trainer 5
    createConnection('trainer-5', 'client-4');
    
    // Client 5 connected to Trainer 6
    createConnection('trainer-6', 'client-5');
    
    // Client 6 connected to Trainer 1 and Trainer 3
    createConnection('trainer-1', 'client-6');
    createConnection('trainer-3', 'client-6');
    
    // Client 7 connected to Trainer 9
    createConnection('trainer-9', 'client-7');
    
    // Client 8 connected to Trainer 7
    createConnection('trainer-7', 'client-8');
    
    // Client 9 connected to Trainer 8
    createConnection('trainer-8', 'client-9');
    
    // Client 10 connected to Trainer 10
    createConnection('trainer-10', 'client-10');
    
    // Save updated users with connections
    const updatedUsers = [...mockTrainers, ...mockClients];
    localStorage.setItem(this.storageKeys.users, JSON.stringify(updatedUsers));
    localStorage.setItem(this.storageKeys.connections, JSON.stringify(connections));
  }

  // User operations
  getUsers(): User[] {
    const data = localStorage.getItem(this.storageKeys.users);
    return data ? JSON.parse(data) : [];
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email === email);
  }

  createUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.storageKeys.users, JSON.stringify(users));
  }

  updateUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(this.storageKeys.users, JSON.stringify(users));
    }
  }

  // Trainer operations
  getTrainers(): Trainer[] {
    return this.getUsers().filter((u) => u.role === UserRole.TRAINER) as Trainer[];
  }

  getTrainerById(id: string): Trainer | undefined {
    const user = this.getUserById(id);
    return user && user.role === UserRole.TRAINER ? (user as Trainer) : undefined;
  }

  updateTrainer(trainer: Trainer): void {
    this.updateUser(trainer);
  }

  // Client operations
  getClients(): Client[] {
    return this.getUsers().filter((u) => u.role === UserRole.CLIENT) as Client[];
  }

  getClientById(id: string): Client | undefined {
    const user = this.getUserById(id);
    return user && user.role === UserRole.CLIENT ? (user as Client) : undefined;
  }

  updateClient(client: Client): void {
    this.updateUser(client);
  }

  // Course operations
  getCourses(): Course[] {
    const data = localStorage.getItem(this.storageKeys.courses);
    return data ? JSON.parse(data) : [];
  }

  getCoursesByTrainerId(trainerId: string): Course[] {
    return this.getCourses().filter((c) => c.trainerId === trainerId);
  }

  createCourse(course: Course): void {
    const courses = this.getCourses();
    courses.push(course);
    localStorage.setItem(this.storageKeys.courses, JSON.stringify(courses));

    // Update trainer's courses array
    const trainer = this.getTrainerById(course.trainerId);
    if (trainer) {
      trainer.courses.push(course.id);
      this.updateTrainer(trainer);
    }
  }

  getCourseById(id: string): Course | undefined {
    return this.getCourses().find((c) => c.id === id);
  }

  // Connection operations
  getConnections(): Connection[] {
    const data = localStorage.getItem(this.storageKeys.connections);
    return data ? JSON.parse(data) : [];
  }

  getConnectionsByTrainerId(trainerId: string): Connection[] {
    return this.getConnections().filter((c) => c.trainerId === trainerId);
  }

  getConnectionsByClientId(clientId: string): Connection[] {
    return this.getConnections().filter((c) => c.clientId === clientId);
  }

  createConnection(trainerId: string, clientId: string): Connection {
    const connections = this.getConnections();
    const connection: Connection = {
      id: `conn-${Date.now()}`,
      trainerId,
      clientId,
      status: ConnectionStatus.CONNECTED,
      createdAt: new Date().toISOString(),
    };
    connections.push(connection);
    localStorage.setItem(this.storageKeys.connections, JSON.stringify(connections));

    // Update trainer's clients array
    const trainer = this.getTrainerById(trainerId);
    if (trainer && !trainer.clients.includes(clientId)) {
      trainer.clients.push(clientId);
      this.updateTrainer(trainer);
    }

    // Update client's trainers array
    const client = this.getClientById(clientId);
    if (client && !client.trainers.includes(trainerId)) {
      client.trainers.push(trainerId);
      this.updateClient(client);
    }

    return connection;
  }

  getConnection(trainerId: string, clientId: string): Connection | undefined {
    return this.getConnections().find(
      (c) => c.trainerId === trainerId && c.clientId === clientId
    );
  }
}

export const storageService = new StorageService();
storageService.initializeMockData();
