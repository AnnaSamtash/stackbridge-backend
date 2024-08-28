import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['woman', 'man'],
      default: 'woman',
    },
    avatar: {
      type: String,
      default: null,
    },
    waterRate: {
      type: Number,
      default: 2000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User = model('user', userSchema);
export default User;
