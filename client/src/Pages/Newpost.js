import React, { useState, useRef, useEffect, createRef } from "react";
import twitter from "../images/twitter.png";
import facebook from "../images/facebook.png";
import linkedin from "../images/linkedin.png";
import upload from "../images/upload.png";
import picture from "../images/picture.png";
import mbj from "../images/mbj.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../Context/DataContext";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { MdOutlineCancel } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";

export default function Newpost() {
  const value = useData();
  const { socials, setSocials } = useData();

  const ref = useRef(null);
  const imageRef = useRef([]);

  const { user } = useAuth();

  const navigate = useNavigate();

  const { state } = useLocation();

  const [twitterPicture, setTwitterPicture] = useState(value.twitterPicture);
  const [twitterMax, setTwitterMax] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const errorRef = useRef(null);

  const contentIcon = (target) => {
    switch (target) {
      case "twitter":
        return twitter;
      case "facebook":
        return facebook;
      case "linkedin":
        return linkedin;
    }
  };

  const whichContent = (target) => {
    switch (target) {
      case "twitter":
        return value.twitterContent;
      case "facebook":
        return value.facebookContent;
      case "linkedin":
        return value.linkedinContent;
    }
  };

  const changeContent = (text) => {
    switch (value.target) {
      case "twitter":
        return value.setTwitterContent(text);
      case "facebook":
        return value.setFacebookContent(text);
      case "linkedin":
        return value.setLinkedinContent(text);
    }
  };

  const previewedContent = (previewTarget) => {
    switch (previewTarget) {
      case "twitter":
        return value.twitterContent;
      case "facebook":
        return value.facebookContent;
      case "linkedin":
        return value.linkedinContent;
    }
  };

  const contentPreviewIcon = (previewTarget) => {
    switch (previewTarget) {
      case "twitter":
        return twitter;
      case "facebook":
        return facebook;
      case "linkedin":
        return linkedin;
    }
  };

  const selectImage = async () => {
    setLoading(true);
    let type;
    let reader = new FileReader();
    reader.readAsDataURL(ref.current.files[0]);
    reader.onload = function (e) {
      const extension = ref.current.files[0].name
        .split(".")
        .pop()
        .toLowerCase();
      if (extension !== "jpg") {
        if (extension === "gif") {
          type = "gif";
          setTwitterMax(true);
          updateContents(type, reader);
          setLoading(false);
        } else {
          type = "video";
          let media = new Audio(reader.result);
          media.onloadedmetadata = function () {
            if (media.duration > 140) {
              setError("Video cannot be longer than 2min:20sec");
              setShowError(true);
              setLoading(false);
              setTwitterMax(false);
              return;
            } else {
              setTwitterMax(true);
              setShowError(false);
              setLoading(false);
              setError("");
              updateContents(type, reader);
              return;
            }
          };
        }
      } else {
        // setImage(reader.result) ;
        navigate("/previewImage", {
          state: {
            image: reader.result,
            for: value.target,
            social: value.target,
            extension,
          },
        });
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    console.log("loading is ", loading);
  }, [loading]);
  useEffect(() => {
    console.log("twitter picture is ", value.twitterPicture);
  }, [value.twitterPicture]);

  useEffect(() => {
    if (error !== "") {
      setShowError(true);
    }
  }, [error]);

  const updateContents = (type, reader) => {
    switch (value.target) {
      case "twitter":
        value.setTwitterPicture((prev) => [
          ...prev,
          { type, value: reader.result },
        ]);
        setTwitterPicture((prev) => [...prev, { type, value: reader.result }]);
        return;
      case "facebook":
        return value.setFacebookPicture(state?.image);
      case "linkedin":
        return value.setLinkedinPicture(state?.image);
    }
  };

  const previewPicture = (previewTarget) => {
    switch (previewTarget) {
      case "twitter":
        return twitterPicture;
      case "facebook":
        return value.facebookPicture;
      case "linkedin":
        return value.linkedinPicture;
    }
  };
  useEffect(() => {
    imageRef.current = previewPicture(value.previewTarget)?.map(
      (item, i) => imageRef.current[i] ?? createRef()
    );
  }, [value.previewTarget]);

  useEffect(() => {
    console.log("new twitter pictures are ", twitterPicture);
  }, [twitterPicture]);

  const publish = async () => {
    const image = value.twitterPicture.value;
    console.log("image is ", image);
    const files = await Promise.all(
      image.map(async (item) => {
        const filename = await fetch(item)
          .then((r) => r.blob())
          .then(
            (blobFile) =>
              new File([blobFile], "fileName", { type: blobFile.type })
          );
        return filename;
      })
    );

    const bases = await Promise.all(
      files.map(async (item) => {
        const base = await getBase64(item);
        return base;
      })
    );

    console.log("bases  are", bases);

    const data = value.twitterContent;
    axios
      .post("http://localhost:5000/api/user/post/twitter", {
        data,
        id: user._id,
        image: bases,
      })
      .then((res) => {
        console.log(res);
      });
  };

  const removeImage = (e, pic) => {
    console.log("pic is ", pic);
    switch (value.previewTarget) {
      case "twitter":
        if (pic.type === "gif" || pic.type === "video") {
          setTwitterMax(false);
        }
        value.setTwitterPicture(
          previewPicture(value.previewTarget).filter(
            (item) => item.value !== pic.value
          )
        );
        setTwitterPicture(
          previewPicture(value.previewTarget).filter(
            (item) => item.value !== pic.value
          )
        );
    }
    previewPicture(value.previewTarget).filter(
      (item) => item.value !== pic.value
    );
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  return (
    <div className="block mx-5 md:mx-auto">
      <div
        className={
          !loading
            ? "flex flex-col my-5  mx-5 md:w-10/12 mx-auto max-w-lg md:max-w-6xl"
            : "hidden"
        }
      >
        <div
          ref={errorRef}
          className={
            showError
              ? "flex space-x-6 justify-center mx-auto border border-ored px-4 py-3 text-xl rounded-lg bg-[#D61C4E] text-owhite max-w-[300px]"
              : "hidden"
          }
        >
          <p className="font-inter font-bold">{error}</p>
          <p
            onClick={(e) => {
              errorRef.current.classList.add("hidden");
              setShowError(false);
              setError("");
            }}
            className="font-inter font-black self-center"
          >
            X
          </p>
        </div>
        <nav className="my-3.5 flex justify-start ">
          <h2 className="text-5xl md:text-6xl font-a text-dblue">Spost</h2>
        </nav>
        <div
          className={
            value.preview
              ? "flex flex-col justify-center items-center w-full "
              : "flex justify-center w-full"
          }
        >
          <div className="flex flex-col md:w-1/2 space-y-6 font-inter">
            <div>
              <h2 className="text-4xl font-black text-dblue">New Post</h2>
            </div>

            <div className="flex flex-col space-y-2 font-bold ">
              <p className="font-bold text-xl">Publish to</p>
              {socials.map((item) => (
                <div>
                  <input
                    defaultChecked={
                      value.select.includes(item.type) ? true : false
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        value.setSelect((prev) => [
                          ...prev,
                          e.target.value.split(" ")[0].toLowerCase(),
                        ]);
                        value.setTarget(
                          e.target.value.split(" ")[0].toLowerCase()
                        );
                        value.setPreviewTarget(
                          e.target.value.split(" ")[0].toLowerCase()
                        );
                      } else {
                        value.setSelect((prev) =>
                          prev.filter(
                            (item) =>
                              item !==
                              e.target.value.split(" ")[0].toLowerCase()
                          )
                        );
                      }
                    }}
                    type="checkbox"
                    value={`${item.type.toUpperCase()} : @${item.username}`}
                  />
                  <label className="ml-2">{`${item.type.toUpperCase()} : @${
                    item.username
                  }`}</label>
                </div>
              ))}
            </div>

            <div className="flex flex-col space-y-2">
              <div
                className={
                  value.select.includes("twitter")
                    ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                    : "hidden"
                }
              >
                <img className="w-5 h-5" src={twitter} />
                <p className="font-bold">@AhmadBMTahir</p>
              </div>
              <div
                className={
                  value.select.includes("facebook")
                    ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                    : "hidden"
                }
              >
                <img className="w-5 h-5" src={facebook} />
                <p className="font-bold">@AhmadBMTahir</p>
              </div>
              <div
                className={
                  value.select.includes("linkedin")
                    ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                    : "hidden"
                }
              >
                <div className="absolute border border-dblue flex justify-center rounded-full z-10 -top-3 -right-3 w-7 h-7 bg-owhite border border-dblue">
                  <p
                    onClick={(e) => {
                      const index = value.select.indexOf("linkedin");
                      value.setSelect([
                        ...value.select.slice(0, index),
                        ...value.select.slice(index + 1, select.length),
                      ]);
                    }}
                    className="font-black text-ored "
                  >
                    x
                  </p>
                </div>
                <img className="w-5 h-5" src={linkedin} />
                <p className="font-bold">@AhmadBMTahir</p>
              </div>
            </div>

            <div className="flex-flex-col space-y-2">
              <div className=" mb-10 flex space-x-2 md:space-x-4  border border-dblue bg-dblue bg-opacity-10 items-center rounded-lg w-fit">
                <div className={value.select.length === 0 ? "hidden" : ""}>
                  <p className="font-black text-xl ml-2">Content</p>
                </div>
                <div
                  className={value.select.includes("facebook") ? "" : "hidden"}
                >
                  <div
                    onClick={(e) => value.setTarget("facebook")}
                    className={
                      value.target === "facebook"
                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                        : "cursor-pointer p-3"
                    }
                  >
                    <img className="w-12 h-12" src={facebook} />
                  </div>
                </div>
                <div
                  className={value.select.includes("twitter") ? "" : "hidden"}
                >
                  <div
                    onClick={(e) => value.setTarget("twitter")}
                    className={
                      value.target === "twitter"
                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                        : "cursor-pointer p-3"
                    }
                  >
                    <img className="w-12 h-12" src={twitter} />
                  </div>
                </div>
                <div
                  className={value.select.includes("linkedin") ? "" : "hidden"}
                >
                  <div
                    onClick={(e) => value.setTarget("linkedin")}
                    className={
                      value.target === "linkedin"
                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                        : "cursor-pointer p-3"
                    }
                  >
                    <img className="w-12 h-12" src={linkedin} />
                  </div>
                </div>
              </div>

              <div
                className={
                  value.select.length === 0
                    ? "hidden"
                    : " relative w-full md:w-[500px]"
                }
              >
                <div className="absolute -top-7 right-0 flex space-x-2 items-center">
                  <img className="w-4 h-4" src={contentIcon(value.target)} />
                  <p className="text-ogray">
                    {whichContent(value.target)?.length}/200
                  </p>
                </div>
                <textarea
                  value={whichContent(value.target)}
                  onChange={(e) => changeContent(e.target.value)}
                  className="p-2 w-full rounded-lg border border-dblue min-h-[200px] font-bold"
                  placeholder="Enter your text here"
                />
              </div>
            </div>

            <div
              className={
                value.select.length === 0 ? "hidden" : "flex flex-col space-y-2"
              }
            >
              <div
                className={
                  twitterMax ||
                  previewPicture(value.previewTarget)?.length === 4
                    ? "hidden"
                    : ""
                }
              >
                <h2 className="font-black text-xl">Media</h2>
              </div>

              <div
                className={
                  twitterMax ||
                  previewPicture(value.previewTarget)?.length === 4
                    ? "hidden"
                    : "border w-xl md:w-[500px] border-dashed border-dblue p-2 rounded-lg flex flex-col space-y-3 items-center justify-center min-h-[200px] "
                }
              >
                <input
                  onChange={(e) => selectImage()}
                  className="hidden"
                  ref={ref}
                  type="file"
                  accept=".jpg,.png,.gif,video/mp4,.mov"
                />
                <img onClick={(e) => ref.current.click()} src={upload} />
                <p className="font-black">Drag files here</p>
                <p
                  onClick={(e) => ref.current.click()}
                  className="text-dblue font-black"
                >
                  Or select file to Upload
                </p>
              </div>
            </div>

            <div
              className={
                value.select.length === 0
                  ? "hidden"
                  : "mt-10 w-full flex justify-center xl:hidden"
              }
            >
              <button
                onClick={(e) => value.setPreview(true)}
                className={
                  value.preview
                    ? "hidden"
                    : "bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg font-bold hover:bg-lblue hover:text-dblue hover:border-2"
                }
              >
                Preview
              </button>
            </div>
          </div>

          <div
            className={
              value.preview
                ? "flex xl:flex mt-10 w-full justify-center items-center flex-col space-y-6 font-inter"
                : "hidden xl:flex w-1/2 flex-col space-y-6 font-inter"
            }
          >
            <div className="flex-flex-col space-y-2">
              <div className="mb-10 flex space-x-2 md:space-x-4 border border-dblue w-fit bg-dblue bg-opacity-10 items-center rounded-lg">
                <div className={value.select.length === 0 ? "hidden" : ""}>
                  <p className="ml-2 font-black text-xl">Preview</p>
                </div>
                <div
                  className={value.select.includes("facebook") ? "" : "hidden"}
                >
                  <div
                    onClick={(e) => value.setPreviewTarget("facebook")}
                    className={
                      value.previewTarget === "facebook"
                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                        : "cursor-pointer p-3"
                    }
                  >
                    <img className="w-12 h-12" src={facebook} />
                  </div>
                </div>
                <div
                  className={value.select.includes("twitter") ? "" : "hidden"}
                >
                  <div
                    onClick={(e) => value.setPreviewTarget("twitter")}
                    className={
                      value.previewTarget === "twitter"
                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                        : "cursor-pointer p-3"
                    }
                  >
                    <img className="w-12 h-12" src={twitter} />
                  </div>
                </div>
                <div
                  className={value.select.includes("linkedin") ? "" : "hidden"}
                >
                  <div
                    onClick={(e) => value.setPreviewTarget("linkedin")}
                    className={
                      value.previewTarget === "linkedin"
                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                        : "cursor-pointer p-3"
                    }
                  >
                    <img className="w-12 h-12" src={linkedin} />
                  </div>
                </div>
              </div>

              <div
                className={
                  value.select.length === 0
                    ? "hidden"
                    : " relative w-xl md:w-[500px]"
                }
              >
                <div className="absolute -top-7 right-0 flex space-x-2 items-center">
                  <img
                    className="w-4 h-4"
                    src={contentPreviewIcon(value.previewTarget)}
                  />
                  {/* <p className="text-ogray">1/200</p> */}
                </div>
                <div className="p-2 w-full rounded-lg border border-dblue  flex flex-col">
                  <div className="flex space-x-4 p-4">
                    <img
                      className="rounded-full"
                      src={
                        socials.find((item) => item.type === "twitter")?.image
                      }
                    />
                    <div className="flex flex-col space-y-1 justify-center">
                      <p className="font-black">
                        {
                          socials.find((item) => item.type === "twitter")
                            ?.displayName
                        }
                      </p>
                      <p className="font-bold text-ogray">
                        @
                        {
                          socials.find((item) => item.type === "twitter")
                            ?.username
                        }
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold break-words">
                      {previewedContent(value.previewTarget)}
                    </p>
                  </div>
                  <div className="px-4 mb-4">
                    <div className="flex flex-wrap w-full max-w-full">
                      {console.log(previewPicture(value.previewTarget))}
                      {previewPicture(value.previewTarget) &&
                        previewPicture(value.previewTarget).map(
                          (pic, index) => (
                            <div className="w-1/2 relative">
                              {pic.type === "image" || pic.type === "gif" ? (
                                <img
                                  ref={imageRef.current[index]}
                                  className="rounded-lg w-full h-[150px] object-cover "
                                  src={pic.value}
                                />
                              ) : (
                                <video
                                  ref={imageRef.current[index]}
                                  className="rounded-lg w-full h-[150px] object-cover "
                                  src={pic.value}
                                />
                              )}

                              <MdOutlineCancel
                                onClick={(e) => {
                                  removeImage(e, pic);
                                }}
                                className="absolute -top-3 -right-2 text-ored"
                              />
                            </div>
                          )
                        )}
                    </div>

                    {/* <div>
                      <img
                        className="rounded-lg w-1/2 "
                        src={
                          state === null
                            ? ""
                            : previewPicture(value.previewTarget)
                        }
                      />
                    </div> */}
                  </div>
                </div>
                <div className="mt-10 w-full flex justify-center">
                  <button
                    className="bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg font-bold hover:bg-lblue hover:text-dblue hover:border-2"
                    onClick={(e) => publish()}
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          loading
            ? "w-screen h-screen flex justify-center items-center"
            : "hidden"
        }
      >
        <CircularProgress />
      </div>
    </div>
  );
}
