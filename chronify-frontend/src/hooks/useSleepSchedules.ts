// // src/hooks/useSleepSchedules.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api';

// // ============= TYPES =============

// export type SleepType = 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE';
// export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

// export interface SleepSchedule {
//   id: string;
//   userId: string;
//   day: DayOfWeek;
//   bedtime: string;
//   wakeTime: string;
//   duration: number;
//   isActive: boolean;
//   type: SleepType;
//   notes?: string;
//   color: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreateSleepSchedulePayload {
//   day: DayOfWeek;
//   bedtime: string;
//   wakeTime: string;
//   isActive?: boolean;
//   type?: SleepType;
//   notes?: string;
//   color?: string;
// }

// export interface BulkSleepSchedulePayload {
//   schedules: Array<{
//     day: DayOfWeek;
//     bedtime: string;
//     wakeTime: string;
//     isActive?: boolean;
//     type?: SleepType;
//     notes?: string;
//     color?: string;
//   }>;
// }

// export interface ApplyToAllPayload {
//   bedtime: string;
//   wakeTime: string;
//   type?: SleepType;
//   isActive?: boolean;
//   notes?: string;
//   color?: string;
// }

// export interface SleepStats {
//   averageDuration: number;
//   totalSleepHours: number;
//   consistencyScore: number;
//   weeklyAverage: number;
//   mostConsistentDay: string;
//   leastConsistentDay: string;
//   typeDistribution: Record<string, number>;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= SLEEP SCHEDULES SERVICE =============

// class SleepSchedulesServiceClass {
//   private static instance: SleepSchedulesServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
//     }
//   }

//   static getInstance(): SleepSchedulesServiceClass {
//     if (!SleepSchedulesServiceClass.instance) {
//       SleepSchedulesServiceClass.instance = new SleepSchedulesServiceClass();
//     }
//     return SleepSchedulesServiceClass.instance;
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

//   // ============= SLEEP SCHEDULE APIs =============

//   async createSleepSchedule(payload: CreateSleepSchedulePayload): Promise<SleepSchedule | null> {
//     try {
//       if (!payload.day) throw new Error('Day is required');
//       if (!payload.bedtime) throw new Error('Bedtime is required');
//       if (!payload.wakeTime) throw new Error('Wake time is required');

//       const requestPayload = {
//         day: payload.day.toUpperCase(),
//         bedtime: payload.bedtime,
//         wakeTime: payload.wakeTime,
//         isActive: payload.isActive ?? true,
//         type: payload.type || 'REGULAR',
//         notes: payload.notes || '',
//         color: payload.color || '#4B5563',
//       };

//       console.log('📤 Creating sleep schedule with payload:', requestPayload);

//       const response = await this.handleRequest<SleepSchedule>('/sleep-schedules', {
//         method: 'POST',
//         body: JSON.stringify(requestPayload),
//       });

//       if (response.success && response.data) {
//         toast.success('😴 Sleep Schedule Created!', {
//           description: `Schedule for ${payload.day} has been added.`,
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to create sleep schedule');
//     } catch (error: any) {
//       console.log('Create sleep schedule error:', error);
      
//       toast.error('Failed to Create Sleep Schedule', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async bulkCreateSleepSchedules(payload: BulkSleepSchedulePayload): Promise<SleepSchedule[] | null> {
//     try {
//       if (!payload.schedules.length) throw new Error('No schedules to create');

//       const requestPayload = {
//         schedules: payload.schedules.map(schedule => ({
//           day: schedule.day.toUpperCase(),
//           bedtime: schedule.bedtime,
//           wakeTime: schedule.wakeTime,
//           isActive: schedule.isActive ?? true,
//           type: schedule.type || 'REGULAR',
//           notes: schedule.notes || '',
//           color: schedule.color || '#4B5563',
//         })),
//       };

//       const response = await this.handleRequest<SleepSchedule[]>('/sleep-schedules/bulk', {
//         method: 'POST',
//         body: JSON.stringify(requestPayload),
//       });

//       if (response.success && response.data) {
//         toast.success(`😴 Created ${response.data.length} Sleep Schedules!`, {
//           description: 'Your weekly sleep schedule has been set up.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to create sleep schedules');
//     } catch (error: any) {
//       console.log('Bulk create sleep schedules error:', error);
      
