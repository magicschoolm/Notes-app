
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/me",
        { withCredentials: true }
      );

   console.log("In Fetch Uswe Login :",response)
      setUser(response.data);
    } catch (err) {
      setUser(null);
      console.log("Fetch user failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
        console.log("Before Login :",userData)
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        await fetchUser();
        return true;
      }
      return false;
    } catch (err) {
      setUser(null);
      console.log("Login failed:", err.response?.data || err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);


  const logout = async () => {
    try {
    await axios.post(
        "http://localhost:5000/api/auth/logout", {}, { withCredentials: true }
      );
      setUser(null)
    } catch (error) {
      setUser(null)
      console.log("logout error: ", error);
    }
}   



  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


