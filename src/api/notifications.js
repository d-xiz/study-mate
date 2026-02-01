const BASE_URL = import.meta.env.VITE_API_URL;


export const notificationsApi = {
  create: async (data) => {
    const res = await fetch(`${BASE_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || "Failed to create notification");
    }

    return res.json();
  },

  getForUser: async (userId) => {
    const res = await fetch(`${BASE_URL}/notifications/${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return res.json();
  },

  updateStatus: async (id, status) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Failed to update notification");
    }

    return res.json();
  },
};
