import React, { useRef, useEffect, useState, useCallback } from "react";
import instagram from "../images/instagram.png";
import twitter from "../images/twitter.png";
import facebook from "../images/facebook.png";
import linkedin from "../images/linkedin.png";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { BsPlusCircle } from "react-icons/bs";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useData } from "../Context/DataContext";
import Modal from "../components/modal";
import { useLocation } from "react-router-dom";
import { useInitFbSDK } from "../utilities/facebookSDK";

export default function Dashboard() {
  const ref = useRef();
  const ref2 = useRef();

  const { user } = useAuth();
  const { socials, setSocials } = useData();

  const [showModal, setShowModal] = useState(false);
  const [connect, setConnect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteTwitter, setDeleteTwitter] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [fbUserAccessToken, setFbUserAccessToken] = useState("");
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [loadingLinkedin, setLoadingLinkedin] = useState(false);
  const [loadingInstagram, setLoadingInstagram] = useState(false);
  const [deleteLinkedin, setDeleteLinkedin] = useState(false);
  const [deleteFacebook, setDeleteFacebook] = useState(false);

  const [deleteInstagram, setDeleteInstagram] = useState(false);
  const [deletingInstagram, setDeletingInstagram] = useState(false);
  const [deletingFacebook, setDeletingFacebook] = useState(false);
  const [deletingLinkedin, setDeletingLinkedin] = useState(false);

  const [linkedinCode, setLinkedinCode] = useState("");
  const [message, setMessage] = useState("");

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const toggleSidebar = () => {
    ref.current.classList.toggle("open");
    ref2.current.classList.toggle("flex");
    ref2.current.classList.toggle("hidden");
  };

  const { logout } = useAuth();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const logoutNow = async () => {
    setLoggingOut(true);
    setSocials([]);
    const res = await logout();
    if (res.status == "ok") {
      setUser({});
      navigate("/");
    }
    setLoggingOut(false);
  };

  useEffect(() => {
    setSocials([]);
    setLoading(true);

    axios
      .post("https://web-production-191a.up.railway.app/api/user/get/socials", {
        data: user?.connect,
      })
      .then((res) => {
        setSocials(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const connectTwitter = async () => {
    setConnecting(true);
    const result = await axios.get(
      "https://web-production-191a.up.railway.app/api/user/twitter",
      {
        headers: {
          id: user._id,
        },
      }
    );
    window.location.href = result.data.URL;
    setConnecting(false);
  };

  const connectInstagram = async () => {
    const facebookExist = user.connect.find(
      (target) => target.social === "facebook"
    );
    if (!facebookExist) {
      setShowModal(true);
      setMessage(
        "You have to connect your FACEBOOK business account associated with the instagram account!"
      );
      return;
    }

    setLoadingInstagram(true);
    const res = await axios.get(
      "https://web-production-191a.up.railway.app/api/user/instagram",
      {
        params: {
          id: user._id,
        },
      }
    );
    window.location.reload(false);
    setLoadingInstagram(false);
  };

  const connectLinkedin = async () => {
    let clientId = "77azlgzvzxd9s0";

    window.open(
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=https://spostapp.vercel.app/dashboard&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`,
      "_self"
    );
  };

  useEffect(() => {
    const code = query.get("code");

    if (code !== "") {
      setLinkedinCode(code);
    }
  }, []);

  useEffect(() => {
    if (linkedinCode !== "" && linkedinCode !== null) {
      axios
        .get("https://web-production-191a.up.railway.app/api/user/linkedin", {
          params: {
            code: linkedinCode,
            id: user._id,
          },
        })
        .then((res) => {
          if (res.data === "success") {
          }
        });
    }
  }, [linkedinCode]);

  const showPopup = () => {
    setMessage("You do not have permission to perform this on a test account");
    setShowModal(true);
    return;
  };

  const isFbSDKInitialized = useInitFbSDK();
  const connectFacebook = async () => {
    setLoadingFacebook(true);
    logInToFB();
  };

  const logInToFB = useCallback(() => {
    window.FB.login((response) => {
      setFbUserAccessToken(response.authResponse.accessToken);
    });
  }, []);

  useEffect(() => {
    if (fbUserAccessToken) {
      axios
        .get("https://web-production-191a.up.railway.app/api/user/facebook", {
          withCredentials: true,
          params: {
            accessToken: fbUserAccessToken,
            user: user._id,
          },
        })
        .then((res) => {
          setLoadingFacebook(false);
          window.location.reload(false);
        })
        .catch((err) => {
          setLoadingFacebook(false);
        });
    }
  }, [fbUserAccessToken]);

  const socialImage = (type) => {
    switch (type) {
      case "twitter":
        return twitter;
      case "facebook":
        return facebook;
      case "instagram":
        return instagram;
      case "linkedin":
        return linkedin;
    }
  };

  const logoutTwitter = async (e) => {
    if (user.email.toLowerCase() === "futuristicaistore@gmail.com") {
      setMessage(
        "You do not have permission to perform this on a test account"
      );
      return setShowModal(true);
    }
    setDeleting(true);
    const con = user.connect.find((target) => {
      return target.social === "twitter";
    });
    axios
      .get(
        "https://web-production-191a.up.railway.app/api/user/twitter/logout",
        {
          withCredentials: true,
          params: {
            id: con.id,
            user,
          },
        }
      )
      .then((res) => {
        if (res.data.status === "ok") {
          window.location.reload(false);
          setDeleting(false);
        }
      });
  };

  const logoutInstagram = () => {
    if (user.email.toLowerCase() === "futuristicaistore@gmail.com") {
      setMessage(
        "You do not have permission to perform this on a test account"
      );
      return setShowModal(true);
    }
    setDeletingInstagram(true);
    const instagramDetails = user?.connect?.find((target) => {
      return target.social === "instagram";
    });
    axios
      .get(
        "https://web-production-191a.up.railway.app/api/user/instagram/logout",
        {
          withCredentials: true,
          params: {
            id: instagramDetails.id,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          window.location.reload(false);
          setDeletingInstagram(true);
        }
      })
      .catch((err) => {
        window.location.reload(false);
        setDeletingInstagram(true);
      });
  };

  const logoutFacebook = () => {
    if (user.email.toLowerCase() === "futuristicaistore@gmail.com") {
      setMessage(
        "You do not have permission to perform this on a test account"
      );
      return setShowModal(true);
    }
    setDeletingFacebook(true);
    const facebookDetails = user?.connect?.find((target) => {
      return target.social === "facebook";
    });
    axios
      .get(
        "https://web-production-191a.up.railway.app/api/user/facebook/logout",
        {
          withCredentials: true,
          params: {
            id: facebookDetails.id,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          window.location.reload(false);
          setDeletingFacebook(true);
        }
      })
      .catch((err) => {
        window.location.reload(false);
        setDeletingFacebook(true);
      });
  };

  const logoutLinkedin = () => {
    if (user.email.toLowerCase() === "futuristicaistore@gmail.com") {
      setMessage(
        "You do not have permission to perform this on a test account"
      );
      return setShowModal(true);
    }
    setDeletingLinkedin(true);
    const linkedinDetails = user?.connect?.find((target) => {
      return target.social === "linkedin";
    });
    axios
      .get(
        "https://web-production-191a.up.railway.app/api/user/linkedin/logout",
        {
          withCredentials: true,
          params: {
            id: linkedinDetails.id,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          window.location.reload(false);
          setDeletingLinkedin(true);
        }
      })
      .catch((err) => {
        window.location.reload(false);
        setDeletingLinkedin(true);
      });
  };
  return (
    Object.keys(user).length !== 0 && (
      <div className="block mx-5 md:mx-auto max-w-[800px] ">
        <Modal
          successProfile={[]}
          showModal={showModal}
          setShowModal={setShowModal}
          message={message}
        />

        <div className="flex flex-col my-5  mx-5 md:w-10/12 mx-auto max-w-lg md:max-w-6xl">
          <nav className="relative">
            <div className="flex justify-between border-b border-dblue pb-3.5">
              <h2
                onClick={(e) => navigate("/")}
                className="text-5xl md:text-6xl font-a text-dblue cursor-pointer"
              >
                Spost
              </h2>

              <div className="flex space-x-4">
                <div className="p-2   flex items-center">
                  {!loggingOut ? (
                    <button
                      onClick={(e) => {
                        logoutNow();
                      }}
                      className="bg-lblue border border-dblue text-sm md:text-lg p-2 md:p-3 text-dblue rounded-lg   hover:bg-dblue hover:text-owhite"
                    >
                      Log out
                    </button>
                  ) : (
                    <CircularProgress />
                  )}
                </div>
              </div>
            </div>

            <div class=" ">
              <div
                ref={ref2}
                id="menu"
                class=" rounded-sm absolute hidden flex-col items-center self-end mt-14 space-y-6  bg-owhite w-full sm:self-center  drop-shadow-md"
              >
                <a
                  className="cursor-pointer p-5 hover:text-xl hover:text-dblue"
                  onClick={(e) => navigate("/newpost")}
                >
                  New Post
                </a>
              </div>
            </div>
          </nav>

          <div className="flex justify-between mt-3.5 pb-3.5 border-b border-dblue items-center ">
            <button
              ref={ref}
              id="menu-btn"
              class="block hamburger focus:outline-none"
              onClick={(e) => {
                toggleSidebar();
              }}
            >
              <span class="hamburger-top"></span>
              <span class="hamburger-middle"></span>
              <span class="hamburger-bottom"></span>
            </button>

            <div>
              <h2 className="text-[25px]  ">Dashboard</h2>
            </div>

            <div></div>
          </div>
          <div
            className={
              loading ? "mt-20 flex justify-center align-center" : "hidden"
            }
          >
            <CircularProgress />
          </div>
          <div className={loading ? "hidden" : "flex  "}>
            <div
              className={
                socials.length === 0 || connect
                  ? "hidden"
                  : "flex flex-col  space-y-6 m-auto items-center"
              }
            >
              <div className="flex flex-col m-auto items-center space-y-12 ">
                <h2 className="text-[20px] md:text-3xl   mt-10 text-center">
                  Your social media profiles
                </h2>
              </div>
              {socials.map((social) => (
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-6 items-center">
                    <div className="flex space-x-2 items-center text-lg md:text-xl">
                      <img className="w-5 h-5" src={socialImage(social.type)} />
                      <p className="">@{social.username}</p>
                    </div>
                    <div className="text-xl">
                      <MdOutlineCancel
                        className="fill-ored cursor-pointer"
                        onClick={(e) => {
                          if (social.type === "twitter") {
                            setDeleteTwitter(true);
                          } else if (social.type === "facebook") {
                            setDeleteFacebook(true);
                          } else if (social.type === "instagram") {
                            setDeleteInstagram(true);
                          } else if (social.type === "linkedin") {
                            setDeleteLinkedin(true);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className={
                      (social.type === "twitter" && deleteTwitter) ||
                      (social.type === "facebook" && deleteFacebook) ||
                      (social.type === "instagram" && deleteInstagram) ||
                      (social.type === "linkedin" && deleteLinkedin)
                        ? "flex flex-col  space-y-4 bg-owhite rounded-lg p-2 "
                        : "hidden"
                    }
                  >
                    <p>Are you sure you want to delete account</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={(e) => {
                          if (social.type === "twitter") {
                            setDeleteTwitter(false);
                          } else if (social.type === "facebook") {
                            setDeleteFacebook(false);
                          } else if (social.type === "instagram") {
                            setDeleteInstagram(false);
                          } else if (social.type === "linkedin") {
                            setDeleteLinkedin(false);
                          }
                        }}
                        className="rounded-lg p-2 border border-ogray"
                      >
                        Cancel
                      </button>
                      {(social.type === "twitter" && !deleting) ||
                      (social.type === "facebook" && !deletingFacebook) ||
                      (social.type === "instagram" && !deletingInstagram) ||
                      (social.type === "linkedin" && !deletingLinkedin) ? (
                        <button
                          onClick={(e) => {
                            if (social.type === "twitter") {
                              logoutTwitter();
                            } else if (social.type === "facebook") {
                              logoutFacebook();
                            } else if (social.type === "instagram") {
                              logoutInstagram();
                            } else if (social.type === "linkedin") {
                              logoutLinkedin();
                            }
                          }}
                          className="rounded-lg p-2 bg-ored text-owhite border"
                        >
                          Delete
                        </button>
                      ) : (
                        <CircularProgress />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div
                onClick={(e) => {
                  setConnect(true);
                }}
                className="hover:bg-dblue hover:text-owhite  cursor-pointer self-center border w-full max-w-[300px] border-dashed border-dblue p-2 rounded-lg flex space-x-3 items-center justify-center"
              >
                <BsPlusCircle />
                <p className=" ">Add new social media profile</p>
              </div>
            </div>

            <div
              className={
                socials.length === 0 || connect
                  ? "flex flex-col m-auto items-center space-y-12 "
                  : "hidden"
              }
            >
              <h2 className="text-[25px] md:text-3xl   mt-10 text-center">
                Connect your social media profiles
              </h2>
              <div className="flex justify-center space-x-4 max-w-{500px} w-full md:space-x-10  w-full md:w-auto items-center">
                {socials.some((e) => e.type === "twitter") === false &&
                connecting ? (
                  <CircularProgress />
                ) : (
                  socials.some((e) => e.type === "twitter") === false && (
                    <img
                      onClick={(e) => {
                        user.email.toLowerCase() ===
                        "futuristicaistore@gmail.com"
                          ? showPopup()
                          : connectTwitter();
                      }}
                      className="w-12 h-12 md:w-20 md:h-20 cursor-pointer "
                      src={twitter}
                    />
                  )
                )}
                {socials.some((e) => e.type === "facebook") === false &&
                loadingFacebook ? (
                  <CircularProgress />
                ) : (
                  socials.some((e) => e.type === "facebook") === false && (
                    <img
                      onClick={(e) =>
                        user.email.toLowerCase() ===
                        "futuristicaistore@gmail.com"
                          ? showPopup()
                          : connectFacebook()
                      }
                      className="w-12 h-12 md:w-20 md:h-20 cursor-pointer "
                      src={facebook}
                    />
                  )
                )}
                {socials.some((e) => e.type === "instagram") === false &&
                loadingInstagram ? (
                  <CircularProgress />
                ) : (
                  socials.some((e) => e.type === "instagram") === false && (
                    <img
                      onClick={(e) =>
                        user.email.toLowerCase() ===
                        "futuristicaistore@gmail.com"
                          ? showPopup()
                          : connectInstagram()
                      }
                      className="w-12 h-12 md:w-20 md:h-20 cursor-pointer "
                      src={instagram}
                    />
                  )
                )}{" "}
                {socials.some((e) => e.type === "linkedin") === false &&
                loadingLinkedin ? (
                  <CircularProgress />
                ) : (
                  socials.some((e) => e.type === "linkedin") === false && (
                    <img
                      onClick={(e) =>
                        user.email.toLowerCase() ===
                        "futuristicaistore@gmail.com"
                          ? showPopup()
                          : connectLinkedin()
                      }
                      className="w-12 h-12 md:w-20 md:h-20 cursor-pointer "
                      src={linkedin}
                    />
                  )
                )}
              </div>

              <div className="cursor-pointer self-center border w-full max-w-[300px] hover:bg-dblue hover:text-owhite border-dblue p-2 rounded-lg flex space-x-3 items-center justify-center">
                <p className="" onClick={(e) => setConnect(false)}>
                  View Connected Accounts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
