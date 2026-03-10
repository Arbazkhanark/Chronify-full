// // src/hooks/use-goals.ts
// import { useState, useEffect } from 'react'

// interface Goal {
//   id: string
//   title: string
//   description?: string
//   type: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'DELAYED'
//   targetDate: Date
//   progress: number
//   subjects: string[]
//   currentStreak: number
//   longestStreak: number
//   delayedDays: number
//   isLocked: boolean
// }

// export function useGoals() {
//   const [goals, setGoals] = useState<Goal[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchGoals()
//   }, [])

//   const fetchGoals = async () => {
//     try {
//       // Mock API call
//       const mockGoals: Goal[] = [
//         {
//           id: '1',
//           title: 'Complete DSA in 3 months',
//           type: 'MEDIUM_TERM',
//           priority: 'CRITICAL',
//           status: 'IN_PROGRESS',
//           targetDate: new Date('2025-03-01'),
//           progress: 45,
//           subjects: ['DSA', 'Algorithms'],
//           currentStreak: 14,
//           longestStreak: 21,
//           delayedDays: 0,
//           isLocked: true
//         },
//         {
//           id: '2',
//           title: 'Learn AI/ML Basics',
//           type: 'LONG_TERM',
//           priority: 'HIGH',
//           status: 'IN_PROGRESS',
//           targetDate: new Date('2025-06-01'),
//           progress: 20,
//           subjects: ['AI/ML', 'Python'],
//           currentStreak: 7,
//           longestStreak: 15,
//           delayedDays: 2,
//           isLocked: false
//         },
//         {
//           id: '3',
//           title: 'Build Portfolio Website',
//           type: 'SHORT_TERM',
//           priority: 'MEDIUM',
//           status: 'COMPLETED',
//           targetDate: new Date('2024-12-15'),
//           progress: 100,
//           subjects: ['Web Development', 'React'],
//           currentStreak: 0,
//           longestStreak: 10,
//           delayedDays: 0,
//           isLocked: true
//         }
//       ]
//       setGoals(mockGoals)
//     } catch (error) {
//       console.log('Error fetching goals:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const createGoal = async (goalData: Partial<Goal>) => {
//     try {
//       const newGoal: Goal = {
//         id: Date.now().toString(),
//         title: goalData.title || '',
//         type: goalData.type || 'MEDIUM_TERM',
//         priority: goalData.priority || 'MEDIUM',
//         status: 'NOT_STARTED',
//         targetDate: goalData.targetDate || new Date(),
//         progress: 0,
//         subjects: goalData.subjects || [],
//         currentStreak: 0,
//         longestStreak: 0,
//         delayedDays: 0,
//         isLocked: false
//       }
//       setGoals([...goals, newGoal])
//       return newGoal
//     } catch (error) {
//       console.log('Error creating goal:', error)
//       throw error
//     }
//   }

//   const updateGoal = async (id: string, updates: Partial<Goal>) => {
//     try {
//       setGoals(goals.map(goal => 
//         goal.id === id ? { ...goal, ...updates } : goal
//       ))
//     } catch (error) {
//       console.log('Error updating goal:', error)
//       throw error
//     }
//   }

//   const deleteGoal = async (id: string) => {
//     try {
//       setGoals(goals.filter(goal => goal.id !== id))
//     } catch (error) {
//       console.log('Error deleting goal:', error)
//       throw error
//     }
//   }

//   const calculateGoalProgress = (goal: Goal) => {
//     // Auto-update progress based on tasks
//     const today = new Date()
//     const daysRemaining = Math.ceil((goal.targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
//     if (daysRemaining < 0 && goal.progress < 100) {
//       // Goal is overdue
//       return { ...goal, status: 'DELAYED', delayedDays: Math.abs(daysRemaining) }
//     }
    
//     return goal
//   }

//   return {
//     goals,
//     loading,
//     createGoal,
//     updateGoal,
//     deleteGoal,
//     calculateGoalProgress
//   }
// }





















// // hooks/useGoals.ts
// // src/hooks/use-goals.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api';

// // ============= TYPES =============

// export interface Milestone {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   targetDate: Date;
//   progress: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface Goal {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   type: 'SHORT_TERM' | 'LONG_TERM';
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
//   targetDate: Date;
//   completedAt: Date | null;
//   progress: number;
//   totalHours: number;
//   completedHours: number;
//   weeklyTarget: number;
//   color: string;
//   subject: string | null;
//   streak: number;
//   lastUpdated: Date;
//   isPublic: boolean;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   milestones: Milestone[];
//   tasks?: any[];
// }

// export interface GoalStats {
//   total: number;
//   active: number;
//   completed: number;
//   delayed: number;
//   totalHours: number;
//   completedHours: number;
//   averageProgress: number;
//   upcomingDeadlines: number;
//   highPriority: number;
//   streaks: {
//     current: number;
//     longest: number;
//     totalActiveDays: number;
//   };
//   categoryDistribution: Record<string, number>;
//   priorityDistribution: Record<string, number>;
//   statusDistribution: Record<string, number>;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// export interface ApiError {
//   success: boolean;
//   message: string;
//   errors?: Record<string, string[]>;
//   status?: number;
// }

// // ============= GOALS SERVICE =============

// class GoalsServiceClass {
//   private static instance: GoalsServiceClass;
//   private isRefreshing = false;
//   private refreshSubscribers: ((token: string) => void)[] = [];

//   private constructor() {}

//   static getInstance(): GoalsServiceClass {
//     if (!GoalsServiceClass.instance) {
//       GoalsServiceClass.instance = new GoalsServiceClass();
//     }
//     return GoalsServiceClass.instance;
//   }

//   private getAuthHeaders(): HeadersInit {
//     const token = AuthService.getAccessToken();
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     };
//   }

//   private onRefreshed(token: string) {
//     this.refreshSubscribers.forEach(callback => callback(token));
//     this.refreshSubscribers = [];
//   }

//   private addRefreshSubscriber(callback: (token: string) => void) {
//     this.refreshSubscribers.push(callback);
//   }

//   private async refreshToken(): Promise<boolean> {
//     try {
//       const refreshToken = AuthService.getRefreshToken();
//       if (!refreshToken) return false;

//       const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken }),
//       });

//       const data = await response.json();
      
//       if (response.ok && data.success) {
//         AuthService.setTokens(data.data.accessToken, data.data.refreshToken);
//         this.onRefreshed(data.data.accessToken);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Token refresh failed:', error);
//       return false;
//     }
//   }

//   // private async handleRequest<T>(
//   //   url: string,
//   //   options: RequestInit = {},
//   //   retryCount = 0
//   // ): Promise<ApiResponse<T>> {
//   //   const maxRetries = 2;
    
//   //   try {
//   //     // Log the request for debugging
//   //     console.log(`🌐 API Request: ${options.method || 'GET'} ${API_BASE_URL}${url}`);
      
//   //     const response = await fetch(`${API_BASE_URL}${url}`, {
//   //       ...options,
//   //       headers: {
//   //         ...this.getAuthHeaders(),
//   //         ...options.headers,
//   //       },
//   //     });

//   //     // Log response status for debugging
//   //     console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

//   //     let data;
//   //     const contentType = response.headers.get('content-type');
      
//   //     if (contentType && contentType.includes('application/json')) {
//   //       data = await response.json();
//   //     } else {
//   //       const text = await response.text();
//   //       console.log('Non-JSON response:', text);
//   //       throw {
//   //         success: false,
//   //         message: 'Invalid response format from server',
//   //         status: response.status,
//   //       };
//   //     }

//   //     // Log response data for debugging
//   //     console.log(`📦 Response Data:`, data);

//   //     if (!response.ok) {
//   //       // Handle 401 Unauthorized - Token expired
//   //       if (response.status === 401 && retryCount < maxRetries) {
//   //         console.log('🔄 Attempting to refresh token...');
          
//   //         if (!this.isRefreshing) {
//   //           this.isRefreshing = true;
//   //           const refreshed = await this.refreshToken();
//   //           this.isRefreshing = false;
            
//   //           if (refreshed) {
//   //             console.log('✅ Token refreshed, retrying request...');
//   //             return this.handleRequest(url, options, retryCount + 1);
//   //           }
//   //         } else {
//   //           // Wait for token refresh
//   //           return new Promise((resolve, reject) => {
//   //             this.addRefreshSubscriber(async (token) => {
//   //               try {
//   //                 const result = await this.handleRequest(url, options, retryCount + 1);
//   //                 resolve(result);
//   //               } catch (error) {
//   //                 reject(error);
//   //               }
//   //             });
//   //           });
//   //         }
//   //       }

//   //       throw {
//   //         success: false,
//   //         message: data.message || 'An error occurred',
//   //         errors: data.errors,
//   //         status: response.status,
//   //       };
//   //     }

//   //     return data;
//   //   } catch (error: any) {
//   //     // Log the full error for debugging
//   //     console.log('❌ API Error:', {
//   //       url,
//   //       method: options.method,
//   //       error: error.message || error,
//   //       status: error.status,
//   //       stack: error.stack
//   //     });

//   //     if (error instanceof Error) {
//   //       throw {
//   //         success: false,
//   //         message: error.message || 'Network error occurred',
//   //         status: 0,
//   //       };
//   //     }
//   //     throw error;
//   //   }
//   // }


//     private async handleRequest<T>(
//     url: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     };

//     if (this.accessToken) {
//       headers['Authorization'] = `Bearer ${this.accessToken}`;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         ...options,
//         headers,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw {
//           success: false,
//           message: data.message || 'An error occurred',
//           errors: data.errors,
//         };
//       }

//       return data;
//     } catch (error) {
//       if (error instanceof Error) {
//         throw {
//           success: false,
//           message: error.message || 'Network error occurred',
//         };
//       }
//       throw error;
//     }
//   }

//   private parseGoalDates(goal: any): Goal {
//     return {
//       ...goal,
//       targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(),
//       completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
//       createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
//       updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date(),
//       lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date(),
//       milestones: Array.isArray(goal.milestones) 
//         ? goal.milestones.map((m: any) => ({
//             ...m,
//             targetDate: m.targetDate ? new Date(m.targetDate) : new Date(),
//             createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
//             updatedAt: m.updatedAt ? new Date(m.updatedAt) : undefined,
//           }))
//         : [],
//     };
//   }

//   // ============= GOAL APIs =============

//   /**
//    * POST /goals - Create new goal
//    */
//   async createGoal(goalData: Partial<Goal>): Promise<Goal> {
//     try {
//       // Validate required fields
//       if (!goalData.title?.trim()) {
//         throw new Error('Goal title is required');
//       }

//       const payload: any = {
//         title: goalData.title.trim(),
//         description: goalData.description?.trim() || '',
//         category: goalData.category?.toUpperCase() || 'PERSONAL',
//         priority: goalData.priority || 'MEDIUM',
//         type: goalData.type || 'SHORT_TERM',
//         targetDate: goalData.targetDate instanceof Date 
//           ? goalData.targetDate.toISOString() 
//           : goalData.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//         totalHours: Number(goalData.totalHours) || 50,
//         weeklyTarget: Number(goalData.weeklyTarget) || 5,
//         color: goalData.color || '#3B82F6',
//         tags: Array.isArray(goalData.tags) ? goalData.tags : [],
//         isPublic: goalData.isPublic ?? true,
//       };

//       console.log('📤 Creating goal with payload:', payload);

//       const response = await this.handleRequest<Goal>('/goals', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       console.log('✅ Goal created successfully:', response);

//       if (response.success) {
//         const goal = this.parseGoalDates(response.data);
        
//         toast.success('🎯 Goal Created!', {
//           description: `"${goal.title}" has been added to your goals.`,
//           duration: 5000,
//           icon: '✨',
//         });
        
//         return goal;
//       }
//       throw new Error(response.message);
//     } catch (error: any) {
//       console.log('Create goal error:', error);
      
//       toast.error('Failed to Create Goal', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   /**
//    * GET /goals - Get all goals with optional filters
//    */
//   async getGoals(filters?: { filter?: string; priority?: string }): Promise<Goal[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       // Map filter values to API expected values
//       if (filters?.filter) {
//         let apiFilter = filters.filter;
        
//         // Convert UI filter names to API filter names
//         if (filters.filter === 'active') apiFilter = 'active';
//         else if (filters.filter === 'completed') apiFilter = 'completed';
//         else if (filters.filter === 'delayed') apiFilter = 'delayed';
//         else if (filters.filter === 'not_started') apiFilter = 'not_started';
//         else if (filters.filter === 'short') apiFilter = 'short';
//         else if (filters.filter === 'long') apiFilter = 'long';
        
//         queryParams.append('filter', apiFilter);
//       }
      
//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority);
//       }
      
//       const url = `/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
//       console.log('🔍 Fetching goals from:', url);
      
//       const response = await this.handleRequest<Goal[]>(url, { method: 'GET' });

//       if (response.success) {
//         const goals = Array.isArray(response.data) 
//           ? response.data.map(goal => this.parseGoalDates(goal))
//           : [];
//         console.log(`✅ Fetched ${goals.length} goals`);
//         return goals;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching goals:', error);
      
//       // Don't show toast for 401 errors (will be handled by auth)
//       if ((error as any)?.status !== 401) {
//         toast.error('Failed to Load Goals', {
//           description: 'Unable to fetch your goals. Please refresh.',
//           duration: 4000,
//         });
//       }
//       return [];
//     }
//   }

//   /**
//    * GET /goals/:goalId - Get specific goal
//    */
//   async getGoalById(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
      
//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'GET',
//       });

//       if (response.success) {
//         return this.parseGoalDates(response.data);
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching goal:', error);
//       return null;
//     }
//   }

//   /**
//    * PUT /goals/:goalId - Update goal
//    */
//   async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       // Filter out undefined values
//       const payload: any = {};
//       if (updates.title !== undefined) payload.title = updates.title;
//       if (updates.description !== undefined) payload.description = updates.description;
//       if (updates.priority !== undefined) payload.priority = updates.priority;
//       if (updates.status !== undefined) payload.status = updates.status;
//       if (updates.progress !== undefined) payload.progress = updates.progress;
//       if (updates.completedHours !== undefined) payload.completedHours = updates.completedHours;
//       if (updates.totalHours !== undefined) payload.totalHours = updates.totalHours;
//       if (updates.weeklyTarget !== undefined) payload.weeklyTarget = updates.weeklyTarget;
//       if (updates.color !== undefined) payload.color = updates.color;
//       if (updates.tags !== undefined) payload.tags = updates.tags;
//       if (updates.isPublic !== undefined) payload.isPublic = updates.isPublic;
//       if (updates.streak !== undefined) payload.streak = updates.streak;

//       console.log('📝 Updating goal:', goalId, payload);

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         toast.success('✨ Goal Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update goal error:', error);
      
//       toast.error('Failed to Update Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   /**
//    * PUT /goals/:goalId - Update goal status and progress
//    */
//   async updateGoalStatus(goalId: string, status: Goal['status'], progress: number, completedHours?: number): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: any = { 
//         status, 
//         progress: Math.min(100, Math.max(0, progress))
//       };
      
