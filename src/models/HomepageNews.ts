import mongoose from 'mongoose';

const homepageNewsSchema = new mongoose.Schema({
  newsEventIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsEvent',
    required: true
  }],
  maxItems: {
    type: Number,
    default: 3,
    min: 1,
    max: 6
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.HomepageNews || mongoose.model('HomepageNews', homepageNewsSchema);
