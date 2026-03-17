import { supabase } from './supabase';

/**
 * Checks if the required bucket exists and is accessible.
 */
export const checkBuckets = async (): Promise<Record<string, boolean>> => {
  const bucketsToCheck = ['images', 'videos'];
  const results: Record<string, boolean> = {};

  // List all buckets to see what's available
  const { data: allBuckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError.message);
  } else {
    const bucketNames = allBuckets.map(b => b.name);
    console.log('Available buckets in Supabase:', bucketNames);
  }

  for (const bucket of bucketsToCheck) {
    const { data, error } = await supabase.storage.getBucket(bucket);
    results[bucket] = !!data && !error;
    if (error) {
      console.warn(`Bucket check failed for '${bucket}':`, error.message);
    }
  }

  return results;
};

/**
 * Uploads a file to a Supabase Storage bucket and returns the public URL.
 * @param bucket The name of the bucket (e.g., 'images', 'videos')
 * @param file The File object to upload
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (bucket: string, file: File): Promise<string> => {
  // Validate file type
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  if (!isImage && !isVideo) {
    throw new Error('Only images and videos are allowed.');
  }

  // Create a unique file name to avoid collisions
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload the file to Supabase Storage
  console.log(`Attempting to upload to bucket: "${bucket}"`);
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading file:', error);
    if (error.message.includes('Bucket not found')) {
      const { data: allBuckets } = await supabase.storage.listBuckets();
      const available = allBuckets?.map(b => b.name).join(', ') || 'none';
      throw new Error(`Bucket "${bucket}" not found. Available buckets: ${available}. Please ensure the bucket is Public.`);
    }
    if (error.message.includes('row-level security policy')) {
      throw new Error(`Upload failed: RLS Policy violation. You need to add an INSERT policy for the "${bucket}" bucket in Supabase -> Storage -> Policies.`);
    }
    throw error;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};
