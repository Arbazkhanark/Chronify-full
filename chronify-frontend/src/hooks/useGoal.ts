// src/hooks/useGoal.ts
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AuthService } from './useAuth';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8181/v0/api'}`

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
    
    // FIX: Removed the redundant `goal.status !== 'COMPLETED'` check.
    // After the two early returns above, TypeScript has already narrowed
    // `goal.status` to exclude 'COMPLETED' and 'FAILED', so the extra
    // check was both a no-op at runtime and a TS error.
    if (daysLeft < 0) {
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