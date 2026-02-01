const BASE_URL = import.meta.env.VITE_API_URL;


export const authApi = {
  login: async (adminNumber, password) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNumber, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const user = await res.json();
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  signup: async (name, adminNumber, password) => {
    const res = await fetch(`${BASE_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, adminNumber, password }),
    });

    if (!res.ok) {
      throw new Error("Signup failed");
    }

    return res.json();
  },

  logout: () => {
    localStorage.removeItem("user");
  },
};
