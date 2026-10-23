import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";


import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// ==========================================
// GET CURRENT USER NOTIFICATIONS
// ==========================================

router.get(
  "/",
  authMiddleware,
  getNotifications
);


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

router.put(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

router.put(
  "/read-all",
  authMiddleware,
  markAllNotificationsAsRead
);


// ==========================================
// DELETE NOTIFICATION
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);


// ==========================================
// CREATE NOTIFICATION
// ==========================================

router.post(
  "/",
  authMiddleware,
  createNotification
);

export default router;