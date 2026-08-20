import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) throw new AppError('Receiver user not found', 404);

    // Generate deterministic conversationId between two users
    const conversationId = [senderId.toString(), receiverId].sort().join('_');

    const message = await Message.create({
      senderId,
      receiverId,
      conversationId,
      text,
      isRead: false,
    });

    return sendSuccess(res, message, 'Message sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getConversationMessages = async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id.toString();
    const conversationId = [userId, otherUserId].sort().join('_');

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name profileImage')
      .populate('receiverId', 'name profileImage')
      .sort({ createdAt: 1 });

    // Mark unread messages
    await Message.updateMany(
      { conversationId, receiverId: req.user._id, isRead: false },
      { isRead: true }
    );

    return sendSuccess(res, messages, 'Conversation messages retrieved');
  } catch (error) {
    next(error);
  }
};

export const getConversationsList = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all distinct conversation messages involving user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate('senderId', 'name profileImage city')
      .populate('receiverId', 'name profileImage city')
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();
    for (const msg of messages) {
      if (!conversationsMap.has(msg.conversationId)) {
        conversationsMap.set(msg.conversationId, msg);
      }
    }

    const conversations = Array.from(conversationsMap.values());
    return sendSuccess(res, conversations, 'Recent conversations retrieved');
  } catch (error) {
    next(error);
  }
};

