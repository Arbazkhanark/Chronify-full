// // src/hooks/useFixedTimes.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api';

// // ============= TYPES =============

// export interface FreePeriod {
//   id: string;
//   title: string;
//   startTime: string;
//   endTime: string;
//   duration: number;
//   day: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface FixedTime {
//   id: string;
//   userId: string;
//   title: string;
//   description?: string;
//   days: string[];
//   startTime: string;
//   endTime: string;
//   type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP';
//   color: string;
//   isEditable: boolean;
//   freePeriods: FreePeriod[];
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreateFixedTimePayload {
//   title: string;
//   description?: string;
//   days: string[];
//   startTime: string;
//   endTime: string;
//   type: string;
//   color?: string;
//   isEditable?: boolean;
// }

// export interface CreateFreePeriodPayload {
//   title: string;
//   startTime: string;
//   endTime: string;
//   duration: number;
//   day: string;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= FIXED TIMES SERVICE =============

// class FixedTimesServiceClass {
//   private static instance: FixedTimesServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
//     }
//   }

//   static getInstance(): FixedTimesServiceClass {
//     if (!FixedTimesServiceClass.instance) {
//       FixedTimesServiceClass.instance = new FixedTimesServiceClass();
//     }
//     return FixedTimesServiceClass.instance;
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

//   // ============= FIXED TIME APIs =============

//   async createFixedTime(payload: CreateFixedTimePayload): Promise<FixedTime | null> {
//     try {
//       if (!payload.title?.trim()) {
//         throw new Error('Fixed time title is required');
//       }

//       if (!payload.days.length) {
//         throw new Error('At least one day must be selected');
//       }

//       const requestPayload = {
//         title: payload.title.trim(),
//         description: payload.description || '',
//         days: payload.days.map(day => day.toUpperCase()),
//         startTime: payload.startTime,
//         endTime: payload.endTime,
//         type: payload.type.toUpperCase(),
//         color: payload.color || '#6B7280',
//         isEditable: payload.isEditable ?? true,
//       };

//       console.log('📤 Creating fixed time with payload:', requestPayload);

//       const response = await this.handleRequest<FixedTime>('/fixed-times', {
//         method: 'POST',
//         body: JSON.stringify(requestPayload),
//       });

//       if (response.success && response.data) {
//         toast.success('📅 Fixed Commitment Created!', {
//           description: `"${response.data.title}" has been added.`,
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to create fixed time');
//     } catch (error: any) {
//       console.log('Create fixed time error:', error);
      
//       toast.error('Failed to Create Fixed Commitment', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getAllFixedTimes(): Promise<FixedTime[]> {
//     try {
//       const response = await this.handleRequest<FixedTime[]>('/fixed-times', {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching fixed times:', error);
//       return [];
//     }
//   }

//   async getFixedTimeById(fixedTimeId: string): Promise<FixedTime | null> {
//     try {
//       if (!fixedTimeId) throw new Error('Fixed time ID is required');

//       const response = await this.handleRequest<FixedTime>(`/fixed-times/${fixedTimeId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching fixed time:', error);
//       return null;
//     }
//   }

//   async updateFixedTime(fixedTimeId: string, updates: Partial<FixedTime>): Promise<FixedTime | null> {
//     try {
//       if (!fixedTimeId) throw new Error('Fixed time ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = ['title', 'description', 'days', 'startTime', 'endTime', 'color'];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof FixedTime] !== undefined) {
//           if (key === 'days' && updates[key]) {
//             payload[key] = (updates[key] as string[]).map(day => day.toUpperCase());
//           } else {
//             payload[key] = updates[key as keyof FixedTime];
//           }
//         }
//       });

//       const response = await this.handleRequest<FixedTime>(`/fixed-times/${fixedTimeId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         toast.success('✨ Fixed Commitment Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update fixed time error:', error);
      
//       toast.error('Failed to Update Fixed Commitment', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteFixedTime(fixedTimeId: string): Promise<boolean> {
//     try {
//       if (!fixedTimeId) throw new Error('Fixed time ID is required');

//       const response = await this.handleRequest<any>(`/fixed-times/${fixedTimeId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Fixed Commitment Deleted', {
//           description: 'The commitment has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete fixed time error:', error);
      
//       toast.error('Failed to Delete Fixed Commitment', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getTasksInFixedTime(fixedTimeId: string): Promise<any[]> {
//     try {
//       if (!fixedTimeId) throw new Error('Fixed time ID is required');

//       const response = await this.handleRequest<any[]>(`/fixed-times/${fixedTimeId}/tasks`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching tasks in fixed time:', error);
//       return [];
//     }
//   }

//   // ============= FREE PERIOD APIs =============

//   async addFreePeriod(fixedTimeId: string, payload: CreateFreePeriodPayload): Promise<FreePeriod | null> {
//     try {
//       if (!fixedTimeId) throw new Error('Fixed time ID is required');
//       if (!payload.title?.trim()) throw new Error('Free period title is required');
//       if (!payload.day) throw new Error('Day is required');

//       const requestPayload = {
//         title: payload.title.trim(),
//         startTime: payload.startTime,
//         endTime: payload.endTime,
//         duration: payload.duration,
//         day: payload.day.toUpperCase(),
//       };

//       const response = await this.handleRequest<FreePeriod>(
//         `/fixed-times/${fixedTimeId}/free-periods`,
//         {
//           method: 'POST',
//           body: JSON.stringify(requestPayload),
//         }
//       );

//       if (response.success && response.data) {
//         toast.success('⏰ Free Period Added!', {
//           description: `Free period added for ${payload.day}.`,
//           duration: 3000,
//         });
//         return response.data;
//       }
//       throw new Error(response.message || 'Failed to add free period');
//     } catch (error: any) {
//       console.log('Add free period error:', error);
      
//       toast.error('Failed to Add Free Period', {
//         description: error.message || 'Please try again.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async updateFreePeriod(
//     fixedTimeId: string, 
//     freePeriodId: string, 
//     updates: Partial<FreePeriod>
//   ): Promise<FreePeriod | null> {
//     try {
//       if (!fixedTimeId || !freePeriodId) throw new Error('Fixed time ID and Free period ID are required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = ['title', 'startTime', 'endTime', 'duration', 'day'];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof FreePeriod] !== undefined) {
//           if (key === 'day' && updates[key]) {
//             payload[key] = (updates[key] as string).toUpperCase();
//           } else {
//             payload[key] = updates[key as keyof FreePeriod];
//           }
//         }
//       });

//       const response = await this.handleRequest<FreePeriod>(
//         `/fixed-times/${fixedTimeId}/free-periods/${freePeriodId}`,
//         {
//           method: 'PUT',
//           body: JSON.stringify(payload),
//         }
//       );

//       if (response.success && response.data) {
//         toast.success('✨ Free Period Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update free period error:', error);
      
//       toast.error('Failed to Update Free Period', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteFreePeriod(fixedTimeId: string, freePeriodId: string): Promise<boolean> {
//     try {
//       if (!fixedTimeId || !freePeriodId) throw new Error('Fixed time ID and Free period ID are required');

//       const response = await this.handleRequest<any>(
//         `/fixed-times/${fixedTimeId}/free-periods/${freePeriodId}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       if (response.success) {
//         toast.success('🗑️ Free Period Deleted', {
//           description: 'The free period has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete free period error:', error);
      
//       toast.error('Failed to Delete Free Period', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }
// }

// export const FixedTimesService = FixedTimesServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useFixedTimes() {
//   const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchFixedTimes = useCallback(async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching fixed times');
      
//       const fetchedFixedTimes = await FixedTimesService.getAllFixedTimes();
      
//       console.log('📦 Fetched fixed times:', fetchedFixedTimes);
//       setFixedTimes(fetchedFixedTimes || []);
      
//       console.log(`✅ Successfully loaded ${fetchedFixedTimes?.length || 0} fixed times`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch fixed times:', err);
//       setError(err.message || 'Failed to fetch fixed times');
//       setFixedTimes([]);
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchFixedTimes();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchFixedTimes]);

