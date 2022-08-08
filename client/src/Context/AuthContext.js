import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function useAuth() {
  return useContext(UserContext);
}

export const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const signup = async (email, password) => {
    const result = await axios.post("http://localhost:5000/api/user/register", {
      email,
      password,
    });
    if (result.data.status === "ok") {
      return await signin(email, password);
    } else {
      return { access: false, error: result.data.error };
    }
  };

  const signin = async (email, password) => {
    const result = await axios.post("http://localhost:5000/api/user/login", {
      email,
      password,
    });
    if (result.data.status === "ok") {
      setUser({ token: result.data.token, email: result.data.email });
      localStorage.setItem("token", result.data.token);
      return { access: true, data: result.data };
    } else {
      return { access: false, error: result.data.error };
    }
  };

  const logout = async () => {
    const res = await axios.get("http://localhost:5000/api/user/logout");
    localStorage.removeItem("token");
    return res.data;
  };

  const value = {
    signin,
    signup,
    user,
    logout,
    setUser,
    user,
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/user/login/success", {
        withCredentials: true,
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (typeof res.data.data == "undefined") {
          setUser({});
        } else if (res.data.data) {
          setUser(res.data.data);
        } else {
          setUser({});
        }
        setLoading(false);
        return;
      });
  }, []);


  return (
    <UserContext.Provider value={value}>
      {!loading && props.children}
    </UserContext.Provider>
  );
};
