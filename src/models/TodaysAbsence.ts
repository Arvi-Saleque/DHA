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
todaysAbsenceSchema.pre('save', function () {
  this.totalAbsent = this.students.length;
});

// Delete existing model to avoid schema mismatch issues
if (mongoose.models.TodaysAbsence) {
  delete mongoose.models.TodaysAbsence;
}

const TodaysAbsence = mongoose.model('TodaysAbsence', todaysAbsenceSchema);

export default TodaysAbsence;
