import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { upload } from '../middlewares/multer.js';
import { checkToken } from '../middlewares/checkToken.js';
import { updateUserSchema } from '../validation/user.js';
import {
  getUserInfo,
  updateUser,
  updateUserAvatar,
} from '../controllers/user.js';

const router = Router();

router.use(checkToken);

router.patch('/avatar', upload.single('avatar'), ctrlWrapper(updateUserAvatar));

router.get('/', ctrlWrapper(getUserInfo));

router.patch(
  '/',
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUser),
);
export default router;
