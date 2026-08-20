import { Router } from 'express';
import { createReport, getMyReports } from '../../controllers/report.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { createReportSchema } from '../../validators/index.js';

const router = Router();

router.use(protect);

router.post('/', validateBody(createReportSchema), createReport);
router.get('/my-reports', getMyReports);

export default router;

