import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge extends Document {
  // Basic Information
  name: string;
  description: string;
  icon: string; // URL or emoji
  color: string; // Hex color code

  // Category
  category: 'learning' | 'community' | 'skill' | 'achievement' | 'special' | 'rare';

  // Requirements
  requirements: {
    type: 'xp' | 'streak' | 'activity' | 'milestone' | 'special';
    value: number;
    description: string;
  };

  // Rarity
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // Rewards
  coinReward: number;
  xpReward: number;

  // Statistics
  totalAwarded: number;

  // Status
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBadge extends Document {
  user: mongoose.Types.ObjectId;
  badge: mongoose.Types.ObjectId;
  awardedDate: Date;
  progress?: number; // For incremental badges
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },

    category: {
      type: String,
      enum: ['learning', 'community', 'skill', 'achievement', 'special', 'rare'],
      required: true
    },

    requirements: {
      type: { type: String, enum: ['xp', 'streak', 'activity', 'milestone', 'special'], required: true },
      value: { type: Number, required: true },
      description: { type: String, required: true }
    },

    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common'
    },

    coinReward: { type: Number, default: 0 },
    xpReward: { type: Number, default: 0 },

    totalAwarded: { type: Number, default: 0 },

    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const UserBadgeSchema = new Schema<IUserBadge>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badge: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
    awardedDate: { type: Date, default: Date.now },
    progress: { type: Number, default: 100 }
  },
  { timestamps: true }
);

// Indexes
BadgeSchema.index({ category: 1, active: 1 });
UserBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });
UserBadgeSchema.index({ awardedDate: -1 });

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
export const UserBadge = mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);
