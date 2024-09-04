import WaterNote from '../db/models/waterNote.js';
import User from '../db/models/user.js';
import moment from 'moment-timezone';
import createHttpError from 'http-errors';

export const createWaterInfoService = (waterData) =>
  WaterNote.create(waterData);

export const updateWaterInfoService = (id, userId, waterData) =>
  WaterNote.findOneAndUpdate({ _id: id, userId }, waterData, { new: true });

export const deleteWaterInfoService = (id, userId) =>
  WaterNote.findOneAndDelete({ _id: id, userId });

export const getTodayWaterNotesService = async (userId) => {
  const start = moment.tz('Europe/Kiev').startOf('day').utc().toDate();
  const end = moment.tz('Europe/Kiev').endOf('day').utc().toDate();

  const [todayWaterNotesList, user] = await Promise.all([
    WaterNote.find({ userId, date: { $gte: start, $lte: end } }).lean(),
    User.findById(userId).lean(),
  ]);

  if (!todayWaterNotesList || !user) {
    throw createHttpError(404, 'Water notes or user not found');
  }

  const totalWater = todayWaterNotesList.reduce((total, item) => {
    return total + item.waterVolume;
  }, 0);

  const percentOfWaterRate = ((totalWater / user.waterRate) * 100).toFixed();

  return { percentOfWaterRate: `${percentOfWaterRate}%`, todayWaterNotesList };
};

export const getMonthlyWaterNotesService = async (userId, year, month) => {
  const start = moment
    .tz(`${year}-${month}`, 'YYYY-MM', 'Europe/Kiev')
    .startOf('month')
    .utc()
    .toDate();
  const end = moment
    .tz(`${year}-${month}`, 'YYYY-MM', 'Europe/Kiev')
    .endOf('month')
    .utc()
    .toDate();

  const [monthlyWaterNotes, user] = await Promise.all([
    WaterNote.find({ userId, date: { $gte: start, $lte: end } }).lean(),
    User.findById(userId).lean(),
  ]);

  if (!monthlyWaterNotes || !user) {
    throw createHttpError(404, 'Water notes or user not found');
  }

  const waterPerDay = monthlyWaterNotes.reduce((acc, record) => {
    const date = new Date(record.date).getDate();
    if (!acc[date])
      acc[date] = {
        totalWater: 0,
        count: 0,
      };
    acc[date].totalWater += record.waterVolume;
    acc[date].count += 1;
    return acc;
  }, {});

  return Object.keys(waterPerDay).map((date) => {
    const { totalWater, count } = waterPerDay[date];
    const waterRate = user?.waterRate;

    const percentOfWaterRate = Math.min(
      ((totalWater / waterRate) * 100).toFixed(),
      100,
    );

    return {
      date: `${date}, ${moment(end).format('MMMM')}`,
      waterRate: `${(waterRate / 1000).toFixed(1)} L`,
      percentOfWaterRate: `${percentOfWaterRate}%`,
      amountOfRecords: count,
    };
  });
};