//   const createFixedTime = useCallback(async (payload: CreateFixedTimePayload) => {
//     try {
//       const newFixedTime = await FixedTimesService.createFixedTime(payload);
//       if (newFixedTime) {
//         setFixedTimes(prev => [newFixedTime, ...prev]);
//       }
//       return newFixedTime;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateFixedTime = useCallback(async (id: string, updates: Partial<FixedTime>) => {
//     try {
//       const updatedFixedTime = await FixedTimesService.updateFixedTime(id, updates);
//       if (updatedFixedTime) {
//         setFixedTimes(prev => prev.map(ft => ft.id === id ? updatedFixedTime : ft));
//       }
//       return updatedFixedTime;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteFixedTime = useCallback(async (id: string) => {
//     try {
//       const success = await FixedTimesService.deleteFixedTime(id);
//       if (success) {
//         setFixedTimes(prev => prev.filter(ft => ft.id !== id));
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const addFreePeriod = useCallback(async (fixedTimeId: string, payload: CreateFreePeriodPayload) => {
//     try {
//       const newFreePeriod = await FixedTimesService.addFreePeriod(fixedTimeId, payload);
//       if (newFreePeriod) {
//         setFixedTimes(prev => prev.map(ft => {
//           if (ft.id === fixedTimeId) {
//             return {
//               ...ft,
//               freePeriods: [...(ft.freePeriods || []), newFreePeriod],
//             };
//           }
//           return ft;
//         }));
//       }
//       return newFreePeriod;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateFreePeriod = useCallback(async (
//     fixedTimeId: string, 
//     freePeriodId: string, 
//     updates: Partial<FreePeriod>
//   ) => {
//     try {
//       const updatedFreePeriod = await FixedTimesService.updateFreePeriod(fixedTimeId, freePeriodId, updates);
//       if (updatedFreePeriod) {
//         setFixedTimes(prev => prev.map(ft => {
//           if (ft.id === fixedTimeId) {
//             return {
//               ...ft,
//               freePeriods: (ft.freePeriods || []).map(fp => 
//                 fp.id === freePeriodId ? updatedFreePeriod : fp
//               ),
//             };
//           }
//           return ft;
//         }));
//       }
//       return updatedFreePeriod;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteFreePeriod = useCallback(async (fixedTimeId: string, freePeriodId: string) => {
//     try {
//       const success = await FixedTimesService.deleteFreePeriod(fixedTimeId, freePeriodId);
//       if (success) {
//         setFixedTimes(prev => prev.map(ft => {
//           if (ft.id === fixedTimeId) {
//             return {
//               ...ft,
//               freePeriods: (ft.freePeriods || []).filter(fp => fp.id !== freePeriodId),
//             };
//           }
//           return ft;
//         }));
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const getTasksInFixedTime = useCallback(async (fixedTimeId: string) => {
//     try {
//       return await FixedTimesService.getTasksInFixedTime(fixedTimeId);
//     } catch (error) {
//       console.log('Error getting tasks in fixed time:', error);
//       return [];
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchFixedTimes();
//   }, [fetchFixedTimes]);

//   return {
//     // State
//     fixedTimes,
//     loading,
//     error,
//     isInitialized,
    
//     // Fixed time CRUD
//     fetchFixedTimes,
//     createFixedTime,
//     updateFixedTime,
//     deleteFixedTime,
    
//     // Free period operations
//     addFreePeriod,
//     updateFreePeriod,
//     deleteFreePeriod,
    
//     // Utility
//     getTasksInFixedTime,
//     refresh,
//   };
// }

















'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { AuthService } from './useAuth'

// Use proxy URL instead of direct API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/v0/api'

// ============= TYPES =============
export interface FreePeriod {
  id: string
  title: string
  startTime: string
  endTime: string
  duration: number
  day: string
  createdAt?: string
  updatedAt?: string
}

export interface FixedTime {
  id: string
  userId: string
  title: string
  description?: string
  days: string[]
  startTime: string
  endTime: string
  type: FixedTimeType
  color: string
  isEditable?: boolean
  freePeriods?: FreePeriod[]
  createdAt?: string
  updatedAt?: string
}

export type FixedTimeType = 
  | 'COLLEGE' 
  | 'OFFICE' 
  | 'SCHOOL' 
  | 'COMMUTE' 
  | 'FREE' 
  | 'MEETING' 
  | 'WORKOUT' 
  | 'MEAL' 
  | 'ENTERTAINMENT' 
  | 'FAMILY' 
  | 'OTHER' 
  | 'SLEEP'

export interface CreateFixedTimeData {
  title: string
  description?: string
  days: string[]
  startTime: string
  endTime: string
  type: FixedTimeType
  color: string
  isEditable?: boolean
}

export interface UpdateFixedTimeData {
  title?: string
  description?: string
  days?: string[]
  startTime?: string
  endTime?: string
  type?: FixedTimeType
  color?: string
  isEditable?: boolean
}

export interface CreateFreePeriodData {
  title: string
  startTime: string
  endTime: string
  duration: number
  day: string
}

export interface UpdateFreePeriodData {
  title?: string
  startTime?: string
  endTime?: string
  duration?: number
  day?: string
}

export interface FixedTimeStats {
  total: number
  totalHours: number
  byType: Record<string, number>
  byDay: Record<string, number>
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// ============= FIXED TIMES SERVICE =============
class FixedTimesServiceClass {
  private static instance: FixedTimesServiceClass
  private accessToken: string | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = AuthService.getAccessToken()
    }
  }

  static getInstance(): FixedTimesServiceClass {
    if (!FixedTimesServiceClass.instance) {
      FixedTimesServiceClass.instance = new FixedTimesServiceClass()
    }
    return FixedTimesServiceClass.instance
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

    console.log(`🌐 FixedTimes: Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`)

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
      console.error('❌ FixedTimes API request failed:', {
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

  // ============= FIXED TIME APIs =============

  async createFixedTime(data: CreateFixedTimeData): Promise<FixedTime | null> {
    try {
      if (!data.title?.trim()) {
        throw new Error('Title is required')
      }

      const payload = {
        title: data.title.trim(),
        description: data.description?.trim() || '',
        days: data.days.map(d => this.toApiDayFormat(d)),
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type || 'OTHER',
        color: data.color || '#6B7280',
        isEditable: data.isEditable ?? true,
      }

      console.log('📤 Creating fixed time with payload:', payload)

      const response = await this.handleRequest<FixedTime>('/fixed-times', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const fixedTime = this.parseFixedTime(response.data)

        toast.success('📅 Fixed Commitment Created!', {
          description: `"${fixedTime.title}" has been added.`,
          duration: 4000,
        })

        return fixedTime
      }

      throw new Error(response.message || 'Failed to create fixed time')
    } catch (error: any) {
      console.error('Create fixed time error:', error)

      toast.error('Failed to Create Fixed Commitment', {
        description: error.message || 'Please try again later.',
        duration: 4000,
      })
      throw error
    }
  }

  async getFixedTimes(): Promise<FixedTime[]> {
    try {
      const response = await this.handleRequest<FixedTime[] | { fixedTimes: FixedTime[] }>('/fixed-times', {
        method: 'GET',
      })

      if (response.success && response.data) {
        let fixedTimesArray: FixedTime[] = []

        if (Array.isArray(response.data)) {
          fixedTimesArray = response.data
        } else if ((response.data as any).fixedTimes && Array.isArray((response.data as any).fixedTimes)) {
          fixedTimesArray = (response.data as any).fixedTimes
        }

        const fixedTimes = fixedTimesArray.map(ft => this.parseFixedTime(ft))
        console.log(`✅ Fetched ${fixedTimes.length} fixed times`)
        return fixedTimes
      }
      return []
    } catch (error) {
      console.error('Error fetching fixed times:', error)
      return []
    }
  }

  async getFixedTimeById(id: string): Promise<FixedTime | null> {
    try {
      if (!id) throw new Error('Fixed time ID is required')

      const response = await this.handleRequest<FixedTime>(`/fixed-times/${id}`, {
        method: 'GET',
      })

      if (response.success && response.data) {
        return this.parseFixedTime(response.data)
      }
      return null
    } catch (error) {
      console.error('Error fetching fixed time:', error)
      return null
    }
  }

  async updateFixedTime(id: string, data: UpdateFixedTimeData): Promise<FixedTime | null> {
    try {
      if (!id) throw new Error('Fixed time ID is required')

      const payload: Record<string, any> = { ...data }
      if (data.days) {
        payload.days = data.days.map(d => this.toApiDayFormat(d))
      }

      const response = await this.handleRequest<FixedTime>(`/fixed-times/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const updatedFixedTime = this.parseFixedTime(response.data)

        toast.success('✨ Fixed Commitment Updated', {
          description: 'Your changes have been saved.',
          duration: 3000,
        })

        return updatedFixedTime
      }
      return null
    } catch (error) {
      console.error('Update fixed time error:', error)

      toast.error('Failed to Update Fixed Commitment', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async deleteFixedTime(id: string): Promise<boolean> {
    try {
      if (!id) throw new Error('Fixed time ID is required')

      const response = await this.handleRequest<any>(`/fixed-times/${id}`, {
        method: 'DELETE',
      })

      if (response.success) {
        toast.success('🗑️ Fixed Commitment Deleted', {
          description: 'The commitment has been removed.',
          duration: 4000,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Delete fixed time error:', error)

      toast.error('Failed to Delete Fixed Commitment', {
        description: 'Please try again.',
        duration: 4000,
      })
      return false
    }
  }

  async getTasksInFixedTime(id: string): Promise<any[]> {
    try {
      if (!id) throw new Error('Fixed time ID is required')

      const response = await this.handleRequest<any[]>(`/fixed-times/${id}/tasks`, {
        method: 'GET',
      })

      if (response.success && response.data) {
        return response.data
      }
      return []
    } catch (error) {
      console.error('Error fetching tasks in fixed time:', error)
      return []
    }
  }

  // ============= FREE PERIOD APIs =============

  async addFreePeriod(fixedTimeId: string, data: CreateFreePeriodData): Promise<FreePeriod | null> {
    try {
      if (!fixedTimeId) throw new Error('Fixed time ID is required')
      if (!data.title?.trim()) throw new Error('Free period title is required')

      const payload = {
        title: data.title.trim(),
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        day: this.toApiDayFormat(data.day),
      }

      const response = await this.handleRequest<FreePeriod>(`/fixed-times/${fixedTimeId}/free-periods`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.success && response.data) {
        const freePeriod = {
          ...response.data,
          day: this.fromApiDayFormat(response.data.day),
        }

        toast.success('☕ Free Period Added!', {
          description: `"${freePeriod.title}" has been added.`,
          duration: 4000,
        })

        return freePeriod
      }
      return null
    } catch (error) {
      console.error('Add free period error:', error)

      toast.error('Failed to Add Free Period', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async updateFreePeriod(
    fixedTimeId: string,
    freePeriodId: string,
    data: UpdateFreePeriodData
  ): Promise<FreePeriod | null> {
    try {
      if (!fixedTimeId || !freePeriodId) throw new Error('Fixed time ID and Free period ID are required')

      const payload: Record<string, any> = { ...data }
      if (data.day) {
        payload.day = this.toApiDayFormat(data.day)
      }

      const response = await this.handleRequest<FreePeriod>(
        `/fixed-times/${fixedTimeId}/free-periods/${freePeriodId}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      )

      if (response.success && response.data) {
        const freePeriod = {
          ...response.data,
          day: this.fromApiDayFormat(response.data.day),
        }

        toast.success('✨ Free Period Updated', {
          description: 'Your changes have been saved.',
          duration: 3000,
        })

        return freePeriod
      }
      return null
    } catch (error) {
      console.error('Update free period error:', error)

      toast.error('Failed to Update Free Period', {
        description: 'Please try again.',
        duration: 4000,
      })
      return null
    }
  }

  async deleteFreePeriod(fixedTimeId: string, freePeriodId: string): Promise<boolean> {
    try {
      if (!fixedTimeId || !freePeriodId) throw new Error('Fixed time ID and Free period ID are required')

      const response = await this.handleRequest<any>(
        `/fixed-times/${fixedTimeId}/free-periods/${freePeriodId}`,
        { method: 'DELETE' }
      )

      if (response.success) {
        toast.success('🗑️ Free Period Deleted', {
          description: 'The free period has been removed.',
          duration: 3000,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Delete free period error:', error)

      toast.error('Failed to Delete Free Period', {
        description: 'Please try again.',
        duration: 4000,
      })
      return false
    }
  }

  // Helper to parse fixed time dates and convert day formats
  private parseFixedTime(ft: any): FixedTime {
    return {
      ...ft,
      days: ft.days?.map((d: string) => this.fromApiDayFormat(d)) || [],
      freePeriods: ft.freePeriods?.map((fp: any) => ({
        ...fp,
        day: this.fromApiDayFormat(fp.day),
      })) || [],
      createdAt: ft.createdAt ? new Date(ft.createdAt) : undefined,
      updatedAt: ft.updatedAt ? new Date(ft.updatedAt) : undefined,
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

export const FixedTimesService = FixedTimesServiceClass.getInstance()

// ============= REACT HOOK =============
export function useFixedTimes() {
  const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchFixedTimes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('🚀 Fetching fixed times...')
      const fetchedFixedTimes = await FixedTimesService.getFixedTimes()
      setFixedTimes(fetchedFixedTimes || [])
      console.log(`✅ Successfully loaded ${fetchedFixedTimes?.length || 0} fixed times`)
    } catch (err: any) {
      console.error('❌ Failed to fetch fixed times:', err)
      setError(err.message || 'Failed to fetch fixed times')
      setFixedTimes([])
    } finally {
      setLoading(false)
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      if (mounted) {
        await fetchFixedTimes()
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [fetchFixedTimes])

  const createFixedTime = useCallback(async (data: CreateFixedTimeData) => {
    try {
      const newFixedTime = await FixedTimesService.createFixedTime(data)
      if (newFixedTime) {
        setFixedTimes(prev => Array.isArray(prev) ? [newFixedTime, ...prev] : [newFixedTime])
      }
      return newFixedTime
    } catch (error) {
      throw error
    }
  }, [])

  const updateFixedTime = useCallback(async (id: string, data: UpdateFixedTimeData) => {
    try {
      const updatedFixedTime = await FixedTimesService.updateFixedTime(id, data)
      if (updatedFixedTime) {
        setFixedTimes(prev =>
          Array.isArray(prev)
            ? prev.map(ft => ft.id === id ? updatedFixedTime : ft)
            : [updatedFixedTime]
        )
      }
      return updatedFixedTime
    } catch (error) {
      throw error
    }
  }, [])

  const deleteFixedTime = useCallback(async (id: string) => {
    try {
      const success = await FixedTimesService.deleteFixedTime(id)
      if (success) {
        setFixedTimes(prev =>
          Array.isArray(prev)
            ? prev.filter(ft => ft.id !== id)
            : []
        )
      }
      return success
    } catch (error) {
      throw error
    }
  }, [])

  const addFreePeriod = useCallback(async (fixedTimeId: string, data: CreateFreePeriodData) => {
    try {
      const newFreePeriod = await FixedTimesService.addFreePeriod(fixedTimeId, data)
      if (newFreePeriod) {
        setFixedTimes(prev =>
          Array.isArray(prev)
            ? prev.map(ft => {
                if (ft.id === fixedTimeId) {
                  return {
                    ...ft,
                    freePeriods: [...(ft.freePeriods || []), newFreePeriod],
                  }
                }
                return ft
              })
            : prev
        )
      }
      return newFreePeriod
    } catch (error) {
      throw error
    }
  }, [])

  const updateFreePeriod = useCallback(async (
    fixedTimeId: string,
    freePeriodId: string,
    data: UpdateFreePeriodData
  ) => {
    try {
      const updatedFreePeriod = await FixedTimesService.updateFreePeriod(fixedTimeId, freePeriodId, data)
      if (updatedFreePeriod) {
        setFixedTimes(prev =>
          Array.isArray(prev)
            ? prev.map(ft => {
                if (ft.id === fixedTimeId) {
                  return {
                    ...ft,
                    freePeriods: (ft.freePeriods || []).map(fp =>
                      fp.id === freePeriodId ? updatedFreePeriod : fp
                    ),
                  }
                }
                return ft
              })
            : prev
        )
      }
      return updatedFreePeriod
    } catch (error) {
      throw error
    }
  }, [])

  const deleteFreePeriod = useCallback(async (fixedTimeId: string, freePeriodId: string) => {
    try {
      const success = await FixedTimesService.deleteFreePeriod(fixedTimeId, freePeriodId)
      if (success) {
        setFixedTimes(prev =>
          Array.isArray(prev)
            ? prev.map(ft => {
                if (ft.id === fixedTimeId) {
                  return {
                    ...ft,
                    freePeriods: (ft.freePeriods || []).filter(fp => fp.id !== freePeriodId),
                  }
                }
                return ft
              })
            : prev
        )
      }
      return success
    } catch (error) {
      throw error
    }
  }, [])

  const getTasksInFixedTime = useCallback(async (fixedTimeId: string) => {
    try {
      return await FixedTimesService.getTasksInFixedTime(fixedTimeId)
    } catch (error) {
      return []
    }
  }, [])

  const refresh = useCallback(() => {
    fetchFixedTimes()
  }, [fetchFixedTimes])

  console.log('📅 FixedTimes Hook State - Current fixed times:', fixedTimes)

  return {
    // State
    fixedTimes: Array.isArray(fixedTimes) ? fixedTimes : [],
    loading,
    error,
    isInitialized,

    // Fixed Time CRUD
    fetchFixedTimes,
    createFixedTime,
    updateFixedTime,
    deleteFixedTime,

    // Free Period operations
    addFreePeriod,
    updateFreePeriod,
    deleteFreePeriod,

    // Utility
    getTasksInFixedTime,
    refresh,
  }
}
