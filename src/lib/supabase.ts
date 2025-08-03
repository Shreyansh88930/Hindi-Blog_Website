import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Database types
export interface MediaItem {
  id: string;
  title: string;
  description: string;
  file_type: 'image' | 'video' | 'audio';
  url: string;
  created_at: string;
}

// Auth helper functions
export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};


export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Media helper functions
export const fetchAllMedia = async () => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const fetchMediaByType = async (fileType: 'image' | 'video' | 'audio') => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('file_type', fileType)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const uploadMediaFile = async (file: File, bucket: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) return { data: null, error };
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return { data: { ...data, publicUrl }, error: null };
};

export const addMediaRecord = async (mediaData: Omit<MediaItem, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('media')
    .insert([mediaData])
    .select();
  
  return { data, error };
};

// Add a like (user_id is optional)
export const addLike = async (mediaId: string, userId?: string) => {
  const { data, error } = await supabase
    .from('likes')
    .insert([{ media_id: mediaId, user_id: userId ?? null }])
    .single();
  return { data, error };
};
// Add a comment (user_id is optional, content is required)
export const addComment = async (mediaId: string, content: string, userId?: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ media_id: mediaId, content, user_id: userId ?? null }])
    .select()
    .single();
  return { data, error };
};
// Fetch comments for a media post
export const fetchComments = async (mediaId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('media_id', mediaId)
    .order('created_at', { ascending: true });
  return { data, error };
};
// Fetch likes count for a media post
export const fetchLikesCount = async (mediaId: string) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('media_id', mediaId);
  return { count, error };
};
export const isPostLikedByUser = async (mediaId: string, userId?: string) => {
  let query = supabase.from('likes').select('*').eq('media_id', mediaId);
  if (userId) query = query.eq('user_id', userId);
  else query = query.is('user_id', null);
  const { data, error } = await query.single();
  return { data, error };
};

// Remove a like
export const removeLike = async (mediaId: string, userId?: string) => {
  let query = supabase.from('likes').delete().eq('media_id', mediaId);
  if (userId) query = query.eq('user_id', userId);
  else query = query.is('user_id', null);
  const { error } = await query;
  return { error };
};