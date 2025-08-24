import { get, post } from "@/lib/request";

const authService = {
  login: async (email: string, password: string) => {
    const response = await post("/api/auth/login", { email, password });
    return response;
  },
  logout: async () => {
    return post("/api/auth/logout", undefined);
  },
  register: async (email: string, password: string) => {
    const response = await post("/api/auth/register", { email, password });
    return response;
  },

  getUser: async () => {
    const response = await get("/api/auth/get-user");
    return response;
  },

  createGuestUser: async () => {
    const response = await post("/api/auth/create-guest-user");
    return response;
  },
};

export default authService;
