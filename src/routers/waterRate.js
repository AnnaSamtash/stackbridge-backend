import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';
import { waterRateSchema } from '../validation/user.js';
import { updateWaterRate } from '../controllers/waterRate.js';

const router = Router();

router.use(checkToken);

router.patch('/', validateBody(waterRateSchema), ctrlWrapper(updateWaterRate));

export default router;
