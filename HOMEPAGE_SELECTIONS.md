# Homepage News & Gallery Selection System

## Overview
The homepage now features a dynamic content selection system for News & Events and Gallery sections. Admins can choose which specific items appear on the homepage from existing content, rather than always showing the latest items automatically.

## Features Implemented

### 1. Homepage News Selection
- **Admin Page**: `/admin/homepage-news`
- **API Endpoint**: `/api/homepage-news`
- **Models**: `HomepageNews`, `NewsEvent`

**Capabilities**:
- Select specific news items from all available news
- Set display limit (3, 4, or 6 items)
- View selection order with numbered badges
- Preview selections before saving
- Reset to automatic mode (shows latest 3)
- Visual feedback for selected items

### 2. Homepage Gallery Selection
- **Admin Page**: `/admin/homepage-gallery`
- **API Endpoint**: `/api/homepage-gallery`
- **Models**: `HomepageGallery`, `GalleryImage`

**Capabilities**:
- Select specific gallery images from all available images
- Set display limit (3, 6, 9, or 12 images)
- Grid view with image previews
- View selection order with numbered badges
- Preview selections before saving
- Reset to automatic mode (shows latest 6)
- Category badges for organization

## Database Schema

### HomepageNews Model
```javascript
{
  newsEventIds: [ObjectId],    // References to NewsEvent documents
  maxItems: Number,            // How many items to display (default: 3)
  isActive: Boolean,           // Active status (default: true)
  timestamps: true             // Created/Updated dates
}
```

### HomepageGallery Model
```javascript
{
  galleryImageIds: [ObjectId], // References to GalleryImage documents
  maxItems: Number,            // How many images to display (default: 6)
  isActive: Boolean,           // Active status (default: true)
  timestamps: true             // Created/Updated dates
}
```

## How to Use

### For Admins

#### Managing Homepage News

1. **Access the Admin Panel**:
   - Navigate to `/admin/homepage-news`
   - Login if not authenticated

2. **View Current Status**:
   - See if you're using Custom Selection or Automatic mode
   - Check how many items are selected
   - Adjust display limit (3, 4, or 6 items)

