# 🚀 Quick Start Guide - Cloudinary Setup

## What Changed?

Your project now uses **Cloudinary** instead of Google Drive for all file uploads (images and PDFs). This means:
- ✅ Direct file upload from admin panel
- ✅ No more manual Google Drive link copying
- ✅ Automatic file optimization and CDN delivery
- ✅ Better performance and user experience

## Setup Steps (5 minutes)

### Step 1: Create Cloudinary Account

1. Go to **[cloudinary.com](https://cloudinary.com/users/register_free)**
2. Click "Sign Up" and create a free account
3. Verify your email

### Step 2: Get Your Credentials

1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. You'll see three important values on your dashboard:
   - **Cloud Name** (example: `dq3xhb00a`)
   - **API Key** (example: `123456789012345`)
   - **API Secret** (click "Reveal" button to see it)

### Step 3: Add to Environment Variables

1. Open your project folder
2. Create a file named `.env.local` in the root (if it doesn't exist)
3. Add these lines:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

4. Replace `your_cloud_name_here`, `your_api_key_here`, and `your_api_secret_here` with your actual values from Step 2

### Step 4: Restart Development Server

```bash
# Stop your current server (Ctrl+C)
npm run dev
```

## ✅ You're Done!

Now when you go to any admin page, you'll see a new "Upload Image" or "Upload PDF" button instead of URL input fields.

## How to Upload Files

### For Images (Gallery, Slider, News, etc.)
1. Click "Upload Image" button
2. Select image from your computer
3. Wait for upload to complete (you'll see a preview)
4. Click "Save" to save your changes

### For PDFs (Syllabus, Routines, Calendar)
1. Click "Upload PDF" button
2. Select PDF from your computer
3. Wait for upload to complete (you'll see file info)
4. Click "Save" to save your changes

## Updated Pages

### Image Uploads
- Gallery Management
- Header Slider
- News & Events
- Today's Absences
- Chairman Message (photo & signature)
- Homepage About Us

### PDF Uploads
- Syllabus Management
- Exam Routine
- Class Routine
- Curriculum
- Academic Calendar

## File Size Limits

- **Images**: 5MB maximum (automatically optimized)
- **PDFs**: 10MB maximum

## Supported Formats

- **Images**: JPG, PNG, WebP, GIF
- **PDFs**: PDF only

## Free Tier Limits

Cloudinary free account includes:
- 25GB storage
- 25GB monthly bandwidth
- 25,000 transformations/month

This is more than enough for most educational institutions!

## Troubleshooting

### Upload fails with "Upload failed" error
- ✅ Check that your `.env.local` file has the correct credentials
- ✅ Make sure you restarted the dev server after adding credentials
- ✅ Verify your file is under the size limit

### Can't see the upload button
- ✅ Clear your browser cache
- ✅ Make sure the page has loaded completely
- ✅ Check browser console for errors (F12)

### "Invalid credentials" error
- ✅ Double-check your Cloud Name, API Key, and API Secret
- ✅ Make sure there are no extra spaces in `.env.local`
- ✅ Verify you're using the correct environment variable names

## Need Help?

1. Check [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for detailed documentation
2. Check [CLOUDINARY_MIGRATION_COMPLETE.md](./CLOUDINARY_MIGRATION_COMPLETE.md) for technical details
3. Visit [Cloudinary Documentation](https://cloudinary.com/documentation)

## What About Existing Google Drive Links?

Don't worry! Existing Google Drive links will continue to work. When you edit content:
1. The old link will still be there
2. You can upload a new file using Cloudinary
3. The new Cloudinary URL will replace the old Google Drive link
4. Save your changes

## Questions?

**Q: Do I need to pay for Cloudinary?**  
A: No! The free tier is sufficient for most schools.

**Q: What happens to my old Google Drive files?**  
A: They stay in Google Drive. You can delete them if you want.

**Q: Can I still use Google Drive links?**  
A: Yes, but we recommend using Cloudinary for better performance.

**Q: Is my data safe?**  
A: Yes! Cloudinary has enterprise-grade security and 99.9% uptime.

---

**🎉 Congratulations!** You're now using a professional image and file management system!
