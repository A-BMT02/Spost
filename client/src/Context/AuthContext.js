import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function useAuth() {
  return useContext(UserContext);
}

export const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuth , setIsAuth] = useState(false) ; 

  const signup = async (email, password) => {
    const result = await axios.post("https://spost1.herokuapp.com/api/user/register", {
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
    const result = await axios.post("https://spost1.herokuapp.com/api/user/login", {
      email,
      password,
    });
    if (result.data.status === "ok") {
      setUser({ token: result.data.token, email: result.data.email });
      localStorage.setItem("token", result.data.token);
      setIsAuth(true) ;
      return { access: true, data: result.data };
    } else {
      setIsAuth(false) 
      return { access: false, error: result.data.error };
    }
  };

  const logout = async () => {
    const res = await axios.get("https://spost1.herokuapp.com/api/user/logout" , {
        withCredentials: true,
    });
    localStorage.removeItem("token");
    setIsAuth(false) ; 
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
      .get("https://spost1.herokuapp.com/api/user/login/success", {
        withCredentials: true,
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (typeof res.data.data == "undefined") {
          setUser({})
        } else if (res.data.data) {
          setUser(res.data.data) ; 
        } else {
          setUser({})
        }
    setLoading(false);

      });
  }, [isAuth]);

  useEffect(() => {
    console.log('logged user is ' , user) ; 
    if(Object.keys(user).length !== 0) {
      setIsAuth(true) ;
    } else {
      setIsAuth(false) ; 
    }

  } , [user])


  return (
    <UserContext.Provider value={value}>
      {!loading && props.children}
    </UserContext.Provider>
  );
};