//       toast.error('Failed to Create Sleep Schedules', {
//         description: error.message || 'Please try again.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getAllSleepSchedules(filters?: { 
//     isActive?: boolean; 
//     type?: SleepType;
//     fromDate?: string;
//     toDate?: string;
//   }): Promise<SleepSchedule[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters?.isActive !== undefined) {
//         queryParams.append('isActive', String(filters.isActive));
//       }
//       if (filters?.type) {
//         queryParams.append('type', filters.type);
//       }
//       if (filters?.fromDate) {
//         queryParams.append('fromDate', filters.fromDate);
//       }
//       if (filters?.toDate) {
//         queryParams.append('toDate', filters.toDate);
//       }
      
//       const url = `/sleep-schedules${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
//       const response = await this.handleRequest<SleepSchedule[]>(url, { method: 'GET' });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching sleep schedules:', error);
//       return [];
//     }
//   }

//   async getSleepScheduleById(scheduleId: string): Promise<SleepSchedule | null> {
//     try {
//       if (!scheduleId) throw new Error('Schedule ID is required');

//       const response = await this.handleRequest<SleepSchedule>(`/sleep-schedules/${scheduleId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching sleep schedule:', error);
//       return null;
//     }
//   }

//   async getSleepScheduleByDay(day: DayOfWeek): Promise<SleepSchedule | null> {
//     try {
//       if (!day) throw new Error('Day is required');

//       const response = await this.handleRequest<SleepSchedule>(`/sleep-schedules/day/${day.toUpperCase()}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching sleep schedule by day:', error);
//       return null;
//     }
//   }

//   async updateSleepSchedule(scheduleId: string, updates: Partial<SleepSchedule>): Promise<SleepSchedule | null> {
//     try {
//       if (!scheduleId) throw new Error('Schedule ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = ['bedtime', 'wakeTime', 'isActive', 'type', 'notes', 'color'];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof SleepSchedule] !== undefined) {
//           if (key === 'type' && updates[key]) {
//             payload[key] = (updates[key] as string).toUpperCase();
//           } else {
//             payload[key] = updates[key as keyof SleepSchedule];
//           }
//         }
//       });

//       const response = await this.handleRequest<SleepSchedule>(`/sleep-schedules/${scheduleId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✨ Sleep Schedule Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update sleep schedule error:', error);
      
//       toast.error('Failed to Update Sleep Schedule', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateSleepScheduleByDay(day: DayOfWeek, updates: Partial<SleepSchedule>): Promise<SleepSchedule | null> {
//     try {
//       if (!day) throw new Error('Day is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = ['bedtime', 'wakeTime', 'isActive', 'type', 'notes', 'color'];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof SleepSchedule] !== undefined) {
//           if (key === 'type' && updates[key]) {
//             payload[key] = (updates[key] as string).toUpperCase();
//           } else {
//             payload[key] = updates[key as keyof SleepSchedule];
//           }
//         }
//       });

//       const response = await this.handleRequest<SleepSchedule>(`/sleep-schedules/day/${day.toUpperCase()}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✨ Sleep Schedule Updated', {
//           description: `Schedule for ${day} has been updated.`,
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update sleep schedule by day error:', error);
      
//       toast.error('Failed to Update Sleep Schedule', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async toggleSleepScheduleActive(scheduleId: string, isActive: boolean): Promise<SleepSchedule | null> {
//     try {
//       if (!scheduleId) throw new Error('Schedule ID is required');

//       const response = await this.handleRequest<SleepSchedule>(`/sleep-schedules/${scheduleId}/toggle`, {
//         method: 'PATCH',
//         body: JSON.stringify({ isActive }),
//       });

//       if (response.success && response.data) {
//         toast.success(isActive ? '🔔 Sleep Schedule Activated' : '🔕 Sleep Schedule Deactivated', {
//           description: isActive ? 'Sleep time will be shown in timetable.' : 'Sleep time hidden from timetable.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Toggle sleep schedule error:', error);
      
//       toast.error('Failed to Toggle Sleep Schedule', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteSleepSchedule(scheduleId: string): Promise<boolean> {
//     try {
//       if (!scheduleId) throw new Error('Schedule ID is required');

//       const response = await this.handleRequest<any>(`/sleep-schedules/${scheduleId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Sleep Schedule Deleted', {
//           description: 'The schedule has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete sleep schedule error:', error);
      
