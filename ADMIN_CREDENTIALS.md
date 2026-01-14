# Admin Panel Access

## Admin Login

Access the admin panel at: **http://localhost:3000/admin**

The system will automatically redirect you to the login page if you're not authenticated.

### Hardcoded Admin Credentials

**Username:** `adminDHA`  
**Password:** `D!@23h2@%A23`

These credentials are hardcoded in the system for single admin access.

## Admin Routes

After logging in, you'll be redirected to the admin dashboard at `/admin/dashboard`.

### Available Admin Pages:

- **Dashboard:** `/admin/dashboard` - View and manage contact messages
- **Homepage Management:**
  - Why Choose Us: `/admin/homepage`
  - About Us Section: `/admin/homepage-about`
  - News Selection: `/admin/homepage-news`
  - Gallery Selection: `/admin/homepage-gallery`
- **Header Slider:** `/admin/header-slider`
- **Reviews:** `/admin/reviews`
- **About Us:**
  - About: `/admin/about/about-us`
  - Mission & Vision: `/admin/about/mission-vission`
  - Chairman's Message: `/admin/about/chairman-message`
  - Teachers Panel: `/admin/about/teachers`
  - Committee: `/admin/about/committee`
- **Academic:**
  - Daily Assignments: `/admin/academic/assignments`
  - Next Exam: `/admin/academic/next-exam`
  - Today's Absences: `/admin/academic/todays-absences`
  - Curriculum: `/admin/academic/curriculum`
  - Syllabus: `/admin/academic/syllabus`
  - Exam Routine: `/admin/academic/exam-routine`
  - Class Routine: `/admin/academic/class-routine`
  - Academic Calendar: `/admin/academic/academic-calendar`
  - Scholarship: `/admin/academic/scholarship`
  - Admission & Tuition Fee: `/admin/academic/admission-fee`
  - Exam Results: `/admin/academic/exam-results`
- **Admission:** `/admin/admission`
- **Gallery:** `/admin/gallery`
- **News & Events:** `/admin/news-events`
- **Contact:** `/admin/contact`
- **Newsletter:** `/admin/newsletter`
- **Footer Settings:** `/admin/footer-settings`

## Authentication Flow

1. Visit `/admin` or any admin route
2. If not authenticated, you'll be redirected to `/admin/login`
3. Enter credentials (username: `adminDHA`, password: `D!@23h2@%A23`)
4. Upon successful login, you'll be redirected to `/admin/dashboard`
5. Click the logout button in the sidebar to end your session

## Security Note

The authentication token is stored in the browser's localStorage as `adminToken`. The user information is stored as `adminUser`.

## Implementation Details

- **Login API:** `/api/auth/login` (POST)
- **Authentication:** Hardcoded credentials checked before database lookup
- **Session Storage:** localStorage (client-side)
- **Protected Routes:** All admin routes check for authentication token
