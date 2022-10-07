import React, { useState, useRef, useEffect } from "react";
import twitter from "../images/twitter.png";
import facebook from "../images/facebook.png";
import linkedin from "../images/linkedin.png";
import instagram from "../images/instagram.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../Context/DataContext";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { MdOutlineCancel } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import Dropzone from "../utilities/Dropzone";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Modal from "../components/modal";

export default function Newpost() {
  const value = useData();
  const { socials } = useData();

  const { dispatch } = useData();

  const sliderRef = useRef(null);
  const imageRef = useRef([]);

  const { user } = useAuth();

  const navigate = useNavigate();

  const { state } = useLocation();

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [successProfile, setSuccessProfile] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const errorRef = useRef(null);

  const contentIcon = (target) => {
    switch (target) {
      case "twitter":
        return twitter;
      case "facebook":
        return facebook;
      case "linkedin":
        return linkedin;
      case "instagram":
        return instagram;
    }
  };

  const whichContent = (target) => {
    switch (target) {
      case "twitter":
        const text =
          value.state.value.length === 0
            ? ""
            : value.state.value[value.twitterCounter]?.text || "";
        return text;
      case "facebook":
        return value.facebookContent;
      case "linkedin":
        return value.linkedinContent;
      case "instagram":
        return value.instagramContent;
    }
  };

  const changeContent = (text) => {
    switch (value.target) {
      case "twitter":
        return dispatch({
          type: "addContent",
          item: text,
          index: value.twitterCounter,
        });
      case "facebook":
        return value.setFacebookContent(text);
      case "linkedin":
        return value.setLinkedinContent(text);
      case "instagram":
        return value.setInstagramContent(text);
    }
  };

  const previewedContent = (previewTarget) => {
    switch (previewTarget) {
      case "twitter":
        return value.state.value[value.twitterCounter].text;
      case "facebook":
        return value.facebookContent;
      case "linkedin":
        return value.linkedinContent;
      case "instagram":
        return value.instagramContent;
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
      case "instagram":
        return instagram;
    }
  };

  const maxMedia = () => {
    let max = false;
    const targetMedia = value.state.value[value.twitterCounter].media;
    const result = targetMedia?.map((obj) => {
      if (obj.type === "gif" || obj.type === "video") {
        max = true;
      }
    });
    if (value.state.value[value.twitterCounter]?.media?.length === 4) {
      max = true;
    }

    return max;
  };

  const next = (index) => {
    value.setTwitterCounter((prev) => {
      const multiple = prev !== value.state.value.length - 1 ? prev + 1 : 0;
      translate(multiple);
      return multiple;
    });
  };

  const previous = () => {
    value.setTwitterCounter((prev) => {
      const multiple = prev !== 0 ? prev - 1 : value.state.value.length - 1;
      translate(multiple);
      return multiple;
    });
  };
  useEffect(() => {}, [value.twitterCounter]);

  const translate = (multiple) => {
    sliderRef.current.style.transform = `translateX(-${
      (100 / value.state.value.length) * multiple
    }%)`;
  };

  const selectImage = (uploadedFile, index) => {
    setLoading(true);
    let type;
    let reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onload = function (e) {
      const extension = uploadedFile.name.split(".").pop().toLowerCase();
      if (extension === "gif") {
        type = "gif";
        value.setTwitterMax((prev) => [...prev, true]);
        updateContents(type, reader, extension);
        setLoading(false);
      } else if (extension === "mp4") {
        type = "video";
        let media = new Audio(reader.result);
        media.onloadedmetadata = function () {
          if (media.duration > 140) {
            setError("Video cannot be longer than 2min:20sec");
            setShowError(true);
            setLoading(false);
            value.setTwitterMax((prev) => [...prev, false]);

            return;
          } else {
            value.setTwitterMax((prev) => [...prev, true]);

            setShowError(false);
            setError("");
            updateContents(type, reader, extension);
            setLoading(false);
            return;
          }
        };
      } else {
        if (window.screen.width > 768) {
          navigate("/previewImage", {
            state: {
              image: reader.result,
              for: value.target,
              social: value.target,
              extension,
            },
          });
          setLoading(false);
          return;
        } else {
          type = "image";
          updateContents(type, reader, extension);
          setLoading(false);
        }
      }
    };
  };

  useEffect(() => {
    if (error !== "") {
      setShowError(true);
    }
  }, [error]);

  const updateContents = (type, reader, extension) => {
    switch (value.target) {
      case "twitter":
        dispatch({
          type: "addPicture",
          fileType: type,
          file: reader.result,
          index: value.twitterCounter,
        });

        return;
      case "facebook":
        return value.setFacebookPicture((prev) => [
          ...prev,
          { type: "image", file: reader.result, extension },
        ]);

      case "linkedin":
        return value.setLinkedinPicture(state?.image);
    }
  };

  const previewPicture = (previewTarget) => {
    switch (previewTarget) {
      case "twitter":
        return value.state.value[value.twitterCounter].media;
      case "facebook":
        return value.facebookPicture;
      case "linkedin":
        return value.linkedinPicture;
      case "instagram":
        return [{ type: "image", media: imageUrl, index: 0 }];
    }
  };

  const publish = async () => {
    setMessage("");
    const allData = await organizeData();

    const facebookConnect = user.connect.find((item) => {
      return item.social === "facebook";
    });

    const linkedinConnect = user.connect.find((item) => {
      return item.social === "linkedin";
    });

    const post = axios
      .post("https://web-production-191a.up.railway.app/api/user/post/all", {
        id: user._id,
        twitter: allData,
        facebook: {
          data: value.facebookContent,
          id: facebookConnect.id,
          picture: value.facebookPicture,
        },
        linkedin: {
          text: value.linkedinContent,
          id: linkedinConnect.id,
        },
        instagram: {
          picture: imageUrl,
          text: value.instagramContent,
          id: instagram.id,
        },
      })
      .then((res) => {
        setSuccessProfile(res.data);
        setSuccess(true);
        setLoad(false);
        setMessage("Successfully Published!");
      });
  };

  const organizeData = async () => {
    return await Promise.all(
      value.state.value.map(async (obj) => {
        const media = await Promise.all(
          obj.media.map(async (mediaObj) => {
            if (mediaObj.type === "image") {
              const filename = await fetch(mediaObj.file)
                .then((r) => r.blob())
                .then(
                  (blobFile) =>
                    new File([blobFile], "fileName", { type: blobFile.type })
                );
              return { ...mediaObj, file: await getBase64(filename) };
            } else {
              return { ...mediaObj };
            }
          })
        );
        return { ...obj, media };
      })
    );
  };

  const removeImage = (e, pic) => {
    switch (value.previewTarget) {
      case "twitter":
        dispatch({
          type: "removeMedia",
          media: pic,
          index: value.twitterCounter,
        });
        value.setTwitterPicture(
          previewPicture(value.previewTarget).filter(
            (item) => item.value !== pic.value
          )
        );
        if (pic.type === "gif" || pic.type === "video") {
          value.setTwitterMax((prev) => [...prev, false]);
        }
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

  const slider = (e) => {
    sliderRef.current.classList.add("-translate-x-full");
  };

  const setUrlPreview = () => {
    if (value.previewTarget === "instagram") {
      if (imageUrl === "") {
        return "";
      } else {
        return imageUrl;
      }
    }
    return value.facebookPicture;
  };

  useEffect(() => {
    if (message !== "") {
      setShowModal(true);
    }
  }, [message]);
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
          <p className=" ">{error}</p>
          <p
            onClick={(e) => {
              errorRef.current.classList.add("hidden");
              setShowError(false);
              setError("");
            }}
            className="  self-center"
          >
            X
          </p>
        </div>
        <Modal
          message={message}
          showModal={showModal}
          setShowModal={setShowModal}
          successProfile={successProfile}
        />

        <nav className="my-3.5 flex justify-start ">
          <h2
            onClick={(e) => navigate("/")}
            className="text-5xl md:text-6xl font-a text-dblue cursor-pointer"
          >
            Spost
          </h2>
        </nav>
        <div
          className={
            value.preview
              ? "flex flex-col justify-center items-center w-full "
              : "flex justify-center w-full space-x-6"
          }
        >
          <div className="flex flex-col md:w-1/2 space-y-6 space-x-6 ">
            <div>
              <h2 className="text-4xl  text-dblue">New Post</h2>
            </div>

            <div className="flex flex-col space-y-2  ">
              <p className=" text-xl">Publish to</p>
              {socials.map((item) => (
                <div>
                  <input
                    checked={value.select.includes(item.type) ? true : false}
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
                <p className="">
                  @{socials.find((item) => item.type === "twitter")?.username}
                </p>
              </div>
              <div
                className={
                  value.select.includes("facebook")
                    ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                    : "hidden"
                }
              >
                <img className="w-5 h-5" src={facebook} />
                <p className="">
                  @{socials.find((item) => item.type === "facebook")?.username}
                </p>
              </div>
              <div
                className={
                  value.select.includes("instagram")
                    ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                    : "hidden"
                }
              >
                <img className="w-5 h-5" src={instagram} />
                <p className="">
                  @{socials.find((item) => item.type === "instagram")?.username}
                </p>
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
                        ...value.select.slice(index + 1, value.select.length),
                      ]);
                    }}
                    className=" text-ored "
                  >
                    x
                  </p>
                </div>
                <img className="w-5 h-5" src={linkedin} />
                <p className="">
                  @{socials.find((item) => item.type === "linkedin")?.username}
                </p>
              </div>
            </div>

            <div className="flex-flex-col space-y-2">
              <div className=" mb-10 flex space-x-2 md:space-x-4  border border-dblue bg-dblue bg-opacity-10 items-center rounded-lg w-fit">
                <div className={value.select.length === 0 ? "hidden" : ""}>
                  <p className=" text-xl ml-2">Content</p>
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
                  className={value.select.includes("instagram") ? "" : "hidden"}
                >
                  <div
                    onClick={(e) => value.setTarget("instagram")}
                    className={
                      value.target === "instagram"
                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                        : "cursor-pointer p-3"
                    }
                  >
                    <img className="w-12 h-12" src={instagram} />
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
              <div className={value.select.length === 0 ? "hidden" : ""}>
                <div className="mb-2 flex justify-between items-center">
                  <div
                    onClick={(e) => {
                      dispatch({ type: "delete", index: value.twitterCounter });
                      value.setTwitterCounter((prev) => {
                        const multiple = 0;
                        translate(multiple);
                        return multiple;
                      });
                      value.setTwitterMax((prev) => {
                        const newMax = prev.map((item, index) => {
                          if (index === value.twitterCounter) {
                            return;
                          }
                        });
                      });
                    }}
                    className={
                      value.state.value.length > 1 ? "text-ored " : "hidden"
                    }
                  >
                    <MdOutlineCancel />
                  </div>
                  <div
                    className={value.state.value.length > 1 ? "hidden" : ""}
                  ></div>
                  <div className={value.sele}></div>
                  <div className="flex space-x-1">
                    <img className="w-5 h-5" src={contentIcon(value.target)} />
                    <p>{whichContent(value.target)?.length}/280</p>
                  </div>
                </div>
                <div className="relative w-full">
                  <div className="w-full overflow-hidden">
                    <div
                      ref={sliderRef}
                      className="flex transition-all duration-300"
                      style={{ width: `${100 * value.state.value.length}%` }}
                    >
                      {value.state.value.map((item) => (
                        <div
                          style={{
                            width: `${
                              (100 * value.state.value.length) /
                              value.state.value.length
                            }%`,
                          }}
                        >
                          <textarea
                            maxLength={280}
                            value={whichContent(value.target)}
                            onChange={(e) => {
                              if (e.target.value == "\n") {
                              }
                              changeContent(e.target.value);
                            }}
                            className="textarea w-full   p-2 rounded-lg border border-dblue min-h-[200px]"
                            placeholder="Enter your text here"
                          />
                          <div className="flex justify-between">
                            <div
                              className={
                                value.state.value.length < 2
                                  ? "hidden"
                                  : " bottom-4 right-1 flex items-center"
                              }
                            >
                              <div
                                onClick={(e) => {
                                  previous();
                                }}
                              >
                                <GrFormPrevious />
                              </div>
                              <div
                                onClick={(e) => {
                                  next();
                                }}
                              >
                                <GrFormNext />
                              </div>
                              <div>
                                <p>
                                  {value.twitterCounter + 1}/
                                  {value.state.value.length}
                                </p>
                              </div>
                            </div>
                            <div
                              onClick={(e) => {
                                dispatch({ type: "addEmpty" });
                                sliderRef.current.style.transform = `translateX(-${0}%)`;
                              }}
                              className={
                                value.target === "twitter"
                                  ? "mt-2 flex justify-end"
                                  : "hidden"
                              }
                            >
                              <AiOutlinePlusCircle />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                value.select.length === 0 ? "hidden" : "flex flex-col space-y-2"
              }
            >
              <div className={maxMedia() ? "hidden" : ""}>
                <h2 className=" text-xl">Media</h2>
              </div>
              {value.target !== "instagram" ? (
                <div className={maxMedia() ? "hidden" : ""}>
                  <Dropzone selectImage={selectImage} />
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <p className="">Enter image Url below</p>
                  <input
                    value={value.target === "instagram" ? imageUrl : imageUrl2}
                    onChange={(e) =>
                      value.target === "instagram"
                        ? setImageUrl(e.target.value)
                        : setImageUrl2(e.target.value)
                    }
                    className="rounded-md border border-dblue  p-2"
                  />
                </div>
              )}
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
                    : "bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg  hover:bg-lblue hover:text-dblue hover:border-2"
                }
              >
                Preview
              </button>
            </div>
          </div>

          <div
            className={
              value.preview
                ? "flex xl:flex mt-10 w-full justify-center items-center flex-col space-y-6 "
                : "hidden xl:flex w-1/2 flex-col space-y-6 "
            }
          >
            <div className="flex-flex-col space-y-2">
              <div className="mb-10 flex space-x-2 md:space-x-4 border border-dblue w-fit bg-dblue bg-opacity-10 items-center rounded-lg">
                <div className={value.select.length === 0 ? "hidden" : ""}>
                  <p className="ml-2  text-xl">Preview</p>
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
                  className={value.select.includes("instagram") ? "" : "hidden"}
                >
                  <div
                    onClick={(e) => value.setPreviewTarget("instagram")}
                    className={
                      value.previewTarget === "instagram"
                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                        : "cursor-pointer p-3"
                    }
                  >
                    <img className="w-12 h-12" src={instagram} />
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
                <div className="p-2 w-full rounded-lg border border-dblue  flex flex-col">
                  {socials.map((item) => (
                    <div
                      className={
                        value.previewTarget === item.type
                          ? "flex space-x-4 p-4"
                          : "hidden"
                      }
                    >
                      <img
                        className="rounded-full w-14 h-14"
                        src={item.image}
                      />
                      <div className="flex flex-col space-y-1 justify-center">
                        <p className={item.type == "twitter" ? "" : "hidden"}>
                          {item.displayName}
                        </p>
                        <p className=" text-ogray">@{item.username}</p>
                      </div>
                    </div>
                  ))}

                  <div className="p-4">
                    <p className=" ">{previewedContent(value.previewTarget)}</p>
                  </div>

                  <div className="px-4 mb-4">
                    <div className="flex flex-wrap w-full max-w-full">
                      {previewPicture(value.previewTarget) &&
                        previewPicture(value.previewTarget)?.map(
                          (media, index) => (
                            <div className="w-1/2 relative">
                              {media.type === "image" ||
                              media.type === "gif" ? (
                                <img
                                  ref={imageRef.current[index]}
                                  className="rounded-lg w-full h-[150px] object-cover "
                                  src={
                                    value.previewTarget !== "instagram"
                                      ? media.file
                                      : setUrlPreview()
                                  }
                                />
                              ) : (
                                <video
                                  className="rounded-lg w-full h-[150px] object-cover "
                                  src={media.file}
                                />
                              )}

                              {value.previewTarget === "twitter" && (
                                <MdOutlineCancel
                                  onClick={(e) => {
                                    removeImage(e, media);
                                  }}
                                  className="absolute -top-3 -right-2 text-ored"
                                />
                              )}
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
                <div className="mt-10 w-full flex justify-center">
                  {load ? (
                    <CircularProgress />
                  ) : (
                    <button
                      className="bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg  hover:bg-lblue hover:text-dblue hover:border-2"
                      onClick={(e) => publish()}
                    >
                      Publish
                    </button>
                  )}
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
