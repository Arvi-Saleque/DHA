# MongoDB Schema Structure for Madrasa Management System

## Collections Overview

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String, // 'super_admin', 'teacher', 'accountant'
  phone: String,
  designation: String,
  department: String,
  isActive: Boolean,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Students Collection
```javascript
{
  _id: ObjectId,
  studentId: String (unique, indexed),
  name: String,
  grade: String, // 'Grade 8', 'Grade 9', etc.
  section: String, // 'A', 'B', 'C'
  rollNumber: String,
  dateOfBirth: Date,
  gender: String,
  guardianName: String,
  guardianPhone: String,
  guardianEmail: String,
  address: String,
  admissionDate: Date,
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Assignments Collection
```javascript
{
  _id: ObjectId,
  class: String,
  section: String,
  subject: String,
  name: String,
  instructions: String,
  assignDate: Date,
  submissionDate: Date,
  marks: Number,
  priority: String, // 'high', 'medium', 'low'
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Exams Collection
```javascript
{
  _id: ObjectId,
  examName: String,
  examType: String, // 'midterm', 'final', 'terminal'
  grade: String,
  startDate: Date,
  endDate: Date,
  status: String, // 'upcoming', 'ongoing', 'completed'
  schedule: [{
    date: Date,
    day: String,
    subject: String,
    time: String,
    duration: String,
    room: String
  }],
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### 5. ClassRoutines Collection
```javascript
{
  _id: ObjectId,
  grade: String,
  section: String,
  term: String, // 'Fall 2025', 'Spring 2026'
  imageUrl: String,
  pdfUrl: String,
  updatedBy: ObjectId (ref: Users),
  updatedDate: Date,
  createdAt: Date
}
```

### 6. Absences Collection
```javascript
{
  _id: ObjectId,
  grade: String,
  section: String,
  date: Date,
  absentStudents: [ObjectId] (ref: Students),
  totalAbsent: Number,
  imageUrl: String, // uploaded image of absence list
  updatedBy: ObjectId (ref: Users),
  updatedTime: String,
  createdAt: Date
}
```

### 7. Scholarships Collection
```javascript
{
  _id: ObjectId,
  benefactorId: String,
  benefactorName: String,
  studentId: ObjectId (ref: Students),
  studentName: String,
  class: String,
  amount: Number,
  date: Date,
  status: String, // 'Active', 'Completed', 'Suspended'
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### 8. Fees Collection
```javascript
{
  _id: ObjectId,
  className: String,
  tuitionFee: Number,
  academicFee: Number,
  yearlyFee: Number,
  academicYear: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 9. NewsEvents Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String, // 'news', 'event', 'announcement'
  date: Date,
  imageUrl: String,
  content: String,
  isPublished: Boolean,
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### 10. Gallery Collection
```javascript
{
  _id: ObjectId,
  title: String,
  category: String, // 'Academic Events', 'Sports', etc.
  imageUrl: String,
  date: Date,
  location: String,
  description: String,
  uploadedBy: ObjectId (ref: Users),
  createdAt: Date
}
```

### 11. AdmissionApplications Collection
```javascript
{
  _id: ObjectId,
  applicantName: String,
  dateOfBirth: Date,
  grade: String,
  guardianName: String,
  guardianPhone: String,
  guardianEmail: String,
  address: String,
  documents: [{
    type: String,
    url: String
  }],
  status: String, // 'pending', 'approved', 'rejected'
  applicationDate: Date,
  reviewedBy: ObjectId (ref: Users),
  reviewDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 12. Results Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Students),
  examId: ObjectId (ref: Exams),
  grade: String,
  section: String,
  subjects: [{
    name: String,
    marksObtained: Number,
    totalMarks: Number,
    grade: String
  }],
  totalMarks: Number,
  obtainedMarks: Number,
  percentage: Number,
  resultStatus: String, // 'Pass', 'Fail'
  publishDate: Date,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Routes Structure

### Authentication
- POST `/api/auth/login` - Admin/Teacher login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Get current user
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Users Management
- GET `/api/users` - Get all users (admin only)
- POST `/api/users` - Create user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Students
- GET `/api/students` - Get all students
- GET `/api/students/:id` - Get student by ID
- POST `/api/students` - Create student
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student

### Assignments
- GET `/api/assignments` - Get all assignments
- POST `/api/assignments` - Create assignment
- PUT `/api/assignments/:id` - Update assignment
- DELETE `/api/assignments/:id` - Delete assignment

### Exams
- GET `/api/exams` - Get all exams
- GET `/api/exams/next` - Get next exam
- POST `/api/exams` - Create exam
- PUT `/api/exams/:id` - Update exam
- DELETE `/api/exams/:id` - Delete exam

### Routines
- GET `/api/routines` - Get all routines
- POST `/api/routines` - Upload routine
- PUT `/api/routines/:id` - Update routine
- DELETE `/api/routines/:id` - Delete routine

### Absences
- GET `/api/absences` - Get absences
- GET `/api/absences/today` - Get today's absences
- POST `/api/absences` - Upload absence record
- PUT `/api/absences/:id` - Update absence

### Scholarships
- GET `/api/scholarships` - Get all scholarships
- POST `/api/scholarships` - Create scholarship
- PUT `/api/scholarships/:id` - Update scholarship
- DELETE `/api/scholarships/:id` - Delete scholarship

### Gallery
- GET `/api/gallery` - Get gallery images
- POST `/api/gallery` - Upload image
- DELETE `/api/gallery/:id` - Delete image

### Admissions
- GET `/api/admissions` - Get applications
- POST `/api/admissions` - Submit application
- PUT `/api/admissions/:id` - Update application status

## Environment Variables Needed

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/madrasa?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# File Upload (Choose one)
# Option 1: Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Option 2: AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# Email Service (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# App Config
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## Next Steps

1. **Set up MongoDB Atlas** (or local MongoDB)
2. **Install required packages:**
   ```bash
   npm install mongoose bcryptjs jsonwebtoken
   npm install multer cloudinary (for file uploads)
   ```
3. **Create database connection**
4. **Implement authentication middleware**
5. **Create API routes**
6. **Build admin dashboard**

Would you like me to proceed with:
1. Setting up the MongoDB connection?
2. Creating the authentication API routes?
3. Building the admin dashboard?
