import { Schema } from 'mongoose';

export const PostsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      required: true,
      unique: true,
      trim: true,
      alias: 'id',
    },
    userId: {
      type: Schema.Types.UUID,
      required: true,
      trim: true,
      alias: 'user_id',
    },
    count: {
      type: Schema.Types.BigInt,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      alias: 'created_at',
    },
  },
  {
    timestamps: false,
    autoCreate: false,
  },
);
