import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';
import { updateWaterSchema, waterSchema } from '../validation/water.js';
import { validateId } from '../middlewares/validateId.js';
import {
  createWaterRecord,
  deleteWaterRecord,
  getMonthlyWaterRecords,
  getTodayWaterRecords,
  updateWaterRecord,
} from '../controllers/water.js';

const router = Router();

router.use(checkToken);

router.post('/', validateBody(waterSchema), ctrlWrapper(createWaterRecord));

router.patch(
  '/:id',
  validateId,
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterRecord),
);

router.delete('/:id', validateId, ctrlWrapper(deleteWaterRecord));

router.get('/today', ctrlWrapper(getTodayWaterRecords));

router.get('/:year/:month', ctrlWrapper(getMonthlyWaterRecords));

export default router;
