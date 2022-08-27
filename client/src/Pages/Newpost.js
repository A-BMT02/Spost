import React, {
  useState,
  useRef,
  useEffect,
  createRef,
  useCallback,
} from "react";
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
import Dropzone from "../utilities/Dropzone";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import Slider from "../components/slider";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { NextPlan } from "@mui/icons-material";

export default function Newpost() {
  const value = useData();
  const { socials, setSocials } = useData();

  const { dispatch } = useData();

  const ref = useRef(null);
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

  const errorRef = useRef(null);
  const successRef = useRef(null);

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
        const text =
          value.state.value.length === 0
            ? ""
            : value.state.value[value.twitterCounter]?.text || "";
        return text;
      case "facebook":
        return value.facebookContent;
      case "linkedin":
        return value.linkedinContent;
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
      // const next = prev
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
      console.log("extesion is ", extension);
      if (extension === "gif") {
        type = "gif";
        // setTwitterMax(true);
        value.setTwitterMax((prev) => [...prev, true]);
        updateContents(type, reader);
        setLoading(false);
      } else if (extension === "mp4") {
        type = "video";
        let media = new Audio(reader.result);
        media.onloadedmetadata = function () {
          if (media.duration > 140) {
            setError("Video cannot be longer than 2min:20sec");
            setShowError(true);
            setLoading(false);
            // setTwitterMax(false);
            value.setTwitterMax((prev) => [...prev, false]);

            return;
          } else {
            // setTwitterMax(true);
            value.setTwitterMax((prev) => [...prev, true]);

            setShowError(false);
            setError("");
            updateContents(type, reader);
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
          updateContents(type, reader);
          setLoading(false);
        }
      }
    };
  };

  // const postToFacebook = async (result) => {
  // const blob = dataUrltoBlob(result);
  // const authToken =
  //   "EAARghgSyyVwBANi7MlNJ33AzeLxMbLe5ZCOxcooGD52B5VZBCv4IGJJBQdekmFCrVlQ9UBI1qBG4FkLYjQAB1hOpt90arq8f98ezMlPZCW6JISofpfN5ZAKs8Q0CK0ZAgJAFLZALr59Jhzj7kmAU7TDZALjYyFhz8kvm52NMeIe3gZDZD";
  // let formData = new FormData();
  // fd.append("access_token", authToken);
  // formData.append("source", blob, "image/jpg");

  // const result2 = await axios.post(
  //   `https://graph.facebook.com/v14.0/1232028627552604/uploads?file_length=${blob.size}&file_type=image/jpeg&access_token=EAARghgSyyVwBANi7MlNJ33AzeLxMbLe5ZCOxcooGD52B5VZBCv4IGJJBQdekmFCrVlQ9UBI1qBG4FkLYjQAB1hOpt90arq8f98ezMlPZCW6JISofpfN5ZAKs8Q0CK0ZAgJAFLZALr59Jhzj7kmAU7TDZALjYyFhz8kvm52NMeIe3gZDZD`
  // );

  // const id = result2.data.id;

  // const result3 = window.FB.api(`/v14.0/${id}`, formData, config);

  // console.log("res 1 is ", result, " and res 2 is ", result2);
  // console.log("id is ", id);
  // fd.append("message", "Please work");
  // console.log(
  //   "blob is ",
  //   blob,
  //   " and fd is",
  //   ...formData,
  //   " blob size is ",
  //   blob.size
  // );

  // const config2 = {
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  //   params: {
  //     id,
  //     size: blob.size,
  //   },
  // };

  // const res = await axios.post("/api/user/test", {
  //   blob,
  //   result: result,
  // });
  // };

  function dataUrltoBlob(dataURI) {
    var byteString = window.atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpg" });
  }

  useEffect(() => {
    if (error !== "") {
      setShowError(true);
    }
  }, [error]);

  const updateContents = (type, reader) => {
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
        console.log("i am here", reader.result);
        return value.setFacebookPicture(state?.image);
      case "linkedin":
        return value.setLinkedinPicture(state?.image);
    }
  };

  const previewPicture = (previewTarget) => {
    switch (previewTarget) {
      case "twitter":
        return value.state.value[value.twitterCounter].media;
      // return value.twitterPicture;
      case "facebook":
        return value.facebookPicture;
      case "linkedin":
        return value.linkedinPicture;
    }
  };

  const publish = async () => {
    setLoad(true);
    const allData = await Promise.all(
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

    //post to facebook
    const facebook = user.connect.find((item) => {
      return item.social === "facebook";
    });
    axios
      .post("/api/user/post/facebook", {
        data: value.facebookContent,
        id: facebook.id,
      })
      .then((res) => {
        console.log("res is ", res);
        // post to twitter
        axios
          .post("/api/user/post/twitter", {
            data: allData,
            id: user._id,
          })
          .then((res) => {
            console.log("res twitter is ", res);
            setLoad(false);
            if (res.data.status === "ok") {
              setSuccess(true);
            } else {
              setLoad(false);
              setError(res.data.error);
              setShowError(true);
            }
          });
      });
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
          // setTwitterMax(false);
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
        <div
          ref={successRef}
          className={
            success
              ? "flex space-x-6 justify-center mx-auto border border-ogreen px-4 py-3 text-xl rounded-lg bg-ogreen text-owhite max-w-[300px]"
              : "hidden"
          }
        >
          <p className="font-inter font-bold">Successfully posted</p>
          <p
            onClick={(e) => {
              successRef.current.classList.add("hidden");
              setSuccess(false);
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
          <div className="flex flex-col md:w-1/2 space-y-6 space-x-6 font-inter">
            <div>
              <h2 className="text-4xl font-black text-dblue">New Post</h2>
            </div>

            <div className="flex flex-col space-y-2 font-bold ">
              <p className="font-bold text-xl">Publish to</p>
              {socials.map((item) => (
                <div>
                  <input
                    // defaultChecked={
                    //   value.select.includes(item.type) ? true : false
                    // }
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
                        ...value.select.slice(index + 1, value.select.length),
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
                    <p>{whichContent(value.target).length}/280</p>
                  </div>
                </div>
                <div className="relative w-full">
                  {/* <Slider /> */}
                  <div className="w-full overflow-hidden">
                    {/* <div className={`width-[${100 * value.state.value.length}%] flex`}> */}
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
                            onChange={(e) => changeContent(e.target.value)}
                            className="w-full font-bold  p-2 rounded-lg border border-dblue min-h-[200px]"
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
              <div
                className={
                  maxMedia() || value.target === "facebook" ? "hidden" : ""
                }
              >
                <h2 className="font-black text-xl">Media</h2>
              </div>
              <div
                className={
                  maxMedia() || value.target === "facebook" ? "hidden" : ""
                }
              >
                <Dropzone selectImage={selectImage} />
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
                      {previewPicture(value.previewTarget) &&
                        previewPicture(value.previewTarget)?.map(
                          (media, index) => (
                            <div className="w-1/2 relative">
                              {console.log("media type is ", media.type)}
                              {media.type === "image" ||
                              media.type === "gif" ? (
                                <img
                                  ref={imageRef.current[index]}
                                  className="rounded-lg w-full h-[150px] object-cover "
                                  src={media.file}
                                />
                              ) : (
                                <video
                                  // ref={imageRef.current[index]}
                                  className="rounded-lg w-full h-[150px] object-cover "
                                  src={media.file}
                                />
                              )}

                              <MdOutlineCancel
                                onClick={(e) => {
                                  removeImage(e, media);
                                }}
                                className="absolute -top-3 -right-2 text-ored"
                              />
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
                      className="bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg font-bold hover:bg-lblue hover:text-dblue hover:border-2"
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
