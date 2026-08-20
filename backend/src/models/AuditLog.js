import mongoose from 'mongoose';

const { Schema } = mongoose;

const AuditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    targetId: { type: Schema.Types.ObjectId, index: true },
    targetModel: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    changes: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

