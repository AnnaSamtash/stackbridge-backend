import createHttpError from 'http-errors';
import {
  createWaterInfoService,
  deleteWaterInfoService,
  getMonthlyWaterService,
  getTodayWaterService,
  updateWaterInfoService,
} from '../services/water.js';
import moment from 'moment-timezone';

export const createWaterInfo = async (req, res) => {
  const userId = req.user._id;
  const { time, amount } = req.body;

  const utcDate = moment
    .tz(time, 'YYYY-MM-DD HH:mm:ss', 'Europe/Kiev')
    .utc()
    .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

  console.log(utcDate);

  const waterData = await createWaterInfoService({
    time: utcDate,
    amount,
    userId,
  });

  res.status(201).json(waterData);
};

export const updateWaterInfo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const updatedRecord = await updateWaterInfoService(id, userId, req.body);

  res.status(200).json(updatedRecord);
};

export const deleteWaterInfo = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const waterData = await deleteWaterInfoService(id, userId);

  if (!waterData) {
    throw createHttpError(404, 'Water not found');
  }

  res.status(204).send();
};

export const getTodayWater = async (req, res) => {
  const userId = req.user.id;

  const result = await getTodayWaterService(userId);

  res.status(200).json(result);
};

export const getMonthlyWater = async (req, res) => {
  const userId = req.user.id;
  const { year, month } = req.params;

  const result = await getMonthlyWaterService(userId, year, month);

  res.status(200).json(result);
};
