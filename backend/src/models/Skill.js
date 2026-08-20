import mongoose from 'mongoose';

const { Schema } = mongoose;

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    suggestedPriceRange: {
      min: { type: Number, default: 100 },
      max: { type: Number, default: 500 },
      unit: { type: String, default: 'hour' },
    },
    icon: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Skill = mongoose.model('Skill', SkillSchema);

