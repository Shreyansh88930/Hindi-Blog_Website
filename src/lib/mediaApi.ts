// src/lib/mediaApi.ts
import { supabase } from './supabase'

export async function getAllMedia() {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getMediaById(id: string) {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createMedia(media: any) {
  const { data, error } = await supabase
    .from('media')
    .insert(media)
    .single()
  return { data, error }
}

export async function updateMedia(id: string, media: any) {
  const { data, error } = await supabase
    .from('media')
    .update(media)
    .eq('id', id)
    .single()
  return { data, error }
}

export async function deleteMedia(id: string) {
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id)
  return { error }
}

// For uploads to storage buckets:
export async function uploadMediaFile(file: File, type: 'image' | 'video' | 'audio') {
  const bucket = type === 'image' ? 'images' : type === 'video' ? 'videos' : 'audios'
  const filePath = `${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (error) return { error }
  const { data: publicUrlData } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(filePath)
  return { url: publicUrlData.publicUrl }
}

export async function unlikePost(mediaId: string, userId?: string) {
  let query = supabase.from('likes').delete().eq('media_id', mediaId);
  if (userId) query = query.eq('user_id', userId);
  else query = query.is('user_id', null);
  const { error } = await query;
  return { error };
}

export async function getLikesCount(mediaId: string) {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('media_id', mediaId);
  return { count, error };
}


export async function addComment(mediaId: string, content: string, userId?: string, name?: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      media_id: mediaId,
      user_id: userId ?? null,
      content,
      name: name ?? 'Guest'
    })
    .select()
    .maybeSingle();
  return { data, error };
}

export async function getComments(mediaId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('media_id', mediaId)
    .order('created_at', { ascending: true });
  return { data, error };
}

export async function likePost(mediaId: string, userId?: string) {
  const { data, error } = await supabase
    .from('likes')
    .insert({
      media_id: mediaId,
      user_id: userId ?? null
    })
    .select()
    .maybeSingle(); // <- fix here
  return { data, error };
}

export async function isPostLikedByUser(mediaId: string, userId?: string) {
  let query = supabase.from('likes').select('*').eq('media_id', mediaId);
  if (userId !== null && userId !== undefined) {
    query = query.eq('user_id', userId);
  }
  const { data, error } = await query.maybeSingle(); // <- fix here
  return { data, error };
}