3. **Select News Items**:
   - Browse all available news items
   - Check the boxes for news you want to display
   - Selected items show numbered badges (#1, #2, etc.)
   - Items appear in the order you select them
   - Each item shows:
     * Thumbnail image
     * Title and excerpt
     * Category badge
     * Published date
     * Active status

4. **Save Your Selection**:
   - Click "Save Selection" button
   - Changes apply immediately to homepage
   - Use "Preview" to see how it looks

5. **Reset to Automatic**:
   - Click "Reset to Auto" button
   - Confirms before resetting
   - Homepage will show latest 3 news automatically

#### Managing Homepage Gallery

1. **Access the Admin Panel**:
   - Navigate to `/admin/homepage-gallery`
   - Login if not authenticated

2. **View Current Status**:
   - See if you're using Custom Selection or Automatic mode
   - Check how many images are selected
   - Adjust display limit (3, 6, 9, or 12 images)

3. **Select Gallery Images**:
   - Browse all gallery images in grid view
   - Check the boxes for images you want to display
   - Selected images show numbered badges (#1, #2, etc.)
   - Images appear in the order you select them
   - Each image shows:
     * Full image preview
     * Title
     * Category badge
     * Active status

4. **Save Your Selection**:
   - Click "Save Selection" button
   - Changes apply immediately to homepage
   - Use "Preview" to see how it looks

5. **Reset to Automatic**:
   - Click "Reset to Auto" button
   - Confirms before resetting
   - Homepage will show latest 6 images automatically

### For Developers

#### API Endpoints

**GET /api/homepage-news**
```javascript
// Returns selected news for homepage
Response: {
  newsEvents: [NewsEvent],      // Array of selected news
  maxItems: Number,             // Display limit
  isCustomSelection: Boolean,   // True if custom, false if automatic
  _id: String                   // Selection document ID (if exists)
}

// Fallback: If no custom selection, returns latest 3 news
```

**POST /api/homepage-news**
```javascript
// Create new news selection
Body: {
  newsEventIds: [String],       // Array of news IDs
  maxItems: Number              // Optional, defaults to 3
}
```

**PUT /api/homepage-news**
```javascript
// Update existing news selection
Body: {
  _id: String,                  // Selection document ID
  newsEventIds: [String],       // Array of news IDs
  maxItems: Number              // Optional, defaults to 3
}
```

**DELETE /api/homepage-news**
```javascript
// Remove custom selection (reverts to automatic)
Response: {
  message: "Homepage news selection removed"
}
```

**GET /api/homepage-gallery**
```javascript
// Returns selected gallery images for homepage
Response: {
  images: [GalleryImage],       // Array of selected images
  maxItems: Number,             // Display limit
  isCustomSelection: Boolean,   // True if custom, false if automatic
  _id: String                   // Selection document ID (if exists)
}

// Fallback: If no custom selection, returns latest 6 images
```

**POST /api/homepage-gallery**
```javascript
// Create new gallery selection
Body: {
  galleryImageIds: [String],    // Array of image IDs
  maxItems: Number              // Optional, defaults to 6
}
```

**PUT /api/homepage-gallery**
```javascript
// Update existing gallery selection
Body: {
  _id: String,                  // Selection document ID
  galleryImageIds: [String],    // Array of image IDs
  maxItems: Number              // Optional, defaults to 6
}
```

**DELETE /api/homepage-gallery**
```javascript
// Remove custom selection (reverts to automatic)
Response: {
  message: "Homepage gallery selection removed"
}
```

#### Setup Script

Run the setup script to create initial selections from existing content:
```bash
node scripts/setup-homepage-selections.js
```

This will:
- Connect to MongoDB
- Find latest 3 active news items
- Find latest 6 active gallery images
- Create/update homepage selections
- Show what was selected

#### Homepage Implementation

The homepage (`src/app/page.tsx`) now:
1. Calls `/api/homepage-news` instead of `/api/news-events`
2. Calls `/api/homepage-gallery` instead of `/api/gallery`
3. Uses whatever items are returned (respects selection)
4. Falls back gracefully if no content available

**Key Changes**:
```javascript
// Before
const response = await fetch("/api/news-events");
const data = await response.json();
setNewsEvents(data.newsEvents.slice(0, 3));

// After
const response = await fetch("/api/homepage-news");
const data = await response.json();
setNewsEvents(data.newsEvents); // Already limited by API
```

## File Structure

```
src/
├── app/
│   ├── page.tsx                          # Homepage (updated to use new APIs)
│   ├── admin/
│   │   ├── homepage-news/
│   │   │   └── page.tsx                  # News selection admin page
│   │   └── homepage-gallery/
│   │       └── page.tsx                  # Gallery selection admin page
│   └── api/
│       ├── homepage-news/
│       │   └── route.ts                  # News selection API
│       └── homepage-gallery/
│           └── route.ts                  # Gallery selection API
├── models/
│   ├── HomepageNews.ts                   # News selection model
│   └── HomepageGallery.ts                # Gallery selection model
└── components/
    ├── admin/
    │   └── DashboardLayout.tsx           # Updated with new menu items
    └── ui/
        └── checkbox.tsx                  # Checkbox component (new)

scripts/
└── setup-homepage-selections.js          # Initial data population
```

## Admin Navigation

The Homepage submenu now includes:
- **Why Choose Us** → `/admin/homepage` (existing)
- **About Us Section** → `/admin/homepage-about` (existing)
- **News Selection** → `/admin/homepage-news` (new)
- **Gallery Selection** → `/admin/homepage-gallery` (new)

## User Interface Features

### News Selection Page
- ✅ Status card showing selection mode and count
- ✅ Display limit dropdown (3/4/6 items)
- ✅ List view with thumbnails
- ✅ Checkboxes for selection
- ✅ Numbered badges showing order
- ✅ Category color coding
- ✅ Published date display
- ✅ Active/Inactive status indicators
- ✅ Reset and Preview buttons
- ✅ Save confirmation

### Gallery Selection Page
- ✅ Status card showing selection mode and count
- ✅ Display limit dropdown (3/6/9/12 images)
- ✅ Grid view with image previews
- ✅ Checkboxes for selection
- ✅ Numbered badges showing order
- ✅ Category badges
- ✅ Active/Inactive status indicators
- ✅ Reset and Preview buttons
- ✅ Responsive grid layout
- ✅ Save confirmation

## Behavior

### Automatic Mode (Default)
- When no custom selection exists
- Homepage shows latest items by date
- News: Latest 3 by `publishedAt` (descending)
- Gallery: Latest 6 by `order` (ascending)
- Indicated by blue badge "Automatic"

### Custom Selection Mode
- When admin has selected specific items
- Homepage shows only selected items
- Respects selection order
- Respects display limit setting
- Indicated by green badge "Custom Selection"

### Fallback Handling
- If selected items are deleted, they won't appear
- If all selected items are inactive, falls back to automatic
- If no items exist at all, shows empty state
- Graceful error handling throughout

## Benefits

✅ **Full Control**: Choose exactly which content appears on homepage
✅ **Order Control**: Items appear in the order you select them
✅ **Flexible Limits**: Adjust how many items display (3-12)
✅ **Visual Selection**: See thumbnails/previews while selecting
✅ **Easy Reset**: One-click return to automatic mode
✅ **Real-time Preview**: Check changes before publishing
✅ **Category Filtering**: Visual category badges help organization
✅ **Status Awareness**: See which items are active/inactive
✅ **User-Friendly**: Checkbox interface familiar to all users
✅ **Fallback Safety**: Automatic mode if custom selection removed

## Troubleshooting

### Content Not Showing on Homepage
1. Check if items are marked as `isActive: true`
2. Verify selection exists in database
3. Check if selected items still exist
4. Try resetting to automatic mode
5. Check browser console for API errors

### Selection Not Saving
1. Verify authentication is working
2. Check that at least one item is selected
3. Look for validation errors (requires 1+ items)
4. Check server logs for error messages
5. Verify MongoDB connection is active

### Images Not Loading
1. Check image URLs are valid
2. Verify images exist in gallery database
3. Check if images are marked active
4. Review browser network tab for 404s
5. Check image paths in database

### Selection Order Issues
1. Selection order follows the order you click checkboxes
2. To reorder, uncheck all and select in desired order
3. Badge numbers show current order (#1, #2, etc.)
4. Refresh page to see updated order

## Performance Considerations

- API uses MongoDB population for efficient joins
- Only active items are queried
- Display limits prevent overloading
- Caching can be added to API responses
- Images should be optimized before upload

## Future Enhancements

Potential improvements:
- Drag-and-drop reordering
- Bulk selection tools
- Preview thumbnail in selection list
- Scheduled content rotation
- Analytics on clicked items
- Multi-homepage support (different selections per page)
- A/B testing different selections

## Related Documentation

- `HOMEPAGE_ABOUT_SECTION.md` - About Us dynamic content
- `MONGODB_SCHEMA.md` - Complete database schema
- `SETUP_INSTRUCTIONS.md` - General project setup

## Installation

Required package (already installed):
```bash
npm install @radix-ui/react-checkbox
```

## Quick Start

1. Run setup script:
   ```bash
   node scripts/setup-homepage-selections.js
   ```

2. Visit admin pages:
   - News: http://localhost:3001/admin/homepage-news
   - Gallery: http://localhost:3001/admin/homepage-gallery

3. Select your content and save

4. Check homepage to see changes

## Support

For issues:
1. Check this documentation
2. Review API responses in Network tab
3. Check MongoDB for data existence
4. Verify authentication tokens
5. Run setup script to reset
