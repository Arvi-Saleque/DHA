import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate configuration
export function validateCloudinaryConfig() {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  
  if (!cloud_name || !api_key || !api_secret) {
    const missing = [];
    if (!cloud_name) missing.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    if (!api_key) missing.push('CLOUDINARY_API_KEY');
    if (!api_secret) missing.push('CLOUDINARY_API_SECRET');
    
    throw new Error(`Missing Cloudinary environment variables: ${missing.join(', ')}`);
  }
}

export default cloudinary;

// Helper function to extract public ID from Cloudinary URL
export function getPublicIdFromUrl(url: string): string | null {
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}
