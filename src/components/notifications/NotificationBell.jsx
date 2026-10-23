import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

const API_URL = `${
  import.meta.env.VITE_API_URL ||
  "https://farmiq-api-6asq.onrender.com/api"
}/notifications`;

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET AUTH TOKEN
  // ==========================================

  const getToken = () => {
    return sessionStorage.getItem("farmiq_token");
  };

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      const token = getToken();

      if (!token) {
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/notifications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch notifications"
        );
      }

      setNotifications(
        data.notifications || []
      );
    } catch (error) {
      console.error(
        "Notification Fetch Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ==========================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(
          ".notification-container"
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const markAsRead = async (id) => {
    try {
      const token = getToken();

      if (!token) return;

      const response = await fetch(
        `${API_URL}/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark notification as read"
        );
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark Notification Error:",
        error
      );
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      const token = getToken();

      if (!token) return;

      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark all notifications as read"
        );
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark All Notifications Error:",
        error
      );
    }
  };

  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  const removeNotification = async (id) => {
    try {
      const token = getToken();

      if (!token) return;

      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete notification"
        );
      }

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Notification Error:",
        error
      );
    }
  };

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="relative notification-container">

      {/* ======================================
          NOTIFICATION BUTTON
      ====================================== */}

      <button
        type="button"
        onClick={() => {
          setOpen((previous) => !previous);

          if (!open) {
            fetchNotifications();
          }
        }}
        className="relative w-11 h-11 rounded-xl flex items-center justify-center text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
        aria-label="Notifications"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* ======================================
          DROPDOWN
      ====================================== */}

      {open && (
        <div className="absolute right-0 top-14 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">

          {/* HEADER */}

          <div className="flex items-center justify-between px-5 py-4 border-b">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Notifications
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1
                        ? "s"
                        : ""
                    }`
                  : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-green-600 hover:text-green-700"
              >
                Mark all read
              </button>
            )}

          </div>

          {/* ======================================
              NOTIFICATION LIST
          ====================================== */}

          <div className="max-h-96 overflow-y-auto">

            {loading ? (
              <div className="px-5 py-10 text-center">
                <p className="text-gray-500">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">

                <Bell
                  size={36}
                  className="mx-auto text-gray-300 mb-3"
                />

                <p className="text-gray-500">
                  No notifications
                </p>

              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <div
                    key={notification._id}
                    className={`relative px-5 py-4 border-b hover:bg-gray-50 transition ${
                      !notification.read
                        ? "bg-green-50/50"
                        : "bg-white"
                    }`}
                  >

                    <div className="flex gap-3">

                      {/* ICON */}

                      <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <Bell size={18} />
                      </div>

                      {/* CONTENT */}

                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          markAsRead(
                            notification._id
                          )
                        }
                      >

                        <div className="flex items-start justify-between gap-2">

                          <h3 className="font-semibold text-gray-800 text-sm">
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                          )}

                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeNotification(
                            notification._id
                          )
                        }
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove notification"
                      >
                        <X size={16} />
                      </button>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default NotificationBell;