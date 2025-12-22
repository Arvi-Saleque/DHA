# Cloudinary PDF Access Issue - Quick Fix

## The Problem
PDFs are uploading but showing "Customer is marked as untrusted" error when trying to view them.

## Solution

### Option 1: Update Cloudinary Account Settings (Recommended)

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Click **Settings** (gear icon) in the top right
3. Go to **Security** tab
4. Under **Restricted media types**, make sure **Raw files** delivery is **ENABLED**
5. Look for **"Blocked for delivery"** or **"Untrusted customers"** settings
6. Change to **Allow public access** for raw files
7. Click **Save**

### Option 2: Change in Media Library Settings

1. Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
2. Find your uploaded PDF
3. Click on it to open details
4. Look for **Access Control** section
5. Change from "Blocked for delivery" to **Public**
6. Save changes

### Option 3: Account Verification

If the above doesn't work, you may need to:
1. Go to **Account Settings**
2. Complete **Email Verification** if not done
3. Some accounts require phone verification for raw file delivery
4. Check if your account is in "trial mode" which restricts raw file access

## After Fixing Settings

1. **Delete old PDFs** from Cloudinary Media Library
2. **Re-upload** PDFs through your admin panel
3. New uploads will have proper public access

## Code Changes Already Applied

I've already updated the upload code to:
- ✅ Set `access_mode: "public"` for all uploads
- ✅ Explicitly set `type: "upload"`
- ✅ Removed the `flags: "attachment"` that may have caused issues

## Test After Configuration

1. Upload a new PDF through any admin page
2. Click "View PDF" link
3. PDF should now open without errors

## If Still Not Working

Contact Cloudinary support - your account might have restrictions on raw file delivery that need to be lifted by their team. Free tier accounts sometimes have this limitation.
