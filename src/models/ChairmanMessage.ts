import mongoose from 'mongoose';

// Schema for core values
const coreValueSchema = new mongoose.Schema({
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

const chairmanMessageSchema = new mongoose.Schema({
  // Chairman Profile
  chairmanName: {
    type: String,
    required: true,
  },
  chairmanTitle: {
    type: String,
    required: true,
    default: 'Chairman, Board of Trustees',
  },
  servingSince: {
    type: String,
    required: true,
  },
  chairmanImageUrl: {
    type: String,
    required: true,
  },
  signatureImageUrl: {
    type: String,
    required: false,
  },

  // Message Content
  messageTitle: {
    type: String,
    required: true,
    default: 'Assalamu Alaikum & Greetings',
  },
  messageParagraphs: [{
    type: String,
  }],
  closingMessage: {
    type: String,
    required: false,
  },
  closingRegards: {
    type: String,
    required: false,
    default: 'Warm regards,',
  },

  // Core Values
  coreValues: [coreValueSchema],

  // Achievements
  achievements: [{
    type: String,
  }],

  // Inspirational Quote
  inspirationalQuote: {
    type: String,
    required: false,
  },
  quoteAuthor: {
    type: String,
    required: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const ChairmanMessage = mongoose.models.ChairmanMessage || mongoose.model('ChairmanMessage', chairmanMessageSchema);

export default ChairmanMessage;