//       toast.error('Failed to Delete Sleep Schedule', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async deleteSleepScheduleByDay(day: DayOfWeek): Promise<boolean> {
//     try {
//       if (!day) throw new Error('Day is required');

//       const response = await this.handleRequest<any>(`/sleep-schedules/day/${day.toUpperCase()}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Sleep Schedule Deleted', {
//           description: `Schedule for ${day} has been removed.`,
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete sleep schedule by day error:', error);
      
//       toast.error('Failed to Delete Sleep Schedule', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async applyToAllDays(payload: ApplyToAllPayload): Promise<SleepSchedule[] | null> {
//     try {
//       if (!payload.bedtime) throw new Error('Bedtime is required');
//       if (!payload.wakeTime) throw new Error('Wake time is required');

//       const requestPayload = {
//         bedtime: payload.bedtime,
//         wakeTime: payload.wakeTime,
//         type: payload.type || 'REGULAR',
//         isActive: payload.isActive ?? true,
//         notes: payload.notes || '',
//         color: payload.color || '#4B5563',
//       };

//       const response = await this.handleRequest<SleepSchedule[]>('/sleep-schedules/apply-to-all', {
//         method: 'POST',
//         body: JSON.stringify(requestPayload),
//       });

//       if (response.success && response.data) {
//         toast.success('📅 Applied to All Days!', {
//           description: 'Sleep schedule has been applied to all days.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to apply to all days');
//     } catch (error: any) {
//       console.log('Apply to all days error:', error);
      
//       toast.error('Failed to Apply Schedule', {
//         description: error.message || 'Please try again.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async regenerateAllSleepTasks(): Promise<boolean> {
//     try {
//       const response = await this.handleRequest<any>('/sleep-schedules/regenerate-tasks', {
//         method: 'POST',
//       });

//       if (response.success) {
//         toast.success('🔄 Sleep Tasks Regenerated', {
//           description: 'Sleep blocks have been updated in your timetable.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Regenerate tasks error:', error);
      
//       toast.error('Failed to Regenerate Sleep Tasks', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getSleepStats(weeks: number = 8): Promise<SleepStats | null> {
//     try {
//       const response = await this.handleRequest<SleepStats>(`/sleep-schedules/stats?weeks=${weeks}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching sleep stats:', error);
//       return null;
//     }
//   }
// }

// export const SleepSchedulesService = SleepSchedulesServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useSleepSchedules() {
//   const [schedules, setSchedules] = useState<SleepSchedule[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<SleepStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchSchedules = useCallback(async (filters?: { 
//     isActive?: boolean; 
//     type?: SleepType;
//   }) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching sleep schedules with filters:', filters);
      
//       const [fetchedSchedules, fetchedStats] = await Promise.all([
//         SleepSchedulesService.getAllSleepSchedules(filters),
//         SleepSchedulesService.getSleepStats()
//       ]);
      
//       console.log('📦 Fetched sleep schedules:', fetchedSchedules);
//       setSchedules(fetchedSchedules || []);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedSchedules?.length || 0} sleep schedules`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch sleep schedules:', err);
//       setError(err.message || 'Failed to fetch sleep schedules');
//       setSchedules([]);
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchSchedules();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchSchedules]);

