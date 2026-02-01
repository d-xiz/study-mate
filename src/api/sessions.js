const BASE_URL = import.meta.env.VITE_API_URL;


export const sessionsApi = {
  create: async (data) => {
    const res = await fetch(`${BASE_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || "Failed to book session");
    }

    return res.json();
  },
  getTutorSessionCount: async (userId) => {
  const res = await fetch(`${BASE_URL}/sessions/tutor/${userId}/count`);
  if (!res.ok) throw new Error("Failed to fetch session count");
  return res.json();
},
getForStudent: async (userId) => {
    const res = await fetch(`${BASE_URL}/sessions/student/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch student sessions");
    return res.json();
  },

  getForTutor: async (tutorId) => {
    const res = await fetch(`${BASE_URL}/sessions/tutor/${tutorId}`);
    if (!res.ok) throw new Error("Failed to fetch tutor sessions");
    return res.json();
  },
cancel: async (sessionId) => {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}/cancel`, {
    method: "PATCH",
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error || "Failed to cancel session");
  }

  return res.json();
},

};
