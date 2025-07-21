import { promises as fs } from 'fs';
import path from 'path';

// Type definitions for data structures
type UserData = Record<string, any>;
type ProjectData = Record<string, any[]>;
type TaskData = Record<string, any[]>;

// Data file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or is invalid, return default and create the file
    await writeJsonFile(filePath, defaultValue);
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// User operations
export async function readUsers(): Promise<UserData> {
  const data = await readJsonFile(USERS_FILE, {});
  
  // Migration: Convert array format to object format if needed
  if (Array.isArray(data)) {
    const migratedData: UserData = {};
    data.forEach((user: any) => {
      if (user.username) {
        migratedData[user.username] = user;
      }
    });
    await writeUsers(migratedData);
    return migratedData;
  }
  
  return data;
}

export async function writeUsers(users: UserData) {
  return writeJsonFile(USERS_FILE, users);
}

// Project operations
export async function readProjects(): Promise<ProjectData> {
  return readJsonFile(PROJECTS_FILE, {});
}

export async function writeProjects(projects: ProjectData) {
  return writeJsonFile(PROJECTS_FILE, projects);
}

// Task operations
export async function readTasks(): Promise<TaskData> {
  return readJsonFile(TASKS_FILE, {});
}

export async function writeTasks(tasks: TaskData) {
  return writeJsonFile(TASKS_FILE, tasks);
}

// Database-like operations for better organization
export class DataManager {
  // User methods
  static async getUser(username: string) {
    const users = await readUsers();
    return users[username] || null;
  }

  static async saveUser(username: string, userData: any) {
    const users = await readUsers();
    users[username] = userData;
    await writeUsers(users);
  }

  // Project methods
  static async getUserProjects(username: string) {
    const projects = await readProjects();
    return projects[username] || [];
  }

  static async saveUserProjects(username: string, userProjects: any[]) {
    const projects = await readProjects();
    projects[username] = userProjects;
    await writeProjects(projects);
  }

  static async addProject(username: string, project: any) {
    const projects = await this.getUserProjects(username);
    projects.push(project);
    await this.saveUserProjects(username, projects);
    return project;
  }

  static async updateProject(username: string, projectId: string, updates: any) {
    const projects = await this.getUserProjects(username);
    const index = projects.findIndex((p: any) => p.id === projectId);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      await this.saveUserProjects(username, projects);
      return projects[index];
    }
    return null;
  }

  static async deleteProject(username: string, projectId: string) {
    const projects = await this.getUserProjects(username);
    const filteredProjects = projects.filter((p: any) => p.id !== projectId);
    await this.saveUserProjects(username, filteredProjects);
    
    // Also delete all tasks for this project
    const tasks = await this.getUserTasks(username);
    const filteredTasks = tasks.filter((t: any) => t.projectId !== projectId);
    await this.saveUserTasks(username, filteredTasks);
  }

  // Task methods
  static async getUserTasks(username: string, projectId?: string) {
    const tasks = await readTasks();
    const userTasks = tasks[username] || [];
    
    if (projectId) {
      return userTasks.filter((task: any) => task.projectId === projectId);
    }
    
    return userTasks;
  }

  static async saveUserTasks(username: string, userTasks: any[]) {
    const tasks = await readTasks();
    tasks[username] = userTasks;
    await writeTasks(tasks);
  }

  static async addTask(username: string, task: any) {
    const tasks = await this.getUserTasks(username);
    
    // Ensure task has required fields with defaults
    const newTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'todo',
      completed: false,
      ...task,
    };
    
    tasks.push(newTask);
    await this.saveUserTasks(username, tasks);
    return newTask;
  }

  static async updateTask(username: string, taskId: string, updates: any) {
    const tasks = await this.getUserTasks(username);
    const index = tasks.findIndex((t: any) => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { 
        ...tasks[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      await this.saveUserTasks(username, tasks);
      return tasks[index];
    }
    return null;
  }

  static async deleteTask(username: string, taskId: string) {
    const tasks = await this.getUserTasks(username);
    const filteredTasks = tasks.filter((t: any) => t.id !== taskId);
    await this.saveUserTasks(username, filteredTasks);
  }

  // Migration utilities
  static async migrateTaskStatuses(username: string) {
    const tasks = await this.getUserTasks(username);
    let hasChanges = false;

    const updatedTasks = tasks.map((task: any) => {
      if (!task.status) {
        hasChanges = true;
        return {
          ...task,
          status: task.completed ? 'done' : 'todo',
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: task.updatedAt || new Date().toISOString(),
        };
      }
      return task;
    });

    if (hasChanges) {
      await this.saveUserTasks(username, updatedTasks);
    }

    return updatedTasks;
  }
}