//   const createSchedule = useCallback(async (payload: CreateSleepSchedulePayload) => {
//     try {
//       const newSchedule = await SleepSchedulesService.createSleepSchedule(payload);
//       if (newSchedule) {
//         setSchedules(prev => [newSchedule, ...prev]);
//         const fetchedStats = await SleepSchedulesService.getSleepStats();
//         setStats(fetchedStats);
//       }
//       return newSchedule;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const bulkCreateSchedules = useCallback(async (payload: BulkSleepSchedulePayload) => {
//     try {
//       const newSchedules = await SleepSchedulesService.bulkCreateSleepSchedules(payload);
//       if (newSchedules) {
//         setSchedules(prev => [...newSchedules, ...prev]);
//         const fetchedStats = await SleepSchedulesService.getSleepStats();
//         setStats(fetchedStats);
//       }
//       return newSchedules;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateSchedule = useCallback(async (id: string, updates: Partial<SleepSchedule>) => {
//     try {
//       const updatedSchedule = await SleepSchedulesService.updateSleepSchedule(id, updates);
//       if (updatedSchedule) {
//         setSchedules(prev => prev.map(s => s.id === id ? updatedSchedule : s));
//         const fetchedStats = await SleepSchedulesService.getSleepStats();
//         setStats(fetchedStats);
//       }
//       return updatedSchedule;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateScheduleByDay = useCallback(async (day: DayOfWeek, updates: Partial<SleepSchedule>) => {
//     try {
//       const updatedSchedule = await SleepSchedulesService.updateSleepScheduleByDay(day, updates);
//       if (updatedSchedule) {
//         setSchedules(prev => prev.map(s => s.day === day ? updatedSchedule : s));
//         const fetchedStats = await SleepSchedulesService.getSleepStats();
//         setStats(fetchedStats);
//       }
//       return updatedSchedule;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const toggleActive = useCallback(async (id: string, isActive: boolean) => {
//     try {
//       const updatedSchedule = await SleepSchedulesService.toggleSleepScheduleActive(id, isActive);
//       if (updatedSchedule) {
//         setSchedules(prev => prev.map(s => s.id === id ? updatedSchedule : s));
//         const fetchedStats = await SleepSchedulesService.getSleepStats();
//         setStats(fetchedStats);
//       }
//       return updatedSchedule;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteSchedule = useCallback(async (id: string) => {
//     try {
//       const success = await SleepSchedulesService.deleteSleepSchedule(id);
//       if (success) {
//         setSchedules(prev => prev.filter(s => s.id !== id));
//         const fetchedStats = await SleepSchedulesService.getSleepStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteScheduleByDay = useCallback(async (day: DayOfWeek) => {
//     try {
//       const success = await SleepSchedulesService.deleteSleepScheduleByDay(day);
//       if (success) {
//         setSchedules(prev => prev.filter(s => s.day !== day));
//         const fetchedStats = await SleepSchedulesService.getSleepStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const applyToAllDays = useCallback(async (payload: ApplyToAllPayload) => {
//     try {
//       const newSchedules = await SleepSchedulesService.applyToAllDays(payload);
//       if (newSchedules) {
//         setSchedules(newSchedules);
//         const fetchedStats = await SleepSchedulesService.getSleepStats();
//         setStats(fetchedStats);
//       }
//       return newSchedules;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const regenerateTasks = useCallback(async () => {
//     try {
//       const success = await SleepSchedulesService.regenerateAllSleepTasks();
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchSchedules();
//   }, [fetchSchedules]);

//   // Helper functions
//   const getScheduleForDay = useCallback((day: DayOfWeek) => {
//     return schedules.find(s => s.day === day);
//   }, [schedules]);

//   const getActiveSchedules = useCallback(() => {
//     return schedules.filter(s => s.isActive);
//   }, [schedules]);

//   const getSchedulesByType = useCallback((type: SleepType) => {
//     return schedules.filter(s => s.type === type);
//   }, [schedules]);

//   return {
//     // State
//     schedules,
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // CRUD operations
//     fetchSchedules,
//     createSchedule,
//     bulkCreateSchedules,
//     updateSchedule,
//     updateScheduleByDay,
//     toggleActive,
//     deleteSchedule,
//     deleteScheduleByDay,
    
//     // Bulk operations
//     applyToAllDays,
//     regenerateTasks,
    
//     // Utility
//     refresh,
//     getScheduleForDay,
//     getActiveSchedules,
//     getSchedulesByType,
//   };
// }



















'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { AuthService } from './useAuth'

// Use proxy URL instead of direct API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/v0/api'

// ============= TYPES =============
export type SleepType = 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'

export interface SleepSchedule {
  id: string
  userId: string
  day: string
  bedtime: string
  wakeTime: string
  duration: number
  isActive: boolean
  type: SleepType
  notes?: string
  color: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSleepScheduleData {
  day: string
  bedtime: string
  wakeTime: string
  isActive?: boolean
  type: SleepType
  notes?: string
  color?: string
}

export interface UpdateSleepScheduleData {
  bedtime?: string
  wakeTime?: string
  isActive?: boolean
  type?: SleepType
  notes?: string
  color?: string
}

export interface ApplyToAllData {
  bedtime: string
  wakeTime: string
  type: SleepType
  isActive: boolean
  notes?: string
}

export interface BulkScheduleData {
  schedules: CreateSleepScheduleData[]
}

export interface SleepStats {
  totalSleepHours: number
  avgSleepHours: number
  daysWithSleep: number
  recommendedHours: number
  weeklyStats?: {
    week: string
    totalHours: number
    avgPerDay: number
    daysTracked: number
  }[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// ============= SLEEP SCHEDULES SERVICE =============
class SleepSchedulesServiceClass {
  private static instance: SleepSchedulesServiceClass
  private accessToken: string | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = AuthService.getAccessToken()
    }
  }

