# Homepage About Us Section - Dynamic Content Management

## Overview
The homepage About Us section has been converted from hardcoded content to dynamic database-driven content. Admins can now edit this section through the admin panel.

## Features Implemented

### 1. Dynamic Homepage About Section
- **Location**: Homepage (`/`)
- **API Endpoint**: `/api/about-us`
- **Database Model**: `AboutUs`

**Content Includes**:
- Title
- Subtitle (optional)
- Description
- Image URL (optional)
- Established Year
- Key Features (displayed as list items)
- Core Values (Mission, Vision, Values with icons)

### 2. Admin Management Page
- **Location**: `/admin/homepage-about`
- **Features**:
  - Edit basic information (title, subtitle, description)
  - Add/remove/edit key features (up to 4 displayed on homepage)
  - Add/remove/edit core values (up to 3 displayed on homepage)
  - Icon selection for core values
  - Real-time preview button
  - Save changes with validation

### 3. Navigation Updates
The admin sidebar now has a submenu under "Homepage":
- **Why Choose Us** → `/admin/homepage` (existing)
- **About Us Section** → `/admin/homepage-about` (new)

## Database Schema

```javascript
{
  title: String,              // Main heading
  subtitle: String,           // Secondary text (optional)
  description: String,        // Main description paragraph
  imageUrl: String,           // Featured image (optional)
  establishedYear: String,    // Year institution was founded
  features: [String],         // Array of key features
  coreValues: [{              // Array of core values
    icon: String,             // Lucide icon name
    title: String,            // Value title (e.g., "Our Mission")
    description: String       // Value description
  }],
  faqs: [{                    // FAQs (not used on homepage)
    question: String,
    answer: String
  }],
  isActive: Boolean,          // Active status
  timestamps: true            // Created/Updated dates
}
```

## How to Use

### For Admins

1. **Access Admin Panel**:
   - Navigate to `/admin/homepage-about`
   - Login if not already authenticated

2. **Edit Basic Information**:
   - Update the title (required)
   - Add or update subtitle (optional context)
   - Edit the main description (required)
   - Add image URL if desired
   - Set established year

3. **Manage Key Features**:
   - Click "Add Feature" to add new features
   - Enter feature text (e.g., "Islamic Education")
   - Remove features with the trash icon
   - Up to 4 features will display on homepage

4. **Manage Core Values**:
   - Click "Add Core Value" to create new values
   - Select an icon from the dropdown (Target, Heart, Shield, etc.)
   - Enter title (e.g., "Our Mission", "Our Vision")
   - Add description text
   - Remove values with the trash icon
   - Up to 3 core values display on homepage

5. **Preview and Save**:
   - Click "Preview" to open homepage in new tab
   - Click "Save Changes" when ready
   - Changes appear immediately on homepage

### For Developers

#### API Endpoints

**GET /api/about-us**
- Returns active About Us data
- No authentication required
- Used by homepage to fetch content

**POST /api/about-us**
- Creates new About Us entry
- Requires authentication
- Deactivates previous entries

**PUT /api/about-us**
- Updates existing About Us entry
- Requires authentication
- Used by admin page to save changes

**DELETE /api/about-us**
- Deletes About Us entry
- Requires authentication

#### Setup Script

Run the setup script to populate initial data:
```bash
node scripts/setup-homepage-about.js
```

This will:
- Connect to MongoDB
- Create or update About Us data
- Add sample content with features and core values

#### Homepage Implementation

The homepage (`src/app/page.tsx`) now:
1. Has `aboutUsData` state for storing content
2. Calls `fetchAboutUs()` on mount to get data from API
3. Shows loading spinner while fetching
4. Displays dynamic content with proper error handling
5. Falls back to "No content available" if data missing

**Key Features**:
- Features display with colored icons (green, blue, purple, amber)
- Core values display with gradient backgrounds (cyan, purple, green)
- Icons are dynamically loaded from Lucide React
- Responsive grid layout for mobile/tablet/desktop

#### Icon System

Available icons for core values:
- Target, Heart, Shield, Trophy, Award, Star
- CheckCircle, BookOpen, GraduationCap, Users
- Globe, Lightbulb, Rocket, BadgeCheck, Sparkles

Icons are imported from `lucide-react` and rendered dynamically based on the icon name stored in the database.

## File Structure

```
src/
├── app/
│   ├── page.tsx                          # Homepage with dynamic About section
│   ├── admin/
│   │   └── homepage-about/
│   │       └── page.tsx                  # Admin management page
│   └── api/
│       └── about-us/
│           └── route.ts                  # API endpoints
├── models/
│   └── AboutUs.ts                        # Mongoose schema
└── components/
    └── admin/
        └── DashboardLayout.tsx           # Updated sidebar menu

scripts/
└── setup-homepage-about.js               # Data population script
```

## Sample Data

Default content includes:
- Title: "Welcome to Darul Hikmah Academy"
- Description about the institution
- 4 features: Islamic Education, Modern Curriculum, Expert Faculty, Excellence Focus
- 3 core values: Mission, Vision, Values

## Troubleshooting

### Content Not Showing on Homepage
1. Check if About Us data exists in database
2. Verify `isActive: true` is set
3. Run setup script to create initial data
4. Check browser console for API errors

### Admin Page Not Saving
1. Verify authentication is working
2. Check API endpoint is accessible
3. Look for validation errors (title and description required)
4. Check server logs for error messages

### Icons Not Displaying
1. Verify icon name matches Lucide React icon exactly (case-sensitive)
2. Check that icon is imported in the icons list
3. Default to "Target" icon if name doesn't match

## Benefits

✅ **No Code Changes Needed**: Admins can update content without developer help
✅ **Consistent Design**: Changes maintain the same professional styling
✅ **Real-time Updates**: Changes appear immediately after saving
✅ **Version Control**: All changes tracked with timestamps
✅ **User-Friendly**: Simple interface for non-technical users
✅ **Flexible**: Easy to add more features or core values

## Future Enhancements

Potential improvements:
- Image upload functionality (currently uses URLs)
- Drag-and-drop reordering for features and values
- Multi-language support
- Content versioning and rollback
- Preview mode before publishing
- Scheduled content updates

## Related Documentation

- `MONGODB_SCHEMA.md` - Complete database schema
- `MONGODB_SETUP_COMPLETE.md` - Database setup guide
- `SETUP_INSTRUCTIONS.md` - General project setup

## Support

For issues or questions:
1. Check this documentation
2. Review API endpoint responses
3. Check MongoDB connection
4. Verify authentication is working
5. Run setup script to reset data
