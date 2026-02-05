/**
 * Mock API service to simulate backend calls
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  age: number;
  salary: number;
  department: string;
}

// Mock data generator
const generateMockUsers = (count: number): User[] => {
  const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Engineer', 'Architect', 'Lead'];
  const statuses: User['status'][] = ['Active', 'Inactive', 'Pending'];
  const departments = ['Engineering', 'Design', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
  
  const firstNames = [
    'John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank',
    'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Liam', 'Mia', 'Noah',
    'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tara', 'Uma', 'Victor',
    'Wendy', 'Xavier', 'Yara', 'Zack', 'Anna', 'Ben', 'Clara', 'David',
  ];
  
  const lastNames = [
    'Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson',
    'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
    'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
  ];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    
    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      age: 25 + (i % 35),
      salary: 50000 + (i * 1000) + (Math.floor(i / 10) * 5000),
      department: departments[i % departments.length],
    };
  });
};

// Simulated database
let mockDatabase: User[] = generateMockUsers(100);

/**
 * Simulates a delay like a real API call
 */
const simulateDelay = (ms: number = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock API: Fetch all users
 */
export const fetchUsers = async (): Promise<User[]> => {
  await simulateDelay(1500); // Simulate network delay
  return [...mockDatabase];
};

/**
 * Mock API: Fetch users with pagination
 */
export const fetchUsersPaginated = async (
  page: number = 1,
  pageSize: number = 20
): Promise<{ data: User[]; total: number }> => {
  await simulateDelay(1000);
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = mockDatabase.slice(startIndex, endIndex);
  
  return {
    data,
    total: mockDatabase.length,
  };
};

/**
 * Mock API: Search users
 */
export const searchUsers = async (query: string): Promise<User[]> => {
  await simulateDelay(800);
  
  if (!query) return [...mockDatabase];
  
  const lowerQuery = query.toLowerCase();
  return mockDatabase.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(lowerQuery)
    )
  );
};

/**
 * Mock API: Clear all data (for testing empty state)
 */
export const clearAllUsers = (): void => {
  mockDatabase = [];
};

/**
 * Mock API: Reset data
 */
export const resetUsers = (count: number = 100): void => {
  mockDatabase = generateMockUsers(count);
};

/**
 * Mock API: Add a user
 */
export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
  await simulateDelay(500);
  
  const newUser: User = {
    ...user,
    id: mockDatabase.length > 0 ? Math.max(...mockDatabase.map(u => u.id)) + 1 : 1,
  };
  
  mockDatabase.push(newUser);
  return newUser;
};

/**
 * Mock API: Delete a user
 */
export const deleteUser = async (id: number): Promise<void> => {
  await simulateDelay(500);
  mockDatabase = mockDatabase.filter((user) => user.id !== id);
};
