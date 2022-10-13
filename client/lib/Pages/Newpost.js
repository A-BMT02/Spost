"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const twitter_png_1 = __importDefault(require("../images/twitter.png"));
const facebook_png_1 = __importDefault(require("../images/facebook.png"));
const linkedin_png_1 = __importDefault(require("../images/linkedin.png"));
const instagram_png_1 = __importDefault(require("../images/instagram.png"));
const react_router_dom_1 = require("react-router-dom");
const DataContext_1 = require("../Context/DataContext");
const axios_1 = __importDefault(require("axios"));
const AuthContext_1 = require("../Context/AuthContext");
const md_1 = require("react-icons/md");
const CircularProgress_1 = __importDefault(require("@mui/material/CircularProgress"));
const Dropzone_1 = __importDefault(require("../utilities/Dropzone"));
const gr_1 = require("react-icons/gr");
const gr_2 = require("react-icons/gr");
const ai_1 = require("react-icons/ai");
const modal_1 = __importDefault(require("../components/modal"));
function Newpost() {
    var _a, _b, _c, _d, _e, _f;
    const value = (0, DataContext_1.useData)();
    const { socials } = (0, DataContext_1.useData)();
    const { dispatch } = (0, DataContext_1.useData)();
    const sliderRef = (0, react_1.useRef)(null);
    const imageRef = (0, react_1.useRef)([]);
    const { user } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { state } = (0, react_router_dom_1.useLocation)();
    const [showError, setShowError] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [load, setLoad] = (0, react_1.useState)(false);
    const [success, setSuccess] = (0, react_1.useState)(false);
    const [imageUrl, setImageUrl] = (0, react_1.useState)("");
    const [imageUrl2, setImageUrl2] = (0, react_1.useState)("");
    const [successProfile, setSuccessProfile] = (0, react_1.useState)([]);
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)("");
    const errorRef = (0, react_1.useRef)(null);
    const contentIcon = (target) => {
        switch (target) {
            case "twitter":
                return twitter_png_1.default;
            case "facebook":
                return facebook_png_1.default;
            case "linkedin":
                return linkedin_png_1.default;
            case "instagram":
                return instagram_png_1.default;
        }
    };
    const whichContent = (target) => {
        switch (target) {
            case "twitter":
                const text = value.state.value.length === 0
                    ? ""
                    : typeof value.twitterCounter !== 'undefined' && value.state.value[value.twitterCounter].text || "";
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
                return typeof value.setFacebookContent !== 'undefined' && value.setFacebookContent(text);
            case "linkedin":
                return typeof value.setLinkedinContent !== "undefined" && value.setLinkedinContent(text);
            case "instagram":
                return typeof value.setInstagramContent !== 'undefined' && value.setInstagramContent(text);
        }
    };
    const previewedContent = (previewTarget) => {
        switch (previewTarget) {
            case "twitter":
                return typeof value.twitterCounter !== 'undefined' && value.state.value[value.twitterCounter].text;
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
                return twitter_png_1.default;
            case "facebook":
                return facebook_png_1.default;
            case "linkedin":
                return linkedin_png_1.default;
            case "instagram":
                return instagram_png_1.default;
        }
    };
    const maxMedia = () => {
        var _a, _b;
        let max = false;
        const targetMedia = typeof value.twitterCounter !== 'undefined' && value.state.value[value.twitterCounter].media;
        const result = targetMedia === null || targetMedia === void 0 ? void 0 : targetMedia.map((obj) => {
            if (obj.type === "gif" || obj.type === "video") {
                max = true;
            }
        });
        if (typeof value.twitterCounter !== 'undefined' && ((_b = (_a = value.state.value[value.twitterCounter]) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.length) === 4) {
            max = true;
        }
        return max;
    };
    const next = () => {
        typeof value.setTwitterCounter !== 'undefined' && value.setTwitterCounter((prev) => {
            const multiple = prev !== value.state.value.length - 1 ? prev + 1 : 0;
            translate(multiple);
            return multiple;
        });
    };
    const previous = () => {
        typeof value.setTwitterCounter !== 'undefined' && value.setTwitterCounter((prev) => {
            const multiple = prev !== 0 ? prev - 1 : value.state.value.length - 1;
            translate(multiple);
            return multiple;
        });
    };
    (0, react_1.useEffect)(() => { }, [value.twitterCounter]);
    const translate = (multiple) => {
        if (sliderRef.current !== null) {
            sliderRef.current.style.transform = `translateX(-${(100 / value.state.value.length) * multiple}%)`;
        }
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
                if (typeof value.setTwitterMax !== 'undefined') {
                    value.setTwitterMax((prev) => [...prev, true]);
                }
                updateContents(type, reader, extension);
                setLoading(false);
            }
            else if (extension === "mp4") {
                type = "video";
                if (typeof reader.result === 'string') {
                    let media = new Audio(reader.result);
                    media.onloadedmetadata = function () {
                        if (media.duration > 140) {
                            setError("Video cannot be longer than 2min:20sec");
                            setShowError(true);
                            setLoading(false);
                            if (typeof value.setTwitterMax !== 'undefined') {
                                value.setTwitterMax((prev) => [...prev, false]);
                            }
                            return;
                        }
                        else {
                            if (typeof value.setTwitterMax !== 'undefined') {
                                value.setTwitterMax((prev) => [...prev, true]);
                            }
                            setShowError(false);
                            setError("");
                            updateContents(type, reader, extension);
                            setLoading(false);
                            return;
                        }
                    };
                }
            }
            else {
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
                }
                else {
                    type = "image";
                    updateContents(type, reader, extension);
                    setLoading(false);
                }
            }
        };
    };
    (0, react_1.useEffect)(() => {
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
                return typeof value.setFacebookPicture !== 'undefined' && value.setFacebookPicture((prev) => [
                    ...prev,
                    { type: "image", file: reader.result, extension },
                ]);
            case "linkedin":
                return typeof value.setLinkedinPicture !== 'undefined' && value.setLinkedinPicture(reader.result);
        }
    };
    const previewPicture = (previewTarget) => {
        switch (previewTarget) {
            case "twitter":
                return typeof value.twitterCounter !== 'undefined' && value.state.value[value.twitterCounter].media;
            case "facebook":
                return value.facebookPicture;
            case "linkedin":
                return value.linkedinPicture;
            case "instagram":
                return [{ type: "image", media: imageUrl, index: 0 }];
        }
    };
    const publish = () => __awaiter(this, void 0, void 0, function* () {
        setMessage("");
        setLoad(true);
        const allData = yield organizeData();
        const facebookConnect = user.connect.find((item) => {
            return item.social === "facebook";
        });
        const linkedinConnect = user.connect.find((item) => {
            return item.social === "linkedin";
        });
        const post = axios_1.default
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
                id: instagram_png_1.default.id,
            },
        })
            .then((res) => {
            setSuccessProfile(res.data);
            setSuccess(true);
            setLoad(false);
            setMessage("Successfully Published!");
        })
            .catch((err) => {
            setLoad(false);
        });
    });
    const organizeData = () => __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(value.state.value.map((obj) => __awaiter(this, void 0, void 0, function* () {
            const media = yield Promise.all(obj.media.map((mediaObj) => __awaiter(this, void 0, void 0, function* () {
                if (mediaObj.type === "image") {
                    const filename = yield fetch(mediaObj.file)
                        .then((r) => r.blob())
                        .then((blobFile) => new File([blobFile], "fileName", { type: blobFile.type }));
                    return Object.assign(Object.assign({}, mediaObj), { file: yield getBase64(filename) });
                }
                else {
                    return Object.assign({}, mediaObj);
                }
            })));
            return Object.assign(Object.assign({}, obj), { media });
        })));
    });
    const removeImage = (e, pic) => {
        switch (value.previewTarget) {
            case "twitter":
                dispatch({
                    type: "removeMedia",
                    media: pic,
                    index: value.twitterCounter,
                });
                typeof value.setTwitterPicture !== 'undefined' && value.setTwitterPicture(previewPicture(value.previewTarget).filter((item) => item.value !== pic.value));
                if (pic.type === "gif" || pic.type === "video") {
                    typeof value.setTwitterMax !== 'undefined' && value.setTwitterMax((prev) => [...prev, false]);
                }
        }
        previewPicture(value.previewTarget).filter((item) => item.value !== pic.value);
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
        if (sliderRef.current !== null) {
            sliderRef.current.classList.add("-translate-x-full");
        }
    };
    const setUrlPreview = () => {
        if (value.previewTarget === "instagram") {
            if (imageUrl === "") {
                return "";
            }
            else {
                return imageUrl;
            }
        }
        return value.facebookPicture;
    };
    (0, react_1.useEffect)(() => {
        if (message !== "") {
            setShowModal(true);
        }
    }, [message]);
    return (react_1.default.createElement("div", { className: "block mx-5 md:mx-auto" },
        react_1.default.createElement("div", { className: !loading
                ? "flex flex-col my-5  mx-5 md:w-10/12 mx-auto max-w-lg md:max-w-6xl"
                : "hidden" },
            react_1.default.createElement("div", { ref: errorRef, className: showError
                    ? "flex space-x-6 justify-center mx-auto border border-ored px-4 py-3 text-xl rounded-lg bg-[#D61C4E] text-owhite max-w-[300px]"
                    : "hidden" },
                react_1.default.createElement("p", { className: " " }, error),
                react_1.default.createElement("p", { onClick: (e) => {
                        errorRef.current !== null && errorRef.current.classList.add("hidden");
                        setShowError(false);
                        setError("");
                    }, className: "  self-center" }, "X")),
            react_1.default.createElement(modal_1.default, { message: message, showModal: showModal, setShowModal: setShowModal, successProfile: successProfile }),
            react_1.default.createElement("nav", { className: "my-3.5 flex justify-start " },
                react_1.default.createElement("h2", { onClick: (e) => navigate("/"), className: "text-5xl md:text-6xl font-a text-dblue cursor-pointer" }, "Spost")),
            react_1.default.createElement("div", { className: value.preview
                    ? "flex flex-col justify-center items-center w-full "
                    : "flex justify-center w-full space-x-6" },
                react_1.default.createElement("div", { className: "flex flex-col md:w-1/2 space-y-6 space-x-6 " },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h2", { className: "text-4xl  text-dblue" }, "New Post")),
                    react_1.default.createElement("div", { className: "flex flex-col space-y-2  " },
                        react_1.default.createElement("p", { className: " text-xl" }, "Publish to"),
                        socials.map((item) => (react_1.default.createElement("div", null,
                            react_1.default.createElement("input", { checked: value.select.includes(item.type) ? true : false, onChange: (e) => {
                                    if (e.target.checked) {
                                        typeof value.setSelect !== 'undefined' && value.setSelect((prev) => [
                                            ...prev,
                                            e.target.value.split(" ")[0].toLowerCase(),
                                        ]);
                                        typeof value.setTarget !== 'undefined' && value.setTarget(e.target.value.split(" ")[0].toLowerCase());
                                        typeof value.setPreviewTarget !== 'undefined' && value.setPreviewTarget(e.target.value.split(" ")[0].toLowerCase());
                                    }
                                    else {
                                        typeof value.setSelect !== 'undefined' && value.setSelect((prev) => prev.filter((item) => item !==
                                            e.target.value.split(" ")[0].toLowerCase()));
                                    }
                                }, type: "checkbox", value: `${item.type.toUpperCase()} : @${item.username}` }),
                            react_1.default.createElement("label", { className: "ml-2" }, `${item.type.toUpperCase()} : @${item.username}`))))),
                    react_1.default.createElement("div", { className: "flex flex-col space-y-2" },
                        react_1.default.createElement("div", { className: value.select.includes("twitter")
                                ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                                : "hidden" },
                            react_1.default.createElement("img", { className: "w-5 h-5", src: twitter_png_1.default }),
                            react_1.default.createElement("p", { className: "" },
                                "@", (_a = socials.find((item) => item.type === "twitter")) === null || _a === void 0 ? void 0 :
                                _a.username)),
                        react_1.default.createElement("div", { className: value.select.includes("facebook")
                                ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                                : "hidden" },
                            react_1.default.createElement("img", { className: "w-5 h-5", src: facebook_png_1.default }),
                            react_1.default.createElement("p", { className: "" },
                                "@", (_b = socials.find((item) => item.type === "facebook")) === null || _b === void 0 ? void 0 :
                                _b.username)),
                        react_1.default.createElement("div", { className: value.select.includes("instagram")
                                ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                                : "hidden" },
                            react_1.default.createElement("img", { className: "w-5 h-5", src: instagram_png_1.default }),
                            react_1.default.createElement("p", { className: "" },
                                "@", (_c = socials.find((item) => item.type === "instagram")) === null || _c === void 0 ? void 0 :
                                _c.username)),
                        react_1.default.createElement("div", { className: value.select.includes("linkedin")
                                ? "relative flex space-x-2 items-center bg-owhite rounded-lg w-fit p-2 border border-dblue"
                                : "hidden" },
                            react_1.default.createElement("div", { className: "absolute border border-dblue flex justify-center rounded-full z-10 -top-3 -right-3 w-7 h-7 bg-owhite border border-dblue" },
                                react_1.default.createElement("p", { onClick: (e) => {
                                        const index = value.select.indexOf("linkedin");
                                        typeof value.setSelect !== 'undefined' && value.setSelect([
                                            ...value.select.slice(0, index),
                                            ...value.select.slice(index + 1, value.select.length),
                                        ]);
                                    }, className: " text-ored " }, "x")),
                            react_1.default.createElement("img", { className: "w-5 h-5", src: linkedin_png_1.default }),
                            react_1.default.createElement("p", { className: "" },
                                "@", (_d = socials.find((item) => item.type === "linkedin")) === null || _d === void 0 ? void 0 :
                                _d.username))),
                    react_1.default.createElement("div", { className: "flex-flex-col space-y-2" },
                        react_1.default.createElement("div", { className: " mb-10 flex space-x-2 md:space-x-4  border border-dblue bg-dblue bg-opacity-10 items-center rounded-lg w-fit" },
                            react_1.default.createElement("div", { className: value.select.length === 0 ? "hidden" : "" },
                                react_1.default.createElement("p", { className: " text-xl ml-2" }, "Content")),
                            react_1.default.createElement("div", { className: value.select.includes("facebook") ? "" : "hidden" },
                                react_1.default.createElement("div", { onClick: (e) => typeof value.setTarget !== 'undefined' && value.setTarget("facebook"), className: value.target === "facebook"
                                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                                        : "cursor-pointer p-3" },
                                    react_1.default.createElement("img", { className: "w-12 h-12", src: facebook_png_1.default }))),
                            react_1.default.createElement("div", { className: value.select.includes("twitter") ? "" : "hidden" },
                                react_1.default.createElement("div", { onClick: (e) => typeof value.setTarget !== 'undefined' && value.setTarget("twitter"), className: value.target === "twitter"
                                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                                        : "cursor-pointer p-3" },
                                    react_1.default.createElement("img", { className: "w-12 h-12", src: twitter_png_1.default }))),
                            react_1.default.createElement("div", { className: value.select.includes("instagram") ? "" : "hidden" },
                                react_1.default.createElement("div", { onClick: (e) => typeof value.setTarget !== 'undefined' && value.setTarget("instagram"), className: value.target === "instagram"
                                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                                        : "cursor-pointer p-3" },
                                    react_1.default.createElement("img", { className: "w-12 h-12", src: instagram_png_1.default }))),
                            react_1.default.createElement("div", { className: value.select.includes("linkedin") ? "" : "hidden" },
                                react_1.default.createElement("div", { onClick: (e) => typeof value.setTarget !== 'undefined' && value.setTarget("linkedin"), className: value.target === "linkedin"
                                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                                        : "cursor-pointer p-3" },
                                    react_1.default.createElement("img", { className: "w-12 h-12", src: linkedin_png_1.default })))),
                        react_1.default.createElement("div", { className: value.select.length === 0 ? "hidden" : "" },
                            react_1.default.createElement("div", { className: "mb-2 flex justify-between items-center" },
                                react_1.default.createElement("div", { onClick: (e) => {
                                        dispatch({ type: "delete", index: value.twitterCounter });
                                        typeof value.setTwitterCounter !== 'undefined' && value.setTwitterCounter((prev) => {
                                            const multiple = 0;
                                            translate(multiple);
                                            return multiple;
                                        });
                                        typeof value.setTwitterMax !== 'undefined' && value.setTwitterMax((prev) => {
                                            const newMax = prev.map((item, index) => {
                                                if (index === value.twitterCounter) {
                                                    return;
                                                }
                                            });
                                            return newMax;
                                        });
                                    }, className: value.state.value.length > 1 ? "text-ored " : "hidden" },
                                    react_1.default.createElement(md_1.MdOutlineCancel, null)),
                                react_1.default.createElement("div", { className: value.state.value.length > 1 ? "hidden" : "" }),
                                react_1.default.createElement("div", { className: "flex space-x-1" },
                                    react_1.default.createElement("img", { className: "w-5 h-5", src: contentIcon(value.target) }),
                                    react_1.default.createElement("p", null, (_e = whichContent(value.target)) === null || _e === void 0 ? void 0 :
                                        _e.length,
                                        "/280"))),
                            react_1.default.createElement("div", { className: "relative w-full" },
                                react_1.default.createElement("div", { className: "w-full overflow-hidden" },
                                    react_1.default.createElement("div", { ref: sliderRef, className: "flex transition-all duration-300", style: { width: `${100 * value.state.value.length}%` } }, value.state.value.map((item) => (react_1.default.createElement("div", { style: {
                                            width: `${(100 * value.state.value.length) /
                                                value.state.value.length}%`,
                                        } },
                                        react_1.default.createElement("textarea", { maxLength: 280, value: whichContent(value.target), onChange: (e) => {
                                                if (e.target.value == "\n") {
                                                }
                                                changeContent(e.target.value);
                                            }, className: "textarea w-full   p-2 rounded-lg border border-dblue min-h-[200px]", placeholder: "Enter your text here" }),
                                        react_1.default.createElement("div", { className: "flex justify-between" },
                                            react_1.default.createElement("div", { className: value.state.value.length < 2
                                                    ? "hidden"
                                                    : " bottom-4 right-1 flex items-center" },
                                                react_1.default.createElement("div", { onClick: (e) => {
                                                        previous();
                                                    } },
                                                    react_1.default.createElement(gr_2.GrFormPrevious, null)),
                                                react_1.default.createElement("div", { onClick: (e) => {
                                                        next();
                                                    } },
                                                    react_1.default.createElement(gr_1.GrFormNext, null)),
                                                react_1.default.createElement("div", null,
                                                    react_1.default.createElement("p", null,
                                                        typeof value.twitterCounter !== 'undefined' && value.twitterCounter + 1,
                                                        "/",
                                                        value.state.value.length))),
                                            react_1.default.createElement("div", { onClick: (e) => {
                                                    dispatch({ type: "addEmpty" });
                                                    if (sliderRef.current !== null) {
                                                        sliderRef.current.style.transform = `translateX(-${0}%)`;
                                                    }
                                                }, className: value.target === "twitter"
                                                    ? "mt-2 flex justify-end"
                                                    : "hidden" },
                                                react_1.default.createElement(ai_1.AiOutlinePlusCircle, null))))))))))),
                    react_1.default.createElement("div", { className: value.select.length === 0 ? "hidden" : "flex flex-col space-y-2" },
                        react_1.default.createElement("div", { className: maxMedia() ? "hidden" : "" },
                            react_1.default.createElement("h2", { className: " text-xl" }, "Media")),
                        value.target !== "instagram" ? (react_1.default.createElement("div", { className: maxMedia() ? "hidden" : "" },
                            react_1.default.createElement(Dropzone_1.default, { selectImage: selectImage }))) : (react_1.default.createElement("div", { className: "flex flex-col space-y-2" },
                            react_1.default.createElement("p", { className: "" }, "Enter image Url below"),
                            react_1.default.createElement("input", { value: value.target === "instagram" ? imageUrl : imageUrl2, onChange: (e) => value.target === "instagram"
                                    ? setImageUrl(e.target.value)
                                    : setImageUrl2(e.target.value), className: "rounded-md border border-dblue  p-2" })))),
                    react_1.default.createElement("div", { className: value.select.length === 0
                            ? "hidden"
                            : "mt-10 w-full flex justify-center xl:hidden" },
                        react_1.default.createElement("button", { onClick: (e) => typeof value.setPreview !== 'undefined' && value.setPreview(true), className: value.preview
                                ? "hidden"
                                : "bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg  hover:bg-lblue hover:text-dblue hover:border-2" }, "Preview"))),
                react_1.default.createElement("div", { className: value.preview
                        ? "flex xl:flex mt-10 w-full justify-center items-center flex-col space-y-6 "
                        : "hidden xl:flex w-1/2 flex-col space-y-6 " },
                    react_1.default.createElement("div", { className: "flex-flex-col space-y-2" },
                        react_1.default.createElement("div", { className: "mb-10 flex space-x-2 md:space-x-4 border border-dblue w-fit bg-dblue bg-opacity-10 items-center rounded-lg" },
                            react_1.default.createElement("div", { className: value.select.length === 0 ? "hidden" : "" },
                                react_1.default.createElement("p", { className: "ml-2  text-xl" }, "Preview")),
                            react_1.default.createElement("div", { className: value.select.includes("facebook") ? "" : "hidden" },
                                react_1.default.createElement("div", { onClick: (e) => typeof value.setPreviewTarget !== 'undefined' && value.setPreviewTarget("facebook"), className: value.previewTarget === "facebook"
                                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                                        : "cursor-pointer p-3" },
                                    react_1.default.createElement("img", { className: "w-12 h-12", src: facebook_png_1.default }))),
                            react_1.default.createElement("div", { className: value.select.includes("twitter") ? "" : "hidden" },
                                react_1.default.createElement("div", { onClick: (e) => typeof value.setPreviewTarget !== 'undefined' && value.setPreviewTarget("twitter"), className: value.previewTarget === "twitter"
                                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                                        : "cursor-pointer p-3" },
                                    react_1.default.createElement("img", { className: "w-12 h-12", src: twitter_png_1.default }))),
                            react_1.default.createElement("div", { className: value.select.includes("instagram") ? "" : "hidden" },
                                react_1.default.createElement("div", { onClick: (e) => typeof value.setPreviewTarget !== 'undefined' && value.setPreviewTarget("instagram"), className: value.previewTarget === "instagram"
                                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                                        : "cursor-pointer p-3" },
                                    react_1.default.createElement("img", { className: "w-12 h-12", src: instagram_png_1.default }))),
                            react_1.default.createElement("div", { className: value.select.includes("linkedin") ? "" : "hidden" },
                                react_1.default.createElement("div", { onClick: (e) => typeof value.setPreviewTarget !== 'undefined' && value.setPreviewTarget("linkedin"), className: value.previewTarget === "linkedin"
                                        ? "cursor-pointer p-3 bg-gradient-to-b from-dblue to-owhite "
                                        : "cursor-pointer p-3" },
                                    react_1.default.createElement("img", { className: "w-12 h-12", src: linkedin_png_1.default })))),
                        react_1.default.createElement("div", { className: value.select.length === 0
                                ? "hidden"
                                : " relative w-xl md:w-[500px]" },
                            react_1.default.createElement("div", { className: "p-2 w-full rounded-lg border border-dblue  flex flex-col" },
                                socials.map((item) => (react_1.default.createElement("div", { className: value.previewTarget === item.type
                                        ? "flex space-x-4 p-4"
                                        : "hidden" },
                                    react_1.default.createElement("img", { className: "rounded-full w-14 h-14", src: item.image }),
                                    react_1.default.createElement("div", { className: "flex flex-col space-y-1 justify-center" },
                                        react_1.default.createElement("p", { className: item.type == "twitter" ? "" : "hidden" }, item.displayName),
                                        react_1.default.createElement("p", { className: " text-ogray" },
                                            "@",
                                            item.username))))),
                                react_1.default.createElement("div", { className: "p-4" },
                                    react_1.default.createElement("p", { className: " " }, previewedContent(value.previewTarget))),
                                react_1.default.createElement("div", { className: "px-4 mb-4" },
                                    react_1.default.createElement("div", { className: "flex flex-wrap w-full max-w-full" }, previewPicture(value.previewTarget) &&
                                        ((_f = previewPicture(value.previewTarget)) === null || _f === void 0 ? void 0 : _f.map((media, index) => (react_1.default.createElement("div", { className: "w-1/2 relative" },
                                            media.type === "image" ||
                                                media.type === "gif" ? (react_1.default.createElement("img", { ref: imageRef.current[index], className: "rounded-lg w-full h-[150px] object-cover ", src: value.previewTarget !== "instagram"
                                                    ? media.file
                                                    : setUrlPreview() })) : (react_1.default.createElement("video", { className: "rounded-lg w-full h-[150px] object-cover ", src: media.file })),
                                            value.previewTarget === "twitter" && (react_1.default.createElement(md_1.MdOutlineCancel, { onClick: (e) => {
                                                    removeImage(e, media);
                                                }, className: "absolute -top-3 -right-2 text-ored" }))))))))),
                            react_1.default.createElement("div", { className: "mt-10 w-full flex justify-center" }, load ? (react_1.default.createElement(CircularProgress_1.default, null)) : (react_1.default.createElement("button", { className: "bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg  hover:bg-lblue hover:text-dblue hover:border-2", onClick: (e) => publish() }, "Publish")))))))),
        react_1.default.createElement("div", { className: loading
                ? "w-screen h-screen flex justify-center items-center"
                : "hidden" },
            react_1.default.createElement(CircularProgress_1.default, null))));
}
exports.default = Newpost;
