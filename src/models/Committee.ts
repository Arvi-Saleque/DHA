import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  tenure: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,
  icon: String,
  color: {
    type: String,
    default: "cyan",
  },
  category: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const ResponsibilitySchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const CommitteeSchema = new mongoose.Schema(
  {
    // Introduction Section
    sectionTitle: {
      type: String,
      default: "Committed to Excellence",
    },
    sectionDescription: {
      type: String,
      default:
        "Our management committee comprises accomplished professionals from diverse fields, united by a shared commitment to advancing Islamic education and serving the community.",
    },

    // Categories
    categories: [CategorySchema],

    // Members
    members: [MemberSchema],

    // Responsibilities Section
    responsibilitiesTitle: {
      type: String,
      default: "Committee Responsibilities",
    },
    responsibilitiesSubtitle: {
      type: String,
      default: "Our committee ensures effective governance and sustainable growth",
    },
    responsibilities: [ResponsibilitySchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Committee ||
  mongoose.model("Committee", CommitteeSchema);
