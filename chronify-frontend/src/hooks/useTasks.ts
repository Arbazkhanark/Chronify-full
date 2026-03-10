// // src/hooks/useTasks.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api';

// // ============= TYPES =============

// export interface Task {
//   id: string;
//   title: string;
//   subject: string;
//   note?: string;
//   startTime: string;
//   endTime: string;
//   duration: number;
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   color: string;
//   day: string;
//   type: 'TASK' | 'FIXED' | 'BREAK' | 'COMMUTE' | 'FREE' | 'CLASS' | 'STUDY' | 'HEALTH' | 'PROJECT' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP';
//   category?: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
//   status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
//   isFreePeriod?: boolean;
//   goalId?: string;
//   milestoneId?: string;
//   fixedTimeId?: string;
//   isSleepTime?: boolean;
//   sleepScheduleId?: string;
//   completedAt?: string;
//   createdAt: string;
//   updatedAt: string;
//   userId: string;
// }

// export interface TaskStats {
//   totalTasks: number;
//   completedTasks: number;
//   pendingTasks: number;
//   ongoingTasks: number;
//   totalHours: number;
//   completedHours: number;
//   pendingHours: number;
//   averageTaskDuration: number;
//   mostProductiveDay: string;
//   priorityDistribution: Record<string, number>;
//   categoryDistribution: Record<string, number>;
//   dailyProgress: Record<string, number>;
// }

// export interface DragDropPayload {
//   taskId: string;
//   newDay: string;
//   newStartTime: string;
//   newEndTime: string;
//   newDuration: number;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= TASKS SERVICE =============

// class TasksServiceClass {
//   private static instance: TasksServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
//     }
//   }

//   static getInstance(): TasksServiceClass {
//     if (!TasksServiceClass.instance) {
//       TasksServiceClass.instance = new TasksServiceClass();
//     }
//     return TasksServiceClass.instance;
//   }

//   private getAuthHeaders(): HeadersInit {
//     this.accessToken = AuthService.getAccessToken();
    
//     return {
//       'Content-Type': 'application/json',
//       ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
//     };
//   }

//   private async handleRequest<T>(
//     url: string,
//     options: RequestInit = {}
//   ): Promise<ApiResponse<T>> {
//     const headers = this.getAuthHeaders();
    
//     console.log(`🌐 Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`);

//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         ...options,
//         headers: {
//           ...headers,
//           ...options.headers,
//         },
//         credentials: 'omit',
//         mode: 'cors',
//       });

//       const contentType = response.headers.get('content-type');
//       if (!contentType?.includes('application/json')) {
//         const text = await response.text();
//         console.log('Non-JSON response:', text);
//         throw new Error('Server returned non-JSON response');
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         if (response.status === 401) {
//           toast.error('Authentication Failed', {
//             description: 'Please log in again',
//             duration: 5000,
//           });
//         } else if (response.status === 403) {
//           toast.error('Access Denied', {
//             description: 'You don\'t have permission to perform this action',
//             duration: 5000,
//           });
//         } else if (response.status === 404) {
//           toast.error('Resource Not Found', {
//             description: 'The requested resource was not found',
//             duration: 4000,
//           });
//         } else if (response.status >= 500) {
//           toast.error('Server Error', {
//             description: 'Please try again later',
//             duration: 5000,
//           });
//         }

//         throw {
//           success: false,
//           message: data.message || `HTTP error ${response.status}`,
//           status: response.status,
//           data: data,
//         };
//       }

//       return data;
//     } catch (error: any) {
//       console.log('❌ API request failed:', {
//         url,
//         method: options.method,
//         error: error.message || error,
//       });

//       if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
//         toast.error('Network Error', {
//           description: 'Cannot connect to the server. Please check if the server is running.',
//           duration: 6000,
//           action: {
//             label: 'Retry',
//             onClick: () => window.location.reload(),
//           },
//         });
//       }

//       throw error;
//     }
//   }

//   // ============= TASK APIs =============

//   async createTask(taskData: {
//     title: string;
//     subject: string;
//     note?: string;
//     startTime: string;
//     endTime?: string;
//     duration: number;
//     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//     color?: string;
//     day: string;
//     type?: string;
//     category?: string;
//     goalId?: string;
//     milestoneId?: string;
//     fixedTimeId?: string;
//   }): Promise<Task | null> {
//     try {
//       if (!taskData.title?.trim()) {
//         throw new Error('Task title is required');
//       }

//       if (!taskData.startTime) {
//         throw new Error('Start time is required');
//       }

//       // Calculate end time if not provided
//       let endTime = taskData.endTime;
//       if (!endTime) {
//         const [hours, minutes] = taskData.startTime.split(':').map(Number);
//         const totalMinutes = hours * 60 + minutes + taskData.duration;
//         const endHours = Math.floor(totalMinutes / 60);
//         const endMinutes = totalMinutes % 60;
//         endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
//       }

//       const payload = {
//         title: taskData.title.trim(),
//         subject: taskData.subject || 'General',
//         note: taskData.note || '',
//         startTime: taskData.startTime,
//         endTime: endTime,
//         duration: taskData.duration,
//         priority: taskData.priority,
//         color: taskData.color || '#3B82F6',
//         day: taskData.day.toUpperCase(),
//         type: (taskData.type || 'TASK').toUpperCase(),
//         category: taskData.category || 'ACADEMIC',
//         ...(taskData.goalId && { goalId: taskData.goalId }),
//         ...(taskData.milestoneId && { milestoneId: taskData.milestoneId }),
//         ...(taskData.fixedTimeId && { fixedTimeId: taskData.fixedTimeId }),
//       };

//       console.log('📤 Creating task with payload:', payload);

//       const response = await this.handleRequest<Task>('/tasks', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✅ Task Created!', {
//           description: `"${response.data.title}" has been added to your schedule.`,
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to create task');
//     } catch (error: any) {
//       console.log('Create task error:', error);
      
//       toast.error('Failed to Create Task', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async bulkCreateTasks(tasks: Array<{
//     title: string;
//     subject: string;
//     startTime: string;
//     endTime: string;
//     duration: number;
//     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//     day: string;
//     type?: string;
//   }>): Promise<Task[] | null> {
//     try {
//       if (!tasks.length) {
//         throw new Error('No tasks to create');
//       }

//       const payload = tasks.map(task => ({
//         title: task.title.trim(),
//         subject: task.subject || 'General',
//         startTime: task.startTime,
//         endTime: task.endTime,
//         duration: task.duration,
//         priority: task.priority,
//         color: '#3B82F6',
//         day: task.day.toUpperCase(),
//         type: (task.type || 'TASK').toUpperCase(),
//       }));

//       const response = await this.handleRequest<Task[]>('/tasks/bulk', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success(`✅ Created ${response.data.length} tasks!`, {
//           description: 'Tasks have been added to your schedule.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to create tasks');
//     } catch (error: any) {
//       console.log('Bulk create tasks error:', error);
      
//       toast.error('Failed to Create Tasks', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getTasks(filters?: { 
//     status?: string; 
//     priority?: string; 
//     day?: string;
//     goalId?: string;
//   }): Promise<Task[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters?.status) {
//         queryParams.append('status', filters.status);
//       }
//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority);
//       }
//       if (filters?.day) {
//         queryParams.append('day', filters.day);
//       }
//       if (filters?.goalId) {
//         queryParams.append('goalId', filters.goalId);
//       }
      
//       const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
//       const response = await this.handleRequest<Task[]>(url, { method: 'GET' });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching tasks:', error);
//       return [];
//     }
//   }

//   async getTaskById(taskId: string): Promise<Task | null> {
//     try {
//       if (!taskId) throw new Error('Task ID is required');
      
//       const response = await this.handleRequest<Task>(`/tasks/${taskId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching task:', error);
//       return null;
//     }
//   }

//   async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
//     try {
//       if (!taskId) throw new Error('Task ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = [
//         'title', 'subject', 'note', 'startTime', 'endTime', 'duration',
//         'priority', 'color', 'day', 'type', 'status', 'goalId', 'milestoneId'
//       ];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof Task] !== undefined) {
//           if (key === 'day' && updates[key]) {
//             payload[key] = (updates[key] as string).toUpperCase();
//           } else {
//             payload[key] = updates[key as keyof Task];
//           }
//         }
//       });

//       const response = await this.handleRequest<Task>(`/tasks/${taskId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✨ Task Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update task error:', error);
      
//       toast.error('Failed to Update Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteTask(taskId: string): Promise<boolean> {
//     try {
//       if (!taskId) throw new Error('Task ID is required');

//       const response = await this.handleRequest<any>(`/tasks/${taskId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Task Deleted', {
//           description: 'The task has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete task error:', error);
      
//       toast.error('Failed to Delete Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getTasksByDay(day: string): Promise<Task[]> {
//     try {
//       const response = await this.handleRequest<Task[]>(`/tasks/day/${day.toUpperCase()}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching tasks by day:', error);
//       return [];
//     }
//   }

//   async getTasksByGoal(goalId: string): Promise<Task[]> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<Task[]>(`/tasks/goal/${goalId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching tasks by goal:', error);
//       return [];
//     }
//   }

//   async markTaskAsComplete(taskId: string, completedAt?: string): Promise<Task | null> {
//     try {
//       if (!taskId) throw new Error('Task ID is required');

//       const payload = {
//         completedAt: completedAt || new Date().toISOString(),
//       };

//       const response = await this.handleRequest<Task>(`/tasks/${taskId}/complete`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✅ Task Completed!', {
//           description: `Great job! Task marked as complete.`,
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Mark task complete error:', error);
      
//       toast.error('Failed to Mark Task Complete', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async dragDropTask(payload: DragDropPayload): Promise<Task | null> {
//     try {
//       const response = await this.handleRequest<Task>('/tasks/drag-drop', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('🔄 Task Rescheduled', {
//           description: 'Task has been moved to new time slot.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Drag drop error:', error);
      
//       toast.error('Failed to Move Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async getTaskStats(): Promise<TaskStats | null> {
//     try {
//       const response = await this.handleRequest<TaskStats>('/tasks/stats', {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching task stats:', error);
//       return null;
//     }
//   }
// }

// export const TasksService = TasksServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useTasks() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<TaskStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchTasks = useCallback(async (filters?: { 
//     status?: string; 
//     priority?: string; 
//     day?: string;
//     goalId?: string;
//   }) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching tasks with filters:', filters);
      
//       const [fetchedTasks, fetchedStats] = await Promise.all([
//         TasksService.getTasks(filters),
//         TasksService.getTaskStats()
//       ]);
      
//       console.log('📦 Fetched tasks:', fetchedTasks);
//       setTasks(fetchedTasks || []);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedTasks?.length || 0} tasks`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch tasks:', err);
//       setError(err.message || 'Failed to fetch tasks');
//       setTasks([]);
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchTasks();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchTasks]);

