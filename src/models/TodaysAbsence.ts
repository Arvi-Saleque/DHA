import mongoose from 'mongoose';

// Individual student absence record
const studentAbsenceSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
});

const todaysAbsenceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    className: {
      type: String,
      required: true,
      enum: [
        'Play Group',
        'Nursery',
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7',
        'Class 8',
        'Class 9',
        'Class 10',
      ],
      index: true,
    },
    students: [studentAbsenceSchema],
    totalAbsent: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
todaysAbsenceSchema.index({ date: -1, className: 1 });

// Update totalAbsent before saving
todaysAbsenceSchema.pre('save', function (next) {
  this.totalAbsent = this.students.length;
  next();
});

const TodaysAbsence = mongoose.models.TodaysAbsence || mongoose.model('TodaysAbsence', todaysAbsenceSchema);

export default TodaysAbsence;
