# Cloudinary Image Upload Setup

This project now uses Cloudinary for image uploads instead of Google Drive. This provides a better, more integrated image management experience.

## Features

✅ Direct image upload from admin panel  
✅ Automatic image optimization and CDN delivery  
✅ Image preview before upload  
✅ Organized folders for different content types  
✅ No manual Google Drive sharing links needed  

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. You get 25GB storage and 25GB monthly bandwidth on the free tier

### 2. Get Your Cloudinary Credentials

1. After signing up, go to your [Dashboard](https://cloudinary.com/console)
2. You'll see your account details:
   - **Cloud Name** (e.g., `dq3xhb00a`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click to reveal)

### 3. Add Credentials to Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

3. Replace the placeholder values with your actual Cloudinary credentials

### 4. Restart Your Development Server

```bash
npm run dev
```

## How to Use

### Uploading Images

1. Go to any admin page with image upload (Gallery, Header Slider, News/Events, etc.)
2. Click the "Upload Image" button
3. Select an image from your computer
4. The image will be automatically uploaded to Cloudinary
5. You'll see a preview of the uploaded image
6. Save your changes

### Supported Image Types

- JPG/JPEG
- PNG
- WebP
- GIF

### File Size Limits

- Maximum file size: 5MB (configurable)
- Images are automatically optimized by Cloudinary

### Organized Folders

Images are automatically organized into folders based on content type:

- `gallery/` - Gallery images
- `header-slider/` - Homepage slider images
- `news-events/` - News and events images
- `absences/` - Attendance sheet images
- `chairman/` - Chairman photos and signatures
- `homepage-about/` - About section images

## Pages Updated

The following admin pages now use Cloudinary upload:

- ✅ Gallery Management
- ✅ Header Slider
- ✅ Today's Absences
- ✅ Chairman Message
- ✅ Homepage About Us
- ✅ News & Events

## Migration from Google Drive

If you have existing Google Drive URLs in your database:

1. The old URLs will continue to work
2. When you edit an item, use the new image uploader to replace the Google Drive link
3. Upload the image again using Cloudinary
4. Save the changes

## Troubleshooting

### "Upload failed" error

- Check that your Cloudinary credentials are correct in `.env.local`
- Make sure you've restarted the dev server after adding credentials
- Check that your file is under 5MB

### Images not displaying

- Verify your `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Check the browser console for any CORS errors
- Ensure the Cloudinary URL is valid

### API Key/Secret issues

- Make sure there are no extra spaces in your `.env.local` file
- Verify the credentials in your Cloudinary dashboard
- Try regenerating your API secret if needed

## Benefits Over Google Drive

1. **Direct Upload**: No need to manually upload to Drive and copy links
2. **Automatic Optimization**: Images are automatically optimized for web
3. **Fast CDN**: Cloudinary serves images through a global CDN
4. **Image Transformations**: Automatic resizing and format conversion
5. **Better Security**: No need to make files publicly accessible
6. **Professional Management**: Built-in image management dashboard

## API Endpoints

### Upload Image
```
POST /api/upload
Body: FormData with 'file' and optional 'folder'
Response: { success: true, url: string, publicId: string }
```

### Delete Image
```
DELETE /api/upload?publicId=<public_id>
Response: { success: true, result: object }
```

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your environment variables
3. Check Cloudinary dashboard for upload logs
4. Ensure your Cloudinary account is active

## Next Steps

Consider implementing:

- Image cropping before upload
- Multiple image upload
- Image gallery/library for reusing images
- Automatic image backup
- Analytics on image usage
