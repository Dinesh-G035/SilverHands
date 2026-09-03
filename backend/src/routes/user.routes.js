import { Router } from 'express';
import { getProfile, updateProfile, getProviderPublicProfile } from '../../controllers/user.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { updateProfileSchema } from '../../validators/index.js';

const router = Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, validateBody(updateProfileSchema), updateProfile);
router.get('/provider/:id', getProviderPublicProfile);

export default router;

