const BASE_URL = import.meta.env.VITE_API_URL;


export const homeApi = {
  getSubjects: async () => {
    const res = await fetch(`${BASE_URL}/home/subjects`);
    if (!res.ok) throw new Error("Failed to fetch subjects");
    return res.json();
  },

  getPopularGroups: async () => {
    const res = await fetch(`${BASE_URL}/home/groups`);
    if (!res.ok) throw new Error("Failed to fetch groups");
    return res.json();
  },
};
