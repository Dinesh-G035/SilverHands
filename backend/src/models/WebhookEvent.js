import mongoose from 'mongoose';

const { Schema } = mongoose;

const WebhookEventSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ['received', 'processed', 'failed'],
      default: 'received',
      index: true,
    },
    errorMessage: { type: String, default: '' },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export const WebhookEvent = mongoose.model('WebhookEvent', WebhookEventSchema);

