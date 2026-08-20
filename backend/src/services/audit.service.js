import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';

export class AuditService {
  /**
   * Logs security or administrative audit events.
   * @param {{ actorId?: string, action: string, targetId?: string, targetModel?: string, ipAddress?: string, changes?: any }} params
   */
  static async log(params) {
    try {
      await AuditLog.create({
        actorId: params.actorId,
        action: params.action,
        targetId: params.targetId,
        targetModel: params.targetModel || '',
        ipAddress: params.ipAddress || '',
        changes: params.changes || {},
      });
    } catch (err) {
      logger.error(`[AuditService] Failed to record audit log: ${err.message}`);
    }
  }
}

