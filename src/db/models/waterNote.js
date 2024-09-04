import { model, Schema } from 'mongoose';

const waterNoteSchema = new Schema(
  {
    waterVolume: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const WaterNote = model('water', waterNoteSchema);
export default WaterNote;
