import { supabase } from './supabase';

/**
 * Uploads a file to a Supabase Storage bucket and returns the public URL.
 * @param bucket The name of the bucket (e.g., 'images', 'videos')
 * @param file The File object to upload
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (bucket: string, file: File): Promise<string> => {
  // Create a unique file name to avoid collisions
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};
