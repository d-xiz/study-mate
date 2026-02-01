const BASE_URL = import.meta.env.VITE_API_URL;


export const usersApi = {
  getById: async (userId) => {
    const res = await fetch(`${BASE_URL}/users/${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    return res.json();
  },

  completeProfile: async (userId, data) => {
    const res = await fetch(`${BASE_URL}/users/${userId}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to complete profile");
    }

    return res.json();
  },
  updateRole: async (userId, role) => {
  const res = await fetch(
    `${BASE_URL}/users/${userId}/role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update role");
  }

  return res.json();
},
getGamification: async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/gamification`);
  if (!res.ok) throw new Error("Failed to load gamification");
  return res.json();
},

};
