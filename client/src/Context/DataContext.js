import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useReducer,
} from "react";
import axios from "axios";
import { reducer } from "../utilities/Reducers";

export const dataContext = createContext();

export const useData = () => {
  return useContext(dataContext);
};

export const DataContextProvider = (props) => {
  const [twitterCounter, setTwitterCounter] = useState(0);
  const [twitterContent, setTwitterContent] = useState([]);
  const [twitterPreviewCounter, setTwitterPreviewCounter] = useState(0);
  const [facebookContent, setFacebookContent] = useState("");
  const [linkedinContent, setLinkedinContent] = useState("");
  const [twitterPicture, setTwitterPicture] = useState([]);
  const [facebookPicture, setFacebookPicture] = useState([]);
  const [linkedinPicture, setLinkedinPicture] = useState([]);
  const [target, setTarget] = useState("twitter");
  const [previewTarget, setPreviewTarget] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(false);
  const [socials, setSocials] = useState([]);
  const [select, setSelect] = useState([]);

  const [state, dispatch] = useReducer(reducer, {
    value: [{ text: "", media: [] }],
  });

  const value = {
    twitterPreviewCounter,
    setTwitterPreviewCounter,
    state,
    dispatch,
    twitterCounter,
    setTwitterCounter,
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
