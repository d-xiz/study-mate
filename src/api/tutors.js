const BASE_URL = import.meta.env.VITE_API_URL;


export const tutorsApi = {
  getAll: async (module = "") => {
    const res = await fetch(
      `${BASE_URL}/tutors${module ? `?module=${module}` : ""}`
    );

    if (!res.ok) throw new Error("Failed to fetch tutors");
    return res.json();
  },

create: async (data) => {
  const res = await fetch(`${BASE_URL}/tutors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json();

    return Promise.reject({
      status: res.status,
      message: body.error || "Failed to create tutor",
    });
  }

  return res.json();
},
 update: async (tutorId, data) => {
    const res = await fetch(`${BASE_URL}/tutors/${tutorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      return Promise.reject({
        status: res.status,
        message: body.error || "Failed to update tutor",
      });
    }

    return res.json();
  },
  delete: async (tutorId) => {
  const res = await fetch(`${BASE_URL}/tutors/${tutorId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error || "Failed to delete tutor");
  }
},
getByUserId: async (userId) => {
  const res = await fetch(`${BASE_URL}/tutors/user/${userId}`);

  if (!res.ok) {
    throw new Error("Tutor not found");
  }

  return res.json();
},

};