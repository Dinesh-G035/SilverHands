import { Router } from 'express';
import {
  sendMessage,
  getConversationMessages,
  getConversationsList,
} from '../../controllers/message.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../middleware/validate.middleware.js';
import { sendMessageSchema } from '../../validators/index.js';

const router = Router();

router.use(protect);

router.post('/send', validateBody(sendMessageSchema), sendMessage);
router.get('/conversations', getConversationsList);
router.get('/conversations/:otherUserId', getConversationMessages);

export default router;

