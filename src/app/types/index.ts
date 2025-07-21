export interface Project {
  id: string;
  name: string;
}

export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  username: string;
  token: string;
}
