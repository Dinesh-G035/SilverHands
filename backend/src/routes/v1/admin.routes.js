import { Router } from 'express';
import {
  getUsersAdmin,
  verifyUserAdmin,
  moderateListingAdmin,
  getReportsAdmin,
  resolveReportAdmin,
} from '../../controllers/admin.controller.js';
import { protect, restrictTo } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/users', getUsersAdmin);
router.patch('/users/:id/verify', verifyUserAdmin);
router.patch('/listings/:type/:id/moderate', moderateListingAdmin);
router.get('/reports', getReportsAdmin);
router.patch('/reports/:id/resolve', resolveReportAdmin);

export default router;

