import createHttpError from 'http-errors';
import {
  createWaterInfoService,
  deleteWaterInfoService,
  getMonthlyWaterNotesService,
  getTodayWaterNotesService,
  updateWaterInfoService,
} from '../services/waterNote.js';

export const createWaterNote = async (req, res) => {
  const userId = req.user._id;

  const waterData = await createWaterInfoService({
    ...req.body,
    userId,
  });

  res.status(201).json(waterData);
};

export const updateWaterNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const updatedNote = await updateWaterInfoService(id, userId, req.body);

  if (!updatedNote) {
    throw createHttpError(404, `Water note with id ${userId} not found`);
  }

  res.status(200).json(updatedNote);
};

export const deleteWaterNote = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const waterData = await deleteWaterInfoService(id, userId);

  if (!waterData) {
    throw createHttpError(404, `Water note with id ${userId} not found`);
  }

  res.status(204).send();
};

export const getTodayWaterNotes = async (req, res) => {
  const userId = req.user.id;

  const result = await getTodayWaterNotesService(userId);

  res.status(200).json(result);
};

export const getMonthlyWaterNotes = async (req, res) => {
  const userId = req.user.id;
  const { year, month } = req.params;

  const result = await getMonthlyWaterNotesService(userId, year, month);

  res.status(200).json(result);
};
