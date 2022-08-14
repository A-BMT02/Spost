import React, { useRef, useEffect, useState } from "react";
import account from "../images/account.png";
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

export default function Dashboard() {
  const ref = useRef();
  const ref2 = useRef();

  const { user } = useAuth();
  const { socials, setSocials } = useData();

  const [connect, setConnect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteTwitter, setDeleteTwitter] = useState(false);
  const [connecting , setConnecting] = useState(false) ; 
  const [deleting , setDeleting] = useState(false) ; 

  const toggleSidebar = () => {
    ref.current.classList.toggle("open");
    ref2.current.classList.toggle("flex");
    ref2.current.classList.toggle("hidden");
  };

  const { logout } = useAuth();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const logoutNow = async () => {
    const res = await logout();
    if (res.status == "ok") {
      setUser({});
      navigate("/");
    }
  };

  useEffect(() => {

    setSocials([]);
    setLoading(true);
    const con = user?.connect?.find((target) => {
      return target.social === "twitter";
    });
            console.log('here' , user._id) ;

    axios
      .get("https://spost1.herokuapp.com/api/user/get/twitter", {
        params: {
          id: con?.id,
        },
      })
      .then((res) => {
        if (res.data.status === "ok") {
          if (res.data.data !== null) {
            setSocials((prev) => [
              ...prev,
              {
                type: "twitter",
                username: res.data.data?.username,
                displayName: res.data.data?.displayName,
                image: res.data.data?.image,
              },
            ]);
          }
        }
        setLoading(false);
      });
  }, []);


  const connectTwitter = async () => {
    setConnecting(true) ; 
    const result = await axios.get('https://spost1.herokuapp.com/api/user/twitter' ,  {
      headers : {
        id : user._id
      }
    })
    console.log('result is ' , result) ; 
    window.location.href = result.data.URL ;
    setConnecting(false) ;  

    // window.open("http://localhost:5000/api/user/twitter", "_self");
  };

  const socialImage = (type) => {
    switch (type) {
      case "twitter":
        return twitter;
      case "facebook":
        return facebook;
    }
  };

  const logoutTwitter = async (e) => {
    setDeleting(true) ; 
    const con = user.connect.find((target) => {
      return target.social === "twitter";
    });
    axios
      .get("https://spost1.herokuapp.com/api/user/twitter/logout", {
        withCredentials: true,
        params: {
          id: con.id,
          user
        },
      })
      .then((res) => {
        if (res.data.status === "ok") {
          // console.log('here') ;
          window.location.reload(false);
          setDeleting(true) ; 

        }
      });
  };

  return (
    <div className="block mx-5 md:mx-auto max-w-[800px] ">
      <div className="flex flex-col my-5  mx-5 md:w-10/12 mx-auto max-w-lg md:max-w-6xl">
        <nav className="relative">
          <div className="flex justify-between border-b border-dblue  mt-3.5 pb-3.5">
            <h2
              onClick={(e) => navigate("/")}
              className="text-5xl md:text-6xl font-a text-dblue"
            >
              Spost
            </h2>

            <div className="flex space-x-4">
              <div className="p-2 font-inter font-bold">
                <button
                  onClick={(e) => {
                    logoutNow();
                  }}
                  className="bg-lblue border border-dblue text-sm md:text-lg p-2 md:p-3 text-dblue rounded-lg font-bold font-inter hover:bg-dblue hover:text-owhite"
                >
                  Log out
                </button>
              </div>
              <div className="flex flex-col space-y-2 justify-center items-center">
                <img className="w-[50px]" src={account} />
              </div>
            </div>
          </div>

          <div class="font-inter font-bold">
            <div
              ref={ref2}
              id="menu"
              class="absolute hidden flex-col items-center self-end py-8 mt-14 space-y-6 font-bold bg-owhite w-full sm:self-center  drop-shadow-md"
            >
              <a onClick={(e) => navigate("/newpost")}>New Post</a>
            </div>
          </div>
        </nav>

        <div className="flex justify-between mt-3.5 pb-3.5 border-b border-dblue items-center font-inter">
          {/* <div>
                    <img className='w-10' src={bars}/>
                </div> */}
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
            <h2 className="text-[25px] font-black font-bold">Dashboard</h2>
          </div>

          <div></div>
        </div>
        {/* remove flex-col below and space-y*/}
        <div
          className={
            loading ? "mt-20 flex justify-center align-center" : "hidden"
          }
        >
          <CircularProgress />
        </div>
        <div className={loading ? "hidden" : "flex font-inter "}>
          <div
            className={
              socials.length === 0 || connect
                ? "hidden"
                : "flex flex-col font-inter space-y-6 m-auto items-center"
            }
          >
            <div className="flex flex-col m-auto items-center space-y-12 ">
              <h2 className="text-[20px] md:text-3xl font-black font-bold mt-10 text-center">
                Your social media profiles
              </h2>
            </div>
            {console.log('socials is ' , socials)}
            {socials.map((social) => (
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-6 items-center">
                  <div className="flex space-x-2 items-center text-lg md:text-xl">
                    <img className="w-5 h-5" src={socialImage(social.type)} />
                    <p className="font-bold">@AhmadBMTahir</p>
                  </div>
                  <div className="text-xl">
                    <MdOutlineCancel
                      className="fill-ored cursor-pointer"
                      onClick={(e) => setDeleteTwitter(true)}
                    />
                  </div>
                </div>

                <div
                  className={
                    deleteTwitter
                      ? "flex flex-col font-bold space-y-4 bg-owhite rounded-lg p-2 "
                      : "hidden"
                  }
                >
                  <p>Are you sure you want to delete account</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={(e) => setDeleteTwitter(false)}
                      className="rounded-lg p-2 border border-ogray"
                    >
                      Cancel
                    </button>
                    {!deleting ? <button
                      onClick={(e) => logoutTwitter()}
                      className="rounded-lg p-2 bg-ored text-owhite border"
                    >
                      Delete
                    </button> : <CircularProgress/> }
                    
                  </div>
                </div>
              </div>
            ))}
            <div
              onClick={(e) => setConnect(true)}
              className="cursor-pointer self-center border w-full max-w-[300px] border-dashed border-dblue p-2 rounded-lg flex space-x-3 items-center justify-center"
            >
              <BsPlusCircle />
              <p className="font-black ">Add new social media profile</p>
            </div>
          </div>

          <div
            className={
              socials.length === 0 || connect
                ? "flex flex-col m-auto items-center space-y-12 "
                : "hidden"
            }
          >
            <h2 className="text-[25px] md:text-3xl font-black font-bold mt-10 md:mt-32 text-center">
              Connect your social media profiles
            </h2>
            <div className="flex justify-between max-w-{500px} w-full md:space-x-10  w-full md:w-auto items-center">
              <img
                className="w-12 h-12 md:w-20 md:h-20 cursor-pointer "
                src={instagram}
              />
              {socials[0]?.type !== 'twitter' && connecting ? <CircularProgress/> : <img
                onClick={(e) => {
                  connectTwitter();
                }}
                className="w-12 h-12 md:w-20 md:h-20 cursor-pointer "
                src={twitter}
              />
              }
              
              <img
                className="w-12 h-12 md:w-20 md:h-20 cursor-pointer "
                src={facebook}
              />
              <img
                className="w-12 h-12 md:w-20 md:h-20 cursor-pointer "
                src={linkedin}
              />
            </div>

            <div className="cursor-pointer self-center border w-full max-w-[300px] hover:bg-dblue hover:text-owhite border-dblue p-2 rounded-lg flex space-x-3 items-center justify-center">
              <p className="font-black" onClick={(e) => setConnect(false)}>
                View Connected Accounts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
