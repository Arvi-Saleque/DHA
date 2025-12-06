import mongoose, { Schema, Document } from "mongoose";

export interface IFooterSettings extends Document {
  // Social Media Links
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  // Contact Information
  contact: {
    address: string;
    phone: string;
    email: string;
    officeHours: string;
  };
  // Copyright text
  copyrightText: string;
  // Map embed URL
  mapEmbedUrl: string;
  updatedAt: Date;
}

const FooterSettingsSchema = new Schema<IFooterSettings>(
  {
    socialMedia: {
      facebook: { type: String, default: "https://facebook.com" },
      twitter: { type: String, default: "https://twitter.com" },
      instagram: { type: String, default: "https://instagram.com" },
      youtube: { type: String, default: "https://youtube.com" },
    },
    contact: {
      address: {
        type: String,
        default: "123 Education Street, Dhaka, Bangladesh",
      },
      phone: { type: String, default: "+880 1234-567890" },
      email: { type: String, default: "info@madrasa.edu" },
      officeHours: {
        type: String,
        default: "Sunday - Thursday: 8:00 AM - 5:00 PM",
      },
    },
    copyrightText: {
      type: String,
      default: "All rights reserved.",
    },
    mapEmbedUrl: {
      type: String,
      default:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9064863474833!2d90.39166931543427!3d23.750903394653474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2s!4v1633024800000!5m2!1sen!2s",
    },
  },
  {
    timestamps: true,
  }
);

const FooterSettings =
  mongoose.models.FooterSettings ||
  mongoose.model<IFooterSettings>("FooterSettings", FooterSettingsSchema);

export default FooterSettings;
