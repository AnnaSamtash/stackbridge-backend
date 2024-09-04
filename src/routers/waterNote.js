import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';
import { updateWaterSchema, waterSchema } from '../validation/waterNote.js';
import { validateId } from '../middlewares/validateId.js';
import {
  createWaterNote,
  deleteWaterNote,
  getMonthlyWaterNotes,
  getTodayWaterNotes,
  updateWaterNote,
} from '../controllers/waterNote.js';

const router = Router();

router.use(checkToken);

router.post('/', validateBody(waterSchema), ctrlWrapper(createWaterNote));

router.patch(
  '/:id',
  validateId,
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterNote),
);

router.delete('/:id', validateId, ctrlWrapper(deleteWaterNote));

router.get('/today', ctrlWrapper(getTodayWaterNotes));

router.get('/:year/:month', ctrlWrapper(getMonthlyWaterNotes));

export default router;
