import Notification from "../models/Notification.js";

// ==========================================
// GET CURRENT USER NOTIFICATIONS
// ==========================================

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get notifications",
    });
  }
};


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

export const markNotificationAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.userId,
        },
        {
          read: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark Notification Read Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark notification as read",
    });
  }
};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

export const markAllNotificationsAsRead = async (
  req,
  res
) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.userId,
        read: false,
      },
      {
        read: true,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark All Notifications Read Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark all notifications as read",
    });
  }
};


// ==========================================
// DELETE NOTIFICATION
// ==========================================

export const deleteNotification = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Notification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete notification",
    });
  }
};


// ==========================================
// CREATE NOTIFICATION
// ==========================================

export const createNotification = async (
  req,
  res
) => {
  try {
    const {
      title,
      message,
      type,
    } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Title and message are required",
      });
    }

    const notification =
      await Notification.create({
        user: req.user.userId,
        title: title.trim(),
        message: message.trim(),
        type: type || "general",
        read: false,
      });

    return res.status(201).json({
      success: true,
      message:
        "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create notification",
    });
  }
};