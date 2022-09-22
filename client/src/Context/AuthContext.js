import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

export const UserContext = createContext();

export function useAuth() {
  return useContext(UserContext);
}

export const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [connected, setConnected] = useState(false);

  const signup = async (email, password) => {
    const result = await axios.post("/api/user/register", {
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
    const result = await axios.post("/api/user/login", {
      email,
      password,
    });
    if (result.data.status === "ok") {
      setUser({ token: result.data.token, email: result.data.email });
      localStorage.setItem("token", result.data.token);
      setIsAuth(true);
      return { access: true, data: result.data };
    } else {
      setIsAuth(false);
      return { access: false, error: result.data.error };
    }
  };

  const logout = async () => {
    const res = await axios.get("/api/user/logout", {
      withCredentials: true,
    });
    localStorage.removeItem("token");
    setIsAuth(false);
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
    axios.get("/api/user/test").then((res) => {
      if (res.status === 200) {
        setConnected(true);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("/api/user/login/success", {
        withCredentials: true,
        headers: {
          token: token,
        },
      })
      .then((res) => {
        console.log("res is ", res);
        if (typeof res.data.data == "undefined") {
          setUser({});
        } else if (res.data.data) {
          setUser(res.data.data);
        } else {
          setUser({});
        }
        setLoading(false);
      });
  }, [isAuth, connected]);

  useEffect(() => {
    console.log("logged user is ", user);
    if (Object.keys(user).length !== 0) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [connected]);

  const reconnect = () => {
    setTimeout(() => {
      axios
        .get("/api/user/test")
        .then((res) => {
          if (res.status === 200) {
            setConnected(true);
          } else {
            return window.location.reload(false);
          }
        })
        .catch((err) => window.location.reload(false));
    }, 15000);
  };

  return (
    <UserContext.Provider value={value}>
      {connected ? (
        loading ? (
          <div className="w-screen h-screen flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          props.children
        )
      ) : (
        <div className="w-screen h-screen flex flex-col space-y-4 justify-center items-center">
          <CircularProgress />
          <p>Please be patient while the server loads up</p>
          {reconnect()}
        </div>
      )}
    </UserContext.Provider>
  );
};
