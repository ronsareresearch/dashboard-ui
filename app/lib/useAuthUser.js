import { useEffect, useState } from "react";
import axios from "axios";
import { AUTH_SERVER } from "@/app/constant/constant";

const api = axios.create({
  baseURL: AUTH_SERVER,
  withCredentials: true,
});

export const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading };
};
