import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    role: { type: String, required: true },
    method: { type: String, required: true },
    path: { type: String, required: true },
    ip: { type: String, default: "unknown" },
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);