//       if (completedHours !== undefined) {
//         payload.completedHours = completedHours;
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         const messages: Record<string, { title: string; desc: string }> = {
//           'IN_PROGRESS': { title: '▶️ Goal Started!', desc: 'You\'re making progress!' },
//           'COMPLETED': { title: '🎉 Congratulations!', desc: 'Goal completed successfully!' },
//           'DELAYED': { title: '⚠️ Goal Delayed', desc: 'Don\'t worry, adjust your plan.' },
//           'NOT_STARTED': { title: '⏸️ Goal Paused', desc: 'Take your time.' },
//         };
        
//         toast.success(messages[status]?.title || 'Status Updated', {
//           description: messages[status]?.desc || `Progress: ${progress}%`,
//           duration: 5000,
//         });
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update status error:', error);
      
//       toast.error('Failed to Update Status', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   /**
//    * PUT /goals/:goalId - Mark goal as completed
//    */
//   async markGoalAsCompleted(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify({ 
//           status: 'COMPLETED', 
//           progress: 100,
//           completedAt: new Date().toISOString()
//         }),
//       });

//       if (response.success) {
//         const completedGoal = this.parseGoalDates(response.data);
        
//         toast.success('🏆 Goal Achieved!', {
//           description: `"${completedGoal.title}" - Amazing work! 🎉`,
//           duration: 7000,
//           icon: '🌟',
//         });
        
//         return completedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Mark as completed error:', error);
      
//       toast.error('Failed to Mark as Completed', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   /**
//    * DELETE /goals/:goalId - Delete goal
//    */
//   async deleteGoal(goalId: string): Promise<boolean> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<any>(`/goals/${goalId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Goal Deleted', {
//           description: 'The goal has been removed.',
//           duration: 4000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete goal error:', error);
      
//       toast.error('Failed to Delete Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   /**
//    * GET /goals/stats - Get goal statistics
//    */
//   async getGoalStats(): Promise<GoalStats | null> {
//     try {
//       console.log('📊 Fetching goal stats...');
      
//       const response = await this.handleRequest<any>('/goals/stats', {
//         method: 'GET',
//       });

//       if (response.success) {
//         console.log('✅ Stats fetched successfully:', response.data);
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching stats:', error);
      
//       // Don't show toast for 401 errors
//       if ((error as any)?.status !== 401) {
//         toast.error('Failed to Load Statistics', {
//           description: 'Unable to fetch goal statistics.',
//           duration: 4000,
//         });
//       }
//       return null;
//     }
//   }

//   // ============= MILESTONE APIs =============

//   /**
//    * POST /goals/:goalId/milestones - Add milestone
//    */
//   async addMilestone(
//     goalId: string,
//     milestoneData: { title: string; description: string; targetDate: Date | string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (!milestoneData.title?.trim()) throw new Error('Milestone title is required');

//       const payload = {
//         title: milestoneData.title.trim(),
//         description: milestoneData.description?.trim() || '',
//         targetDate: milestoneData.targetDate instanceof Date 
//           ? milestoneData.targetDate.toISOString() 
//           : milestoneData.targetDate,
//       };

//       console.log('📌 Adding milestone to goal:', goalId, payload);

//       const response = await this.handleRequest<Milestone>(`/goals/${goalId}/milestones`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success) {
//         const milestone = {
//           ...response.data,
//           targetDate: new Date(response.data.targetDate),
//           createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
//           updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined,
//         };
        
//         toast.success('🎯 Milestone Added!', {
//           description: `"${milestone.title}" has been added.`,
//           duration: 4000,
//         });
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Add milestone error:', error);
      
//       toast.error('Failed to Add Milestone', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   /**
//    * PUT /goals/:goalId/milestones/:milestoneId - Update milestone
//    */
//   async updateMilestone(
//     goalId: string,
//     milestoneId: string,
//     updates: { completed?: boolean; progress?: number; title?: string; description?: string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const payload: any = {};
//       if (updates.completed !== undefined) payload.completed = updates.completed;
//       if (updates.progress !== undefined) payload.progress = updates.progress;
//       if (updates.title !== undefined) payload.title = updates.title;
//       if (updates.description !== undefined) payload.description = updates.description;

//       const response = await this.handleRequest<Milestone>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'PUT', body: JSON.stringify(payload) }
//       );

//       if (response.success) {
//         const milestone = { 
//           ...response.data, 
//           targetDate: new Date(response.data.targetDate) 
//         };
        
//         if (updates.completed !== undefined) {
//           if (updates.completed) {
//             toast.success('✅ Milestone Completed!', {
//               description: `"${milestone.title}" - Great progress!`,
//               duration: 4000,
//             });
//           } else {
//             toast.info('🔄 Milestone Reopened', {
//               description: `"${milestone.title}" has been reopened.`,
//               duration: 3000,
//             });
//           }
//         } else if (updates.progress !== undefined) {
//           toast.success('📊 Milestone Progress Updated', {
//             description: `Progress: ${updates.progress}%`,
//             duration: 3000,
//           });
//         }
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update milestone error:', error);
      
//       toast.error('Failed to Update Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   /**
//    * DELETE /goals/:goalId/milestones/:milestoneId - Delete milestone
//    */
//   async deleteMilestone(goalId: string, milestoneId: string): Promise<boolean> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const response = await this.handleRequest<any>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'DELETE' }
//       );

//       if (response.success) {
//         toast.success('🗑️ Milestone Deleted', {
//           description: 'The milestone has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete milestone error:', error);
      
//       toast.error('Failed to Delete Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   // ============= UTILITY METHODS =============

//   async logProgressHours(goalId: string, hours: number): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (hours <= 0) throw new Error('Hours must be greater than 0');

//       const goal = await this.getGoalById(goalId);
//       if (!goal) throw new Error('Goal not found');
      
//       const newCompletedHours = Math.min(goal.totalHours, (goal.completedHours || 0) + hours);
//       const progress = Math.round((newCompletedHours / (goal.totalHours || 1)) * 100);
      
//       // Update streak
//       const today = new Date().toDateString();
//       const lastUpdated = goal.lastUpdated ? new Date(goal.lastUpdated).toDateString() : null;
//       const newStreak = today === lastUpdated ? (goal.streak || 0) : (goal.streak || 0) + 1;
      
//       const updatedGoal = await this.updateGoal(goalId, {
//         completedHours: newCompletedHours,
//         progress: Math.min(100, progress),
//         status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
//         streak: newStreak,
//         lastUpdated: new Date(),
//       });
      
//       if (updatedGoal) {
//         toast.success(`⏱️ Logged ${hours} hour${hours > 1 ? 's' : ''}`, {
//           description: `Progress: ${progress}% • Streak: ${newStreak} days 🔥`,
//           duration: 4000,
//         });
//       }
      
//       return updatedGoal;
//     } catch (error) {
//       console.log('Log progress error:', error);
      
//       toast.error('Failed to Log Progress', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   getDaysUntilDeadline(targetDate: Date): number {
//     if (!targetDate) return 0;
//     const diffTime = targetDate.getTime() - new Date().getTime();
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   }

//   isGoalOverdue(goal: Goal): boolean {
//     if (!goal || goal.status === 'COMPLETED') return false;
//     return this.getDaysUntilDeadline(goal.targetDate) < 0;
//   }

//   getEffectiveStatus(goal: Goal): Goal['status'] {
//     if (!goal) return 'NOT_STARTED';
//     if (goal.status === 'COMPLETED') return 'COMPLETED';
//     if (this.isGoalOverdue(goal) && goal.status !== 'DELAYED') {
//       return 'DELAYED';
//     }
//     return goal.status;
//   }

//   // Helper method to check if API is accessible
//   async checkHealth(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });
//       return response.ok;
//     } catch (error) {
//       console.log('Health check failed:', error);
//       return false;
//     }
//   }
// }

