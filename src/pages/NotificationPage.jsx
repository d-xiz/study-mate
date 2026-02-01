import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const loadNotifications = () => {
    if (!currentUser) return;

    api.notifications
      .getForUser(currentUser.id)
      .then(setNotifications)
      .catch(() => console.error("Failed to load notifications"));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <main >
      <center>
      <h1>Notifications</h1></center>

      {notifications.length === 0 && (
        <p className="empty-state">No notifications yet.</p>
      )}

      <div className="notification-list">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`notification-card ${n.status}`}
          >
            <div className="notification-content">
              <p className="notification-message">
                <strong>{n.senderId?.name}</strong>{" "}
                {n.type === "group_join" && "requested to join your group"}
                {n.type === "tutor_booking" && "requested a tutor session"}
                {n.type === "tutor_booking_accepted" && "accepted your tutor session request"}
                {n.type === "tutor_booking_rejected" && "rejected your tutor session request"}

                {n.groupId && (
                  <> <strong>{n.groupId.name}</strong></>
                )}
              </p>

              {n.message && (
                <p className="notification-sub welcome-message">
                  “{n.message}”
                </p>
              )}

              <span className="notification-time">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>

            {/* ACTIONS */}
            {n.status === "pending" && (
              <div className="notif-actions">
                <button
                  className="notif-accept"
                  onClick={() =>
                    api.notifications
                      .updateStatus(n._id, "accepted")
                      .then(loadNotifications)
                  }
                >
                  Accept
                </button>

                <button
                  className="notif-reject"
                  onClick={() =>
                    api.notifications
                      .updateStatus(n._id, "rejected")
                      .then(loadNotifications)
                  }
                >
                  Reject
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </main>
  );
};

export default NotificationsPage;