  static getInstance(): SleepSchedulesServiceClass {
    if (!SleepSchedulesServiceClass.instance) {
      SleepSchedulesServiceClass.instance = new SleepSchedulesServiceClass()
    }
    return SleepSchedulesServiceClass.instance
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

    console.log(`🌐 SleepSchedules: Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`)

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        credentials: 'omit',
        mode: 'cors',
      })

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error('Server returned non-JSON response')
      }

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
      console.error('❌ SleepSchedules API request failed:', {
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

  // ============= SLEEP SCHEDULE APIs =============

  async createSleepSchedule(data: CreateSleepScheduleData): Promise<SleepSchedule | null> {
    try {
      const payload = {
        day: this.toApiDayFormat(data.day),
        bedtime: data.bedtime,
        wakeTime: data.wakeTime,
        isActive: data.isActive ?? true,
        type: data.type || 'REGULAR',
        notes: data.notes,
        color: data.color || '#4B5563',
      }

      console.log('📤 Creating sleep schedule with payload:', payload)

      const response = await this.handleRequest<SleepSchedule>('/sleep-schedules', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const schedule = this.parseSleepSchedule(response.data)

        toast.success('😴 Sleep Schedule Created!', {
          description: `Schedule for ${schedule.day} has been set.`,
          duration: 4000,
        })

        return schedule
      }

      throw new Error(response.message || 'Failed to create sleep schedule')
    } catch (error: any) {
      console.error('Create sleep schedule error:', error)

      toast.error('Failed to Create Sleep Schedule', {
        description: error.message || 'Please try again later.',
        duration: 4000,
      })
      throw error
    }
  }

  async getSleepSchedules(filters?: {
    isActive?: boolean
    type?: SleepType
    fromDate?: string
    toDate?: string
  }): Promise<SleepSchedule[]> {
    try {
      const queryParams = new URLSearchParams()

      if (filters?.isActive !== undefined) {
        queryParams.append('isActive', filters.isActive.toString())
      }

      if (filters?.type) {
        queryParams.append('type', filters.type)
      }

      if (filters?.fromDate) {
        queryParams.append('fromDate', filters.fromDate)
      }

      if (filters?.toDate) {
        queryParams.append('toDate', filters.toDate)
      }

      const url = `/sleep-schedules${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

      const response = await this.handleRequest<SleepSchedule[] | { schedules: SleepSchedule[] }>(url, {
        method: 'GET',
      })

      if (response.success && response.data) {
        let schedulesArray: SleepSchedule[] = []

        if (Array.isArray(response.data)) {
          schedulesArray = response.data
        } else if ((response.data as any).schedules && Array.isArray((response.data as any).schedules)) {
          schedulesArray = (response.data as any).schedules
        }

        const schedules = schedulesArray.map(s => this.parseSleepSchedule(s))
        console.log(`✅ Fetched ${schedules.length} sleep schedules`)
        return schedules
      }
      return []
    } catch (error) {
      console.error('Error fetching sleep schedules:', error)
      return []
    }
  }

  async getSleepScheduleById(id: string): Promise<SleepSchedule | null> {
    try {
      if (!id) throw new Error('Sleep schedule ID is required')

      const response = await this.handleRequest<SleepSchedule>(`/sleep-schedules/${id}`, {
        method: 'GET',
      })

      if (response.success && response.data) {
        return this.parseSleepSchedule(response.data)
      }
      return null
    } catch (error) {
      console.error('Error fetching sleep schedule:', error)
      return null
    }
  }

  async getSleepScheduleByDay(day: string): Promise<SleepSchedule | null> {
    try {
      if (!day) throw new Error('Day is required')

      const response = await this.handleRequest<SleepSchedule>(
        `/sleep-schedules/day/${this.toApiDayFormat(day)}`,
        { method: 'GET' }
      )

      if (response.success && response.data) {
        return this.parseSleepSchedule(response.data)
      }
      return null
    } catch (error) {
      console.error('Error fetching sleep schedule by day:', error)
      return null
    }
  }

  async updateSleepSchedule(id: string, data: UpdateSleepScheduleData): Promise<SleepSchedule | null> {
    try {
      if (!id) throw new Error('Sleep schedule ID is required')

      const response = await this.handleRequest<SleepSchedule>(`/sleep-schedules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      if (response.success && response.data) {
        const updatedSchedule = this.parseSleepSchedule(response.data)

        toast.success('✨ Sleep Schedule Updated', {
          description: 'Your changes have been saved.',
          duration: 3000,
        })

        return updatedSchedule
      }
      return null
    } catch (error) {
      console.error('Update sleep schedule error:', error)

      toast.error('Failed to Update Sleep Schedule', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async updateSleepScheduleByDay(day: string, data: UpdateSleepScheduleData): Promise<SleepSchedule | null> {
    try {
      if (!day) throw new Error('Day is required')

      const payload: any = { ...data }
      if (data.isActive !== undefined) {
        payload.isActive = data.isActive
      }

      const response = await this.handleRequest<SleepSchedule>(
        `/sleep-schedules/day/${this.toApiDayFormat(day)}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      )

      if (response.success && response.data) {
        const updatedSchedule = this.parseSleepSchedule(response.data)

        toast.success('✨ Sleep Schedule Updated', {
          description: `Schedule for ${updatedSchedule.day} has been updated.`,
          duration: 3000,
        })

        return updatedSchedule
      }
      return null
    } catch (error) {
      console.error('Update sleep schedule by day error:', error)

      toast.error('Failed to Update Sleep Schedule', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async deleteSleepSchedule(id: string): Promise<boolean> {
    try {
      if (!id) throw new Error('Sleep schedule ID is required')

      const response = await this.handleRequest<any>(`/sleep-schedules/${id}`, {
        method: 'DELETE',
      })

      if (response.success) {
        toast.success('🗑️ Sleep Schedule Deleted', {
          description: 'The schedule has been removed.',
          duration: 4000,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Delete sleep schedule error:', error)

      toast.error('Failed to Delete Sleep Schedule', {
        description: 'Please try again.',
        duration: 4000,
      })
      return false
    }
  }

  async deleteSleepScheduleByDay(day: string): Promise<boolean> {
    try {
      if (!day) throw new Error('Day is required')

      const response = await this.handleRequest<any>(
        `/sleep-schedules/day/${this.toApiDayFormat(day)}`,
        { method: 'DELETE' }
      )

      if (response.success) {
        toast.success('🗑️ Sleep Schedule Deleted', {
          description: `Schedule for ${day} has been removed.`,
          duration: 4000,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Delete sleep schedule by day error:', error)

      toast.error('Failed to Delete Sleep Schedule', {
        description: 'Please try again.',
        duration: 4000,
      })
      return false
    }
  }

  async toggleSleepSchedule(id: string, isActive: boolean): Promise<SleepSchedule | null> {
    try {
      if (!id) throw new Error('Sleep schedule ID is required')

      const response = await this.handleRequest<SleepSchedule>(
        `/sleep-schedules/${id}/toggle`,
        {
          method: 'PATCH',
          body: JSON.stringify({ isActive }),
        }
      )

      if (response.success && response.data) {
        const updatedSchedule = this.parseSleepSchedule(response.data)

        toast.success(isActive ? '😴 Sleep Schedule Enabled' : '⏸️ Sleep Schedule Disabled', {
          description: `Schedule for ${updatedSchedule.day} has been ${isActive ? 'enabled' : 'disabled'}.`,
          duration: 3000,
        })

        return updatedSchedule
      }
      return null
    } catch (error) {
      console.error('Toggle sleep schedule error:', error)

      toast.error('Failed to Toggle Sleep Schedule', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async applyToAll(data: ApplyToAllData): Promise<SleepSchedule[] | null> {
    try {
      const payload = {
        bedtime: data.bedtime,
        wakeTime: data.wakeTime,
        type: data.type || 'REGULAR',
        isActive: data.isActive ?? true,
        notes: data.notes,
      }

      const response = await this.handleRequest<SleepSchedule[]>('/sleep-schedules/apply-to-all', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const schedules = response.data.map(s => this.parseSleepSchedule(s))

        toast.success('😴 Schedule Applied to All Days!', {
          description: 'Your sleep schedule has been set for the entire week.',
          duration: 4000,
        })

        return schedules
      }
      return null
    } catch (error) {
      console.error('Apply to all error:', error)

      toast.error('Failed to Apply Schedule', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async bulkCreateSchedules(data: BulkScheduleData): Promise<SleepSchedule[] | null> {
    try {
      const payload = {
        schedules: data.schedules.map(s => ({
          ...s,
          day: this.toApiDayFormat(s.day),
        })),
      }

      const response = await this.handleRequest<SleepSchedule[]>('/sleep-schedules/bulk', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const schedules = response.data.map(s => this.parseSleepSchedule(s))

        toast.success('😴 Schedules Created!', {
          description: `${schedules.length} sleep schedules have been set.`,
          duration: 4000,
        })

        return schedules
      }
      return null
    } catch (error) {
      console.error('Bulk create error:', error)

      toast.error('Failed to Create Schedules', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async getSleepStats(weeks?: number): Promise<SleepStats | null> {
    try {
      const queryParams = weeks ? `?weeks=${weeks}` : ''

      const response = await this.handleRequest<SleepStats>(`/sleep-schedules/stats${queryParams}`, {
        method: 'GET',
      })

      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error fetching sleep stats:', error)
      return null
    }
  }

  async regenerateSleepTasks(): Promise<boolean> {
    try {
      const response = await this.handleRequest<any>('/sleep-schedules/regenerate-tasks', {
        method: 'POST',
      })

      if (response.success) {
        toast.success('🔄 Sleep Tasks Regenerated', {
          description: 'Your sleep tasks have been updated.',
          duration: 3000,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Regenerate sleep tasks error:', error)
      return false
    }
  }

  // Helper to parse sleep schedule dates and convert day formats
  private parseSleepSchedule(s: any): SleepSchedule {
    return {
      ...s,
      day: this.fromApiDayFormat(s.day),
      createdAt: s.createdAt ? new Date(s.createdAt) : undefined,
      updatedAt: s.updatedAt ? new Date(s.updatedAt) : undefined,
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

export const SleepSchedulesService = SleepSchedulesServiceClass.getInstance()

// ============= REACT HOOK =============
export function useSleepSchedules() {
  const [sleepSchedules, setSleepSchedules] = useState<SleepSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<SleepStats | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchSleepSchedules = useCallback(async (filters?: {
    isActive?: boolean
    type?: SleepType
    fromDate?: string
    toDate?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      console.log('🚀 Fetching sleep schedules...')
      const [fetchedSchedules, fetchedStats] = await Promise.all([
        SleepSchedulesService.getSleepSchedules(filters),
        SleepSchedulesService.getSleepStats()
      ])

      setSleepSchedules(fetchedSchedules || [])
      setStats(fetchedStats)
      console.log(`✅ Successfully loaded ${fetchedSchedules?.length || 0} sleep schedules`)
    } catch (err: any) {
      console.error('❌ Failed to fetch sleep schedules:', err)
      setError(err.message || 'Failed to fetch sleep schedules')
      setSleepSchedules([])
    } finally {
      setLoading(false)
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      if (mounted) {
        await fetchSleepSchedules()
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [fetchSleepSchedules])

  const createSleepSchedule = useCallback(async (data: CreateSleepScheduleData) => {
    try {
      const newSchedule = await SleepSchedulesService.createSleepSchedule(data)
      if (newSchedule) {
        setSleepSchedules(prev => {
          const existing = Array.isArray(prev) ? prev : []
          // Replace existing schedule for same day or add new
          const filtered = existing.filter(s => s.day !== newSchedule.day)
          return [...filtered, newSchedule]
        })
        const fetchedStats = await SleepSchedulesService.getSleepStats()
        setStats(fetchedStats)
      }
      return newSchedule
    } catch (error) {
      throw error
    }
  }, [])

  const updateSleepSchedule = useCallback(async (id: string, data: UpdateSleepScheduleData) => {
    try {
      const updatedSchedule = await SleepSchedulesService.updateSleepSchedule(id, data)
      if (updatedSchedule) {
        setSleepSchedules(prev =>
          Array.isArray(prev)
            ? prev.map(s => s.id === id ? updatedSchedule : s)
            : [updatedSchedule]
        )
        const fetchedStats = await SleepSchedulesService.getSleepStats()
        setStats(fetchedStats)
      }
      return updatedSchedule
    } catch (error) {
      throw error
    }
  }, [])

  const updateSleepScheduleByDay = useCallback(async (day: string, data: UpdateSleepScheduleData) => {
    try {
      const updatedSchedule = await SleepSchedulesService.updateSleepScheduleByDay(day, data)
      if (updatedSchedule) {
        setSleepSchedules(prev =>
          Array.isArray(prev)
            ? prev.map(s => s.day === day ? updatedSchedule : s)
            : [updatedSchedule]
        )
        const fetchedStats = await SleepSchedulesService.getSleepStats()
        setStats(fetchedStats)
      }
      return updatedSchedule
    } catch (error) {
      throw error
    }
  }, [])

  const deleteSleepSchedule = useCallback(async (id: string) => {
    try {
      const success = await SleepSchedulesService.deleteSleepSchedule(id)
      if (success) {
        setSleepSchedules(prev =>
          Array.isArray(prev)
            ? prev.filter(s => s.id !== id)
            : []
        )
        const fetchedStats = await SleepSchedulesService.getSleepStats()
        setStats(fetchedStats)
      }
      return success
    } catch (error) {
      throw error
    }
  }, [])

  const deleteSleepScheduleByDay = useCallback(async (day: string) => {
    try {
      const success = await SleepSchedulesService.deleteSleepScheduleByDay(day)
      if (success) {
        setSleepSchedules(prev =>
          Array.isArray(prev)
            ? prev.filter(s => s.day !== day)
            : []
        )
        const fetchedStats = await SleepSchedulesService.getSleepStats()
        setStats(fetchedStats)
      }
      return success
    } catch (error) {
      throw error
    }
  }, [])

  const toggleSleepSchedule = useCallback(async (id: string, isActive: boolean) => {
    try {
      const updatedSchedule = await SleepSchedulesService.toggleSleepSchedule(id, isActive)
      if (updatedSchedule) {
        setSleepSchedules(prev =>
          Array.isArray(prev)
            ? prev.map(s => s.id === id ? updatedSchedule : s)
            : [updatedSchedule]
        )
        const fetchedStats = await SleepSchedulesService.getSleepStats()
        setStats(fetchedStats)
      }
      return updatedSchedule
    } catch (error) {
      throw error
    }
  }, [])

  const applyToAll = useCallback(async (data: ApplyToAllData) => {
    try {
      const schedules = await SleepSchedulesService.applyToAll(data)
      if (schedules) {
        setSleepSchedules(schedules)
        const fetchedStats = await SleepSchedulesService.getSleepStats()
        setStats(fetchedStats)
      }
      return schedules
    } catch (error) {
      throw error
    }
  }, [])

  const bulkCreateSchedules = useCallback(async (data: BulkScheduleData) => {
    try {
      const schedules = await SleepSchedulesService.bulkCreateSchedules(data)
      if (schedules) {
        setSleepSchedules(schedules)
        const fetchedStats = await SleepSchedulesService.getSleepStats()
        setStats(fetchedStats)
      }
      return schedules
    } catch (error) {
      throw error
    }
  }, [])

  const regenerateSleepTasks = useCallback(async () => {
    try {
      return await SleepSchedulesService.regenerateSleepTasks()
    } catch (error) {
      return false
    }
  }, [])

  const refresh = useCallback(() => {
    fetchSleepSchedules()
  }, [fetchSleepSchedules])

  // Calculate sleep statistics
  const getSleepStats = useCallback(() => {
    const activeSchedules = sleepSchedules.filter(s => s.isActive)
    const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
    const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0

    return {
      totalSleepHours,
      avgSleepHours,
      daysWithSleep: activeSchedules.length,
      recommendedHours: 8
    }
  }, [sleepSchedules])

  console.log('😴 SleepSchedules Hook State - Current schedules:', sleepSchedules)

  return {
    // State
    sleepSchedules: Array.isArray(sleepSchedules) ? sleepSchedules : [],
    loading,
    error,
    stats,
    isInitialized,

    // Sleep Schedule CRUD
    fetchSleepSchedules,
    createSleepSchedule,
    updateSleepSchedule,
    updateSleepScheduleByDay,
    deleteSleepSchedule,
    deleteSleepScheduleByDay,
    toggleSleepSchedule,

    // Bulk operations
    applyToAll,
    bulkCreateSchedules,
    regenerateSleepTasks,

    // Utility
    getSleepStats,
    refresh,
  }
}
