import { User as SupabaseUser } from '@supabase/supabase-js';

export interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  timestamp: string;
  createdAt: Date;
}

export interface User extends SupabaseUser {}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  file_type: 'image' | 'video' | 'audio';
  url: string;
  created_at: string;
}
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}