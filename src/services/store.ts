import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';
import type { Task, Column, User } from '../types';
import { DEFAULT_COLUMNS, MOCK_USERS } from '../constants';

// 1. Initialize Supabase
const supabaseUrl = 'https://vzbcqpipuizcpulecqvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YmNxcGlwdWl6Y3B1bGVjcXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MTcxMDksImV4cCI6MjA4NzQ5MzEwOX0.LUTzBz6QHinJ0z011hjZA0CV-JUdGQXplPPugrSReP0';
export const supabase = createClient(supabaseUrl, supabaseKey);

interface AppState {
  // Authentication State
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;

  // Data State
  tasks: Task[];
  columns: Column[];
  users: User[];
  searchQuery: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setTasks: (tasks: Task[]) => Promise<void>; 
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      tasks: [],
      columns: DEFAULT_COLUMNS,
      users: MOCK_USERS,
      searchQuery: '',

      // SEARCH LOGIC: Updates the global search string
      setSearchQuery: (query: string) => set({ searchQuery: query }),

      // LOGIN LOGIC: Authenticates with Supabase
      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          
          if (error) throw error;
          
          set({ isAuthenticated: true });
          return true;
        } catch (error: any) {
          console.error("Login Error:", error.message);
          return false;
        }
      },

      // LOGOUT LOGIC: Clears session and local tasks
      logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, tasks: [], searchQuery: '' });
      },

      // FETCH LOGIC: Pulls latest tasks from Postgres
      fetchTasks: async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('order', { ascending: true });
          
        if (!error && data) {
          set({ tasks: data as Task[] });
        }
      },

      // ADD TASK LOGIC: Inserts to DB then updates UI
      addTask: async (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          order: get().tasks.length
        };

        const { error } = await supabase.from('tasks').insert([newTask]);
        
        if (!error) {
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } else {
          console.error("Error adding task:", error.message);
        }
      },

      // DELETE LOGIC: Removes from DB and UI
      deleteTask: async (id) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (!error) {
          set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
        }
      },

      // REORDER LOGIC: Handles Drag-and-Drop persistence
      setTasks: async (newTasks) => {
        // Optimistic UI update (update screen immediately)
        set({ tasks: newTasks });

        // Update database in the background
        const updates = newTasks.map((task, index) => 
          supabase
            .from('tasks')
            .update({ order: index, columnId: task.columnId })
            .eq('id', task.id)
        );
        
        const results = await Promise.all(updates);
        const hasError = results.some(result => result.error);
        if (hasError) console.error("Some tasks failed to reorder in DB");
      }
      
    }),
    {
      name: 'kanban-auth-storage',
      // Only persist isAuthenticated to keep the user logged in
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);