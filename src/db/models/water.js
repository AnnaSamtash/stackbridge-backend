import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Water = model('water', waterSchema);
export default Water;
