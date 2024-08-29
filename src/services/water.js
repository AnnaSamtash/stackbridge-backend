import Water from '../db/models/water.js';
import User from '../db/models/user.js';
import moment from 'moment-timezone';

export const createWaterInfoService = (waterData) => Water.create(waterData);

export const updateWaterInfoService = (id, userId, waterData) =>
  Water.findOneAndUpdate({ _id: id, userId }, waterData, { new: true });

export const deleteWaterInfoService = (id, userId) =>
  Water.findOneAndDelete({ _id: id, userId });

export const getTodayWaterService = async (userId) => {
  const start = moment.tz('Europe/Kiev').startOf('day').utc().toDate();
  const end = moment.tz('Europe/Kiev').endOf('day').utc().toDate();

  const todayWaterList = await Water.find({
    userId,
    time: { $gte: start, $lte: end },
  }).lean();

  const totalWater = todayWaterList.reduce((total, item) => {
    return total + item.amount;
  }, 0);

  const user = await User.findById(userId);

  const percentOfWaterRate = ((totalWater / user.waterRate) * 100).toFixed();

  return { percentOfWaterRate: `${percentOfWaterRate}%`, todayWaterList };
};

export const getMonthlyWaterService = async (userId, year, month) => {
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

  const [monthlyWater, user] = await Promise.all([
    Water.find({ userId, time: { $gte: start, $lte: end } }).lean(),
    User.findById(userId).lean(),
  ]);

  const waterPerDay = monthlyWater.reduce((acc, record) => {
    const date = new Date(record.time).getDate();
    if (!acc[date])
      acc[date] = {
        totalWater: 0,
        count: 0,
      };
    acc[date].totalWater += record.amount;
    acc[date].count += 1;
    return acc;
  }, {});

  return Object.keys(waterPerDay).map((date) => {
    const { totalWater, count } = waterPerDay[date];
    const waterRate = user?.waterRate ?? 1500;

    const percentOfWaterRate = Math.min(
      ((totalWater / waterRate) * 100).toFixed(),
      100,
    );

    return {
      date: `${date}, ${moment(start).format('MMMM')}`,
      waterRate: `${(waterRate / 1000).toFixed(1)} L`,
      percentOfWaterRate: `${percentOfWaterRate}%`,
      amountOfRecords: count,
    };
  });
};
