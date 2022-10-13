import React, { useState, useEffect, useRef } from "react";
import home from "../images/home.png";
import google from "../images/google.png";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export default function Signup() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(false);
  const [logging, setLogging] = useState(false);

  const navigate = useNavigate();
  const errorRef = useRef<HTMLDivElement>(null);

  const { signup } = useAuth();
  const { signin } = useAuth();
  const { user } = useAuth();

  const signupNow = async (email: any, password: any) => {
    if (password === secondPassword) {
      setLoading(true);

      const res = await signup(email.toLowerCase(), password);
      if (res?.access == false) {
       typeof res.error !== 'undefined' &&  setError(res.error);
        setLoading(false);
        return;
      } else if (res?.access === true) {
        navigate("/dashboard");
        setLoading(false);
        return;
      }
    } else {
      setError("Passwords do not match");
      return;
    }
  };

  useEffect(() => {
    if (error !== "") {
      setShowError(true);
    }
  }, [error]);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      setShow(false);
      navigate("/dashboard");
    } else {
      setShow(true);
    }
  }, []);

  const signinWithGoogle = () => {
    setLogin(true);
    window.open(
      "https://web-production-191a.up.railway.app/api/user/google",
      "_self"
    );
    setLogin(false);
  };

  const testLogin = async () => {
    setLogging(true);
    const res = await signin("futuristicaistore@gmail.com", "12345678");
    if (res?.access == false) {
      typeof res.error !== 'undefined' && setError(res.error);
      setLoading(false);
      return setLogging(false);
    } else if (res?.access === true) {
      navigate("/dashboard");
      setLoading(false);
      return setLogging(false);
    }
  };

  return (
    <div>
      {show && (
        <div className="block mx-5 md:mx-auto">
          <div className="fixed top-2 mx-auto inset-x-0">
            <div
              ref={errorRef}
              className={
                showError
                  ? "flex space-x-6 justify-center mx-auto border border-ored px-4 py-3 text-xl rounded-lg bg-[#D61C4E] text-owhite max-w-[300px]"
                  : "hidden"
              }
            >
              <p className=" ">{error}</p>
              <p
                onClick={(e) => {
                  errorRef.current !== null && errorRef.current.classList.add("hidden");
                  setShowError(false);
                  setError("");
                }}
                className=""
              >
                X
              </p>
            </div>
          </div>
          <div className="flex flex-col my-5  mx-5 md:w-10/12 mx-auto max-w-lg md:max-w-6xl">
            <nav className="flex justify-start ">
              <h2
                onClick={(e) => navigate("/")}
                className="text-5xl md:text-6xl font-a text-dblue"
              >
                Spost
              </h2>
            </nav>
            <div className="flex  items-start mx-auto">
              <div className="hidden block w-1/2 max-w-[538px] ">
                <img src={home} />
              </div>

              <div className=" flex flex-col justify-center items-center space-y-4  max-w-[320px]">
                <div className="flex justify-center">
                  <h2 className="text-3xl ">Sign up</h2>
                </div>
                <div className="relative mx-auto block ">
                  <p className="absolute top-2 left-5 ">Email Address</p>
                  <input
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    className="bg-owhite w-lg border border-dblue rounded-lg p-2 md:w-80 pt-7 pl-5 "
                  />
                </div>
                <div className="relative mx-auto block">
                  <p className="absolute top-2 left-5 ">Password</p>
                  <input
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    type="password"
                    className="bg-owhite w-lg border border-dblue rounded-lg p-2 md:w-80 pt-7 pl-5 "
                  />
                </div>
                <div className="relative mx-auto block">
                  <p className="absolute top-2 left-5 ">Password Again</p>
                  <input
                    value={secondPassword}
                    onChange={(e) => setSecondPassword(e.target.value)}
                    type="password"
                    className="bg-owhite w-lg border border-dblue rounded-lg p-2 md:w-80 pt-7 pl-5 "
                  />
                </div>
                <div>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <button
                      onClick={(e) => signupNow(emailValue, passwordValue)}
                      className="bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg  hover:bg-lblue hover:text-dblue hover:border-2"
                    >
                      Sign up
                    </button>
                  )}
                </div>
                <div className="flex justify-between w-full">
                  <hr className="w-2/5 m-auto text-ogray"></hr>
                  <p>or</p>
                  <hr className="w-2/5 m-auto text-ogray"></hr>
                </div>
                <div className="cursor-pointer relative bg-lblue w-lg border border-dblue rounded-lg p-2 md:w-80  hover:bg-dblue hover:text-owhite">
                  {login ? (
                    <CircularProgress />
                  ) : (
                    <div className=" flex space-x-6 pointer-events-auto justify-center items-center ">
                      <img src={google} />
                      <p
                        onClick={(e) => signinWithGoogle()}
                        className="text-xl "
                      >
                        Sign in with Google
                      </p>
                    </div>
                  )}
                </div>
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={(e) => navigate("/signin")}
                    className="cursor-pointer  text-dblue hover:border-b hover:border-b-dblue"
                  >
                    Sign in
                  </span>
                </p>
                {logging ? (
                  <div className="flex justify-center items-center w-full">
                    <CircularProgress />
                  </div>
                ) : (
                  <div
                    onClick={(e) => testLogin()}
                    className="cursor-pointer relative bg-ored text-owhite hover:text-ored hover:bg-owhite w-lg hover:border hover:border-ored rounded-lg p-2 md:w-80 "
                  >
                    <div className=" flex space-x-6 pointer-events-auto justify-center items-center ">
                      <p className="text-xl   ">Test User login</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
