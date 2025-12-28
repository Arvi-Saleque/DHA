# Curriculum PDF Flipbook Implementation - Complete Guide

## Summary of Changes

All changes have been implemented to enable Cloudinary PDF-to-image transformation for a premium flipbook experience.

---

## 🔧 Critical Fix: Upload Configuration

### File: `src/app/api/upload/route.ts`

**Changed:** PDF upload from `resource_type: 'raw'` to `resource_type: 'auto'`

This is the CRITICAL fix that allows Cloudinary to treat PDFs as images and enable page extraction.

```typescript
// ❌ OLD (Wrong - stores as raw file):
const resourceType = isPDF ? "raw" : "image";

// ✅ NEW (Correct - allows page transformation):
const resourceType = isPDF ? "auto" : "image";
```

---

## 📊 Database Schema Update

### File: `src/models/Curriculum.ts`

**Added:** `totalPages` field to track PDF page count

```typescript
totalPages: {
  type: Number,
  default: 15,
}
```

---

## 🎨 New Flipbook Component

### File: `src/components/common/MobilePDFViewer.tsx`

**Replaced:** Simple iframe viewer with Swiper.js flipbook

**Features:**
- Swipeable page navigation
- Touch-friendly controls
- High-quality image rendering from PDF pages
- Automatic page extraction using Cloudinary transformations

**URL Transformation:**
```
Original PDF: .../raw/upload/v123/curriculum/file.pdf
Page Image:   .../image/upload/w_1200,q_auto:best,f_auto/pg_1/curriculum/file.jpg
```

---

## 🖥️ Admin Panel Updates

### File: `src/app/admin/academic/curriculum/page.tsx`

**Added:**
1. `totalPages` input field
2. Updated form data to include page count
3. Default value: 15 pages

**Form Fields:**
- Category (Pre Hifz / Hifz / Post Hifz)
- PDF Upload
- **Total Pages** (new)

---

## 📄 Public Page Updates

### File: `src/app/academic/curriculum/page.tsx`

**Updated:** Pass `totalPages` from database to viewer

```typescript
<MobilePDFViewer
  pdfUrl={group.curriculum.pdfUrl}
  totalPages={group.curriculum.totalPages || 15}
/>
```

---

## 🗑️ Data Cleanup Tools

### 1. API Endpoint: `/api/curriculum/delete-all`
**File:** `src/app/api/curriculum/delete-all/route.ts`

**Usage:**
```bash
# Using curl
curl -X DELETE http://localhost:3000/api/curriculum/delete-all

# Using Postman/Thunder Client
DELETE http://localhost:3000/api/curriculum/delete-all
```

### 2. Node Script: `scripts/delete-curriculum.js`
**Usage:**
```bash
MONGODB_URI=your_connection_string node scripts/delete-curriculum.js
```

---

## 📝 Step-by-Step Migration Guide

### Step 1: Delete Old Data
```bash
# Option A: Use API endpoint
curl -X DELETE http://localhost:3000/api/curriculum/delete-all

# Option B: Use MongoDB script
MONGODB_URI=your_mongodb_uri node scripts/delete-curriculum.js
```

### Step 2: Restart Development Server
```bash
# Stop current server (Ctrl+C)
# Start fresh
npm run dev
```

### Step 3: Upload New PDFs

1. Go to **Admin Panel** → **Academic** → **Curriculum**
2. Click **Add New Curriculum**
3. Select category (Pre Hifz / Hifz / Post Hifz)
4. **Upload PDF** (will now use `resource_type: 'auto'`)
5. **Enter total pages** (count pages in your PDF)
6. Click **Save**

### Step 4: Verify URL Format

After upload, check the database. The new PDF URL should be:
```
✅ Correct: https://res.cloudinary.com/dr3thd67a/image/upload/v123.../curriculum/file.pdf
❌ Wrong:   https://res.cloudinary.com/dr3thd67a/raw/upload/v123.../curriculum/file.pdf
```

**Important:** If you see `/raw/upload/`, the file was uploaded before the fix. Delete and re-upload.

### Step 5: Test Flipbook

1. Go to **Public Site** → **Academic** → **Curriculum**
2. Select a category tab
3. You should see the flipbook with swipeable pages
4. Swipe left/right to navigate
5. Use navigation arrows on desktop

---

## 🔍 Troubleshooting

### Problem: Images showing 404

**Cause:** PDF uploaded as `raw` instead of `image`

**Solution:**
1. Delete the curriculum entry
2. Re-upload the PDF (upload code is now fixed)
3. Verify URL contains `/image/upload/` not `/raw/upload/`

### Problem: Wrong number of pages shown

**Cause:** Incorrect `totalPages` value

**Solution:**
1. Count actual pages in your PDF
2. Edit curriculum entry
3. Update `Total Pages` field
4. Save

### Problem: Flipbook not appearing

**Cause:** Missing Swiper CSS imports

**Solution:**
The MobilePDFViewer component includes all required imports:
```typescript
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
```

---

## 📦 Dependencies

All required packages are already installed:
- ✅ `swiper` (Flipbook slider)
- ✅ `cloudinary` (Backend upload)
- ✅ `lucide-react` (Icons)

---

## ✨ Final Result

### Before (Old Method):
- PDFs uploaded as raw files
- No page extraction possible
- Basic iframe viewer
- Poor mobile experience

### After (New Method):
- PDFs uploaded as images (resource_type: auto)
- Page-by-page extraction enabled
- Premium Swiper flipbook
- Touch-friendly mobile experience
- High-quality page rendering

---

## 🎯 Key Points to Remember

1. **Always use `resource_type: 'auto'`** for PDF uploads
2. **Count pages** in your PDF before uploading
3. **Verify URL format** after upload (must be `/image/upload/`)
4. **Delete old data** before re-uploading
5. **Test on mobile** for best experience

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify Cloudinary URL format
3. Ensure `totalPages` matches actual PDF
4. Confirm Swiper is properly imported

---

**Status:** ✅ All changes complete and ready to use!

**Next Action:** Delete old curriculum data and re-upload PDFs with the new system.
