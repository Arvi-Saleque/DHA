import mongoose from 'mongoose';

// Schema for mission points
const missionPointSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

// Schema for vision points
const visionPointSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

// Schema for core values
const coreValueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
    default: 'CheckCircle',
  },
  color: {
    type: String,
    required: false,
  },
});

const missionVisionSchema = new mongoose.Schema({
  // Mission Section
  missionTitle: {
    type: String,
    required: true,
    default: 'Our Mission',
  },
  missionDescription: {
    type: String,
    required: true,
  },
  missionImageUrl: {
    type: String,
    required: true,
  },
  missionPoints: [missionPointSchema],

  // Vision Section
  visionTitle: {
    type: String,
    required: true,
    default: 'Our Vision',
  },
  visionDescription: {
    type: String,
    required: true,
  },
  visionImageUrl: {
    type: String,
    required: true,
  },
  visionPoints: [visionPointSchema],

  // Core Values
  coreValues: [coreValueSchema],

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const MissionVision = mongoose.models.MissionVision || mongoose.model('MissionVision', missionVisionSchema);

export default MissionVision;