// export const GoalsService = GoalsServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useGoals() {
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<GoalStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchGoals = useCallback(async (filters?: { filter?: string; priority?: string }) => {
//     // Check if user is authenticated
//     const token = AuthService.getAccessToken();
//     if (!token) {
//       console.log('⏸️ No auth token, skipping goals fetch');
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching goals with filters:', filters);
      
//       const [fetchedGoals, fetchedStats] = await Promise.all([
//         GoalsService.getGoals(filters),
//         GoalsService.getGoalStats()
//       ]);
      
//       setGoals(fetchedGoals);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedGoals.length} goals`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch goals:', err);
//       setError(err.message || 'Failed to fetch goals');
      
//       // Don't show error toast for 401 (handled by auth)
//       if (err?.status !== 401) {
//         toast.error('Failed to Load Goals', {
//           description: 'Please check your connection and try again.',
//           duration: 4000,
//         });
//       }
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   // Initial fetch
//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchGoals();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchGoals]);

//   const createGoal = useCallback(async (goalData: Partial<Goal>) => {
//     try {
//       const newGoal = await GoalsService.createGoal(goalData);
//       if (newGoal) {
//         setGoals(prev => [newGoal, ...prev]);
        
//         // Refresh stats
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return newGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoal(id, updates);
//       if (updatedGoal) {
//         setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
        
//         // Refresh stats
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoalStatus = useCallback(async (id: string, status: Goal['status'], progress: number, completedHours?: number) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoalStatus(id, status, progress, completedHours);
//       if (updatedGoal) {
//         setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
        
//         // Refresh stats
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const markGoalAsCompleted = useCallback(async (id: string) => {
//     try {
//       const completedGoal = await GoalsService.markGoalAsCompleted(id);
//       if (completedGoal) {
//         setGoals(prev => prev.map(g => g.id === id ? completedGoal : g));
        
//         // Refresh stats
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return completedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteGoal = useCallback(async (id: string) => {
//     try {
//       const success = await GoalsService.deleteGoal(id);
//       if (success) {
//         setGoals(prev => prev.filter(g => g.id !== id));
        
//         // Refresh stats
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const addMilestone = useCallback(async (goalId: string, milestoneData: any) => {
//     try {
//       const newMilestone = await GoalsService.addMilestone(goalId, milestoneData);
//       if (newMilestone) {
//         setGoals(prev => prev.map(goal => {
//           if (goal.id === goalId) {
//             return {
//               ...goal,
//               milestones: [...(goal.milestones || []), newMilestone],
//             };
//           }
//           return goal;
//         }));
//       }
//       return newMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateMilestone = useCallback(async (goalId: string, milestoneId: string, updates: any) => {
//     try {
//       const updatedMilestone = await GoalsService.updateMilestone(goalId, milestoneId, updates);
//       if (updatedMilestone) {
//         setGoals(prev => prev.map(goal => {
//           if (goal.id === goalId) {
//             return {
//               ...goal,
//               milestones: (goal.milestones || []).map(m => 
//                 m.id === milestoneId ? updatedMilestone : m
//               ),
//             };
//           }
//           return goal;
//         }));
//       }
//       return updatedMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     const goal = goals.find(g => g.id === goalId);
//     const milestone = goal?.milestones?.find(m => m.id === milestoneId);
//     if (!goal || !milestone) return null;
    
//     return updateMilestone(goalId, milestoneId, { 
//       completed: !milestone.completed,
//       progress: !milestone.completed ? 100 : 0,
//     });
//   }, [goals, updateMilestone]);

//   const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     try {
//       const success = await GoalsService.deleteMilestone(goalId, milestoneId);
//       if (success) {
//         setGoals(prev => prev.map(goal => {
//           if (goal.id === goalId) {
//             return {
//               ...goal,
//               milestones: (goal.milestones || []).filter(m => m.id !== milestoneId),
//             };
//           }
//           return goal;
//         }));
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const logProgressHours = useCallback(async (goalId: string, hours: number) => {
//     try {
//       const updatedGoal = await GoalsService.logProgressHours(goalId, hours);
//       if (updatedGoal) {
//         setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
        
//         // Refresh stats
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchGoals();
//   }, [fetchGoals]);

//   const checkHealth = useCallback(async () => {
//     return GoalsService.checkHealth();
//   }, []);

//   return {
//     // State
//     goals,
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // Goal CRUD
//     fetchGoals,
//     createGoal,
//     updateGoal,
//     updateGoalStatus,
//     markGoalAsCompleted,
//     deleteGoal,
    
//     // Milestone operations
//     addMilestone,
//     updateMilestone,
//     toggleMilestone,
//     deleteMilestone,
    
//     // Progress tracking
//     logProgressHours,
    
//     // Utility
//     refresh,
//     checkHealth,
//     getDaysUntilDeadline: GoalsService.getDaysUntilDeadline.bind(GoalsService),
//     isGoalOverdue: GoalsService.isGoalOverdue.bind(GoalsService),
//     getEffectiveStatus: GoalsService.getEffectiveStatus.bind(GoalsService),
//   };
// }


















// // // src/hooks/use-goals.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// // Use proxy URL instead of direct API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/v0/api';

// // ============= TYPES =============

// export interface Milestone {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   targetDate: Date;
//   progress: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface Goal {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   type: 'SHORT_TERM' | 'LONG_TERM';
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
//   targetDate: Date;
//   completedAt: Date | null;
//   progress: number;
//   totalHours: number;
//   completedHours: number;
//   weeklyTarget: number;
//   color: string;
//   subject: string | null;
//   streak: number;
//   lastUpdated: Date;
//   isPublic: boolean;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   milestones: Milestone[];
//   tasks?: any[];
// }

// export interface GoalStats {
//   total: number;
//   active: number;
//   completed: number;
//   delayed: number;
//   totalHours: number;
//   completedHours: number;
//   averageProgress: number;
//   upcomingDeadlines: number;
//   highPriority: number;
//   streaks: {
//     current: number;
//     longest: number;
//     totalActiveDays: number;
//   };
//   categoryDistribution: Record<string, number>;
//   priorityDistribution: Record<string, number>;
//   statusDistribution: Record<string, number>;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= GOALS SERVICE =============

// class GoalsServiceClass {
//   private static instance: GoalsServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     // Initialize token
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
      
//       // Set test token if none exists (for development)
//       if (!this.accessToken) {
//         AuthService.setTestToken();
//         this.accessToken = AuthService.getAccessToken();
//       }
//     }
//   }

//   static getInstance(): GoalsServiceClass {
//     if (!GoalsServiceClass.instance) {
//       GoalsServiceClass.instance = new GoalsServiceClass();
//     }
//     return GoalsServiceClass.instance;
//   }

//   private getAuthHeaders(): HeadersInit {
//     // Always get fresh token
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
    
//     // Log request for debugging
//     console.log(`🌐 Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`);
//     console.log('📋 Headers:', { ...headers, Authorization: headers.Authorization ? 'Bearer [HIDDEN]' : undefined });

//     try {
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         ...options,
//         headers: {
//           ...headers,
//           ...options.headers,
//         },
//         credentials: 'omit', // Don't send cookies for CORS
//         mode: 'cors', // Explicitly set CORS mode
//       });

//       console.log(`📡 Response status: ${response.status} ${response.statusText}`);

//       // Handle non-JSON responses
//       const contentType = response.headers.get('content-type');
//       if (!contentType?.includes('application/json')) {
//         const text = await response.text();
//         console.log('Non-JSON response:', text);
//         throw new Error('Server returned non-JSON response');
//       }

//       const data = await response.json();
//       console.log('📦 Response data:', data);

//       if (!response.ok) {
//         // Handle specific error cases
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

//       // Handle network errors
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

//   private parseGoalDates(goal: any): Goal {
//     return {
//       ...goal,
//       targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(),
//       completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
//       createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
//       updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date(),
//       lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date(),
//       milestones: Array.isArray(goal.milestones) 
//         ? goal.milestones.map((m: any) => ({
//             ...m,
//             targetDate: m.targetDate ? new Date(m.targetDate) : new Date(),
//             createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
//             updatedAt: m.updatedAt ? new Date(m.updatedAt) : undefined,
//           }))
//         : [],
//     };
//   }

//   // ============= GOAL APIs =============

//   async createGoal(goalData: Partial<Goal>): Promise<Goal> {
//     try {
//       if (!goalData.title?.trim()) {
//         throw new Error('Goal title is required');
//       }

//       // Map category to uppercase if it's in lowercase
//       let category = goalData.category;
//       if (category && typeof category === 'string') {
//         category = category.toUpperCase() as Goal['category'];
//       }

//       const payload = {
//         title: goalData.title.trim(),
//         description: goalData.description?.trim() || '',
//         category: category || 'PERSONAL',
//         priority: goalData.priority || 'MEDIUM',
//         type: goalData.type || 'SHORT_TERM',
//         targetDate: goalData.targetDate instanceof Date 
//           ? goalData.targetDate.toISOString() 
//           : goalData.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//         totalHours: Number(goalData.totalHours) || 50,
//         weeklyTarget: Number(goalData.weeklyTarget) || 5,
//         color: goalData.color || '#3B82F6',
//         tags: Array.isArray(goalData.tags) ? goalData.tags : [],
//         isPublic: goalData.isPublic ?? true,
//       };

//       console.log('📤 Creating goal with payload:', payload);

//       const response = await this.handleRequest<Goal>('/goals', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const goal = this.parseGoalDates(response.data);
        
//         toast.success('🎯 Goal Created!', {
//           description: `"${goal.title}" has been added to your goals.`,
//           duration: 5000,
//           icon: '✨',
//         });
        
//         return goal;
//       }
//       throw new Error(response.message || 'Failed to create goal');
//     } catch (error: any) {
//       console.log('Create goal error:', error);
      
//       toast.error('Failed to Create Goal', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getGoals(filters?: { filter?: string; priority?: string }): Promise<Goal[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters?.filter && filters.filter !== 'all') {
//         queryParams.append('filter', filters.filter);
//       }
      
//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority);
//       }
      
//       const url = `/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
//       console.log('🔍 Fetching goals:', url);
      
//       const response = await this.handleRequest<Goal[]>(url, { method: 'GET' });

//       if (response.success && Array.isArray(response.data)) {
//         const goals = response.data.map(goal => this.parseGoalDates(goal));
//         console.log(`✅ Fetched ${goals.length} goals`);
//         return goals;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching goals:', error);
//       return [];
//     }
//   }

//   async getGoalById(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
      
//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return this.parseGoalDates(response.data);
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching goal:', error);
//       return null;
//     }
//   }

//   async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = [
//         'title', 'description', 'priority', 'status', 'progress',
//         'completedHours', 'totalHours', 'weeklyTarget', 'color',
//         'tags', 'isPublic', 'streak', 'category', 'type'
//       ];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof Goal] !== undefined) {
//           payload[key] = updates[key as keyof Goal];
//         }
//       });

//       // Handle date fields
//       if (updates.targetDate) {
//         payload.targetDate = updates.targetDate instanceof Date 
//           ? updates.targetDate.toISOString() 
//           : updates.targetDate;
//       }

//       console.log('📝 Updating goal:', goalId, payload);

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         toast.success('✨ Goal Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update goal error:', error);
      
//       toast.error('Failed to Update Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateGoalStatus(
//     goalId: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: any = { status };
      
//       if (progress !== undefined) {
//         payload.progress = Math.min(100, Math.max(0, progress));
//       }
      
//       if (completedHours !== undefined) {
//         payload.completedHours = completedHours;
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         const statusMessages = {
//           'IN_PROGRESS': { title: '▶️ Goal Started!', desc: 'You\'re making progress!' },
//           'COMPLETED': { title: '🎉 Congratulations!', desc: 'Goal completed successfully!' },
//           'DELAYED': { title: '⚠️ Goal Delayed', desc: 'Don\'t worry, adjust your plan.' },
//           'NOT_STARTED': { title: '⏸️ Goal Paused', desc: 'Take your time.' },
//         };
        
//         const message = statusMessages[status as keyof typeof statusMessages];
//         if (message) {
//           toast.success(message.title, {
//             description: message.desc,
//             duration: 5000,
//           });
//         }
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update status error:', error);
      
//       toast.error('Failed to Update Status', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async markGoalAsCompleted(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify({ 
//           status: 'COMPLETED', 
//           progress: 100,
//           completedAt: new Date().toISOString()
//         }),
//       });

//       if (response.success && response.data) {
//         const completedGoal = this.parseGoalDates(response.data);
        
//         toast.success('🏆 Goal Achieved!', {
//           description: `"${completedGoal.title}" - Amazing work! 🎉`,
//           duration: 7000,
//           icon: '🌟',
//         });
        
//         return completedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Mark as completed error:', error);
      
//       toast.error('Failed to Mark as Completed', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteGoal(goalId: string): Promise<boolean> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<any>(`/goals/${goalId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Goal Deleted', {
//           description: 'The goal has been removed.',
//           duration: 4000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete goal error:', error);
      
//       toast.error('Failed to Delete Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getGoalStats(): Promise<GoalStats | null> {
//     try {
//       console.log('📊 Fetching goal stats...');
      
//       const response = await this.handleRequest<any>('/goals/stats', {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         console.log('✅ Stats fetched successfully:', response.data);
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching stats:', error);
//       return null;
//     }
//   }

//   // ============= MILESTONE APIs =============

//   async addMilestone(
//     goalId: string,
//     milestoneData: { title: string; description: string; targetDate: Date | string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (!milestoneData.title?.trim()) throw new Error('Milestone title is required');

//       const payload = {
//         title: milestoneData.title.trim(),
//         description: milestoneData.description?.trim() || '',
//         targetDate: milestoneData.targetDate instanceof Date 
//           ? milestoneData.targetDate.toISOString() 
//           : milestoneData.targetDate,
//       };

//       console.log('📌 Adding milestone to goal:', goalId, payload);

//       const response = await this.handleRequest<Milestone>(`/goals/${goalId}/milestones`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const milestone = {
//           ...response.data,
//           targetDate: new Date(response.data.targetDate),
//           createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
//           updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined,
//         };
        
//         toast.success('🎯 Milestone Added!', {
//           description: `"${milestone.title}" has been added.`,
//           duration: 4000,
//         });
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Add milestone error:', error);
      
//       toast.error('Failed to Add Milestone', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateMilestone(
//     goalId: string,
//     milestoneId: string,
//     updates: { completed?: boolean; progress?: number; title?: string; description?: string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const payload: Record<string, any> = {};
//       if (updates.completed !== undefined) payload.completed = updates.completed;
//       if (updates.progress !== undefined) payload.progress = updates.progress;
//       if (updates.title !== undefined) payload.title = updates.title;
//       if (updates.description !== undefined) payload.description = updates.description;

//       const response = await this.handleRequest<Milestone>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'PUT', body: JSON.stringify(payload) }
//       );

//       if (response.success && response.data) {
//         const milestone = { 
//           ...response.data, 
//           targetDate: new Date(response.data.targetDate) 
//         };
        
//         if (updates.completed !== undefined) {
//           if (updates.completed) {
//             toast.success('✅ Milestone Completed!', {
//               description: `"${milestone.title}" - Great progress!`,
//               duration: 4000,
//             });
//           } else {
//             toast.info('🔄 Milestone Reopened', {
//               description: `"${milestone.title}" has been reopened.`,
//               duration: 3000,
//             });
//           }
//         } else if (updates.progress !== undefined) {
//           toast.success('📊 Milestone Progress Updated', {
//             description: `Progress: ${updates.progress}%`,
//             duration: 3000,
//           });
//         }
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update milestone error:', error);
      
//       toast.error('Failed to Update Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteMilestone(goalId: string, milestoneId: string): Promise<boolean> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const response = await this.handleRequest<any>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'DELETE' }
//       );

//       if (response.success) {
//         toast.success('🗑️ Milestone Deleted', {
//           description: 'The milestone has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete milestone error:', error);
      
//       toast.error('Failed to Delete Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async logProgressHours(goalId: string, hours: number): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (hours <= 0) throw new Error('Hours must be greater than 0');

//       const goal = await this.getGoalById(goalId);
//       if (!goal) throw new Error('Goal not found');
      
//       const newCompletedHours = Math.min(goal.totalHours, (goal.completedHours || 0) + hours);
//       const progress = Math.round((newCompletedHours / (goal.totalHours || 1)) * 100);
      
//       // Update streak
//       const today = new Date().toDateString();
//       const lastUpdated = goal.lastUpdated ? new Date(goal.lastUpdated).toDateString() : null;
//       const newStreak = today === lastUpdated ? (goal.streak || 0) : (goal.streak || 0) + 1;
      
//       const updatedGoal = await this.updateGoal(goalId, {
//         completedHours: newCompletedHours,
//         progress: Math.min(100, progress),
//         status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
//         streak: newStreak,
//         lastUpdated: new Date(),
//       });
      
//       if (updatedGoal) {
//         toast.success(`⏱️ Logged ${hours} hour${hours > 1 ? 's' : ''}`, {
//           description: `Progress: ${progress}% • Streak: ${newStreak} days 🔥`,
//           duration: 4000,
//         });
//       }
      
//       return updatedGoal;
//     } catch (error) {
//       console.log('Log progress error:', error);
      
//       toast.error('Failed to Log Progress', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async checkHealth(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });
//       return response.ok;
//     } catch (error) {
//       console.log('Health check failed:', error);
//       return false;
//     }
//   }
// }

// export const GoalsService = GoalsServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useGoals() {
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<GoalStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchGoals = useCallback(async (filters?: { filter?: string; priority?: string }) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching goals with filters:', filters);
      
//       const [fetchedGoals, fetchedStats] = await Promise.all([
//         GoalsService.getGoals(filters),
//         GoalsService.getGoalStats()
//       ]);
      
//       setGoals(fetchedGoals);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedGoals.length} goals`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch goals:', err);
//       setError(err.message || 'Failed to fetch goals');
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchGoals();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchGoals]);

//   const createGoal = useCallback(async (goalData: Partial<Goal>) => {
//     try {
//       const newGoal = await GoalsService.createGoal(goalData);
//       if (newGoal) {
//         setGoals(prev => [newGoal, ...prev]);
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return newGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoal(id, updates);
//       if (updatedGoal) {
//         setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoalStatus = useCallback(async (
//     id: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoalStatus(id, status, progress, completedHours);
//       if (updatedGoal) {
//         setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const markGoalAsCompleted = useCallback(async (id: string) => {
//     try {
//       const completedGoal = await GoalsService.markGoalAsCompleted(id);
//       if (completedGoal) {
//         setGoals(prev => prev.map(g => g.id === id ? completedGoal : g));
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return completedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteGoal = useCallback(async (id: string) => {
//     try {
//       const success = await GoalsService.deleteGoal(id);
//       if (success) {
//         setGoals(prev => prev.filter(g => g.id !== id));
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const addMilestone = useCallback(async (goalId: string, milestoneData: any) => {
//     try {
//       const newMilestone = await GoalsService.addMilestone(goalId, milestoneData);
//       if (newMilestone) {
//         setGoals(prev => prev.map(goal => {
//           if (goal.id === goalId) {
//             return {
//               ...goal,
//               milestones: [...(goal.milestones || []), newMilestone],
//             };
//           }
//           return goal;
//         }));
//       }
//       return newMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateMilestone = useCallback(async (
//     goalId: string, 
//     milestoneId: string, 
//     updates: any
//   ) => {
//     try {
//       const updatedMilestone = await GoalsService.updateMilestone(goalId, milestoneId, updates);
//       if (updatedMilestone) {
//         setGoals(prev => prev.map(goal => {
//           if (goal.id === goalId) {
//             return {
//               ...goal,
//               milestones: (goal.milestones || []).map(m => 
//                 m.id === milestoneId ? updatedMilestone : m
//               ),
//             };
//           }
//           return goal;
//         }));
//       }
//       return updatedMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     const goal = goals.find(g => g.id === goalId);
//     const milestone = goal?.milestones?.find(m => m.id === milestoneId);
//     if (!goal || !milestone) return null;
    
//     return updateMilestone(goalId, milestoneId, { 
//       completed: !milestone.completed,
//       progress: !milestone.completed ? 100 : 0,
//     });
//   }, [goals, updateMilestone]);

//   const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     try {
//       const success = await GoalsService.deleteMilestone(goalId, milestoneId);
//       if (success) {
//         setGoals(prev => prev.map(goal => {
//           if (goal.id === goalId) {
//             return {
//               ...goal,
//               milestones: (goal.milestones || []).filter(m => m.id !== milestoneId),
//             };
//           }
//           return goal;
//         }));
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const logProgressHours = useCallback(async (goalId: string, hours: number) => {
//     try {
//       const updatedGoal = await GoalsService.logProgressHours(goalId, hours);
//       if (updatedGoal) {
//         setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchGoals();
//   }, [fetchGoals]);

//   return {
//     // State
//     goals,
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // Goal CRUD
//     fetchGoals,
//     createGoal,
//     updateGoal,
//     updateGoalStatus,
//     markGoalAsCompleted,
//     deleteGoal,
    
//     // Milestone operations
//     addMilestone,
//     updateMilestone,
//     toggleMilestone,
//     deleteMilestone,
    
//     // Progress tracking
//     logProgressHours,
    
//     // Utility
//     refresh,
//   };
// }


























// // src/hooks/use-goals.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// // Use proxy URL instead of direct API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/v0/api';

// // ============= TYPES =============

// export interface Milestone {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   targetDate: Date;
//   progress: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface Goal {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   type: 'SHORT_TERM' | 'LONG_TERM';
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
//   targetDate: Date;
//   completedAt: Date | null;
//   progress: number;
//   totalHours: number;
//   completedHours: number;
//   weeklyTarget: number;
//   color: string;
//   subject: string | null;
//   streak: number;
//   lastUpdated: Date;
//   isPublic: boolean;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   milestones: Milestone[];
//   tasks?: any[];
// }

// export interface GoalStats {
//   total: number;
//   active: number;
//   completed: number;
//   delayed: number;
//   totalHours: number;
//   completedHours: number;
//   averageProgress: number;
//   upcomingDeadlines: number;
//   highPriority: number;
//   streaks: {
//     current: number;
//     longest: number;
//     totalActiveDays: number;
//   };
//   categoryDistribution: Record<string, number>;
//   priorityDistribution: Record<string, number>;
//   statusDistribution: Record<string, number>;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= GOALS SERVICE =============

// class GoalsServiceClass {
//   private static instance: GoalsServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     // Initialize token
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
      
//       // Set test token if none exists (for development)
//       if (!this.accessToken) {
//         AuthService.setTestToken();
//         this.accessToken = AuthService.getAccessToken();
//       }
//     }
//   }

//   static getInstance(): GoalsServiceClass {
//     if (!GoalsServiceClass.instance) {
//       GoalsServiceClass.instance = new GoalsServiceClass();
//     }
//     return GoalsServiceClass.instance;
//   }

//   private getAuthHeaders(): HeadersInit {
//     // Always get fresh token
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

//       console.log(`📡 Response status: ${response.status} ${response.statusText}`);

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

//   private parseGoalDates(goal: any): Goal {
//     return {
//       ...goal,
//       targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(),
//       completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
//       createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
//       updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date(),
//       lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date(),
//       milestones: Array.isArray(goal.milestones) 
//         ? goal.milestones.map((m: any) => ({
//             ...m,
//             targetDate: m.targetDate ? new Date(m.targetDate) : new Date(),
//             createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
//             updatedAt: m.updatedAt ? new Date(m.updatedAt) : undefined,
//           }))
//         : [],
//     };
//   }

//   // ============= GOAL APIs =============

//   async createGoal(goalData: Partial<Goal>): Promise<Goal> {
//     try {
//       if (!goalData.title?.trim()) {
//         throw new Error('Goal title is required');
//       }

//       let category = goalData.category;
//       if (category && typeof category === 'string') {
//         category = category.toUpperCase() as Goal['category'];
//       }

//       const payload = {
//         title: goalData.title.trim(),
//         description: goalData.description?.trim() || '',
//         category: category || 'PERSONAL',
//         priority: goalData.priority || 'MEDIUM',
//         type: goalData.type || 'SHORT_TERM',
//         targetDate: goalData.targetDate instanceof Date 
//           ? goalData.targetDate.toISOString() 
//           : goalData.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//         totalHours: Number(goalData.totalHours) || 50,
//         weeklyTarget: Number(goalData.weeklyTarget) || 5,
//         color: goalData.color || '#3B82F6',
//         tags: Array.isArray(goalData.tags) ? goalData.tags : [],
//         isPublic: goalData.isPublic ?? true,
//       };

//       const response = await this.handleRequest<Goal>('/goals', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const goal = this.parseGoalDates(response.data);
        
//         toast.success('🎯 Goal Created!', {
//           description: `"${goal.title}" has been added to your goals.`,
//           duration: 5000,
//           icon: '✨',
//         });
        
//         return goal;
//       }
//       throw new Error(response.message || 'Failed to create goal');
//     } catch (error: any) {
//       console.log('Create goal error:', error);
      
//       toast.error('Failed to Create Goal', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getGoals(filters?: { filter?: string; priority?: string }): Promise<Goal[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters?.filter && filters.filter !== 'all') {
//         queryParams.append('filter', filters.filter);
//       }
      
//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority);
//       }
      
//       const url = `/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
//       const response = await this.handleRequest<Goal[]>(url, { method: 'GET' });

//       if (response.success && Array.isArray(response.data)) {
//         const goals = response.data.map(goal => this.parseGoalDates(goal));
//         return goals;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching goals:', error);
//       return [];
//     }
//   }

//   async getGoalById(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
      
//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return this.parseGoalDates(response.data);
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching goal:', error);
//       return null;
//     }
//   }

//   async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = [
//         'title', 'description', 'priority', 'status', 'progress',
//         'completedHours', 'totalHours', 'weeklyTarget', 'color',
//         'tags', 'isPublic', 'streak', 'category', 'type'
//       ];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof Goal] !== undefined) {
//           payload[key] = updates[key as keyof Goal];
//         }
//       });

//       if (updates.targetDate) {
//         payload.targetDate = updates.targetDate instanceof Date 
//           ? updates.targetDate.toISOString() 
//           : updates.targetDate;
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         toast.success('✨ Goal Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update goal error:', error);
      
//       toast.error('Failed to Update Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateGoalStatus(
//     goalId: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: any = { status };
      
//       if (progress !== undefined) {
//         payload.progress = Math.min(100, Math.max(0, progress));
//       }
      
//       if (completedHours !== undefined) {
//         payload.completedHours = completedHours;
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         const statusMessages = {
//           'IN_PROGRESS': { title: '▶️ Goal Started!', desc: 'You\'re making progress!' },
//           'COMPLETED': { title: '🎉 Congratulations!', desc: 'Goal completed successfully!' },
//           'DELAYED': { title: '⚠️ Goal Delayed', desc: 'Don\'t worry, adjust your plan.' },
//           'NOT_STARTED': { title: '⏸️ Goal Paused', desc: 'Take your time.' },
//         };
        
//         const message = statusMessages[status as keyof typeof statusMessages];
//         if (message) {
//           toast.success(message.title, {
//             description: message.desc,
//             duration: 5000,
//           });
//         }
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update status error:', error);
      
//       toast.error('Failed to Update Status', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async markGoalAsCompleted(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify({ 
//           status: 'COMPLETED', 
//           progress: 100,
//           completedAt: new Date().toISOString()
//         }),
//       });

//       if (response.success && response.data) {
//         const completedGoal = this.parseGoalDates(response.data);
        
//         toast.success('🏆 Goal Achieved!', {
//           description: `"${completedGoal.title}" - Amazing work! 🎉`,
//           duration: 7000,
//           icon: '🌟',
//         });
        
//         return completedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Mark as completed error:', error);
      
//       toast.error('Failed to Mark as Completed', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteGoal(goalId: string): Promise<boolean> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<any>(`/goals/${goalId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Goal Deleted', {
//           description: 'The goal has been removed.',
//           duration: 4000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete goal error:', error);
      
//       toast.error('Failed to Delete Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getGoalStats(): Promise<GoalStats | null> {
//     try {
//       const response = await this.handleRequest<any>('/goals/stats', {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching stats:', error);
//       return null;
//     }
//   }

//   // ============= MILESTONE APIs =============

//   async addMilestone(
//     goalId: string,
//     milestoneData: { title: string; description: string; targetDate: Date | string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (!milestoneData.title?.trim()) throw new Error('Milestone title is required');

//       const payload = {
//         title: milestoneData.title.trim(),
//         description: milestoneData.description?.trim() || '',
//         targetDate: milestoneData.targetDate instanceof Date 
//           ? milestoneData.targetDate.toISOString() 
//           : milestoneData.targetDate,
//       };

//       const response = await this.handleRequest<Milestone>(`/goals/${goalId}/milestones`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const milestone = {
//           ...response.data,
//           targetDate: new Date(response.data.targetDate),
//           createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
//           updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined,
//         };
        
//         toast.success('🎯 Milestone Added!', {
//           description: `"${milestone.title}" has been added.`,
//           duration: 4000,
//         });
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Add milestone error:', error);
      
//       toast.error('Failed to Add Milestone', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateMilestone(
//     goalId: string,
//     milestoneId: string,
//     updates: { completed?: boolean; progress?: number; title?: string; description?: string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const payload: Record<string, any> = {};
//       if (updates.completed !== undefined) payload.completed = updates.completed;
//       if (updates.progress !== undefined) payload.progress = updates.progress;
//       if (updates.title !== undefined) payload.title = updates.title;
//       if (updates.description !== undefined) payload.description = updates.description;

//       const response = await this.handleRequest<Milestone>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'PUT', body: JSON.stringify(payload) }
//       );

//       if (response.success && response.data) {
//         const milestone = { 
//           ...response.data, 
//           targetDate: new Date(response.data.targetDate) 
//         };
        
//         if (updates.completed !== undefined) {
//           if (updates.completed) {
//             toast.success('✅ Milestone Completed!', {
//               description: `"${milestone.title}" - Great progress!`,
//               duration: 4000,
//             });
//           } else {
//             toast.info('🔄 Milestone Reopened', {
//               description: `"${milestone.title}" has been reopened.`,
//               duration: 3000,
//             });
//           }
//         } else if (updates.progress !== undefined) {
//           toast.success('📊 Milestone Progress Updated', {
//             description: `Progress: ${updates.progress}%`,
//             duration: 3000,
//           });
//         }
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update milestone error:', error);
      
//       toast.error('Failed to Update Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteMilestone(goalId: string, milestoneId: string): Promise<boolean> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const response = await this.handleRequest<any>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'DELETE' }
//       );

//       if (response.success) {
//         toast.success('🗑️ Milestone Deleted', {
//           description: 'The milestone has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete milestone error:', error);
      
//       toast.error('Failed to Delete Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async logProgressHours(goalId: string, hours: number): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (hours <= 0) throw new Error('Hours must be greater than 0');

//       const goal = await this.getGoalById(goalId);
//       if (!goal) throw new Error('Goal not found');
      
//       const newCompletedHours = Math.min(goal.totalHours, (goal.completedHours || 0) + hours);
//       const progress = Math.round((newCompletedHours / (goal.totalHours || 1)) * 100);
      
//       const today = new Date().toDateString();
//       const lastUpdated = goal.lastUpdated ? new Date(goal.lastUpdated).toDateString() : null;
//       const newStreak = today === lastUpdated ? (goal.streak || 0) : (goal.streak || 0) + 1;
      
//       const updatedGoal = await this.updateGoal(goalId, {
//         completedHours: newCompletedHours,
//         progress: Math.min(100, progress),
//         status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
//         streak: newStreak,
//         lastUpdated: new Date(),
//       });
      
//       if (updatedGoal) {
//         toast.success(`⏱️ Logged ${hours} hour${hours > 1 ? 's' : ''}`, {
//           description: `Progress: ${progress}% • Streak: ${newStreak} days 🔥`,
//           duration: 4000,
//         });
//       }
      
//       return updatedGoal;
//     } catch (error) {
//       console.log('Log progress error:', error);
      
//       toast.error('Failed to Log Progress', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async checkHealth(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });
//       return response.ok;
//     } catch (error) {
//       console.log('Health check failed:', error);
//       return false;
//     }
//   }
// }

// export const GoalsService = GoalsServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useGoals() {
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<GoalStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchGoals = useCallback(async (filters?: { filter?: string; priority?: string }) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching goals with filters:', filters);
      
//       const [fetchedGoals, fetchedStats] = await Promise.all([
//         GoalsService.getGoals(filters),
//         GoalsService.getGoalStats()
//       ]);
      
//       setGoals(fetchedGoals || []);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedGoals?.length || 0} goals`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch goals:', err);
//       setError(err.message || 'Failed to fetch goals');
//       setGoals([]); // Ensure goals is always an array
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchGoals();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchGoals]);

//   const createGoal = useCallback(async (goalData: Partial<Goal>) => {
//     try {
//       const newGoal = await GoalsService.createGoal(goalData);
//       if (newGoal) {
//         setGoals(prev => Array.isArray(prev) ? [newGoal, ...prev] : [newGoal]);
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return newGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoal(id, updates);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev) 
//           ? prev.map(g => g.id === id ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoalStatus = useCallback(async (
//     id: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoalStatus(id, status, progress, completedHours);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === id ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const markGoalAsCompleted = useCallback(async (id: string) => {
//     try {
//       const completedGoal = await GoalsService.markGoalAsCompleted(id);
//       if (completedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === id ? completedGoal : g)
//           : [completedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return completedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteGoal = useCallback(async (id: string) => {
//     try {
//       const success = await GoalsService.deleteGoal(id);
//       if (success) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.filter(g => g.id !== id)
//           : []
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const addMilestone = useCallback(async (goalId: string, milestoneData: any) => {
//     try {
//       const newMilestone = await GoalsService.addMilestone(goalId, milestoneData);
//       if (newMilestone) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: [...(goal.milestones || []), newMilestone],
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return newMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateMilestone = useCallback(async (
//     goalId: string, 
//     milestoneId: string, 
//     updates: any
//   ) => {
//     try {
//       const updatedMilestone = await GoalsService.updateMilestone(goalId, milestoneId, updates);
//       if (updatedMilestone) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: (goal.milestones || []).map(m => 
//                     m.id === milestoneId ? updatedMilestone : m
//                   ),
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return updatedMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     const goal = Array.isArray(goals) ? goals.find(g => g.id === goalId) : null;
//     const milestone = goal?.milestones?.find(m => m.id === milestoneId);
//     if (!goal || !milestone) return null;
    
//     return updateMilestone(goalId, milestoneId, { 
//       completed: !milestone.completed,
//       progress: !milestone.completed ? 100 : 0,
//     });
//   }, [goals, updateMilestone]);

//   const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     try {
//       const success = await GoalsService.deleteMilestone(goalId, milestoneId);
//       if (success) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: (goal.milestones || []).filter(m => m.id !== milestoneId),
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const logProgressHours = useCallback(async (goalId: string, hours: number) => {
//     try {
//       const updatedGoal = await GoalsService.logProgressHours(goalId, hours);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === goalId ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchGoals();
//   }, [fetchGoals]);

//   // Helper functions
//   const getDaysUntilDeadline = useCallback((targetDate: Date | string) => {
//     if (!targetDate) return 0;
//     const target = new Date(targetDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     target.setHours(0, 0, 0, 0);
//     const diffTime = target.getTime() - today.getTime();
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   }, []);

//   const isGoalOverdue = useCallback((goal: Goal) => {
//     if (!goal || goal.status === 'COMPLETED') return false;
//     const daysLeft = getDaysUntilDeadline(goal.targetDate);
//     return daysLeft < 0;
//   }, [getDaysUntilDeadline]);

//   const getEffectiveStatus = useCallback((goal: Goal): Goal['status'] => {
//     if (!goal) return 'NOT_STARTED';
//     if (goal.status === 'COMPLETED') return 'COMPLETED';
//     if (goal.status === 'FAILED') return 'FAILED';
    
//     const daysLeft = getDaysUntilDeadline(goal.targetDate);
//     if (daysLeft < 0 && goal.status !== 'COMPLETED') {
//       return 'DELAYED';
//     }
    
//     return goal.status;
//   }, [getDaysUntilDeadline]);

//   return {
//     // State
//     goals: Array.isArray(goals) ? goals : [],
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // Goal CRUD
//     fetchGoals,
//     createGoal,
//     updateGoal,
//     updateGoalStatus,
//     markGoalAsCompleted,
//     deleteGoal,
    
//     // Milestone operations
//     addMilestone,
//     updateMilestone,
//     toggleMilestone,
//     deleteMilestone,
    
//     // Progress tracking
//     logProgressHours,
    
//     // Utility
//     refresh,
//     getDaysUntilDeadline,
//     isGoalOverdue,
//     getEffectiveStatus,
//   };
// }










// // src/hooks/use-goals.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// // Use proxy URL instead of direct API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/v0/api';

// // ============= TYPES =============

// export interface Milestone {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   targetDate: Date;
//   progress: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface Goal {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   type: 'SHORT_TERM' | 'LONG_TERM';
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
//   targetDate: Date;
//   completedAt: Date | null;
//   progress: number;
//   totalHours: number;
//   completedHours: number;
//   weeklyTarget: number;
//   color: string;
//   subject: string | null;
//   streak: number;
//   lastUpdated: Date;
//   isPublic: boolean;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   milestones: Milestone[];
//   tasks?: any[];
// }

// export interface GoalStats {
//   total: number;
//   active: number;
//   completed: number;
//   delayed: number;
//   totalHours: number;
//   completedHours: number;
//   averageProgress: number;
//   upcomingDeadlines: number;
//   highPriority: number;
//   streaks: {
//     current: number;
//     longest: number;
//     totalActiveDays: number;
//   };
//   categoryDistribution: Record<string, number>;
//   priorityDistribution: Record<string, number>;
//   statusDistribution: Record<string, number>;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= GOALS SERVICE =============

// class GoalsServiceClass {
//   private static instance: GoalsServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
      
//       if (!this.accessToken) {
//         AuthService.setTestToken();
//         this.accessToken = AuthService.getAccessToken();
//       }
//     }
//   }

//   static getInstance(): GoalsServiceClass {
//     if (!GoalsServiceClass.instance) {
//       GoalsServiceClass.instance = new GoalsServiceClass();
//     }
//     return GoalsServiceClass.instance;
//   }

//   private getAuthHeaders(): HeadersInit {
//     this.accessToken = AuthService.getAccessToken();
    
//     return {
//       'Content-Type': 'application/json',
//       ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
//     };
//   }

//   private formatDateToISO(date: Date | string): string {
//     if (!date) return new Date().toISOString();
    
//     try {
//       if (date instanceof Date) {
//         // Check if date is valid
//         if (isNaN(date.getTime())) {
//           console.log('Invalid Date object provided');
//           return new Date().toISOString();
//         }
//         return date.toISOString();
//       }
      
//       // If it's a string, try to parse it
//       const parsedDate = new Date(date);
//       if (isNaN(parsedDate.getTime())) {
//         console.log('Invalid date string provided:', date);
//         // Return a future date (30 days from now) as fallback
//         const futureDate = new Date();
//         futureDate.setDate(futureDate.getDate() + 30);
//         return futureDate.toISOString();
//       }
//       return parsedDate.toISOString();
//     } catch (error) {
//       console.log('Error formatting date:', error);
//       const futureDate = new Date();
//       futureDate.setDate(futureDate.getDate() + 30);
//       return futureDate.toISOString();
//     }
//   }

//   private parseGoalDates(goal: any): Goal {
//     try {
//       return {
//         ...goal,
//         targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
//         createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
//         updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date(),
//         lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date(),
//         milestones: Array.isArray(goal.milestones) 
//           ? goal.milestones.map((m: any) => ({
//               ...m,
//               targetDate: m.targetDate ? new Date(m.targetDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//               createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
//               updatedAt: m.updatedAt ? new Date(m.updatedAt) : undefined,
//             }))
//           : [],
//       };
//     } catch (error) {
//       console.log('Error parsing goal dates:', error);
//       return {
//         ...goal,
//         targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         completedAt: null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         lastUpdated: new Date(),
//         milestones: [],
//       };
//     }
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

//   // ============= GOAL APIs =============

//   async createGoal(goalData: Partial<Goal>): Promise<Goal> {
//     try {
//       if (!goalData.title?.trim()) {
//         throw new Error('Goal title is required');
//       }

//       let category = goalData.category;
//       if (category && typeof category === 'string') {
//         category = category.toUpperCase() as Goal['category'];
//       }

//       // Ensure proper date format
//       let targetDateISO: string;
//       if (goalData.targetDate) {
//         targetDateISO = this.formatDateToISO(goalData.targetDate);
//       } else {
//         const futureDate = new Date();
//         futureDate.setDate(futureDate.getDate() + 30);
//         targetDateISO = futureDate.toISOString();
//       }

//       const payload = {
//         title: goalData.title.trim(),
//         description: goalData.description?.trim() || '',
//         category: category || 'PERSONAL',
//         priority: goalData.priority || 'MEDIUM',
//         type: goalData.type || 'SHORT_TERM',
//         targetDate: targetDateISO,
//         totalHours: Number(goalData.totalHours) || 50,
//         weeklyTarget: Number(goalData.weeklyTarget) || 5,
//         color: goalData.color || '#3B82F6',
//         tags: Array.isArray(goalData.tags) ? goalData.tags : [],
//         isPublic: goalData.isPublic ?? true,
//       };

//       console.log('📤 Creating goal with payload:', payload);

//       const response = await this.handleRequest<Goal>('/goals', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const goal = this.parseGoalDates(response.data);
        
//         toast.success('🎯 Goal Created!', {
//           description: `"${goal.title}" has been added to your goals.`,
//           duration: 5000,
//           icon: '✨',
//         });
        
//         return goal;
//       }
//       throw new Error(response.message || 'Failed to create goal');
//     } catch (error: any) {
//       console.log('Create goal error:', error);
      
//       toast.error('Failed to Create Goal', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getGoals(filters?: { filter?: string; priority?: string }): Promise<Goal[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters?.filter && filters.filter !== 'all') {
//         queryParams.append('filter', filters.filter);
//       }
      
//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority);
//       }
      
//       const url = `/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
//       const response = await this.handleRequest<Goal[]>(url, { method: 'GET' });

//       if (response.success && Array.isArray(response.data)) {
//         const goals = response.data.map(goal => this.parseGoalDates(goal));
//         return goals;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching goals:', error);
//       return [];
//     }
//   }

//   async getGoalById(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
      
//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return this.parseGoalDates(response.data);
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching goal:', error);
//       return null;
//     }
//   }

//   async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = [
//         'title', 'description', 'priority', 'status', 'progress',
//         'completedHours', 'totalHours', 'weeklyTarget', 'color',
//         'tags', 'isPublic', 'streak', 'category', 'type'
//       ];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof Goal] !== undefined) {
//           payload[key] = updates[key as keyof Goal];
//         }
//       });

//       if (updates.targetDate) {
//         payload.targetDate = this.formatDateToISO(updates.targetDate);
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         toast.success('✨ Goal Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update goal error:', error);
      
//       toast.error('Failed to Update Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateGoalStatus(
//     goalId: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: any = { status };
      
//       if (progress !== undefined) {
//         payload.progress = Math.min(100, Math.max(0, progress));
//       }
      
//       if (completedHours !== undefined) {
//         payload.completedHours = completedHours;
//       }

//       if (status === 'COMPLETED') {
//         payload.completedAt = new Date().toISOString();
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         const statusMessages = {
//           'IN_PROGRESS': { title: '▶️ Goal Started!', desc: 'You\'re making progress!' },
//           'COMPLETED': { title: '🎉 Congratulations!', desc: 'Goal completed successfully!' },
//           'DELAYED': { title: '⚠️ Goal Delayed', desc: 'Don\'t worry, adjust your plan.' },
//           'NOT_STARTED': { title: '⏸️ Goal Paused', desc: 'Take your time.' },
//         };
        
//         const message = statusMessages[status as keyof typeof statusMessages];
//         if (message) {
//           toast.success(message.title, {
//             description: message.desc,
//             duration: 5000,
//           });
//         }
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update status error:', error);
      
//       toast.error('Failed to Update Status', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async markGoalAsCompleted(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify({ 
//           status: 'COMPLETED', 
//           progress: 100,
//           completedAt: new Date().toISOString()
//         }),
//       });

//       if (response.success && response.data) {
//         const completedGoal = this.parseGoalDates(response.data);
        
//         toast.success('🏆 Goal Achieved!', {
//           description: `"${completedGoal.title}" - Amazing work! 🎉`,
//           duration: 7000,
//           icon: '🌟',
//         });
        
//         return completedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Mark as completed error:', error);
      
//       toast.error('Failed to Mark as Completed', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteGoal(goalId: string): Promise<boolean> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<any>(`/goals/${goalId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Goal Deleted', {
//           description: 'The goal has been removed.',
//           duration: 4000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete goal error:', error);
      
//       toast.error('Failed to Delete Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getGoalStats(): Promise<GoalStats | null> {
//     try {
//       const response = await this.handleRequest<any>('/goals/stats', {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching stats:', error);
//       return null;
//     }
//   }

//   // ============= MILESTONE APIs =============

//   async addMilestone(
//     goalId: string,
//     milestoneData: { title: string; description: string; targetDate: Date | string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (!milestoneData.title?.trim()) throw new Error('Milestone title is required');

//       const payload = {
//         title: milestoneData.title.trim(),
//         description: milestoneData.description?.trim() || '',
//         targetDate: this.formatDateToISO(milestoneData.targetDate),
//       };

//       const response = await this.handleRequest<Milestone>(`/goals/${goalId}/milestones`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const milestone = {
//           ...response.data,
//           targetDate: new Date(response.data.targetDate),
//           createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
//           updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined,
//         };
        
//         toast.success('🎯 Milestone Added!', {
//           description: `"${milestone.title}" has been added.`,
//           duration: 4000,
//         });
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Add milestone error:', error);
      
//       toast.error('Failed to Add Milestone', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateMilestone(
//     goalId: string,
//     milestoneId: string,
//     updates: { completed?: boolean; progress?: number; title?: string; description?: string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const payload: Record<string, any> = {};
//       if (updates.completed !== undefined) payload.completed = updates.completed;
//       if (updates.progress !== undefined) payload.progress = updates.progress;
//       if (updates.title !== undefined) payload.title = updates.title;
//       if (updates.description !== undefined) payload.description = updates.description;

//       const response = await this.handleRequest<Milestone>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'PUT', body: JSON.stringify(payload) }
//       );

//       if (response.success && response.data) {
//         const milestone = { 
//           ...response.data, 
//           targetDate: new Date(response.data.targetDate) 
//         };
        
//         if (updates.completed !== undefined) {
//           if (updates.completed) {
//             toast.success('✅ Milestone Completed!', {
//               description: `"${milestone.title}" - Great progress!`,
//               duration: 4000,
//             });
//           } else {
//             toast.info('🔄 Milestone Reopened', {
//               description: `"${milestone.title}" has been reopened.`,
//               duration: 3000,
//             });
//           }
//         } else if (updates.progress !== undefined) {
//           toast.success('📊 Milestone Progress Updated', {
//             description: `Progress: ${updates.progress}%`,
//             duration: 3000,
//           });
//         }
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update milestone error:', error);
      
//       toast.error('Failed to Update Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteMilestone(goalId: string, milestoneId: string): Promise<boolean> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const response = await this.handleRequest<any>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'DELETE' }
//       );

//       if (response.success) {
//         toast.success('🗑️ Milestone Deleted', {
//           description: 'The milestone has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete milestone error:', error);
      
//       toast.error('Failed to Delete Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async logProgressHours(goalId: string, hours: number): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (hours <= 0) throw new Error('Hours must be greater than 0');

//       const goal = await this.getGoalById(goalId);
//       if (!goal) throw new Error('Goal not found');
      
//       const newCompletedHours = Math.min(goal.totalHours, (goal.completedHours || 0) + hours);
//       const progress = Math.round((newCompletedHours / (goal.totalHours || 1)) * 100);
      
//       const today = new Date().toDateString();
//       const lastUpdated = goal.lastUpdated ? new Date(goal.lastUpdated).toDateString() : null;
//       const newStreak = today === lastUpdated ? (goal.streak || 0) : (goal.streak || 0) + 1;
      
//       const updatedGoal = await this.updateGoal(goalId, {
//         completedHours: newCompletedHours,
//         progress: Math.min(100, progress),
//         status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
//         streak: newStreak,
//         lastUpdated: new Date(),
//       });
      
//       if (updatedGoal) {
//         toast.success(`⏱️ Logged ${hours} hour${hours > 1 ? 's' : ''}`, {
//           description: `Progress: ${progress}% • Streak: ${newStreak} days 🔥`,
//           duration: 4000,
//         });
//       }
      
//       return updatedGoal;
//     } catch (error) {
//       console.log('Log progress error:', error);
      
//       toast.error('Failed to Log Progress', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async checkHealth(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });
//       return response.ok;
//     } catch (error) {
//       console.log('Health check failed:', error);
//       return false;
//     }
//   }
// }

// export const GoalsService = GoalsServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useGoals() {
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<GoalStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchGoals = useCallback(async (filters?: { filter?: string; priority?: string }) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching goals with filters:', filters);
      
//       const [fetchedGoals, fetchedStats] = await Promise.all([
//         GoalsService.getGoals(filters),
//         GoalsService.getGoalStats()
//       ]);
      
//       setGoals(fetchedGoals || []);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedGoals?.length || 0} goals`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch goals:', err);
//       setError(err.message || 'Failed to fetch goals');
//       setGoals([]);
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchGoals();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchGoals]);

//   const createGoal = useCallback(async (goalData: Partial<Goal>) => {
//     try {
//       const newGoal = await GoalsService.createGoal(goalData);
//       if (newGoal) {
//         setGoals(prev => Array.isArray(prev) ? [newGoal, ...prev] : [newGoal]);
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return newGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoal(id, updates);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev) 
//           ? prev.map(g => g.id === id ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoalStatus = useCallback(async (
//     id: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoalStatus(id, status, progress, completedHours);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === id ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const markGoalAsCompleted = useCallback(async (id: string) => {
//     try {
//       const completedGoal = await GoalsService.markGoalAsCompleted(id);
//       if (completedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === id ? completedGoal : g)
//           : [completedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return completedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteGoal = useCallback(async (id: string) => {
//     try {
//       const success = await GoalsService.deleteGoal(id);
//       if (success) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.filter(g => g.id !== id)
//           : []
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const addMilestone = useCallback(async (goalId: string, milestoneData: any) => {
//     try {
//       const newMilestone = await GoalsService.addMilestone(goalId, milestoneData);
//       if (newMilestone) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: [...(goal.milestones || []), newMilestone],
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return newMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateMilestone = useCallback(async (
//     goalId: string, 
//     milestoneId: string, 
//     updates: any
//   ) => {
//     try {
//       const updatedMilestone = await GoalsService.updateMilestone(goalId, milestoneId, updates);
//       if (updatedMilestone) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: (goal.milestones || []).map(m => 
//                     m.id === milestoneId ? updatedMilestone : m
//                   ),
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return updatedMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     const goal = Array.isArray(goals) ? goals.find(g => g.id === goalId) : null;
//     const milestone = goal?.milestones?.find(m => m.id === milestoneId);
//     if (!goal || !milestone) return null;
    
//     return updateMilestone(goalId, milestoneId, { 
//       completed: !milestone.completed,
//       progress: !milestone.completed ? 100 : 0,
//     });
//   }, [goals, updateMilestone]);

//   const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     try {
//       const success = await GoalsService.deleteMilestone(goalId, milestoneId);
//       if (success) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: (goal.milestones || []).filter(m => m.id !== milestoneId),
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const logProgressHours = useCallback(async (goalId: string, hours: number) => {
//     try {
//       const updatedGoal = await GoalsService.logProgressHours(goalId, hours);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === goalId ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchGoals();
//   }, [fetchGoals]);

//   // Helper functions
//   const getDaysUntilDeadline = useCallback((targetDate: Date | string) => {
//     if (!targetDate) return 0;
//     try {
//       const target = new Date(targetDate);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       target.setHours(0, 0, 0, 0);
//       const diffTime = target.getTime() - today.getTime();
//       return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     } catch (error) {
//       console.log('Error calculating days until deadline:', error);
//       return 0;
//     }
//   }, []);

//   const isGoalOverdue = useCallback((goal: Goal) => {
//     if (!goal || goal.status === 'COMPLETED') return false;
//     const daysLeft = getDaysUntilDeadline(goal.targetDate);
//     return daysLeft < 0;
//   }, [getDaysUntilDeadline]);

//   const getEffectiveStatus = useCallback((goal: Goal): Goal['status'] => {
//     if (!goal) return 'NOT_STARTED';
//     if (goal.status === 'COMPLETED') return 'COMPLETED';
//     if (goal.status === 'FAILED') return 'FAILED';
    
//     const daysLeft = getDaysUntilDeadline(goal.targetDate);
//     if (daysLeft < 0 && goal.status !== 'COMPLETED') {
//       return 'DELAYED';
//     }
    
//     return goal.status;
//   }, [getDaysUntilDeadline]);


//   console.log('Goals Hook State:', goals)

//   return {
//     // State
//     goals: Array.isArray(goals) ? goals : [],
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // Goal CRUD
//     fetchGoals,
//     createGoal,
//     updateGoal,
//     updateGoalStatus,
//     markGoalAsCompleted,
//     deleteGoal,
    
//     // Milestone operations
//     addMilestone,
//     updateMilestone,
//     toggleMilestone,
//     deleteMilestone,
    
//     // Progress tracking
//     logProgressHours,
    
//     // Utility
//     refresh,
//     getDaysUntilDeadline,
//     isGoalOverdue,
//     getEffectiveStatus,
//   };
// }














// // src/hooks/use-goals.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// // Use proxy URL instead of direct API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/v0/api';

// // ============= TYPES =============

// export interface Milestone {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   targetDate: Date;
//   progress: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// export interface Goal {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   type: 'SHORT_TERM' | 'LONG_TERM';
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
//   targetDate: Date;
//   completedAt: Date | null;
//   progress: number;
//   totalHours: number;
//   completedHours: number;
//   weeklyTarget: number;
//   color: string;
//   subject: string | null;
//   streak: number;
//   lastUpdated: Date;
//   isPublic: boolean;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   milestones: Milestone[];
//   tasks?: any[];
// }

// export interface GoalStats {
//   total: number;
//   active: number;
//   completed: number;
//   delayed: number;
//   totalHours: number;
//   completedHours: number;
//   averageProgress: number;
//   upcomingDeadlines: number;
//   highPriority: number;
//   streaks: {
//     current: number;
//     longest: number;
//     totalActiveDays: number;
//   };
//   categoryDistribution: Record<string, number>;
//   priorityDistribution: Record<string, number>;
//   statusDistribution: Record<string, number>;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= GOALS SERVICE =============

// class GoalsServiceClass {
//   private static instance: GoalsServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
      
//       if (!this.accessToken) {
//         AuthService.setTestToken();
//         this.accessToken = AuthService.getAccessToken();
//       }
//     }
//   }

//   static getInstance(): GoalsServiceClass {
//     if (!GoalsServiceClass.instance) {
//       GoalsServiceClass.instance = new GoalsServiceClass();
//     }
//     return GoalsServiceClass.instance;
//   }

//   private getAuthHeaders(): HeadersInit {
//     this.accessToken = AuthService.getAccessToken();
    
//     return {
//       'Content-Type': 'application/json',
//       ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
//     };
//   }

//   private formatDateToISO(date: Date | string): string {
//     if (!date) return new Date().toISOString();
    
//     try {
//       if (date instanceof Date) {
//         if (isNaN(date.getTime())) {
//           console.log('Invalid Date object provided');
//           return new Date().toISOString();
//         }
//         return date.toISOString();
//       }
      
//       const parsedDate = new Date(date);
//       if (isNaN(parsedDate.getTime())) {
//         console.log('Invalid date string provided:', date);
//         const futureDate = new Date();
//         futureDate.setDate(futureDate.getDate() + 30);
//         return futureDate.toISOString();
//       }
//       return parsedDate.toISOString();
//     } catch (error) {
//       console.log('Error formatting date:', error);
//       const futureDate = new Date();
//       futureDate.setDate(futureDate.getDate() + 30);
//       return futureDate.toISOString();
//     }
//   }

//   private parseGoalDates(goal: any): Goal {
//     try {
//       return {
//         ...goal,
//         targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
//         createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
//         updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date(),
//         lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date(),
//         milestones: Array.isArray(goal.milestones) 
//           ? goal.milestones.map((m: any) => ({
//               ...m,
//               targetDate: m.targetDate ? new Date(m.targetDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//               createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
//               updatedAt: m.updatedAt ? new Date(m.updatedAt) : undefined,
//             }))
//           : [],
//       };
//     } catch (error) {
//       console.log('Error parsing goal dates:', error);
//       return {
//         ...goal,
//         targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         completedAt: null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         lastUpdated: new Date(),
//         milestones: [],
//       };
//     }
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

//   // ============= GOAL APIs =============

//   async createGoal(goalData: Partial<Goal>): Promise<Goal> {
//     try {
//       if (!goalData.title?.trim()) {
//         throw new Error('Goal title is required');
//       }

//       let category = goalData.category;
//       if (category && typeof category === 'string') {
//         category = category.toUpperCase() as Goal['category'];
//       }

//       let targetDateISO: string;
//       if (goalData.targetDate) {
//         targetDateISO = this.formatDateToISO(goalData.targetDate);
//       } else {
//         const futureDate = new Date();
//         futureDate.setDate(futureDate.getDate() + 30);
//         targetDateISO = futureDate.toISOString();
//       }

//       const payload = {
//         title: goalData.title.trim(),
//         description: goalData.description?.trim() || '',
//         category: category || 'PERSONAL',
//         priority: goalData.priority || 'MEDIUM',
//         type: goalData.type || 'SHORT_TERM',
//         targetDate: targetDateISO,
//         totalHours: Number(goalData.totalHours) || 50,
//         weeklyTarget: Number(goalData.weeklyTarget) || 5,
//         color: goalData.color || '#3B82F6',
//         tags: Array.isArray(goalData.tags) ? goalData.tags : [],
//         isPublic: goalData.isPublic ?? true,
//       };

//       console.log('📤 Creating goal with payload:', payload);

//       const response = await this.handleRequest<Goal>('/goals', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const goal = this.parseGoalDates(response.data);
        
//         toast.success('🎯 Goal Created!', {
//           description: `"${goal.title}" has been added to your goals.`,
//           duration: 5000,
//           icon: '✨',
//         });
        
//         return goal;
//       }
//       throw new Error(response.message || 'Failed to create goal');
//     } catch (error: any) {
//       console.log('Create goal error:', error);
      
//       toast.error('Failed to Create Goal', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getGoals(filters?: { filter?: string; priority?: string }): Promise<Goal[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters?.filter && filters.filter !== 'all') {
//         queryParams.append('filter', filters.filter);
//       }
      
//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority);
//       }
      
//       const url = `/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
//       const response = await this.handleRequest<any>(url, { method: 'GET' });

//       if (response.success && response.data) {
//         // Handle different response structures
//         let goalsArray: Goal[] = [];
        
//         // Case 1: response.data is directly an array
//         if (Array.isArray(response.data)) {
//           goalsArray = response.data;
//         }
//         // Case 2: response.data has a goals property that is an array
//         else if (response.data.goals && Array.isArray(response.data.goals)) {
//           goalsArray = response.data.goals;
//         }
//         // Case 3: response.data is an object with other structure
//         else if (response.data && typeof response.data === 'object') {
//           console.log('Response data structure:', response.data);
//           // Try to find any array property that might contain goals
//           const possibleArrayProps = Object.keys(response.data).filter(key => 
//             Array.isArray(response.data[key])
//           );
          
//           if (possibleArrayProps.length > 0) {
//             goalsArray = response.data[possibleArrayProps[0]];
//           }
//         }
        
//         const goals = goalsArray.map(goal => this.parseGoalDates(goal));
//         console.log(`✅ Fetched ${goals.length} goals`);
//         return goals;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching goals:', error);
//       return [];
//     }
//   }

//   async getGoalById(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
      
//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return this.parseGoalDates(response.data);
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching goal:', error);
//       return null;
//     }
//   }

//   async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = [
//         'title', 'description', 'priority', 'status', 'progress',
//         'completedHours', 'totalHours', 'weeklyTarget', 'color',
//         'tags', 'isPublic', 'streak', 'category', 'type'
//       ];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof Goal] !== undefined) {
//           payload[key] = updates[key as keyof Goal];
//         }
//       });

//       if (updates.targetDate) {
//         payload.targetDate = this.formatDateToISO(updates.targetDate);
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         toast.success('✨ Goal Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update goal error:', error);
      
//       toast.error('Failed to Update Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateGoalStatus(
//     goalId: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: any = { status };
      
//       if (progress !== undefined) {
//         payload.progress = Math.min(100, Math.max(0, progress));
//       }
      
//       if (completedHours !== undefined) {
//         payload.completedHours = completedHours;
//       }

//       if (status === 'COMPLETED') {
//         payload.completedAt = new Date().toISOString();
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         const statusMessages = {
//           'IN_PROGRESS': { title: '▶️ Goal Started!', desc: 'You\'re making progress!' },
//           'COMPLETED': { title: '🎉 Congratulations!', desc: 'Goal completed successfully!' },
//           'DELAYED': { title: '⚠️ Goal Delayed', desc: 'Don\'t worry, adjust your plan.' },
//           'NOT_STARTED': { title: '⏸️ Goal Paused', desc: 'Take your time.' },
//         };
        
//         const message = statusMessages[status as keyof typeof statusMessages];
//         if (message) {
//           toast.success(message.title, {
//             description: message.desc,
//             duration: 5000,
//           });
//         }
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update status error:', error);
      
//       toast.error('Failed to Update Status', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async markGoalAsCompleted(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify({ 
//           status: 'COMPLETED', 
//           progress: 100,
//           completedAt: new Date().toISOString()
//         }),
//       });

//       if (response.success && response.data) {
//         const completedGoal = this.parseGoalDates(response.data);
        
//         toast.success('🏆 Goal Achieved!', {
//           description: `"${completedGoal.title}" - Amazing work! 🎉`,
//           duration: 7000,
//           icon: '🌟',
//         });
        
//         return completedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Mark as completed error:', error);
      
//       toast.error('Failed to Mark as Completed', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteGoal(goalId: string): Promise<boolean> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<any>(`/goals/${goalId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Goal Deleted', {
//           description: 'The goal has been removed.',
//           duration: 4000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete goal error:', error);
      
//       toast.error('Failed to Delete Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getGoalStats(): Promise<GoalStats | null> {
//     try {
//       const response = await this.handleRequest<any>('/goals/stats', {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching stats:', error);
//       return null;
//     }
//   }

//   // ============= MILESTONE APIs =============

//   async addMilestone(
//     goalId: string,
//     milestoneData: { title: string; description: string; targetDate: Date | string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (!milestoneData.title?.trim()) throw new Error('Milestone title is required');

//       const payload = {
//         title: milestoneData.title.trim(),
//         description: milestoneData.description?.trim() || '',
//         targetDate: this.formatDateToISO(milestoneData.targetDate),
//       };

//       const response = await this.handleRequest<Milestone>(`/goals/${goalId}/milestones`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const milestone = {
//           ...response.data,
//           targetDate: new Date(response.data.targetDate),
//           createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
//           updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined,
//         };
        
//         toast.success('🎯 Milestone Added!', {
//           description: `"${milestone.title}" has been added.`,
//           duration: 4000,
//         });
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Add milestone error:', error);
      
//       toast.error('Failed to Add Milestone', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateMilestone(
//     goalId: string,
//     milestoneId: string,
//     updates: { completed?: boolean; progress?: number; title?: string; description?: string }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const payload: Record<string, any> = {};
//       if (updates.completed !== undefined) payload.completed = updates.completed;
//       if (updates.progress !== undefined) payload.progress = updates.progress;
//       if (updates.title !== undefined) payload.title = updates.title;
//       if (updates.description !== undefined) payload.description = updates.description;

//       const response = await this.handleRequest<Milestone>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'PUT', body: JSON.stringify(payload) }
//       );

//       if (response.success && response.data) {
//         const milestone = { 
//           ...response.data, 
//           targetDate: new Date(response.data.targetDate) 
//         };
        
//         if (updates.completed !== undefined) {
//           if (updates.completed) {
//             toast.success('✅ Milestone Completed!', {
//               description: `"${milestone.title}" - Great progress!`,
//               duration: 4000,
//             });
//           } else {
//             toast.info('🔄 Milestone Reopened', {
//               description: `"${milestone.title}" has been reopened.`,
//               duration: 3000,
//             });
//           }
//         } else if (updates.progress !== undefined) {
//           toast.success('📊 Milestone Progress Updated', {
//             description: `Progress: ${updates.progress}%`,
//             duration: 3000,
//           });
//         }
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update milestone error:', error);
      
//       toast.error('Failed to Update Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteMilestone(goalId: string, milestoneId: string): Promise<boolean> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const response = await this.handleRequest<any>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'DELETE' }
//       );

//       if (response.success) {
//         toast.success('🗑️ Milestone Deleted', {
//           description: 'The milestone has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete milestone error:', error);
      
//       toast.error('Failed to Delete Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async logProgressHours(goalId: string, hours: number): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (hours <= 0) throw new Error('Hours must be greater than 0');

//       const goal = await this.getGoalById(goalId);
//       if (!goal) throw new Error('Goal not found');
      
//       const newCompletedHours = Math.min(goal.totalHours, (goal.completedHours || 0) + hours);
//       const progress = Math.round((newCompletedHours / (goal.totalHours || 1)) * 100);
      
//       const today = new Date().toDateString();
//       const lastUpdated = goal.lastUpdated ? new Date(goal.lastUpdated).toDateString() : null;
//       const newStreak = today === lastUpdated ? (goal.streak || 0) : (goal.streak || 0) + 1;
      
//       const updatedGoal = await this.updateGoal(goalId, {
//         completedHours: newCompletedHours,
//         progress: Math.min(100, progress),
//         status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
//         streak: newStreak,
//         lastUpdated: new Date(),
//       });
      
//       if (updatedGoal) {
//         toast.success(`⏱️ Logged ${hours} hour${hours > 1 ? 's' : ''}`, {
//           description: `Progress: ${progress}% • Streak: ${newStreak} days 🔥`,
//           duration: 4000,
//         });
//       }
      
//       return updatedGoal;
//     } catch (error) {
//       console.log('Log progress error:', error);
      
//       toast.error('Failed to Log Progress', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async checkHealth(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });
//       return response.ok;
//     } catch (error) {
//       console.log('Health check failed:', error);
//       return false;
//     }
//   }
// }

// export const GoalsService = GoalsServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useGoals() {
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<GoalStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchGoals = useCallback(async (filters?: { filter?: string; priority?: string }) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching goals with filters:', filters);
      
//       const [fetchedGoals, fetchedStats] = await Promise.all([
//         GoalsService.getGoals(filters),
//         GoalsService.getGoalStats()
//       ]);
      
//       console.log('📦 Fetched goals:', fetchedGoals);
//       setGoals(fetchedGoals || []);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedGoals?.length || 0} goals`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch goals:', err);
//       setError(err.message || 'Failed to fetch goals');
//       setGoals([]);
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchGoals();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchGoals]);

//   const createGoal = useCallback(async (goalData: Partial<Goal>) => {
//     try {
//       const newGoal = await GoalsService.createGoal(goalData);
//       if (newGoal) {
//         setGoals(prev => Array.isArray(prev) ? [newGoal, ...prev] : [newGoal]);
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return newGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoal(id, updates);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev) 
//           ? prev.map(g => g.id === id ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoalStatus = useCallback(async (
//     id: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoalStatus(id, status, progress, completedHours);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === id ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const markGoalAsCompleted = useCallback(async (id: string) => {
//     try {
//       const completedGoal = await GoalsService.markGoalAsCompleted(id);
//       if (completedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === id ? completedGoal : g)
//           : [completedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return completedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteGoal = useCallback(async (id: string) => {
//     try {
//       const success = await GoalsService.deleteGoal(id);
//       if (success) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.filter(g => g.id !== id)
//           : []
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const addMilestone = useCallback(async (goalId: string, milestoneData: any) => {
//     try {
//       const newMilestone = await GoalsService.addMilestone(goalId, milestoneData);
//       if (newMilestone) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: [...(goal.milestones || []), newMilestone],
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return newMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateMilestone = useCallback(async (
//     goalId: string, 
//     milestoneId: string, 
//     updates: any
//   ) => {
//     try {
//       const updatedMilestone = await GoalsService.updateMilestone(goalId, milestoneId, updates);
//       if (updatedMilestone) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: (goal.milestones || []).map(m => 
//                     m.id === milestoneId ? updatedMilestone : m
//                   ),
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return updatedMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     const goal = Array.isArray(goals) ? goals.find(g => g.id === goalId) : null;
//     const milestone = goal?.milestones?.find(m => m.id === milestoneId);
//     if (!goal || !milestone) return null;
    
//     return updateMilestone(goalId, milestoneId, { 
//       completed: !milestone.completed,
//       progress: !milestone.completed ? 100 : 0,
//     });
//   }, [goals, updateMilestone]);

//   const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     try {
//       const success = await GoalsService.deleteMilestone(goalId, milestoneId);
//       if (success) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: (goal.milestones || []).filter(m => m.id !== milestoneId),
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const logProgressHours = useCallback(async (goalId: string, hours: number) => {
//     try {
//       const updatedGoal = await GoalsService.logProgressHours(goalId, hours);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === goalId ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchGoals();
//   }, [fetchGoals]);

//   // Helper functions
//   const getDaysUntilDeadline = useCallback((targetDate: Date | string) => {
//     if (!targetDate) return 0;
//     try {
//       const target = new Date(targetDate);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       target.setHours(0, 0, 0, 0);
//       const diffTime = target.getTime() - today.getTime();
//       return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     } catch (error) {
//       console.log('Error calculating days until deadline:', error);
//       return 0;
//     }
//   }, []);

//   const isGoalOverdue = useCallback((goal: Goal) => {
//     if (!goal || goal.status === 'COMPLETED') return false;
//     const daysLeft = getDaysUntilDeadline(goal.targetDate);
//     return daysLeft < 0;
//   }, [getDaysUntilDeadline]);

//   const getEffectiveStatus = useCallback((goal: Goal): Goal['status'] => {
//     if (!goal) return 'NOT_STARTED';
//     if (goal.status === 'COMPLETED') return 'COMPLETED';
//     if (goal.status === 'FAILED') return 'FAILED';
    
//     const daysLeft = getDaysUntilDeadline(goal.targetDate);
//     if (daysLeft < 0 && goal.status !== 'COMPLETED') {
//       return 'DELAYED';
//     }
    
//     return goal.status;
//   }, [getDaysUntilDeadline]);

//   console.log('🎯 Goals Hook State - Current goals:', goals);

//   return {
//     // State
//     goals: Array.isArray(goals) ? goals : [],
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // Goal CRUD
//     fetchGoals,
//     createGoal,
//     updateGoal,
//     updateGoalStatus,
//     markGoalAsCompleted,
//     deleteGoal,
    
//     // Milestone operations
//     addMilestone,
//     updateMilestone,
//     toggleMilestone,
//     deleteMilestone,
    
//     // Progress tracking
//     logProgressHours,
    
//     // Utility
//     refresh,
//     getDaysUntilDeadline,
//     isGoalOverdue,
//     getEffectiveStatus,
//   };
// }


























// // src/hooks/useGoal.ts
// import { useState, useEffect, useCallback } from 'react';
// import { toast } from 'sonner';
// import { AuthService } from './useAuth';

// // Use proxy URL instead of direct API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/v0/api';

// // ============= TYPES =============

// export interface Milestone {
//   id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   targetDate: Date;
//   progress: number;
//   createdAt?: Date;
//   updatedAt?: Date;
//   scheduledHours?: number;
//   completedHours?: number;
// }

// export interface Goal {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   type: 'SHORT_TERM' | 'LONG_TERM';
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
//   targetDate: Date;
//   completedAt: Date | null;
//   progress: number;
//   totalHours: number;
//   completedHours: number;
//   weeklyTarget: number;
//   color: string;
//   subject: string | null;
//   streak: number;
//   lastUpdated: Date;
//   isPublic: boolean;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   milestones: Milestone[];
//   tasks?: any[];
// }

// export interface GoalStats {
//   total: number;
//   active: number;
//   completed: number;
//   delayed: number;
//   totalHours: number;
//   completedHours: number;
//   averageProgress: number;
//   upcomingDeadlines: number;
//   highPriority: number;
//   streaks: {
//     current: number;
//     longest: number;
//     totalActiveDays: number;
//   };
//   categoryDistribution: Record<string, number>;
//   priorityDistribution: Record<string, number>;
//   statusDistribution: Record<string, number>;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ============= GOALS SERVICE =============

// class GoalsServiceClass {
//   private static instance: GoalsServiceClass;
//   private accessToken: string | null = null;

//   private constructor() {
//     if (typeof window !== 'undefined') {
//       this.accessToken = AuthService.getAccessToken();
      
//       if (!this.accessToken) {
//         AuthService.setTestToken();
//         this.accessToken = AuthService.getAccessToken();
//       }
//     }
//   }

//   static getInstance(): GoalsServiceClass {
//     if (!GoalsServiceClass.instance) {
//       GoalsServiceClass.instance = new GoalsServiceClass();
//     }
//     return GoalsServiceClass.instance;
//   }

//   private getAuthHeaders(): HeadersInit {
//     this.accessToken = AuthService.getAccessToken();
    
//     return {
//       'Content-Type': 'application/json',
//       ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
//     };
//   }

//   private formatDateToISO(date: Date | string): string {
//     if (!date) return new Date().toISOString();
    
//     try {
//       if (date instanceof Date) {
//         if (isNaN(date.getTime())) {
//           console.log('Invalid Date object provided');
//           return new Date().toISOString();
//         }
//         return date.toISOString();
//       }
      
//       const parsedDate = new Date(date);
//       if (isNaN(parsedDate.getTime())) {
//         console.log('Invalid date string provided:', date);
//         const futureDate = new Date();
//         futureDate.setDate(futureDate.getDate() + 30);
//         return futureDate.toISOString();
//       }
//       return parsedDate.toISOString();
//     } catch (error) {
//       console.log('Error formatting date:', error);
//       const futureDate = new Date();
//       futureDate.setDate(futureDate.getDate() + 30);
//       return futureDate.toISOString();
//     }
//   }

//   private parseGoalDates(goal: any): Goal {
//     try {
//       return {
//         ...goal,
//         targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
//         createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
//         updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date(),
//         lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date(),
//         milestones: Array.isArray(goal.milestones) 
//           ? goal.milestones.map((m: any) => ({
//               id: m.id || m._id || `temp-${Math.random()}`,
//               title: m.title || '',
//               description: m.description || '',
//               completed: m.completed || false,
//               progress: m.progress || 0,
//               targetDate: m.targetDate ? new Date(m.targetDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//               scheduledHours: m.scheduledHours || 0,
//               completedHours: m.completedHours || 0,
//               createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
//               updatedAt: m.updatedAt ? new Date(m.updatedAt) : undefined,
//             }))
//           : [],
//       };
//     } catch (error) {
//       console.log('Error parsing goal dates:', error);
//       return {
//         ...goal,
//         targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         completedAt: null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         lastUpdated: new Date(),
//         milestones: [],
//       };
//     }
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

//   // ============= GOAL APIs =============

//   async createGoal(goalData: Partial<Goal>): Promise<Goal> {
//     try {
//       if (!goalData.title?.trim()) {
//         throw new Error('Goal title is required');
//       }

//       let category = goalData.category;
//       if (category && typeof category === 'string') {
//         category = category.toUpperCase() as Goal['category'];
//       }

//       let targetDateISO: string;
//       if (goalData.targetDate) {
//         targetDateISO = this.formatDateToISO(goalData.targetDate);
//       } else {
//         const futureDate = new Date();
//         futureDate.setDate(futureDate.getDate() + 30);
//         targetDateISO = futureDate.toISOString();
//       }

//       const payload = {
//         title: goalData.title.trim(),
//         description: goalData.description?.trim() || '',
//         category: category || 'PERSONAL',
//         priority: goalData.priority || 'MEDIUM',
//         type: goalData.type || 'SHORT_TERM',
//         targetDate: targetDateISO,
//         totalHours: Number(goalData.totalHours) || 50,
//         weeklyTarget: Number(goalData.weeklyTarget) || 5,
//         color: goalData.color || '#3B82F6',
//         tags: Array.isArray(goalData.tags) ? goalData.tags : [],
//         isPublic: goalData.isPublic ?? true,
//         subject: goalData.subject || null,
//       };

//       console.log('📤 Creating goal with payload:', payload);

//       const response = await this.handleRequest<Goal>('/goals', {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const goal = this.parseGoalDates(response.data);
        
//         toast.success('🎯 Goal Created!', {
//           description: `"${goal.title}" has been added to your goals.`,
//           duration: 5000,
//           icon: '✨',
//         });
        
//         return goal;
//       }
//       throw new Error(response.message || 'Failed to create goal');
//     } catch (error: any) {
//       console.log('Create goal error:', error);
      
//       toast.error('Failed to Create Goal', {
//         description: error.message || 'Please try again later.',
//         duration: 4000,
//       });
//       throw error;
//     }
//   }

//   async getGoals(filters?: { filter?: string; priority?: string }): Promise<Goal[]> {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters?.filter && filters.filter !== 'all') {
//         queryParams.append('filter', filters.filter);
//       }
      
//       if (filters?.priority) {
//         queryParams.append('priority', filters.priority);
//       }
      
//       const url = `/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
//       console.log('🔍 Fetching goals from:', `${API_BASE_URL}${url}`);
      
//       const response = await this.handleRequest<any>(url, { method: 'GET' });

//       console.log('📦 Goals API response:', response);

//       if (response.success) {
//         // Handle different response structures
//         let goalsArray: Goal[] = [];
        
//         // Case 1: response.data is directly an array
//         if (Array.isArray(response.data)) {
//           goalsArray = response.data;
//         }
//         // Case 2: response.data has a goals property that is an array
//         else if (response.data && response.data.goals && Array.isArray(response.data.goals)) {
//           goalsArray = response.data.goals;
//         }
//         // Case 3: response.data is an object with items array
//         else if (response.data && response.data.items && Array.isArray(response.data.items)) {
//           goalsArray = response.data.items;
//         }
//         // Case 4: response.data is an object with results array
//         else if (response.data && response.data.results && Array.isArray(response.data.results)) {
//           goalsArray = response.data.results;
//         }
//         // Case 5: response.data is an object with data array
//         else if (response.data && response.data.data && Array.isArray(response.data.data)) {
//           goalsArray = response.data.data;
//         }
        
//         console.log(`✅ Found ${goalsArray.length} goals`);
        
//         const goals = goalsArray.map(goal => this.parseGoalDates(goal));
//         return goals;
//       }
//       return [];
//     } catch (error) {
//       console.log('Error fetching goals:', error);
//       return [];
//     }
//   }

//   async getGoalById(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
      
//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return this.parseGoalDates(response.data);
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching goal:', error);
//       return null;
//     }
//   }

//   async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: Record<string, any> = {};
      
//       const allowedUpdates = [
//         'title', 'description', 'priority', 'status', 'progress',
//         'completedHours', 'totalHours', 'weeklyTarget', 'color',
//         'tags', 'isPublic', 'streak', 'category', 'type', 'subject'
//       ];

//       allowedUpdates.forEach(key => {
//         if (updates[key as keyof Goal] !== undefined) {
//           payload[key] = updates[key as keyof Goal];
//         }
//       });

//       if (updates.targetDate) {
//         payload.targetDate = this.formatDateToISO(updates.targetDate);
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         toast.success('✨ Goal Updated', {
//           description: 'Your changes have been saved.',
//           duration: 3000,
//         });
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update goal error:', error);
      
//       toast.error('Failed to Update Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateGoalStatus(
//     goalId: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const payload: any = { status };
      
//       if (progress !== undefined) {
//         payload.progress = Math.min(100, Math.max(0, progress));
//       }
      
//       if (completedHours !== undefined) {
//         payload.completedHours = completedHours;
//       }

//       if (status === 'COMPLETED') {
//         payload.completedAt = new Date().toISOString();
//         payload.progress = 100;
//       }

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const updatedGoal = this.parseGoalDates(response.data);
        
//         const statusMessages = {
//           'IN_PROGRESS': { title: '▶️ Goal Started!', desc: 'You\'re making progress!' },
//           'COMPLETED': { title: '🎉 Congratulations!', desc: 'Goal completed successfully!' },
//           'DELAYED': { title: '⚠️ Goal Delayed', desc: 'Don\'t worry, adjust your plan.' },
//           'NOT_STARTED': { title: '⏸️ Goal Paused', desc: 'Take your time.' },
//         };
        
//         const message = statusMessages[status as keyof typeof statusMessages];
//         if (message) {
//           toast.success(message.title, {
//             description: message.desc,
//             duration: 5000,
//           });
//         }
        
//         return updatedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update status error:', error);
      
//       toast.error('Failed to Update Status', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async markGoalAsCompleted(goalId: string): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
//         method: 'PUT',
//         body: JSON.stringify({ 
//           status: 'COMPLETED', 
//           progress: 100,
//           completedAt: new Date().toISOString()
//         }),
//       });

//       if (response.success && response.data) {
//         const completedGoal = this.parseGoalDates(response.data);
        
//         toast.success('🏆 Goal Achieved!', {
//           description: `"${completedGoal.title}" - Amazing work! 🎉`,
//           duration: 7000,
//           icon: '🌟',
//         });
        
//         return completedGoal;
//       }
//       return null;
//     } catch (error) {
//       console.log('Mark as completed error:', error);
      
//       toast.error('Failed to Mark as Completed', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteGoal(goalId: string): Promise<boolean> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');

//       const response = await this.handleRequest<any>(`/goals/${goalId}`, {
//         method: 'DELETE',
//       });

//       if (response.success) {
//         toast.success('🗑️ Goal Deleted', {
//           description: 'The goal has been removed.',
//           duration: 4000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete goal error:', error);
      
//       toast.error('Failed to Delete Goal', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async getGoalStats(): Promise<GoalStats | null> {
//     try {
//       const response = await this.handleRequest<any>('/goals/stats', {
//         method: 'GET',
//       });

//       if (response.success && response.data) {
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.log('Error fetching stats:', error);
//       return null;
//     }
//   }

//   // ============= MILESTONE APIs =============

//   async addMilestone(
//     goalId: string,
//     milestoneData: { title: string; description: string; targetDate: Date | string; scheduledHours?: number }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (!milestoneData.title?.trim()) throw new Error('Milestone title is required');

//       const payload = {
//         title: milestoneData.title.trim(),
//         description: milestoneData.description?.trim() || '',
//         targetDate: this.formatDateToISO(milestoneData.targetDate),
//         scheduledHours: milestoneData.scheduledHours || 0,
//         completedHours: 0,
//         completed: false,
//         progress: 0,
//       };

//       const response = await this.handleRequest<Milestone>(`/goals/${goalId}/milestones`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//       });

//       if (response.success && response.data) {
//         const milestone = {
//           ...response.data,
//           targetDate: new Date(response.data.targetDate),
//           createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
//           updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined,
//         };
        
//         toast.success('🎯 Milestone Added!', {
//           description: `"${milestone.title}" has been added.`,
//           duration: 4000,
//         });
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Add milestone error:', error);
      
//       toast.error('Failed to Add Milestone', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async updateMilestone(
//     goalId: string,
//     milestoneId: string,
//     updates: { completed?: boolean; progress?: number; title?: string; description?: string; scheduledHours?: number; completedHours?: number }
//   ): Promise<Milestone | null> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const payload: Record<string, any> = {};
//       if (updates.completed !== undefined) payload.completed = updates.completed;
//       if (updates.progress !== undefined) payload.progress = updates.progress;
//       if (updates.title !== undefined) payload.title = updates.title;
//       if (updates.description !== undefined) payload.description = updates.description;
//       if (updates.scheduledHours !== undefined) payload.scheduledHours = updates.scheduledHours;
//       if (updates.completedHours !== undefined) payload.completedHours = updates.completedHours;

//       const response = await this.handleRequest<Milestone>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'PUT', body: JSON.stringify(payload) }
//       );

//       if (response.success && response.data) {
//         const milestone = { 
//           ...response.data, 
//           targetDate: new Date(response.data.targetDate) 
//         };
        
//         if (updates.completed !== undefined) {
//           if (updates.completed) {
//             toast.success('✅ Milestone Completed!', {
//               description: `"${milestone.title}" - Great progress!`,
//               duration: 4000,
//             });
//           } else {
//             toast.info('🔄 Milestone Reopened', {
//               description: `"${milestone.title}" has been reopened.`,
//               duration: 3000,
//             });
//           }
//         } else if (updates.progress !== undefined) {
//           toast.success('📊 Milestone Progress Updated', {
//             description: `Progress: ${updates.progress}%`,
//             duration: 3000,
//           });
//         }
        
//         return milestone;
//       }
//       return null;
//     } catch (error) {
//       console.log('Update milestone error:', error);
      
//       toast.error('Failed to Update Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async deleteMilestone(goalId: string, milestoneId: string): Promise<boolean> {
//     try {
//       if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

//       const response = await this.handleRequest<any>(
//         `/goals/${goalId}/milestones/${milestoneId}`,
//         { method: 'DELETE' }
//       );

//       if (response.success) {
//         toast.success('🗑️ Milestone Deleted', {
//           description: 'The milestone has been removed.',
//           duration: 3000,
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.log('Delete milestone error:', error);
      
//       toast.error('Failed to Delete Milestone', {
//         description: 'Please try again.',
//         duration: 4000,
//       });
//       return false;
//     }
//   }

//   async logProgressHours(goalId: string, hours: number): Promise<Goal | null> {
//     try {
//       if (!goalId) throw new Error('Goal ID is required');
//       if (hours <= 0) throw new Error('Hours must be greater than 0');

//       const goal = await this.getGoalById(goalId);
//       if (!goal) throw new Error('Goal not found');
      
//       const newCompletedHours = Math.min(goal.totalHours, (goal.completedHours || 0) + hours);
//       const progress = Math.round((newCompletedHours / (goal.totalHours || 1)) * 100);
      
//       const today = new Date().toDateString();
//       const lastUpdated = goal.lastUpdated ? new Date(goal.lastUpdated).toDateString() : null;
//       const newStreak = today === lastUpdated ? (goal.streak || 0) : (goal.streak || 0) + 1;
      
//       const updatedGoal = await this.updateGoal(goalId, {
//         completedHours: newCompletedHours,
//         progress: Math.min(100, progress),
//         status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
//         streak: newStreak,
//         lastUpdated: new Date(),
//       });
      
//       if (updatedGoal) {
//         toast.success(`⏱️ Logged ${hours} hour${hours > 1 ? 's' : ''}`, {
//           description: `Progress: ${progress}% • Streak: ${newStreak} days 🔥`,
//           duration: 4000,
//         });
//       }
      
//       return updatedGoal;
//     } catch (error) {
//       console.log('Log progress error:', error);
      
//       toast.error('Failed to Log Progress', {
//         description: error instanceof Error ? error.message : 'Please try again.',
//         duration: 4000,
//       });
//       return null;
//     }
//   }

//   async checkHealth(): Promise<boolean> {
//     try {
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });
//       return response.ok;
//     } catch (error) {
//       console.log('Health check failed:', error);
//       return false;
//     }
//   }
// }

// export const GoalsService = GoalsServiceClass.getInstance();

// // ============= REACT HOOK =============

// export function useGoals() {
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<GoalStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const fetchGoals = useCallback(async (filters?: { filter?: string; priority?: string }) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Fetching goals with filters:', filters);
      
//       const [fetchedGoals, fetchedStats] = await Promise.all([
//         GoalsService.getGoals(filters),
//         GoalsService.getGoalStats()
//       ]);
      
//       console.log('📦 Fetched goals:', fetchedGoals);
//       console.log('📊 Fetched stats:', fetchedStats);
      
//       setGoals(fetchedGoals || []);
//       setStats(fetchedStats);
      
//       console.log(`✅ Successfully loaded ${fetchedGoals?.length || 0} goals`);
//     } catch (err: any) {
//       console.log('❌ Failed to fetch goals:', err);
//       setError(err.message || 'Failed to fetch goals');
//       setGoals([]);
//     } finally {
//       setLoading(false);
//       setIsInitialized(true);
//     }
//   }, []);

//   // Fetch goals on mount and when dependencies change
//   useEffect(() => {
//     let mounted = true;

//     const initialize = async () => {
//       if (mounted) {
//         await fetchGoals();
//       }
//     };

//     initialize();

//     return () => {
//       mounted = false;
//     };
//   }, [fetchGoals]);

//   const createGoal = useCallback(async (goalData: Partial<Goal>) => {
//     try {
//       const newGoal = await GoalsService.createGoal(goalData);
//       if (newGoal) {
//         setGoals(prev => Array.isArray(prev) ? [newGoal, ...prev] : [newGoal]);
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return newGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoal(id, updates);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev) 
//           ? prev.map(g => g.id === id ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateGoalStatus = useCallback(async (
//     id: string, 
//     status: Goal['status'], 
//     progress?: number, 
//     completedHours?: number
//   ) => {
//     try {
//       const updatedGoal = await GoalsService.updateGoalStatus(id, status, progress, completedHours);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === id ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const markGoalAsCompleted = useCallback(async (id: string) => {
//     try {
//       const completedGoal = await GoalsService.markGoalAsCompleted(id);
//       if (completedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === id ? completedGoal : g)
//           : [completedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return completedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const deleteGoal = useCallback(async (id: string) => {
//     try {
//       const success = await GoalsService.deleteGoal(id);
//       if (success) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.filter(g => g.id !== id)
//           : []
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const addMilestone = useCallback(async (goalId: string, milestoneData: any) => {
//     try {
//       const newMilestone = await GoalsService.addMilestone(goalId, milestoneData);
//       if (newMilestone) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: [...(goal.milestones || []), newMilestone],
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return newMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const updateMilestone = useCallback(async (
//     goalId: string, 
//     milestoneId: string, 
//     updates: any
//   ) => {
//     try {
//       const updatedMilestone = await GoalsService.updateMilestone(goalId, milestoneId, updates);
//       if (updatedMilestone) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: (goal.milestones || []).map(m => 
//                     m.id === milestoneId ? updatedMilestone : m
//                   ),
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return updatedMilestone;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     const goal = Array.isArray(goals) ? goals.find(g => g.id === goalId) : null;
//     const milestone = goal?.milestones?.find(m => m.id === milestoneId);
//     if (!goal || !milestone) return null;
    
//     return updateMilestone(goalId, milestoneId, { 
//       completed: !milestone.completed,
//       progress: !milestone.completed ? 100 : 0,
//     });
//   }, [goals, updateMilestone]);

//   const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
//     try {
//       const success = await GoalsService.deleteMilestone(goalId, milestoneId);
//       if (success) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(goal => {
//               if (goal.id === goalId) {
//                 return {
//                   ...goal,
//                   milestones: (goal.milestones || []).filter(m => m.id !== milestoneId),
//                 };
//               }
//               return goal;
//             })
//           : prev
//         );
//       }
//       return success;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const logProgressHours = useCallback(async (goalId: string, hours: number) => {
//     try {
//       const updatedGoal = await GoalsService.logProgressHours(goalId, hours);
//       if (updatedGoal) {
//         setGoals(prev => Array.isArray(prev)
//           ? prev.map(g => g.id === goalId ? updatedGoal : g)
//           : [updatedGoal]
//         );
//         const fetchedStats = await GoalsService.getGoalStats();
//         setStats(fetchedStats);
//       }
//       return updatedGoal;
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   const refresh = useCallback(() => {
//     fetchGoals();
//   }, [fetchGoals]);

//   // Helper functions
//   const getDaysUntilDeadline = useCallback((targetDate: Date | string) => {
//     if (!targetDate) return 0;
//     try {
//       const target = new Date(targetDate);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       target.setHours(0, 0, 0, 0);
//       const diffTime = target.getTime() - today.getTime();
//       return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     } catch (error) {
//       console.log('Error calculating days until deadline:', error);
//       return 0;
//     }
//   }, []);

//   const isGoalOverdue = useCallback((goal: Goal) => {
//     if (!goal || goal.status === 'COMPLETED') return false;
//     const daysLeft = getDaysUntilDeadline(goal.targetDate);
//     return daysLeft < 0;
//   }, [getDaysUntilDeadline]);

//   const getEffectiveStatus = useCallback((goal: Goal): Goal['status'] => {
//     if (!goal) return 'NOT_STARTED';
//     if (goal.status === 'COMPLETED') return 'COMPLETED';
//     if (goal.status === 'FAILED') return 'FAILED';
    
//     const daysLeft = getDaysUntilDeadline(goal.targetDate);
//     if (daysLeft < 0 && goal.status !== 'COMPLETED') {
//       return 'DELAYED';
//     }
    
//     return goal.status;
//   }, [getDaysUntilDeadline]);

//   // Debug log
//   useEffect(() => {
//     console.log('🎯 Goals Hook State - Current goals:', goals);
//     console.log('🎯 Goals Hook State - Loading:', loading);
//     console.log('🎯 Goals Hook State - Initialized:', isInitialized);
//   }, [goals, loading, isInitialized]);

//   return {
//     // State
//     goals: Array.isArray(goals) ? goals : [],
//     loading,
//     error,
//     stats,
//     isInitialized,
    
//     // Goal CRUD
//     fetchGoals,
//     createGoal,
//     updateGoal,
//     updateGoalStatus,
//     markGoalAsCompleted,
//     deleteGoal,
    
//     // Milestone operations
//     addMilestone,
//     updateMilestone,
//     toggleMilestone,
//     deleteMilestone,
    
//     // Progress tracking
//     logProgressHours,
    
//     // Utility
//     refresh,
//     getDaysUntilDeadline,
//     isGoalOverdue,
//     getEffectiveStatus,
//   };
// }

















// src/hooks/useGoal.ts
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AuthService } from './useAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8181/v0/api';

// ============= TYPES =============

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  targetDate: Date;
  progress: number;
  createdAt?: Date;
  updatedAt?: Date;
  scheduledHours?: number;
  completedHours?: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'SHORT_TERM' | 'LONG_TERM';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED';
  targetDate: Date;
  completedAt: Date | null;
  progress: number;
  totalHours: number;
  completedHours: number;
  weeklyTarget: number;
  color: string;
  subject: string | null;
  streak: number;
  lastUpdated: Date;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  milestones: Milestone[];
  tasks?: any[];
}

export interface GoalStats {
  total: number;
  active: number;
  completed: number;
  delayed: number;
  totalHours: number;
  completedHours: number;
  averageProgress: number;
  upcomingDeadlines: number;
  highPriority: number;
  streaks: {
    current: number;
    longest: number;
    totalActiveDays: number;
  };
  categoryDistribution: Record<string, number>;
  priorityDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============= GOALS SERVICE =============

class GoalsServiceClass {
  private static instance: GoalsServiceClass;
  private accessToken: string | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = AuthService.getAccessToken();
    }
  }

  static getInstance(): GoalsServiceClass {
    if (!GoalsServiceClass.instance) {
      GoalsServiceClass.instance = new GoalsServiceClass();
    }
    return GoalsServiceClass.instance;
  }

  private getAuthHeaders(): HeadersInit {
    this.accessToken = AuthService.getAccessToken();
    
    return {
      'Content-Type': 'application/json',
      ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
    };
  }

  private formatDateToISO(date: Date | string): string {
    if (!date) return new Date().toISOString();
    
    try {
      if (date instanceof Date) {
        if (isNaN(date.getTime())) {
          console.log('Invalid Date object provided');
          return new Date().toISOString();
        }
        return date.toISOString();
      }
      
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        console.log('Invalid date string provided:', date);
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        return futureDate.toISOString();
      }
      return parsedDate.toISOString();
    } catch (error) {
      console.log('Error formatting date:', error);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      return futureDate.toISOString();
    }
  }

  private parseGoalDates(goal: any): Goal {
    try {
      return {
        ...goal,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        completedAt: goal.completedAt ? new Date(goal.completedAt) : null,
        createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
        updatedAt: goal.updatedAt ? new Date(goal.updatedAt) : new Date(),
        lastUpdated: goal.lastUpdated ? new Date(goal.lastUpdated) : new Date(),
        milestones: Array.isArray(goal.milestones) 
          ? goal.milestones.map((m: any) => ({
              id: m.id || m._id || `temp-${Math.random()}`,
              title: m.title || '',
              description: m.description || '',
              completed: m.completed || false,
              progress: m.progress || 0,
              targetDate: m.targetDate ? new Date(m.targetDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              scheduledHours: m.scheduledHours || 0,
              completedHours: m.completedHours || 0,
              createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
              updatedAt: m.updatedAt ? new Date(m.updatedAt) : undefined,
            }))
          : [],
      };
    } catch (error) {
      console.log('Error parsing goal dates:', error);
      return {
        ...goal,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastUpdated: new Date(),
        milestones: [],
      };
    }
  }

  private async handleRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = this.getAuthHeaders();
    
    console.log(`🌐 Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`);

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication Failed', {
            description: 'Please log in again',
            duration: 5000,
          });
        } else if (response.status === 403) {
          toast.error('Access Denied', {
            description: 'You don\'t have permission to perform this action',
            duration: 5000,
          });
        } else if (response.status === 404) {
          toast.error('Resource Not Found', {
            description: 'The requested resource was not found',
            duration: 4000,
          });
        } else if (response.status >= 500) {
          toast.error('Server Error', {
            description: 'Please try again later',
            duration: 5000,
          });
        }

        throw {
          success: false,
          message: data.message || `HTTP error ${response.status}`,
          status: response.status,
          data: data,
        };
      }

      return data;
    } catch (error: any) {
      console.log('❌ API request failed:', {
        url,
        method: options.method,
        error: error.message || error,
      });

      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        toast.error('Network Error', {
          description: 'Cannot connect to the server. Please check if the server is running.',
          duration: 6000,
          action: {
            label: 'Retry',
            onClick: () => window.location.reload(),
          },
        });
      }

      throw error;
    }
  }

  // ============= GOAL APIs =============

  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    try {
      if (!goalData.title?.trim()) {
        throw new Error('Goal title is required');
      }

      let category = goalData.category;
      if (category && typeof category === 'string') {
        category = category.toUpperCase() as Goal['category'];
      }

      let targetDateISO: string;
      if (goalData.targetDate) {
        targetDateISO = this.formatDateToISO(goalData.targetDate);
      } else {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        targetDateISO = futureDate.toISOString();
      }

      const payload = {
        title: goalData.title.trim(),
        description: goalData.description?.trim() || '',
        category: category || 'PERSONAL',
        priority: goalData.priority || 'MEDIUM',
        type: goalData.type || 'SHORT_TERM',
        targetDate: targetDateISO,
        totalHours: Number(goalData.totalHours) || 50,
        weeklyTarget: Number(goalData.weeklyTarget) || 5,
        color: goalData.color || '#3B82F6',
        tags: Array.isArray(goalData.tags) ? goalData.tags : [],
        isPublic: goalData.isPublic ?? true,
        subject: goalData.subject || null,
      };

      console.log('📤 Creating goal with payload:', payload);

      const response = await this.handleRequest<Goal>('/goals', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.success && response.data) {
        const goal = this.parseGoalDates(response.data);
        
        toast.success('🎯 Goal Created!', {
          description: `"${goal.title}" has been added to your goals.`,
          duration: 5000,
          icon: '✨',
        });
        
        return goal;
      }
      throw new Error(response.message || 'Failed to create goal');
    } catch (error: any) {
      console.log('Create goal error:', error);
      
      toast.error('Failed to Create Goal', {
        description: error.message || 'Please try again later.',
        duration: 4000,
      });
      throw error;
    }
  }

  async getGoals(filters?: { filter?: string; priority?: string }): Promise<Goal[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.filter && filters.filter !== 'all') {
        queryParams.append('filter', filters.filter);
      }
      
      if (filters?.priority) {
        queryParams.append('priority', filters.priority);
      }
      
      const url = `/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔍 Fetching goals from:', `${API_BASE_URL}${url}`);
      
      const response = await this.handleRequest<any>(url, { method: 'GET' });

      console.log('📦 Goals API response:', response);

      if (response.success) {
        // Handle different response structures
        let goalsArray: Goal[] = [];
        
        if (Array.isArray(response.data)) {
          goalsArray = response.data;
        } else if (response.data && response.data.goals && Array.isArray(response.data.goals)) {
          goalsArray = response.data.goals;
        } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          goalsArray = response.data.items;
        } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
          goalsArray = response.data.results;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          goalsArray = response.data.data;
        }
        
        console.log(`✅ Found ${goalsArray.length} goals`);
        
        const goals = goalsArray.map(goal => this.parseGoalDates(goal));
        return goals;
      }
      return [];
    } catch (error) {
      console.log('Error fetching goals:', error);
      return [];
    }
  }

  async getGoalById(goalId: string): Promise<Goal | null> {
    try {
      if (!goalId) throw new Error('Goal ID is required');
      
      const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
        method: 'GET',
      });

      if (response.success && response.data) {
        return this.parseGoalDates(response.data);
      }
      return null;
    } catch (error) {
      console.log('Error fetching goal:', error);
      return null;
    }
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal | null> {
    try {
      if (!goalId) throw new Error('Goal ID is required');

      const payload: Record<string, any> = {};
      
      const allowedUpdates = [
        'title', 'description', 'priority', 'status', 'progress',
        'completedHours', 'totalHours', 'weeklyTarget', 'color',
        'tags', 'isPublic', 'streak', 'category', 'type', 'subject'
      ];

      allowedUpdates.forEach(key => {
        if (updates[key as keyof Goal] !== undefined) {
          payload[key] = updates[key as keyof Goal];
        }
      });

      if (updates.targetDate) {
        payload.targetDate = this.formatDateToISO(updates.targetDate);
      }

      const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (response.success && response.data) {
        const updatedGoal = this.parseGoalDates(response.data);
        
        toast.success('✨ Goal Updated', {
          description: 'Your changes have been saved.',
          duration: 3000,
        });
        
        return updatedGoal;
      }
      return null;
    } catch (error) {
      console.log('Update goal error:', error);
      
      toast.error('Failed to Update Goal', {
        description: 'Please try again.',
        duration: 4000,
      });
      return null;
    }
  }

  async updateGoalStatus(
    goalId: string, 
    status: Goal['status'], 
    progress?: number, 
    completedHours?: number
  ): Promise<Goal | null> {
    try {
      if (!goalId) throw new Error('Goal ID is required');

      const payload: any = { status };
      
      if (progress !== undefined) {
        payload.progress = Math.min(100, Math.max(0, progress));
      }
      
      if (completedHours !== undefined) {
        payload.completedHours = completedHours;
      }

      if (status === 'COMPLETED') {
        payload.completedAt = new Date().toISOString();
        payload.progress = 100;
      }

      const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (response.success && response.data) {
        const updatedGoal = this.parseGoalDates(response.data);
        
        const statusMessages = {
          'IN_PROGRESS': { title: '▶️ Goal Started!', desc: 'You\'re making progress!' },
          'COMPLETED': { title: '🎉 Congratulations!', desc: 'Goal completed successfully!' },
          'DELAYED': { title: '⚠️ Goal Delayed', desc: 'Don\'t worry, adjust your plan.' },
          'NOT_STARTED': { title: '⏸️ Goal Paused', desc: 'Take your time.' },
        };
        
        const message = statusMessages[status as keyof typeof statusMessages];
        if (message) {
          toast.success(message.title, {
            description: message.desc,
            duration: 5000,
          });
        }
        
        return updatedGoal;
      }
      return null;
    } catch (error) {
      console.log('Update status error:', error);
      
      toast.error('Failed to Update Status', {
        description: 'Please try again.',
        duration: 4000,
      });
      return null;
    }
  }

  async markGoalAsCompleted(goalId: string): Promise<Goal | null> {
    try {
      if (!goalId) throw new Error('Goal ID is required');

      const response = await this.handleRequest<Goal>(`/goals/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'COMPLETED', 
          progress: 100,
          completedAt: new Date().toISOString()
        }),
      });

      if (response.success && response.data) {
        const completedGoal = this.parseGoalDates(response.data);
        
        toast.success('🏆 Goal Achieved!', {
          description: `"${completedGoal.title}" - Amazing work! 🎉`,
          duration: 7000,
          icon: '🌟',
        });
        
        return completedGoal;
      }
      return null;
    } catch (error) {
      console.log('Mark as completed error:', error);
      
      toast.error('Failed to Mark as Completed', {
        description: 'Please try again.',
        duration: 4000,
      });
      return null;
    }
  }

  async deleteGoal(goalId: string): Promise<boolean> {
    try {
      if (!goalId) throw new Error('Goal ID is required');

      const response = await this.handleRequest<any>(`/goals/${goalId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        toast.success('🗑️ Goal Deleted', {
          description: 'The goal has been removed.',
          duration: 4000,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Delete goal error:', error);
      
      toast.error('Failed to Delete Goal', {
        description: 'Please try again.',
        duration: 4000,
      });
      return false;
    }
  }

  async getGoalStats(): Promise<GoalStats | null> {
    try {
      const response = await this.handleRequest<any>('/goals/stats', {
        method: 'GET',
      });

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.log('Error fetching stats:', error);
      return null;
    }
  }

  // ============= MILESTONE APIs =============

  async addMilestone(
    goalId: string,
    milestoneData: { title: string; description: string; targetDate: Date | string; scheduledHours?: number }
  ): Promise<Milestone | null> {
    try {
      if (!goalId) throw new Error('Goal ID is required');
      if (!milestoneData.title?.trim()) throw new Error('Milestone title is required');

      const payload = {
        title: milestoneData.title.trim(),
        description: milestoneData.description?.trim() || '',
        targetDate: this.formatDateToISO(milestoneData.targetDate),
        scheduledHours: milestoneData.scheduledHours || 0,
        completedHours: 0,
        completed: false,
        progress: 0,
      };

      const response = await this.handleRequest<Milestone>(`/goals/${goalId}/milestones`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.success && response.data) {
        const milestone = {
          ...response.data,
          targetDate: new Date(response.data.targetDate),
          createdAt: response.data.createdAt ? new Date(response.data.createdAt) : undefined,
          updatedAt: response.data.updatedAt ? new Date(response.data.updatedAt) : undefined,
        };
        
        toast.success('🎯 Milestone Added!', {
          description: `"${milestone.title}" has been added.`,
          duration: 4000,
        });
        
        return milestone;
      }
      return null;
    } catch (error) {
      console.log('Add milestone error:', error);
      
      toast.error('Failed to Add Milestone', {
        description: error instanceof Error ? error.message : 'Please try again.',
        duration: 4000,
      });
      return null;
    }
  }

  async updateMilestone(
    goalId: string,
    milestoneId: string,
    updates: { completed?: boolean; progress?: number; title?: string; description?: string; scheduledHours?: number; completedHours?: number }
  ): Promise<Milestone | null> {
    try {
      if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

      const payload: Record<string, any> = {};
      if (updates.completed !== undefined) payload.completed = updates.completed;
      if (updates.progress !== undefined) payload.progress = updates.progress;
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.scheduledHours !== undefined) payload.scheduledHours = updates.scheduledHours;
      if (updates.completedHours !== undefined) payload.completedHours = updates.completedHours;

      const response = await this.handleRequest<Milestone>(
        `/goals/${goalId}/milestones/${milestoneId}`,
        { method: 'PUT', body: JSON.stringify(payload) }
      );

      if (response.success && response.data) {
        const milestone = { 
          ...response.data, 
          targetDate: new Date(response.data.targetDate) 
        };
        
        if (updates.completed !== undefined) {
          if (updates.completed) {
            toast.success('✅ Milestone Completed!', {
              description: `"${milestone.title}" - Great progress!`,
              duration: 4000,
            });
          } else {
            toast.info('🔄 Milestone Reopened', {
              description: `"${milestone.title}" has been reopened.`,
              duration: 3000,
            });
          }
        } else if (updates.progress !== undefined) {
          toast.success('📊 Milestone Progress Updated', {
            description: `Progress: ${updates.progress}%`,
            duration: 3000,
          });
        }
        
        return milestone;
      }
      return null;
    } catch (error) {
      console.log('Update milestone error:', error);
      
      toast.error('Failed to Update Milestone', {
        description: 'Please try again.',
        duration: 4000,
      });
      return null;
    }
  }

  async deleteMilestone(goalId: string, milestoneId: string): Promise<boolean> {
    try {
      if (!goalId || !milestoneId) throw new Error('Goal ID and Milestone ID are required');

      const response = await this.handleRequest<any>(
        `/goals/${goalId}/milestones/${milestoneId}`,
        { method: 'DELETE' }
      );

      if (response.success) {
        toast.success('🗑️ Milestone Deleted', {
          description: 'The milestone has been removed.',
          duration: 3000,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Delete milestone error:', error);
      
      toast.error('Failed to Delete Milestone', {
        description: 'Please try again.',
        duration: 4000,
      });
      return false;
    }
  }

  async logProgressHours(goalId: string, hours: number): Promise<Goal | null> {
    try {
      if (!goalId) throw new Error('Goal ID is required');
      if (hours <= 0) throw new Error('Hours must be greater than 0');

      const goal = await this.getGoalById(goalId);
      if (!goal) throw new Error('Goal not found');
      
      const newCompletedHours = Math.min(goal.totalHours, (goal.completedHours || 0) + hours);
      const progress = Math.round((newCompletedHours / (goal.totalHours || 1)) * 100);
      
      const today = new Date().toDateString();
      const lastUpdated = goal.lastUpdated ? new Date(goal.lastUpdated).toDateString() : null;
      const newStreak = today === lastUpdated ? (goal.streak || 0) : (goal.streak || 0) + 1;
      
      const updatedGoal = await this.updateGoal(goalId, {
        completedHours: newCompletedHours,
        progress: Math.min(100, progress),
        status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
        streak: newStreak,
        lastUpdated: new Date(),
      });
      
      if (updatedGoal) {
        toast.success(`⏱️ Logged ${hours} hour${hours > 1 ? 's' : ''}`, {
          description: `Progress: ${progress}% • Streak: ${newStreak} days 🔥`,
          duration: 4000,
        });
      }
      
      return updatedGoal;
    } catch (error) {
      console.log('Log progress error:', error);
      
      toast.error('Failed to Log Progress', {
        description: error instanceof Error ? error.message : 'Please try again.',
        duration: 4000,
      });
      return null;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.log('Health check failed:', error);
      return false;
    }
  }
}

export const GoalsService = GoalsServiceClass.getInstance();

// ============= REACT HOOK =============

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GoalStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchGoals = useCallback(async (filters?: { filter?: string; priority?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Fetching goals with filters:', filters);
      
      const [fetchedGoals, fetchedStats] = await Promise.all([
        GoalsService.getGoals(filters),
        GoalsService.getGoalStats()
      ]);
      
      console.log('📦 Fetched goals:', fetchedGoals);
      console.log('📊 Fetched stats:', fetchedStats);
      
      setGoals(fetchedGoals || []);
      setStats(fetchedStats);
      
      console.log(`✅ Successfully loaded ${fetchedGoals?.length || 0} goals`);
    } catch (err: any) {
      console.log('❌ Failed to fetch goals:', err);
      setError(err.message || 'Failed to fetch goals');
      setGoals([]);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (mounted) {
        await fetchGoals();
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [fetchGoals]);

  const createGoal = useCallback(async (goalData: Partial<Goal>) => {
    try {
      const newGoal = await GoalsService.createGoal(goalData);
      if (newGoal) {
        setGoals(prev => Array.isArray(prev) ? [newGoal, ...prev] : [newGoal]);
        const fetchedStats = await GoalsService.getGoalStats();
        setStats(fetchedStats);
      }
      return newGoal;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    try {
      const updatedGoal = await GoalsService.updateGoal(id, updates);
      if (updatedGoal) {
        setGoals(prev => Array.isArray(prev) 
          ? prev.map(g => g.id === id ? updatedGoal : g)
          : [updatedGoal]
        );
        const fetchedStats = await GoalsService.getGoalStats();
        setStats(fetchedStats);
      }
      return updatedGoal;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateGoalStatus = useCallback(async (
    id: string, 
    status: Goal['status'], 
    progress?: number, 
    completedHours?: number
  ) => {
    try {
      const updatedGoal = await GoalsService.updateGoalStatus(id, status, progress, completedHours);
      if (updatedGoal) {
        setGoals(prev => Array.isArray(prev)
          ? prev.map(g => g.id === id ? updatedGoal : g)
          : [updatedGoal]
        );
        const fetchedStats = await GoalsService.getGoalStats();
        setStats(fetchedStats);
      }
      return updatedGoal;
    } catch (error) {
      throw error;
    }
  }, []);

  const markGoalAsCompleted = useCallback(async (id: string) => {
    try {
      const completedGoal = await GoalsService.markGoalAsCompleted(id);
      if (completedGoal) {
        setGoals(prev => Array.isArray(prev)
          ? prev.map(g => g.id === id ? completedGoal : g)
          : [completedGoal]
        );
        const fetchedStats = await GoalsService.getGoalStats();
        setStats(fetchedStats);
      }
      return completedGoal;
    } catch (error) {
      throw error;
    }
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      const success = await GoalsService.deleteGoal(id);
      if (success) {
        setGoals(prev => Array.isArray(prev)
          ? prev.filter(g => g.id !== id)
          : []
        );
        const fetchedStats = await GoalsService.getGoalStats();
        setStats(fetchedStats);
      }
      return success;
    } catch (error) {
      throw error;
    }
  }, []);

  const addMilestone = useCallback(async (goalId: string, milestoneData: any) => {
    try {
      const newMilestone = await GoalsService.addMilestone(goalId, milestoneData);
      if (newMilestone) {
        setGoals(prev => Array.isArray(prev)
          ? prev.map(goal => {
              if (goal.id === goalId) {
                return {
                  ...goal,
                  milestones: [...(goal.milestones || []), newMilestone],
                };
              }
              return goal;
            })
          : prev
        );
      }
      return newMilestone;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateMilestone = useCallback(async (
    goalId: string, 
    milestoneId: string, 
    updates: any
  ) => {
    try {
      const updatedMilestone = await GoalsService.updateMilestone(goalId, milestoneId, updates);
      if (updatedMilestone) {
        setGoals(prev => Array.isArray(prev)
          ? prev.map(goal => {
              if (goal.id === goalId) {
                return {
                  ...goal,
                  milestones: (goal.milestones || []).map(m => 
                    m.id === milestoneId ? updatedMilestone : m
                  ),
                };
              }
              return goal;
            })
          : prev
        );
      }
      return updatedMilestone;
    } catch (error) {
      throw error;
    }
  }, []);

  const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
    const goal = Array.isArray(goals) ? goals.find(g => g.id === goalId) : null;
    const milestone = goal?.milestones?.find(m => m.id === milestoneId);
    if (!goal || !milestone) return null;
    
    return updateMilestone(goalId, milestoneId, { 
      completed: !milestone.completed,
      progress: !milestone.completed ? 100 : 0,
    });
  }, [goals, updateMilestone]);

  const deleteMilestone = useCallback(async (goalId: string, milestoneId: string) => {
    try {
      const success = await GoalsService.deleteMilestone(goalId, milestoneId);
      if (success) {
        setGoals(prev => Array.isArray(prev)
          ? prev.map(goal => {
              if (goal.id === goalId) {
                return {
                  ...goal,
                  milestones: (goal.milestones || []).filter(m => m.id !== milestoneId),
                };
              }
              return goal;
            })
          : prev
        );
      }
      return success;
    } catch (error) {
      throw error;
    }
  }, []);

  const logProgressHours = useCallback(async (goalId: string, hours: number) => {
    try {
      const updatedGoal = await GoalsService.logProgressHours(goalId, hours);
      if (updatedGoal) {
        setGoals(prev => Array.isArray(prev)
          ? prev.map(g => g.id === goalId ? updatedGoal : g)
          : [updatedGoal]
        );
        const fetchedStats = await GoalsService.getGoalStats();
        setStats(fetchedStats);
      }
      return updatedGoal;
    } catch (error) {
      throw error;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchGoals();
  }, [fetchGoals]);

  const getDaysUntilDeadline = useCallback((targetDate: Date | string) => {
    if (!targetDate) return 0;
    try {
      const target = new Date(targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);
      const diffTime = target.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.log('Error calculating days until deadline:', error);
      return 0;
    }
  }, []);

  const isGoalOverdue = useCallback((goal: Goal) => {
    if (!goal || goal.status === 'COMPLETED') return false;
    const daysLeft = getDaysUntilDeadline(goal.targetDate);
    return daysLeft < 0;
  }, [getDaysUntilDeadline]);

  const getEffectiveStatus = useCallback((goal: Goal): Goal['status'] => {
    if (!goal) return 'NOT_STARTED';
    if (goal.status === 'COMPLETED') return 'COMPLETED';
    if (goal.status === 'FAILED') return 'FAILED';
    
    const daysLeft = getDaysUntilDeadline(goal.targetDate);
    if (daysLeft < 0 && goal.status !== 'COMPLETED') {
      return 'DELAYED';
    }
    
    return goal.status;
  }, [getDaysUntilDeadline]);

  return {
    goals: Array.isArray(goals) ? goals : [],
    loading,
    error,
    stats,
    isInitialized,
    fetchGoals,
    createGoal,
    updateGoal,
    updateGoalStatus,
    markGoalAsCompleted,
    deleteGoal,
    addMilestone,
    updateMilestone,
    toggleMilestone,
    deleteMilestone,
    logProgressHours,
    refresh,
    getDaysUntilDeadline,
    isGoalOverdue,
    getEffectiveStatus,
  };
}