import React, { useContext, useState, createContext, useReducer } from "react";
import { reducer } from "../utilities/Reducers";
import ContextProps from "./DataContextInterface";



export const dataContext = createContext<ContextProps>({});

export const useData = () => {
  return useContext(dataContext);
};

export const DataContextProvider = (props: any) => {
  const [twitterCounter, setTwitterCounter] =useState<any>(0);
  const [twitterContent, setTwitterContent] =useState<any>([]);
  const [twitterPreviewCounter, setTwitterPreviewCounter] =useState<any>(0);
  const [facebookContent, setFacebookContent] =useState<any>("");
  const [linkedinContent, setLinkedinContent] =useState<any>("");
  const [instagramContent, setInstagramContent] =useState<any>("");
  const [twitterPicture, setTwitterPicture] =useState<any>([]);
  const [facebookPicture, setFacebookPicture] =useState<any>([]);
  const [linkedinPicture, setLinkedinPicture] =useState<any>([]);
  const [target, setTarget] =useState<any>("twitter");
  const [previewTarget, setPreviewTarget] =useState<any>("twitter");
  const [image, setImage] =useState<any>("");
  const [preview, setPreview] =useState<any>(false);
  const [socials, setSocials] =useState<any>([]);
  const [select, setSelect] =useState<any>([]);
  const [twitterMax, setTwitterMax] =useState<any>([]);

  const [state, dispatch] = useReducer(reducer, {
    value: [{ text: "", media: [] }],
  });

  const value = {
    twitterMax,
    setTwitterMax,
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
    instagramContent,
    setInstagramContent,
  };

  return (
    <dataContext.Provider value={value}>{props.children}</dataContext.Provider>
  );
};
