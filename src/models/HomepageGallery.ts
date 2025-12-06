import mongoose from 'mongoose';

const homepageGallerySchema = new mongoose.Schema({
  galleryImageIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GalleryImage',
    required: true
  }],
  maxItems: {
    type: Number,
    default: 6,
    min: 3,
    max: 12
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.HomepageGallery || mongoose.model('HomepageGallery', homepageGallerySchema);
