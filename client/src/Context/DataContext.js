import React, { useContext, useState, createContext, useEffect } from "react";
import axios from "axios";

export const dataContext = createContext();

export const useData = () => {
  return useContext(dataContext);
};

export const DataContextProvider = (props) => {
  const [twitterContent, setTwitterContent] = useState("");
  const [facebookContent, setFacebookContent] = useState("");
  const [linkedinContent, setLinkedinContent] = useState("");
  const [twitterPicture, setTwitterPicture] = useState([]);
  const [facebookPicture, setFacebookPicture] = useState([]);
  const [linkedinPicture, setLinkedinPicture] = useState([]);
  const [target, setTarget] = useState("");
  const [previewTarget, setPreviewTarget] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(false);
  const [socials, setSocials] = useState([]);
  const [select, setSelect] = useState([]);

  const value = {
    select,
    setSelect,
    preview,
    setPreview,
    image,
    setImage,
    target,
    setTarget,
    previewTarget,
    previewTarget,
    setPreviewTarget,
    twitterContent,
    facebookContent,
    linkedinContent,
    setTwitterContent,
    setFacebookContent,
    setLinkedinContent,
    twitterPicture,
    facebookPicture,
    linkedinPicture,
    setTwitterPicture,
    setFacebookPicture,
    setLinkedinPicture,
    socials,
    setSocials,
  };

  return (
    <dataContext.Provider value={value}>{props.children}</dataContext.Provider>
  );
};
