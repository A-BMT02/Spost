import React from "react";
import twitter from "../images/twitter.png";
import facebook from "../images/facebook.png";
import instagram from "../images/instagram.png";
import CircularProgress from "@mui/material/CircularProgress";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SettingsRemoteOutlined } from "@mui/icons-material";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";

export default function Modal({ showModal, setShowModal, successProfile }) {
  const { user } = useAuth();

  const navigate = useNavigate();
  console.log("uploaded are", successProfile);
  const { socials } = useData();

  const setUrl = (target) => {
    const twitterData = socials.find((item) => {
      return item.type == "twitter";
    });
    const instaData = socials.find((item) => {
      return item.type == "instagram";
    });
    const facebookData = socials.find((item) => {
      return item.type == "facebook";
    });
    switch (target) {
      case "facebook":
        return `https://www.facebook.com/profile.php?id=${facebookData.pageId}`;
      case "twitter":
        return `https://twitter.com/${twitterData.username}`;
      case "instagram":
        return `https://www.instagram.com/${instaData.username}/`;
    }
  };

  const findLogo = (target) => {
    switch (target) {
      case "facebook":
        return facebook;
      case "twitter":
        return twitter;
      case "instagram":
        return instagram;
    }
  };

  return (
    <div
      className={
        showModal ? "z-10 w-screen h-screen fixed top-0 left-0 " : "hidden"
      }
    >
      <div className=" w-full h-full  flex justify-center items-center">
        <div className=" bg-lgray opacity-50 w-full h-full fixed top-0"></div>
        <div className="fixed opacity-100  drop-shadow-md space-y-4 rounded-md p-5 bg-owhite justify-center items-center flex flex-col">
          <MdOutlineCancel
            onClick={(e) => {
              setShowModal(false);
              navigate("/dashboard");
            }}
            className="cursor-pointer absolute text-ored -top-2 -right-2 text-xl"
          />
          <p className="text-xl ">Successfully Published</p>
          {successProfile.map((item) => (
            <div className="flex justify-center items-center space-x-2">
              <img className="w-8 h-8" src={findLogo(item)} />
              <a
                href={setUrl(item)}
                target="_blank"
                className="cursor-pointer text-dblue"
              >
                {setUrl(item)}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
