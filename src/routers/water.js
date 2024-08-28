import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';
import { updateWaterSchema, waterSchema } from '../validation/water.js';
import { validateId } from '../middlewares/validateId.js';
import {
  createWaterInfo,
  deleteWaterInfo,
  getMonthlyWater,
  getTodayWater,
  updateWaterInfo,
} from '../controllers/water.js';

const router = Router();

router.use(checkToken);

router.post('/', validateBody(waterSchema), ctrlWrapper(createWaterInfo));

router.patch(
  '/:id',
  validateId,
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterInfo),
);

router.delete('/:id', validateId, ctrlWrapper(deleteWaterInfo));

router.get('/today', ctrlWrapper(getTodayWater));

router.get('/:year/:month', ctrlWrapper(getMonthlyWater));

export default router;
