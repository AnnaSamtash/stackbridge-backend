import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  loginUser,
  logout,
  registerUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';

const router = Router();

router.post(
  '/signup',
  validateBody(createUserSchema),
  ctrlWrapper(registerUser),
);

router.post('/signin', validateBody(createUserSchema), ctrlWrapper(loginUser));

router.post('/logout', checkToken, ctrlWrapper(logout));

router.post(
  '/forgot-password',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmail),
);

router.post(
  '/update-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPassword),
);

export default router;
