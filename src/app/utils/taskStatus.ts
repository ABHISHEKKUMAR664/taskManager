import { TaskStatus } from "../types";

export const TASK_STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    color: '#6B7280', // gray-500
    bgColor: '#F3F4F6', // gray-100
    icon: '📋'
  },
  inprogress: {
    label: 'In Progress',
    color: '#3B82F6', // blue-500
    bgColor: '#DBEAFE', // blue-100
    icon: '🔄'
  },
  done: {
    label: 'Done',
    color: '#10B981', // green-500
    bgColor: '#D1FAE5', // green-100
    icon: '✅'
  }
} as const;

export const getStatusConfig = (status: TaskStatus) => {
  return TASK_STATUS_CONFIG[status];
};

export const getStatusOptions = () => {
  return Object.entries(TASK_STATUS_CONFIG).map(([value, config]) => ({
    value: value as TaskStatus,
    label: config.label,
    icon: config.icon
  }));
};

export const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
  const statusFlow: Record<TaskStatus, TaskStatus> = {
    todo: 'inprogress',
    inprogress: 'done',
    done: 'todo'
  };
  return statusFlow[currentStatus];
};

export const isTaskCompleted = (status: TaskStatus): boolean => {
  return status === 'done';
};