//   const createTask = useCallback(async (taskData: {
//     title: string;
//     subject: string;
//     note?: string;
//     startTime: string;
//     duration: number;
//     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//     day: string;
//     type?: string;
//     goalId?: string;
//     milestoneId?: string;
//     fixedTimeId?: string;
//   }) => {
//     try {
//       const newTask = await TasksService.createTask(taskData);
//       if (newTask) {
//         setTasks(prev => [newTask, ...prev]);
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return newTask;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const bulkCreateTasks = useCallback(async (tasks: Array<{
//     title: string;
//     subject: string;
//     startTime: string;
//     endTime: string;
//     duration: number;
//     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//     day: string;
//     type?: string;
//   }>) => {
//     try {
//       const newTasks = await TasksService.bulkCreateTasks(tasks);
//       if (newTasks) {
//         setTasks(prev => [...newTasks, ...prev]);
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return newTasks;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
//     try {
//       const updatedTask = await TasksService.updateTask(id, updates);
//       if (updatedTask) {
//         setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return updatedTask;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteTask = useCallback(async (id: string) => {
//     try {
//       const success = await TasksService.deleteTask(id);
//       if (success) {
//         setTasks(prev => prev.filter(t => t.id !== id));
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const markTaskAsComplete = useCallback(async (id: string) => {
//     try {
//       const completedTask = await TasksService.markTaskAsComplete(id);
//       if (completedTask) {
//         setTasks(prev => prev.map(t => t.id === id ? completedTask : t));
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return completedTask;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const dragDropTask = useCallback(async (payload: DragDropPayload) => {
//     try {
//       const updatedTask = await TasksService.dragDropTask(payload);
//       if (updatedTask) {
//         setTasks(prev => prev.map(t => t.id === payload.taskId ? updatedTask : t));
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return updatedTask;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const getTasksByDay = useCallback(async (day: string) => {
//     try {
//       return await TasksService.getTasksByDay(day);
//     } catch (error) {
//       console.log('Error getting tasks by day:', error);
//       return [];
//     }
//   }, []);

//   const getTasksByGoal = useCallback(async (goalId: string) => {
//     try {
//       return await TasksService.getTasksByGoal(goalId);
//     } catch (error) {
//       console.log('Error getting tasks by goal:', error);
//       return [];
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   return {
//     // State
//     tasks,
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // Task CRUD
//     fetchTasks,
//     createTask,
//     bulkCreateTasks,
//     updateTask,
//     deleteTask,
    
//     // Task operations
//     markTaskAsComplete,
//     dragDropTask,
//     getTasksByDay,
//     getTasksByGoal,
    
//     // Utility
//     refresh,
//   };
// }




























// // src/hooks/useTasks.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api';

// // ============= TYPES =============

// export interface Task {
//   id: string;
//   title: string;
//   subject: string;
//   note?: string;
//   startTime: string;
//   endTime: string;
//   duration: number;
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   color: string;
//   day: string;
//   type: 'TASK' | 'FIXED' | 'BREAK' | 'COMMUTE' | 'FREE' | 'CLASS' | 'STUDY' | 'HEALTH' | 'PROJECT' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP';
//   category?: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
//   status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
//   isFreePeriod?: boolean;
//   goalId?: string;
//   milestoneId?: string;
//   fixedTimeId?: string;
//   isSleepTime?: boolean;
//   sleepScheduleId?: string;
//   completedAt?: string;
//   createdAt: string;
//   updatedAt: string;
//   userId: string;
// }

// export interface TaskStats {
//   totalTasks: number;
//   completedTasks: number;
//   pendingTasks: number;
//   ongoingTasks: number;
//   totalHours: number;
//   completedHours: number;
//   pendingHours: number;
//   averageTaskDuration: number;
//   mostProductiveDay: string;
//   priorityDistribution: Record<string, number>;
//   categoryDistribution: Record<string, number>;
//   dailyProgress: Record<string, number>;
// }

// export interface DragDropPayload {
//   taskId: string;
//   newDay: string;
//   newStartTime: string;
//   newEndTime: string;
//   newDuration: number;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= TASKS SERVICE =============

// class TasksServiceClass {
//   private static instance: TasksServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
//     }
//   }

//   static getInstance(): TasksServiceClass {
//     if (!TasksServiceClass.instance) {
//       TasksServiceClass.instance = new TasksServiceClass();
//     }
//     return TasksServiceClass.instance;
//   }

//   private getAuthHeaders(): HeadersInit {
//     this.accessToken = AuthService.getAccessToken();
    
//     return {
//       'Content-Type': 'application/json',
//       ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
//     };
//   }

//   private async handleRequest<T>(
//     url: string,
//     options: RequestInit = {}
//   ): Promise<ApiResponse<T>> {
//     const headers = this.getAuthHeaders();
    
//     console.log(`🌐 Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`);

//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         ...options,
//         headers: {
//           ...headers,
//           ...options.headers,
//         },
//         credentials: 'omit',
//         mode: 'cors',
//       });

//       const contentType = response.headers.get('content-type');
//       if (!contentType?.includes('application/json')) {
//         const text = await response.text();
//         console.log('Non-JSON response:', text);
//         throw new Error('Server returned non-JSON response');
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         if (response.status === 401) {
//           toast.error('Authentication Failed', {
//             description: 'Please log in again',
//             duration: 5000,
//           });
//         } else if (response.status === 403) {
//           toast.error('Access Denied', {
//             description: 'You don\'t have permission to perform this action',
//             duration: 5000,
//           });
//         } else if (response.status === 404) {
//           toast.error('Resource Not Found', {
//             description: 'The requested resource was not found',
//             duration: 4000,
//           });
//         } else if (response.status >= 500) {
//           toast.error('Server Error', {
//             description: 'Please try again later',
//             duration: 5000,
//           });
//         }

//         throw {
//           success: false,
//           message: data.message || `HTTP error ${response.status}`,
//           status: response.status,
//           data: data,
//         };
//       }

//       return data;
//     } catch (error: any) {
//       console.log('❌ API request failed:', {
//         url,
//         method: options.method,
//         error: error.message || error,
//       });

//       if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
//         toast.error('Network Error', {
//           description: 'Cannot connect to the server. Please check if the server is running.',
//           duration: 6000,
//           action: {
//             label: 'Retry',
//             onClick: () => window.location.reload(),
//           },
//         });
//       }

//       throw error;
//     }
//   }

//   // ============= TASK APIs =============

//   async createTask(taskData: {
//     title: string;
//     subject: string;
//     note?: string;
//     startTime: string;
//     endTime?: string;
//     duration: number;
//     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//     color?: string;
//     day: string;
//     type?: string;
//     category?: string;
//     goalId?: string;
//     milestoneId?: string;
//     fixedTimeId?: string;
//   }): Promise<Task | null> {
//     try {
//       if (!taskData.title?.trim()) {
//         throw new Error('Task title is required');
//       }

//       if (!taskData.startTime) {
//         throw new Error('Start time is required');
//       }

//       // Calculate end time if not provided
//       let endTime = taskData.endTime;
//       if (!endTime) {
//         const [hours, minutes] = taskData.startTime.split(':').map(Number);
//         const totalMinutes = hours * 60 + minutes + taskData.duration;
//         const endHours = Math.floor(totalMinutes / 60);
//         const endMinutes = totalMinutes % 60;
//         endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
//       }

//       const payload = {
//         title: taskData.title.trim(),
//         subject: taskData.subject || 'General',
//         note: taskData.note || '',
//         startTime: taskData.startTime,
//         endTime: endTime,
//         duration: taskData.duration,
//         priority: taskData.priority,
//         color: taskData.color || '#3B82F6',
//         day: taskData.day.toUpperCase(),
//         type: (taskData.type || 'TASK').toUpperCase(),
//         category: taskData.category || 'ACADEMIC',
//         ...(taskData.goalId && { goalId: taskData.goalId }),
//         ...(taskData.milestoneId && { milestoneId: taskData.milestoneId }),
//         ...(taskData.fixedTimeId && { fixedTimeId: taskData.fixedTimeId }),
//       };

//       console.log('📤 Creating task with payload:', payload);

//       const response = await this.handleRequest<Task>('/tasks', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✅ Task Created!', {
//           description: `"${response.data.title}" has been added to your schedule.`,
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to create task');
//     } catch (error: any) {
//       console.log('Create task error:', error);
      
//       toast.error('Failed to Create Task', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async bulkCreateTasks(tasks: Array<{
//     title: string;
//     subject: string;
//     startTime: string;
//     endTime: string;
//     duration: number;
//     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//     day: string;
//     type?: string;
//   }>): Promise<Task[] | null> {
//     try {
//       if (!tasks.length) {
//         throw new Error('No tasks to create');
//       }

//       const payload = tasks.map(task => ({
//         title: task.title.trim(),
//         subject: task.subject || 'General',
//         startTime: task.startTime,
//         endTime: task.endTime,
//         duration: task.duration,
//         priority: task.priority,
//         color: '#3B82F6',
//         day: task.day.toUpperCase(),
//         type: (task.type || 'TASK').toUpperCase(),
//       }));

//       const response = await this.handleRequest<Task[]>('/tasks/bulk', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success(`✅ Created ${response.data.length} tasks!`, {
//           description: 'Tasks have been added to your schedule.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to create tasks');
//     } catch (error: any) {
//       console.log('Bulk create tasks error:', error);
      
//       toast.error('Failed to Create Tasks', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getTasks(filters?: { 
//     status?: string; 
//     priority?: string; 
//     day?: string;
//     goalId?: string;
//   }): Promise<Task[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters?.status) {
//         queryParams.append('status', filters.status);
//       }
//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority);
//       }
//       if (filters?.day) {
//         queryParams.append('day', filters.day);
//       }
//       if (filters?.goalId) {
//         queryParams.append('goalId', filters.goalId);
//       }
      
//       const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
//       const response = await this.handleRequest<Task[]>(url, { method: 'GET' });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching tasks:', error);
//       return [];
//     }
//   }

//   async getTaskById(taskId: string): Promise<Task | null> {
//     try {
//       if (!taskId) throw new Error('Task ID is required');
      
//       const response = await this.handleRequest<Task>(`/tasks/${taskId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching task:', error);
//       return null;
//     }
//   }

//   async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
//     try {
//       if (!taskId) throw new Error('Task ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = [
//         'title', 'subject', 'note', 'startTime', 'endTime', 'duration',
//         'priority', 'color', 'day', 'type', 'status', 'goalId', 'milestoneId'
//       ];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof Task] !== undefined) {
//           if (key === 'day' && updates[key]) {
//             payload[key] = (updates[key] as string).toUpperCase();
//           } else {
//             payload[key] = updates[key as keyof Task];
//           }
//         }
//       });

//       const response = await this.handleRequest<Task>(`/tasks/${taskId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✨ Task Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update task error:', error);
      
//       toast.error('Failed to Update Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteTask(taskId: string): Promise<boolean> {
//     try {
//       if (!taskId) throw new Error('Task ID is required');

//       const response = await this.handleRequest<any>(`/tasks/${taskId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Task Deleted', {
//           description: 'The task has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete task error:', error);
      
//       toast.error('Failed to Delete Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getTasksByDay(day: string): Promise<Task[]> {
//     try {
//       const response = await this.handleRequest<Task[]>(`/tasks/day/${day.toUpperCase()}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching tasks by day:', error);
//       return [];
//     }
//   }

//   async getTasksByGoal(goalId: string): Promise<Task[]> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<Task[]>(`/tasks/goal/${goalId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching tasks by goal:', error);
//       return [];
//     }
//   }

//   async markTaskAsComplete(taskId: string, completedAt?: string): Promise<Task | null> {
//     try {
//       if (!taskId) throw new Error('Task ID is required');

//       const payload = {
//         completedAt: completedAt || new Date().toISOString(),
//       };

//       const response = await this.handleRequest<Task>(`/tasks/${taskId}/complete`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✅ Task Completed!', {
//           description: `Great job! Task marked as complete.`,
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Mark task complete error:', error);
      
//       toast.error('Failed to Mark Task Complete', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async dragDropTask(payload: DragDropPayload): Promise<Task | null> {
//     try {
//       const response = await this.handleRequest<Task>('/tasks/drag-drop', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('🔄 Task Rescheduled', {
//           description: 'Task has been moved to new time slot.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Drag drop error:', error);
      
//       toast.error('Failed to Move Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async getTaskStats(): Promise<TaskStats | null> {
//     try {
//       const response = await this.handleRequest<TaskStats>('/tasks/stats', {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching task stats:', error);
//       return null;
//     }
//   }
// }

// export const TasksService = TasksServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useTasks() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<TaskStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchTasks = useCallback(async (filters?: { 
//     status?: string; 
//     priority?: string; 
//     day?: string;
//     goalId?: string;
//   }) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching tasks with filters:', filters);
      
//       const [fetchedTasks, fetchedStats] = await Promise.all([
//         TasksService.getTasks(filters),
//         TasksService.getTaskStats()
//       ]);
      
//       console.log('📦 Fetched tasks:', fetchedTasks);
//       // Ensure we always set an array
//       setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedTasks?.length || 0} tasks`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch tasks:', err);
//       setError(err.message || 'Failed to fetch tasks');
//       setTasks([]);
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchTasks();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchTasks]);

//   const createTask = useCallback(async (taskData: {
//     title: string;
//     subject: string;
//     note?: string;
//     startTime: string;
//     duration: number;
//     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//     day: string;
//     type?: string;
//     goalId?: string;
//     milestoneId?: string;
//     fixedTimeId?: string;
//   }) => {
//     try {
//       const newTask = await TasksService.createTask(taskData);
//       if (newTask) {
//         // Ensure tasks is always an array before spreading
//         setTasks(prev => {
//           const currentTasks = Array.isArray(prev) ? prev : [];
//           return [newTask, ...currentTasks];
//         });
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return newTask;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const bulkCreateTasks = useCallback(async (tasks: Array<{
//     title: string;
//     subject: string;
//     startTime: string;
//     endTime: string;
//     duration: number;
//     priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//     day: string;
//     type?: string;
//   }>) => {
//     try {
//       const newTasks = await TasksService.bulkCreateTasks(tasks);
//       if (newTasks) {
//         setTasks(prev => {
//           const currentTasks = Array.isArray(prev) ? prev : [];
//           return [...newTasks, ...currentTasks];
//         });
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return newTasks;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
//     try {
//       const updatedTask = await TasksService.updateTask(id, updates);
//       if (updatedTask) {
//         setTasks(prev => {
//           const currentTasks = Array.isArray(prev) ? prev : [];
//           return currentTasks.map(t => t.id === id ? updatedTask : t);
//         });
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return updatedTask;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteTask = useCallback(async (id: string) => {
//     try {
//       const success = await TasksService.deleteTask(id);
//       if (success) {
//         setTasks(prev => {
//           const currentTasks = Array.isArray(prev) ? prev : [];
//           return currentTasks.filter(t => t.id !== id);
//         });
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const markTaskAsComplete = useCallback(async (id: string) => {
//     try {
//       const completedTask = await TasksService.markTaskAsComplete(id);
//       if (completedTask) {
//         setTasks(prev => {
//           const currentTasks = Array.isArray(prev) ? prev : [];
//           return currentTasks.map(t => t.id === id ? completedTask : t);
//         });
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return completedTask;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const dragDropTask = useCallback(async (payload: DragDropPayload) => {
//     try {
//       const updatedTask = await TasksService.dragDropTask(payload);
//       if (updatedTask) {
//         setTasks(prev => {
//           const currentTasks = Array.isArray(prev) ? prev : [];
//           return currentTasks.map(t => t.id === payload.taskId ? updatedTask : t);
//         });
//         const fetchedStats = await TasksService.getTaskStats();
//         setStats(fetchedStats);
//       }
//       return updatedTask;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const getTasksByDay = useCallback(async (day: string) => {
//     try {
//       return await TasksService.getTasksByDay(day);
//     } catch (error) {
//       console.log('Error getting tasks by day:', error);
//       return [];
//     }
//   }, []);

//   const getTasksByGoal = useCallback(async (goalId: string) => {
//     try {
//       return await TasksService.getTasksByGoal(goalId);
//     } catch (error) {
//       console.log('Error getting tasks by goal:', error);
//       return [];
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   return {
//     // State
//     tasks: Array.isArray(tasks) ? tasks : [],
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // Task CRUD
//     fetchTasks,
//     createTask,
//     bulkCreateTasks,
//     updateTask,
//     deleteTask,
    
//     // Task operations
//     markTaskAsComplete,
//     dragDropTask,
//     getTasksByDay,
//     getTasksByGoal,
    
//     // Utility
//     refresh,
//   };
// }



























// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { toast } from 'sonner'
// import { AuthService } from './useAuth'

// // Use proxy URL instead of direct API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/v0/api'

// // ============= TYPES =============
// export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
// export type TaskStatus = 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
// export type TaskType = 
//   | 'TASK' 
//   | 'FIXED' 
//   | 'BREAK' 
//   | 'COMMUTE' 
//   | 'FREE' 
//   | 'CLASS' 
//   | 'STUDY' 
//   | 'HEALTH' 
//   | 'PROJECT' 
//   | 'MEETING' 
//   | 'WORKOUT' 
//   | 'MEAL' 
//   | 'ENTERTAINMENT' 
//   | 'SLEEP'
// export type TaskCategory = 
//   | 'ACADEMIC' 
//   | 'PROFESSIONAL' 
//   | 'HEALTH' 
//   | 'PERSONAL' 
//   | 'SKILL' 
//   | 'FINANCIAL' 
//   | 'SOCIAL' 
//   | 'CREATIVE'

// export interface Task {
//   id: string
//   userId: string
//   title: string
//   subject?: string
//   note?: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: TaskPriority
//   status: TaskStatus
//   color: string
//   day: string
//   type: TaskType
//   category?: TaskCategory
//   goalId?: string
//   milestoneId?: string
//   fixedTimeId?: string
//   isCompleted?: boolean
//   completedAt?: string
//   createdAt?: string
//   updatedAt?: string
// }

// export interface CreateTaskData {
//   title: string
//   subject?: string
//   note?: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: TaskPriority
//   color?: string
//   day: string
//   type: TaskType
//   category?: TaskCategory
//   goalId?: string
//   milestoneId?: string
//   fixedTimeId?: string
// }

// export interface UpdateTaskData {
//   title?: string
//   subject?: string
//   note?: string
//   startTime?: string
//   endTime?: string
//   duration?: number
//   priority?: TaskPriority
//   status?: TaskStatus
//   color?: string
//   day?: string
//   type?: TaskType
//   category?: TaskCategory
//   goalId?: string
//   milestoneId?: string
//   fixedTimeId?: string
// }

// export interface DragDropData {
//   taskId: string
//   newDay: string
//   newStartTime: string
//   newEndTime: string
//   newDuration: number
// }

// export interface CompleteTaskData {
//   completedAt?: string
// }

// export interface TaskStats {
//   total: number
//   completed: number
//   pending: number
//   ongoing: number
//   totalHours: number
//   completedHours: number
//   byPriority: Record<string, number>
//   byDay: Record<string, number>
//   byStatus: Record<string, number>
// }

// export interface ApiResponse<T> {
//   success: boolean
//   message: string
//   data: T
// }

// // ============= TASKS SERVICE =============
// class TasksServiceClass {
//   private static instance: TasksServiceClass
//   private accessToken: string | null = null

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken()
//     }
//   }

//   static getInstance(): TasksServiceClass {
//     if (!TasksServiceClass.instance) {
//       TasksServiceClass.instance = new TasksServiceClass()
//     }
//     return TasksServiceClass.instance
//   }

//   private getAuthHeaders(): HeadersInit {
//     this.accessToken = AuthService.getAccessToken()

//     return {
//       'Content-Type': 'application/json',
//       ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
//     }
//   }

//   private async handleRequest<T>(
//     url: string,
//     options: RequestInit = {}
//   ): Promise<ApiResponse<T>> {
//     const headers = this.getAuthHeaders()

//     console.log(`🌐 Tasks: Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`)

//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         ...options,
//         headers: {
//           ...headers,
//           ...options.headers,
//         },
//         credentials: 'omit',
//         mode: 'cors',
//       })

//       const contentType = response.headers.get('content-type')
//       if (!contentType?.includes('application/json')) {
//         const text = await response.text()
//         console.error('Non-JSON response:', text)
//         throw new Error('Server returned non-JSON response')
//       }

//       const data = await response.json()

//       if (!response.ok) {
//         if (response.status === 401) {
//           toast.error('Authentication Failed', {
//             description: 'Please log in again',
//             duration: 5000,
//           })
//         } else if (response.status === 403) {
//           toast.error('Access Denied', {
//             description: 'You don\'t have permission to perform this action',
//             duration: 5000,
//           })
//         } else if (response.status === 404) {
//           toast.error('Resource Not Found', {
//             description: 'The requested resource was not found',
//             duration: 4000,
//           })
//         } else if (response.status >= 500) {
//           toast.error('Server Error', {
//             description: 'Please try again later',
//             duration: 5000,
//           })
//         }

//         throw {
//           success: false,
//           message: data.message || `HTTP error ${response.status}`,
//           status: response.status,
//           data: data,
//         }
//       }

//       return data
//     } catch (error: any) {
//       console.error('❌ Tasks API request failed:', {
//         url,
//         method: options.method,
//         error: error.message || error,
//       })

//       if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
//         toast.error('Network Error', {
//           description: 'Cannot connect to the server. Please check if the server is running.',
//           duration: 6000,
//           action: {
//             label: 'Retry',
//             onClick: () => window.location.reload(),
//           },
//         })
//       }

//       throw error
//     }
//   }

//   // Convert day format from 'Mon' to 'MONDAY'
//   private toApiDayFormat(day: string): string {
//     const dayMap: Record<string, string> = {
//       'Mon': 'MONDAY',
//       'Tue': 'TUESDAY',
//       'Wed': 'WEDNESDAY',
//       'Thu': 'THURSDAY',
//       'Fri': 'FRIDAY',
//       'Sat': 'SATURDAY',
//       'Sun': 'SUNDAY',
//     }
//     return dayMap[day] || day.toUpperCase()
//   }

//   // Convert day format from 'MONDAY' to 'Mon'
//   private fromApiDayFormat(day: string): string {
//     const dayMap: Record<string, string> = {
//       'MONDAY': 'Mon',
//       'TUESDAY': 'Tue',
//       'WEDNESDAY': 'Wed',
//       'THURSDAY': 'Thu',
//       'FRIDAY': 'Fri',
//       'SATURDAY': 'Sat',
//       'SUNDAY': 'Sun',
//     }
//     return dayMap[day] || day.substring(0, 3)
//   }

//   // ============= TASK APIs =============

//   async createTask(data: CreateTaskData): Promise<Task | null> {
//     try {
//       if (!data.title?.trim()) {
//         throw new Error('Task title is required')
//       }

//       const payload = {
//         title: data.title.trim(),
//         subject: data.subject?.trim() || '',
//         note: data.note?.trim() || '',
//         startTime: data.startTime,
//         endTime: data.endTime,
//         duration: data.duration,
//         priority: data.priority || 'MEDIUM',
//         color: data.color || '#3B82F6',
//         day: this.toApiDayFormat(data.day),
//         type: data.type || 'TASK',
//         category: data.category,
//         goalId: data.goalId,
//         milestoneId: data.milestoneId,
//         fixedTimeId: data.fixedTimeId,
//       }

//       console.log('📤 Creating task with payload:', payload)

//       const response = await this.handleRequest<Task>('/tasks', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       })

//       if (response.success && response.data) {
//         const task = this.parseTask(response.data)

//         toast.success('✅ Task Created!', {
//           description: `"${task.title}" has been added to your schedule.`,
//           duration: 4000,
//         })

//         return task
//       }

//       throw new Error(response.message || 'Failed to create task')
//     } catch (error: any) {
//       console.error('Create task error:', error)

//       toast.error('Failed to Create Task', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       })
//       throw error
//     }
//   }

//   async bulkCreateTasks(tasks: CreateTaskData[]): Promise<Task[] | null> {
//     try {
//       if (!tasks || tasks.length === 0) {
//         throw new Error('No tasks provided')
//       }

//       const payload = tasks.map(task => ({
//         title: task.title.trim(),
//         subject: task.subject?.trim() || '',
//         startTime: task.startTime,
//         endTime: task.endTime,
//         duration: task.duration,
//         priority: task.priority || 'MEDIUM',
//         day: this.toApiDayFormat(task.day),
//         type: task.type || 'TASK',
//       }))

//       const response = await this.handleRequest<Task[]>('/tasks/bulk', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       })

//       if (response.success && response.data) {
//         const createdTasks = response.data.map(t => this.parseTask(t))

//         toast.success('✅ Tasks Created!', {
//           description: `${createdTasks.length} tasks have been added to your schedule.`,
//           duration: 4000,
//         })

//         return createdTasks
//       }
//       return null
//     } catch (error: any) {
//       console.error('Bulk create tasks error:', error)

//       toast.error('Failed to Create Tasks', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       })
//       return null
//     }
//   }

//   async getTasks(filters?: {
//     status?: TaskStatus
//     priority?: TaskPriority
//     day?: string
//     goalId?: string
//   }): Promise<Task[]> {
//     try {
//       const queryParams = new URLSearchParams()

//       if (filters?.status) {
//         queryParams.append('status', filters.status)
//       }

//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority)
//       }

//       if (filters?.day) {
//         queryParams.append('day', this.toApiDayFormat(filters.day))
//       }

//       if (filters?.goalId) {
//         queryParams.append('goalId', filters.goalId)
//       }

//       const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

//       const response = await this.handleRequest<Task[] | { tasks: Task[] }>(url, {
//         method: 'GET',
//       })

//       if (response.success && response.data) {
//         let tasksArray: Task[] = []

//         if (Array.isArray(response.data)) {
//           tasksArray = response.data
//         } else if ((response.data as any).tasks && Array.isArray((response.data as any).tasks)) {
//           tasksArray = (response.data as any).tasks
//         }

//         const tasks = tasksArray.map(t => this.parseTask(t))
//         console.log(`✅ Fetched ${tasks.length} tasks`)
//         return tasks
//       }
//       return []
//     } catch (error) {
//       console.error('Error fetching tasks:', error)
//       return []
//     }
//   }

//   async getTaskById(id: string): Promise<Task | null> {
//     try {
//       if (!id) throw new Error('Task ID is required')

//       const response = await this.handleRequest<Task>(`/tasks/${id}`, {
//         method: 'GET',
//       })

//       if (response.success && response.data) {
//         return this.parseTask(response.data)
//       }
//       return null
//     } catch (error) {
//       console.error('Error fetching task:', error)
//       return null
//     }
//   }

//   async getTasksByDay(day: string): Promise<Task[]> {
//     try {
//       if (!day) throw new Error('Day is required')

//       const response = await this.handleRequest<Task[]>(`/tasks/day/${this.toApiDayFormat(day)}`, {
//         method: 'GET',
//       })

//       if (response.success && response.data) {
//         return response.data.map(t => this.parseTask(t))
//       }
//       return []
//     } catch (error) {
//       console.error('Error fetching tasks by day:', error)
//       return []
//     }
//   }

//   async getTasksByGoal(goalId: string): Promise<Task[]> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required')

//       const response = await this.handleRequest<Task[]>(`/tasks/goal/${goalId}`, {
//         method: 'GET',
//       })

//       if (response.success && response.data) {
//         return response.data.map(t => this.parseTask(t))
//       }
//       return []
//     } catch (error) {
//       console.error('Error fetching tasks by goal:', error)
//       return []
//     }
//   }

//   async updateTask(id: string, data: UpdateTaskData): Promise<Task | null> {
//     try {
//       if (!id) throw new Error('Task ID is required')

//       const payload: Record<string, any> = { ...data }
//       if (data.day) {
//         payload.day = this.toApiDayFormat(data.day)
//       }

//       const response = await this.handleRequest<Task>(`/tasks/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       })

//       if (response.success && response.data) {
//         const updatedTask = this.parseTask(response.data)

//         toast.success('✨ Task Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         })

//         return updatedTask
//       }
//       return null
//     } catch (error) {
//       console.error('Update task error:', error)

//       toast.error('Failed to Update Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       })
//       return null
//     }
//   }

//   async deleteTask(id: string): Promise<boolean> {
//     try {
//       if (!id) throw new Error('Task ID is required')

//       const response = await this.handleRequest<any>(`/tasks/${id}`, {
//         method: 'DELETE',
//       })

//       if (response.success) {
//         toast.success('🗑️ Task Deleted', {
//           description: 'The task has been removed.',
//           duration: 4000,
//         })
//         return true
//       }
//       return false
//     } catch (error) {
//       console.error('Delete task error:', error)

//       toast.error('Failed to Delete Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       })
//       return false
//     }
//   }

//   async markTaskComplete(id: string, data?: CompleteTaskData): Promise<Task | null> {
//     try {
//       if (!id) throw new Error('Task ID is required')

//       const response = await this.handleRequest<Task>(`/tasks/${id}/complete`, {
//         method: 'POST',
//         body: JSON.stringify({
//           completedAt: data?.completedAt || new Date().toISOString(),
//         }),
//       })

//       if (response.success && response.data) {
//         const completedTask = this.parseTask(response.data)

//         toast.success('🎉 Task Completed!', {
//           description: `"${completedTask.title}" has been marked as complete.`,
//           duration: 4000,
//         })

//         return completedTask
//       }
//       return null
//     } catch (error) {
//       console.error('Complete task error:', error)

//       toast.error('Failed to Complete Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       })
//       return null
//     }
//   }

//   async handleDragDrop(data: DragDropData): Promise<Task | null> {
//     try {
//       if (!data.taskId) throw new Error('Task ID is required')

//       const payload = {
//         taskId: data.taskId,
//         newDay: this.toApiDayFormat(data.newDay),
//         newStartTime: data.newStartTime,
//         newEndTime: data.newEndTime,
//         newDuration: data.newDuration,
//       }

//       const response = await this.handleRequest<Task>('/tasks/drag-drop', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       })

//       if (response.success && response.data) {
//         const updatedTask = this.parseTask(response.data)

//         toast.success('📅 Task Rescheduled', {
//           description: `"${updatedTask.title}" moved to ${updatedTask.day} at ${updatedTask.startTime}.`,
//           duration: 3000,
//         })

//         return updatedTask
//       }
//       return null
//     } catch (error) {
//       console.error('Drag drop error:', error)

//       toast.error('Failed to Reschedule Task', {
//         description: 'Please try again.',
//         duration: 4000,
//       })
//       return null
//     }
//   }

//   async getTaskStats(): Promise<TaskStats | null> {
//     try {
//       const response = await this.handleRequest<TaskStats>('/tasks/stats', {
//         method: 'GET',
//       })

//       if (response.success && response.data) {
//         // Convert day keys in byDay from API format to UI format
//         if (response.data.byDay) {
//           const convertedByDay: Record<string, number> = {}
//           for (const [day, count] of Object.entries(response.data.byDay)) {
//             convertedByDay[this.fromApiDayFormat(day)] = count
//           }
//           response.data.byDay = convertedByDay
//         }
//         return response.data
//       }
//       return null
//     } catch (error) {
//       console.error('Error fetching task stats:', error)
//       return null
//     }
//   }

//   // Helper to parse task dates and convert day formats
//   private parseTask(t: any): Task {
//     return {
//       ...t,
//       day: this.fromApiDayFormat(t.day),
//       createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
//       updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
//       completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
//     }
//   }

//   async checkHealth(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       })
//       return response.ok
//     } catch (error) {
//       console.error('Health check failed:', error)
//       return false
//     }
//   }
// }

// export const TasksService = TasksServiceClass.getInstance()

// // ============= REACT HOOK =============
// export function useTasks() {
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [stats, setStats] = useState<TaskStats | null>(null)
//   const [isInitialized, setIsInitialized] = useState(false)

//   const fetchTasks = useCallback(async (filters?: {
//     status?: TaskStatus
//     priority?: TaskPriority
//     day?: string
//     goalId?: string
//   }) => {
//     setLoading(true)
//     setError(null)

//     try {
//       console.log('🚀 Fetching tasks...')
//       const [fetchedTasks, fetchedStats] = await Promise.all([
//         TasksService.getTasks(filters),
//         TasksService.getTaskStats()
//       ])

//       setTasks(fetchedTasks || [])
//       setStats(fetchedStats)
//       console.log(`✅ Successfully loaded ${fetchedTasks?.length || 0} tasks`)
//     } catch (err: any) {
//       console.error('❌ Failed to fetch tasks:', err)
//       setError(err.message || 'Failed to fetch tasks')
//       setTasks([])
//     } finally {
//       setLoading(false)
//       setIsInitialized(true)
//     }
//   }, [])

//   useEffect(() => {
//     let mounted = true

//     const initialize = async () => {
//       if (mounted) {
//         await fetchTasks()
//       }
//     }

//     initialize()

//     return () => {
//       mounted = false
//     }
//   }, [fetchTasks])

//   const createTask = useCallback(async (data: CreateTaskData) => {
//     try {
//       const newTask = await TasksService.createTask(data)
//       if (newTask) {
//         setTasks(prev => Array.isArray(prev) ? [newTask, ...prev] : [newTask])
//         const fetchedStats = await TasksService.getTaskStats()
//         setStats(fetchedStats)
//       }
//       return newTask
//     } catch (error) {
//       throw error
//     }
//   }, [])

//   const bulkCreateTasks = useCallback(async (tasksData: CreateTaskData[]) => {
//     try {
//       const createdTasks = await TasksService.bulkCreateTasks(tasksData)
//       if (createdTasks) {
//         setTasks(prev => Array.isArray(prev) ? [...createdTasks, ...prev] : createdTasks)
//         const fetchedStats = await TasksService.getTaskStats()
//         setStats(fetchedStats)
//       }
//       return createdTasks
//     } catch (error) {
//       throw error
//     }
//   }, [])

//   const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
//     try {
//       const updatedTask = await TasksService.updateTask(id, data)
//       if (updatedTask) {
//         setTasks(prev =>
//           Array.isArray(prev)
//             ? prev.map(t => t.id === id ? updatedTask : t)
//             : [updatedTask]
//         )
//         const fetchedStats = await TasksService.getTaskStats()
//         setStats(fetchedStats)
//       }
//       return updatedTask
//     } catch (error) {
//       throw error
//     }
//   }, [])

//   const deleteTask = useCallback(async (id: string) => {
//     try {
//       const success = await TasksService.deleteTask(id)
//       if (success) {
//         setTasks(prev =>
//           Array.isArray(prev)
//             ? prev.filter(t => t.id !== id)
//             : []
//         )
//         const fetchedStats = await TasksService.getTaskStats()
//         setStats(fetchedStats)
//       }
//       return success
//     } catch (error) {
//       throw error
//     }
//   }, [])

//   const markTaskComplete = useCallback(async (id: string, data?: CompleteTaskData) => {
//     try {
//       const completedTask = await TasksService.markTaskComplete(id, data)
//       if (completedTask) {
//         setTasks(prev =>
//           Array.isArray(prev)
//             ? prev.map(t => t.id === id ? completedTask : t)
//             : [completedTask]
//         )
//         const fetchedStats = await TasksService.getTaskStats()
//         setStats(fetchedStats)
//       }
//       return completedTask
//     } catch (error) {
//       throw error
//     }
//   }, [])

//   const handleDragDrop = useCallback(async (data: DragDropData) => {
//     try {
//       const updatedTask = await TasksService.handleDragDrop(data)
//       if (updatedTask) {
//         setTasks(prev =>
//           Array.isArray(prev)
//             ? prev.map(t => t.id === data.taskId ? updatedTask : t)
//             : [updatedTask]
//         )
//         const fetchedStats = await TasksService.getTaskStats()
//         setStats(fetchedStats)
//       }
//       return updatedTask
//     } catch (error) {
//       throw error
//     }
//   }, [])

//   const getTasksByDay = useCallback(async (day: string) => {
//     try {
//       return await TasksService.getTasksByDay(day)
//     } catch (error) {
//       return []
//     }
//   }, [])

//   const getTasksByGoal = useCallback(async (goalId: string) => {
//     try {
//       return await TasksService.getTasksByGoal(goalId)
//     } catch (error) {
//       return []
//     }
//   }, [])

//   const refresh = useCallback(() => {
//     fetchTasks()
//   }, [fetchTasks])

//   console.log('📋 Tasks Hook State - Current tasks:', tasks)

//   return {
//     // State
//     tasks: Array.isArray(tasks) ? tasks : [],
//     loading,
//     error,
//     stats,
//     isInitialized,

//     // Task CRUD
//     fetchTasks,
//     createTask,
//     bulkCreateTasks,
//     updateTask,
//     deleteTask,
//     markTaskComplete,

//     // Drag and drop
//     handleDragDrop,

//     // Utility
//     getTasksByDay,
//     getTasksByGoal,
//     refresh,
//   }
// }



















// src/hooks/useTasks.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { AuthService } from './useAuth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api'

// ============= TYPES =============
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TaskStatus = 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
export type TaskType = 
  | 'TASK' 
  | 'FIXED' 
  | 'BREAK' 
  | 'COMMUTE' 
  | 'FREE' 
  | 'CLASS' 
  | 'STUDY' 
  | 'HEALTH' 
  | 'PROJECT' 
  | 'MEETING' 
  | 'WORKOUT' 
  | 'MEAL' 
  | 'ENTERTAINMENT' 
  | 'SLEEP'
export type TaskCategory = 
  | 'ACADEMIC' 
  | 'PROFESSIONAL' 
  | 'HEALTH' 
  | 'PERSONAL' 
  | 'SKILL' 
  | 'FINANCIAL' 
  | 'SOCIAL' 
  | 'CREATIVE'

export interface Task {
  id: string
  userId: string
  title: string
  subject?: string
  note?: string
  startTime: string
  endTime: string
  duration: number
  priority: TaskPriority
  status: TaskStatus
  color: string
  day: string
  type: TaskType
  category?: TaskCategory
  goalId?: string
  milestoneId?: string
  fixedTimeId?: string
  isCompleted?: boolean
  completedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateTaskData {
  title: string
  subject?: string
  note?: string
  startTime: string
  endTime: string
  duration: number
  priority: TaskPriority
  color?: string
  day: string
  type: TaskType
  category?: TaskCategory
  goalId?: string
  milestoneId?: string
  fixedTimeId?: string
}

export interface UpdateTaskData {
  title?: string
  subject?: string
  note?: string
  startTime?: string
  endTime?: string
  duration?: number
  priority?: TaskPriority
  status?: TaskStatus
  color?: string
  day?: string
  type?: TaskType
  category?: TaskCategory
  goalId?: string
  milestoneId?: string
  fixedTimeId?: string
}

export interface DragDropData {
  taskId: string
  newDay: string
  newStartTime: string
  newEndTime: string
  newDuration: number
}

export interface CompleteTaskData {
  completedAt?: string
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  ongoing: number
  totalHours: number
  completedHours: number
  byPriority: Record<string, number>
  byDay: Record<string, number>
  byStatus: Record<string, number>
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// ============= TASKS SERVICE =============
class TasksServiceClass {
  private static instance: TasksServiceClass
  private accessToken: string | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = AuthService.getAccessToken()
    }
  }

  static getInstance(): TasksServiceClass {
    if (!TasksServiceClass.instance) {
      TasksServiceClass.instance = new TasksServiceClass()
    }
    return TasksServiceClass.instance
  }

  private getAuthHeaders(): HeadersInit {
    this.accessToken = AuthService.getAccessToken()

    return {
      'Content-Type': 'application/json',
      ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
    }
  }

  private async handleRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = this.getAuthHeaders()

    console.log(`🌐 Tasks: Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`)

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication Failed', {
            description: 'Please log in again',
            duration: 5000,
          })
        } else if (response.status === 403) {
          toast.error('Access Denied', {
            description: 'You don\'t have permission to perform this action',
            duration: 5000,
          })
        } else if (response.status === 404) {
          toast.error('Resource Not Found', {
            description: 'The requested resource was not found',
            duration: 4000,
          })
        } else if (response.status >= 500) {
          toast.error('Server Error', {
            description: 'Please try again later',
            duration: 5000,
          })
        }

        throw {
          success: false,
          message: data.message || `HTTP error ${response.status}`,
          status: response.status,
          data: data,
        }
      }

      return data
    } catch (error: any) {
      console.error('❌ Tasks API request failed:', {
        url,
        method: options.method,
        error: error.message || error,
      })

      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        toast.error('Network Error', {
          description: 'Cannot connect to the server. Please check if the server is running.',
          duration: 6000,
          action: {
            label: 'Retry',
            onClick: () => window.location.reload(),
          },
        })
      }

      throw error
    }
  }

  // Convert day format from 'Mon' to 'MONDAY'
  private toApiDayFormat(day: string): string {
    const dayMap: Record<string, string> = {
      'Mon': 'MONDAY',
      'Tue': 'TUESDAY',
      'Wed': 'WEDNESDAY',
      'Thu': 'THURSDAY',
      'Fri': 'FRIDAY',
      'Sat': 'SATURDAY',
      'Sun': 'SUNDAY',
    }
    return dayMap[day] || day.toUpperCase()
  }

  // Convert day format from 'MONDAY' to 'Mon'
  private fromApiDayFormat(day: string): string {
    const dayMap: Record<string, string> = {
      'MONDAY': 'Mon',
      'TUESDAY': 'Tue',
      'WEDNESDAY': 'Wed',
      'THURSDAY': 'Thu',
      'FRIDAY': 'Fri',
      'SATURDAY': 'Sat',
      'SUNDAY': 'Sun',
    }
    return dayMap[day] || day.substring(0, 3)
  }

  // ============= TASK APIs =============

  async createTask(data: CreateTaskData): Promise<Task | null> {
    try {
      if (!data.title?.trim()) {
        throw new Error('Task title is required')
      }

      const payload = {
        title: data.title.trim(),
        subject: data.subject?.trim() || 'General',
        note: data.note?.trim() || '',
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        priority: data.priority || 'MEDIUM',
        color: data.color || '#3B82F6',
        day: this.toApiDayFormat(data.day),
        type: data.type || 'TASK',
        category: data.category,
        goalId: data.goalId,
        milestoneId: data.milestoneId,
        fixedTimeId: data.fixedTimeId,
      }

      console.log('📤 Creating task with payload:', payload)

      const response = await this.handleRequest<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const task = this.parseTask(response.data)

        toast.success('✅ Task Created!', {
          description: `"${task.title}" has been added to your schedule.`,
          duration: 4000,
        })

        return task
      }

      throw new Error(response.message || 'Failed to create task')
    } catch (error: any) {
      console.error('Create task error:', error)

      toast.error('Failed to Create Task', {
        description: error.message || 'Please try again later.',
        duration: 4000,
      })
      throw error
    }
  }

  async bulkCreateTasks(tasks: CreateTaskData[]): Promise<Task[] | null> {
    try {
      if (!tasks || tasks.length === 0) {
        throw new Error('No tasks provided')
      }

      const payload = tasks.map(task => ({
        title: task.title.trim(),
        subject: task.subject?.trim() || 'General',
        note: task.note?.trim() || '',
        startTime: task.startTime,
        endTime: task.endTime,
        duration: task.duration,
        priority: task.priority || 'MEDIUM',
        color: task.color || '#3B82F6',
        day: this.toApiDayFormat(task.day),
        type: task.type || 'TASK',
        category: task.category,
        goalId: task.goalId,
        milestoneId: task.milestoneId,
        fixedTimeId: task.fixedTimeId,
      }))

      const response = await this.handleRequest<Task[]>('/tasks/bulk', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const createdTasks = (Array.isArray(response.data) ? response.data : []).map(t => this.parseTask(t))

        toast.success('✅ Tasks Created!', {
          description: `${createdTasks.length} tasks have been added to your schedule.`,
          duration: 4000,
        })

        return createdTasks
      }
      return null
    } catch (error: any) {
      console.error('Bulk create tasks error:', error)

      toast.error('Failed to Create Tasks', {
        description: error.message || 'Please try again later.',
        duration: 4000,
      })
      return null
    }
  }

  async getTasks(filters?: {
    status?: TaskStatus
    priority?: TaskPriority
    day?: string
    goalId?: string
  }): Promise<Task[]> {
    try {
      const queryParams = new URLSearchParams()

      if (filters?.status) {
        queryParams.append('status', filters.status)
      }

      if (filters?.priority) {
        queryParams.append('priority', filters.priority)
      }

      if (filters?.day) {
        queryParams.append('day', this.toApiDayFormat(filters.day))
      }

      if (filters?.goalId) {
        queryParams.append('goalId', filters.goalId)
      }

      const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await this.handleRequest<any>(url, {
        method: 'GET',
      })

      if (response.success && response.data) {
        let tasksArray: Task[] = []

        if (Array.isArray(response.data)) {
          tasksArray = response.data
        } else if (response.data.tasks && Array.isArray(response.data.tasks)) {
          tasksArray = response.data.tasks
        }

        const tasks = tasksArray.map(t => this.parseTask(t))
        console.log(`✅ Fetched ${tasks.length} tasks`)
        return tasks
      }
      return []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      if (!id) throw new Error('Task ID is required')

      const response = await this.handleRequest<Task>(`/tasks/${id}`, {
        method: 'GET',
      })

      if (response.success && response.data) {
        return this.parseTask(response.data)
      }
      return null
    } catch (error) {
      console.error('Error fetching task:', error)
      return null
    }
  }

  async getTasksByDay(day: string): Promise<Task[]> {
    try {
      if (!day) throw new Error('Day is required')

      const response = await this.handleRequest<Task[]>(`/tasks/day/${this.toApiDayFormat(day)}`, {
        method: 'GET',
      })

      if (response.success && response.data) {
        return (Array.isArray(response.data) ? response.data : []).map(t => this.parseTask(t))
      }
      return []
    } catch (error) {
      console.error('Error fetching tasks by day:', error)
      return []
    }
  }

  async getTasksByGoal(goalId: string): Promise<Task[]> {
    try {
      if (!goalId) throw new Error('Goal ID is required')

      const response = await this.handleRequest<Task[]>(`/tasks/goal/${goalId}`, {
        method: 'GET',
      })

      if (response.success && response.data) {
        return (Array.isArray(response.data) ? response.data : []).map(t => this.parseTask(t))
      }
      return []
    } catch (error) {
      console.error('Error fetching tasks by goal:', error)
      return []
    }
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task | null> {
    try {
      if (!id) throw new Error('Task ID is required')

      const payload: Record<string, any> = { ...data }
      if (data.day) {
        payload.day = this.toApiDayFormat(data.day)
      }

      const response = await this.handleRequest<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const updatedTask = this.parseTask(response.data)

        toast.success('✨ Task Updated', {
          description: 'Your changes have been saved.',
          duration: 3000,
        })

        return updatedTask
      }
      return null
    } catch (error) {
      console.error('Update task error:', error)

      toast.error('Failed to Update Task', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      if (!id) throw new Error('Task ID is required')

      const response = await this.handleRequest<any>(`/tasks/${id}`, {
        method: 'DELETE',
      })

      if (response.success) {
        toast.success('🗑️ Task Deleted', {
          description: 'The task has been removed.',
          duration: 4000,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Delete task error:', error)

      toast.error('Failed to Delete Task', {
        description: 'Please try again.',
        duration: 4000,
      })
      return false
    }
  }

  async markTaskComplete(id: string, data?: CompleteTaskData): Promise<Task | null> {
    try {
      if (!id) throw new Error('Task ID is required')

      const response = await this.handleRequest<Task>(`/tasks/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify({
          completedAt: data?.completedAt || new Date().toISOString(),
        }),
      })

      if (response.success && response.data) {
        const completedTask = this.parseTask(response.data)

        toast.success('🎉 Task Completed!', {
          description: `"${completedTask.title}" has been marked as complete.`,
          duration: 4000,
        })

        return completedTask
      }
      return null
    } catch (error) {
      console.error('Complete task error:', error)

      toast.error('Failed to Complete Task', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async handleDragDrop(data: DragDropData): Promise<Task | null> {
    try {
      if (!data.taskId) throw new Error('Task ID is required')

      const payload = {
        taskId: data.taskId,
        newDay: this.toApiDayFormat(data.newDay),
        newStartTime: data.newStartTime,
        newEndTime: data.newEndTime,
        newDuration: data.newDuration,
      }

      const response = await this.handleRequest<Task>('/tasks/drag-drop', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const updatedTask = this.parseTask(response.data)

        toast.success('📅 Task Rescheduled', {
          description: `"${updatedTask.title}" moved to ${updatedTask.day} at ${updatedTask.startTime}.`,
          duration: 3000,
        })

        return updatedTask
      }
      return null
    } catch (error) {
      console.error('Drag drop error:', error)

      toast.error('Failed to Reschedule Task', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async getTaskStats(): Promise<TaskStats | null> {
    try {
      const response = await this.handleRequest<TaskStats>('/tasks/stats', {
        method: 'GET',
      })

      if (response.success && response.data) {
        // Convert day keys in byDay from API format to UI format
        if (response.data.byDay) {
          const convertedByDay: Record<string, number> = {}
          for (const [day, count] of Object.entries(response.data.byDay)) {
            convertedByDay[this.fromApiDayFormat(day)] = count
          }
          response.data.byDay = convertedByDay
        }
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error fetching task stats:', error)
      return null
    }
  }

  // Helper to parse task dates and convert day formats
  private parseTask(t: any): Task {
    return {
      ...t,
      day: this.fromApiDayFormat(t.day),
      createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
      completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

export const TasksService = TasksServiceClass.getInstance()

// ============= REACT HOOK =============
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchTasks = useCallback(async (filters?: {
    status?: TaskStatus
    priority?: TaskPriority
    day?: string
    goalId?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      console.log('🚀 Fetching tasks...')
      const [fetchedTasks, fetchedStats] = await Promise.all([
        TasksService.getTasks(filters),
        TasksService.getTaskStats()
      ])

      setTasks(fetchedTasks || [])
      setStats(fetchedStats)
      console.log(`✅ Successfully loaded ${fetchedTasks?.length || 0} tasks`)
    } catch (err: any) {
      console.error('❌ Failed to fetch tasks:', err)
      setError(err.message || 'Failed to fetch tasks')
      setTasks([])
    } finally {
      setLoading(false)
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      if (mounted) {
        await fetchTasks()
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [fetchTasks])

  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      const newTask = await TasksService.createTask(data)
      if (newTask) {
        setTasks(prev => Array.isArray(prev) ? [newTask, ...prev] : [newTask])
        const fetchedStats = await TasksService.getTaskStats()
        setStats(fetchedStats)
      }
      return newTask
    } catch (error) {
      throw error
    }
  }, [])

  const bulkCreateTasks = useCallback(async (tasksData: CreateTaskData[]) => {
    try {
      const createdTasks = await TasksService.bulkCreateTasks(tasksData)
      if (createdTasks && createdTasks.length > 0) {
        setTasks(prev => Array.isArray(prev) ? [...createdTasks, ...prev] : createdTasks)
        const fetchedStats = await TasksService.getTaskStats()
        setStats(fetchedStats)
      }
      return createdTasks
    } catch (error) {
      throw error
    }
  }, [])

  const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
    try {
      const updatedTask = await TasksService.updateTask(id, data)
      if (updatedTask) {
        setTasks(prev =>
          Array.isArray(prev)
            ? prev.map(t => t.id === id ? updatedTask : t)
            : [updatedTask]
        )
        const fetchedStats = await TasksService.getTaskStats()
        setStats(fetchedStats)
      }
      return updatedTask
    } catch (error) {
      throw error
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    try {
      const success = await TasksService.deleteTask(id)
      if (success) {
        setTasks(prev =>
          Array.isArray(prev)
            ? prev.filter(t => t.id !== id)
            : []
        )
        const fetchedStats = await TasksService.getTaskStats()
        setStats(fetchedStats)
      }
      return success
    } catch (error) {
      throw error
    }
  }, [])

  const markTaskComplete = useCallback(async (id: string, data?: CompleteTaskData) => {
    try {
      const completedTask = await TasksService.markTaskComplete(id, data)
      if (completedTask) {
        setTasks(prev =>
          Array.isArray(prev)
            ? prev.map(t => t.id === id ? completedTask : t)
            : [completedTask]
        )
        const fetchedStats = await TasksService.getTaskStats()
        setStats(fetchedStats)
      }
      return completedTask
    } catch (error) {
      throw error
    }
  }, [])

  const handleDragDrop = useCallback(async (data: DragDropData) => {
    try {
      const updatedTask = await TasksService.handleDragDrop(data)
      if (updatedTask) {
        setTasks(prev =>
          Array.isArray(prev)
            ? prev.map(t => t.id === data.taskId ? updatedTask : t)
            : [updatedTask]
        )
        const fetchedStats = await TasksService.getTaskStats()
        setStats(fetchedStats)
      }
      return updatedTask
    } catch (error) {
      throw error
    }
  }, [])

  const getTasksByDay = useCallback((day: string) => {
    return tasks.filter(t => t.day === day)
  }, [tasks])

  const getTasksByGoal = useCallback((goalId: string) => {
    return tasks.filter(t => t.goalId === goalId)
  }, [tasks])

  const refresh = useCallback(() => {
    fetchTasks()
  }, [fetchTasks])

  console.log('📋 Tasks Hook State - Current tasks:', tasks)

  return {
    tasks: Array.isArray(tasks) ? tasks : [],
    loading,
    error,
    stats,
    isInitialized,
    fetchTasks,
    createTask,
    bulkCreateTasks,
    updateTask,
    deleteTask,
    markTaskComplete,
    handleDragDrop,
    getTasksByDay,
    getTasksByGoal,
    refresh,
  }
}