const BASE_URL = import.meta.env.VITE_API_URL;


export const groupsApi = {
  getAll: async (query = "") => {
  const res = await fetch(
    `${BASE_URL}/groups${query ? `?q=${query}` : ""}`
  );

  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
},
getById: async (groupId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch group");
  }

  return res.json();
},

  create: async (data) => {
    const res = await fetch(`${BASE_URL}/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create group");
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/groups/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update group");
    return res.json();
  },

  delete: async  (groupId, userId) => {
    const res = await fetch(`${BASE_URL}/groups/${groupId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Failed to delete group");
    return res.json();
  },
  leave: async (groupId, userId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/leave`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) throw new Error("Failed to leave group");
  return res.json();
},


};
