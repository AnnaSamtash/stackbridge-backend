import { initMongoConnection } from '../db/initMongoConnection.js';
import mongoose from 'mongoose';

export const watchWaterChangesByPeriod = async (id, startDate, endDate) => {
  await initMongoConnection();
  const collection = mongoose.connection.collection('waters');

  const pipeline = [
    {
      $match: {
        'fullDocument._id': new mongoose.Types.ObjectId(id),
        'fullDocument.updatedAt': {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
  ];

  const changeStream = collection.watch(pipeline);

  changeStream.on('change', (change) => {
    console.log(change);
  });

  return changeStream;
};
