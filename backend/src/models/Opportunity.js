import mongoose from 'mongoose';

const { Schema } = mongoose;

const OpportunitySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    demandLevel: {
      type: String,
      enum: ['high', 'medium', 'trending'],
      default: 'high',
    },
    estimatedEarningsRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      unit: { type: String, default: 'month' },
    },
    requiredSkills: [{ type: String }],
    targetCities: [{ type: String }],
    icon: { type: String, default: '🌟' },
    seniorFriendlyNote: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Opportunity = mongoose.model('Opportunity', OpportunitySchema);

