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
const instagram_png_1 = __importDefault(require("../images/instagram.png"));
const twitter_png_1 = __importDefault(require("../images/twitter.png"));
const facebook_png_1 = __importDefault(require("../images/facebook.png"));
const linkedin_png_1 = __importDefault(require("../images/linkedin.png"));
const AuthContext_1 = require("../Context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
const md_1 = require("react-icons/md");
const bs_1 = require("react-icons/bs");
const axios_1 = __importDefault(require("axios"));
const CircularProgress_1 = __importDefault(require("@mui/material/CircularProgress"));
const DataContext_1 = require("../Context/DataContext");
const modal_1 = __importDefault(require("../components/modal"));
const react_router_dom_2 = require("react-router-dom");
const facebookSDK_1 = require("../utilities/facebookSDK");
require("facebook-js-sdk");
const Dashboard = () => {
    const ref = (0, react_1.useRef)(null);
    const ref2 = (0, react_1.useRef)(null);
    const { user } = (0, AuthContext_1.useAuth)();
    const { socials, setSocials } = (0, DataContext_1.useData)();
    const [showModal, setShowModal] = (0, react_1.useState)(false);
    const [connect, setConnect] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [deleteTwitter, setDeleteTwitter] = (0, react_1.useState)(false);
    const [connecting, setConnecting] = (0, react_1.useState)(false);
    const [deleting, setDeleting] = (0, react_1.useState)(false);
    const [loggingOut, setLoggingOut] = (0, react_1.useState)(false);
    const [fbUserAccessToken, setFbUserAccessToken] = (0, react_1.useState)("");
    const [loadingFacebook, setLoadingFacebook] = (0, react_1.useState)(false);
    const [loadingLinkedin, setLoadingLinkedin] = (0, react_1.useState)(false);
    const [loadingInstagram, setLoadingInstagram] = (0, react_1.useState)(false);
    const [deleteLinkedin, setDeleteLinkedin] = (0, react_1.useState)(false);
    const [deleteFacebook, setDeleteFacebook] = (0, react_1.useState)(false);
    const [deleteInstagram, setDeleteInstagram] = (0, react_1.useState)(false);
    const [deletingInstagram, setDeletingInstagram] = (0, react_1.useState)(false);
    const [deletingFacebook, setDeletingFacebook] = (0, react_1.useState)(false);
    const [deletingLinkedin, setDeletingLinkedin] = (0, react_1.useState)(false);
    const [linkedinCode, setLinkedinCode] = (0, react_1.useState)("");
    const [message, setMessage] = (0, react_1.useState)("");
    const useQuery = () => new URLSearchParams((0, react_router_dom_2.useLocation)().search);
    const query = useQuery();
    const toggleSidebar = () => {
        var _a, _b, _c;
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.classList.toggle("open");
        (_b = ref2.current) === null || _b === void 0 ? void 0 : _b.classList.toggle("flex");
        (_c = ref2.current) === null || _c === void 0 ? void 0 : _c.classList.toggle("hidden");
    };
    const { logout } = (0, AuthContext_1.useAuth)();
    const { setUser } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const logoutNow = () => __awaiter(void 0, void 0, void 0, function* () {
        setLoggingOut(true);
        setSocials === null || setSocials === void 0 ? void 0 : setSocials([]);
        const res = yield logout();
        if (res.status == "ok") {
            setUser === null || setUser === void 0 ? void 0 : setUser({});
            navigate("/");
        }
        setLoggingOut(false);
    });
    (0, react_1.useEffect)(() => {
        setSocials === null || setSocials === void 0 ? void 0 : setSocials([]);
        setLoading(true);
        axios_1.default
            .post("https://web-production-191a.up.railway.app/api/user/get/socials", {
            data: user === null || user === void 0 ? void 0 : user.connect,
        })
            .then((res) => {
            setSocials === null || setSocials === void 0 ? void 0 : setSocials(res.data);
            setLoading(false);
        })
            .catch((err) => {
            setLoading(false);
        });
    }, []);
    const connectTwitter = () => __awaiter(void 0, void 0, void 0, function* () {
        setConnecting(true);
        const result = yield axios_1.default.get("https://web-production-191a.up.railway.app/api/user/twitter", {
            headers: {
                id: user._id,
            },
        });
        window.location.href = result.data.URL;
        setConnecting(false);
    });
    const connectInstagram = () => __awaiter(void 0, void 0, void 0, function* () {
        const facebookExist = user.connect.find((target) => target.social === "facebook");
        if (!facebookExist) {
            setShowModal(true);
            setMessage("You have to connect your FACEBOOK business account associated with the instagram account!");
            return;
        }
        setLoadingInstagram(true);
        const res = yield axios_1.default.get("https://web-production-191a.up.railway.app/api/user/instagram", {
            params: {
                id: user._id,
            },
        });
        window.location.reload();
        setLoadingInstagram(false);
    });
    const connectLinkedin = () => __awaiter(void 0, void 0, void 0, function* () {
        let clientId = "77azlgzvzxd9s0";
        window.open(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=https://spostapp.vercel.app/dashboard&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`, "_self");
    });
    (0, react_1.useEffect)(() => {
        const code = query.get("code");
        if (code !== "" && code !== null) {
            setLinkedinCode(code);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (linkedinCode !== "" && linkedinCode !== null) {
            axios_1.default
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
    const isFbSDKInitialized = (0, facebookSDK_1.useInitFbSDK)();
    const connectFacebook = () => __awaiter(void 0, void 0, void 0, function* () {
        setLoadingFacebook(true);
        logInToFB();
    });
    const logInToFB = (0, react_1.useCallback)(() => {
        window.FB.login((response) => {
            setFbUserAccessToken(response.authResponse.accessToken);
        });
    }, []);
    (0, react_1.useEffect)(() => {
        if (fbUserAccessToken) {
            axios_1.default
                .get("https://web-production-191a.up.railway.app/api/user/facebook", {
                withCredentials: true,
                params: {
                    accessToken: fbUserAccessToken,
                    user: user._id,
                },
            })
                .then((res) => {
                setLoadingFacebook(false);
                window.location.reload();
            })
                .catch((err) => {
                setLoadingFacebook(false);
            });
        }
    }, [fbUserAccessToken]);
    const socialImage = (type) => {
        switch (type) {
            case "twitter":
                return twitter_png_1.default;
            case "facebook":
                return facebook_png_1.default;
            case "instagram":
                return instagram_png_1.default;
            case "linkedin":
                return linkedin_png_1.default;
        }
    };
    const logoutTwitter = (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (user.email.toLowerCase() === "futuristicaistore@gmail.com") {
            setMessage("You do not have permission to perform this on a test account");
            return setShowModal(true);
        }
        setDeleting(true);
        const con = user.connect.find((target) => {
            return target.social === "twitter";
        });
        axios_1.default
            .get("https://web-production-191a.up.railway.app/api/user/twitter/logout", {
            withCredentials: true,
            params: {
                id: con.id,
                user,
            },
        })
            .then((res) => {
            if (res.data.status === "ok") {
                window.location.reload();
                setDeleting(false);
            }
        });
    });
    const logoutInstagram = () => {
        var _a;
        if (user.email.toLowerCase() === "futuristicaistore@gmail.com") {
            setMessage("You do not have permission to perform this on a test account");
            return setShowModal(true);
        }
        setDeletingInstagram(true);
        const instagramDetails = (_a = user === null || user === void 0 ? void 0 : user.connect) === null || _a === void 0 ? void 0 : _a.find((target) => {
            return target.social === "instagram";
        });
        axios_1.default
            .get("https://web-production-191a.up.railway.app/api/user/instagram/logout", {
            withCredentials: true,
            params: {
                id: instagramDetails.id,
            },
        })
            .then((res) => {
            if (res.status === 200) {
                window.location.reload();
                setDeletingInstagram(true);
            }
        })
            .catch((err) => {
            window.location.reload();
            setDeletingInstagram(true);
        });
    };
    const logoutFacebook = () => {
        var _a;
        if (user.email.toLowerCase() === "futuristicaistore@gmail.com") {
            setMessage("You do not have permission to perform this on a test account");
            return setShowModal(true);
        }
        setDeletingFacebook(true);
        const facebookDetails = (_a = user === null || user === void 0 ? void 0 : user.connect) === null || _a === void 0 ? void 0 : _a.find((target) => {
            return target.social === "facebook";
        });
        axios_1.default
            .get("https://web-production-191a.up.railway.app/api/user/facebook/logout", {
            withCredentials: true,
            params: {
                id: facebookDetails.id,
            },
        })
            .then((res) => {
            if (res.status === 200) {
                window.location.reload();
                setDeletingFacebook(true);
            }
        })
            .catch((err) => {
            window.location.reload();
            setDeletingFacebook(true);
        });
    };
    const logoutLinkedin = () => {
        var _a;
        if (user.email.toLowerCase() === "futuristicaistore@gmail.com") {
            setMessage("You do not have permission to perform this on a test account");
            return setShowModal(true);
        }
        setDeletingLinkedin(true);
        const linkedinDetails = (_a = user === null || user === void 0 ? void 0 : user.connect) === null || _a === void 0 ? void 0 : _a.find((target) => {
            return target.social === "linkedin";
        });
        axios_1.default
            .get("https://web-production-191a.up.railway.app/api/user/linkedin/logout", {
            withCredentials: true,
            params: {
                id: linkedinDetails.id,
            },
        })
            .then((res) => {
            if (res.status === 200) {
                window.location.reload();
                setDeletingLinkedin(true);
            }
        })
            .catch((err) => {
            window.location.reload();
            setDeletingLinkedin(true);
        });
    };
    return (react_1.default.createElement("div", { className: "block mx-5 md:mx-auto max-w-[800px] " },
        react_1.default.createElement(modal_1.default, { successProfile: [], showModal: showModal, setShowModal: setShowModal, message: message }),
        react_1.default.createElement("div", { className: "flex flex-col my-5  mx-5 md:w-10/12 mx-auto max-w-lg md:max-w-6xl" },
            react_1.default.createElement("nav", { className: "relative" },
                react_1.default.createElement("div", { className: "flex justify-between border-b border-dblue pb-3.5" },
                    react_1.default.createElement("h2", { onClick: (e) => navigate("/"), className: "text-5xl md:text-6xl font-a text-dblue cursor-pointer" }, "Spost"),
                    react_1.default.createElement("div", { className: "flex space-x-4" },
                        react_1.default.createElement("div", { className: "p-2   flex items-center" }, !loggingOut ? (react_1.default.createElement("button", { onClick: (e) => {
                                logoutNow();
                            }, className: "bg-lblue border border-dblue text-sm md:text-lg p-2 md:p-3 text-dblue rounded-lg   hover:bg-dblue hover:text-owhite" }, "Log out")) : (react_1.default.createElement(CircularProgress_1.default, null))))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { ref: ref2, id: "menu", className: "rounded-sm absolute hidden flex-col items-center self-end mt-14 space-y-6  bg-owhite w-full sm:self-center  drop-shadow-md" },
                        react_1.default.createElement("a", { className: "cursor-pointer p-5 hover:text-xl hover:text-dblue", onClick: (e) => navigate("/newpost") }, "New Post")))),
            react_1.default.createElement("div", { className: "flex justify-between mt-3.5 pb-3.5 border-b border-dblue items-center " },
                react_1.default.createElement("button", { ref: ref, id: "menu-btn", className: "block hamburger focus:outline-none", onClick: (e) => {
                        toggleSidebar();
                    } },
                    react_1.default.createElement("span", { className: "hamburger-top" }),
                    react_1.default.createElement("span", { className: "hamburger-middle" }),
                    react_1.default.createElement("span", { className: "hamburger-bottom" })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h2", { className: "text-[25px]  " }, "Dashboard")),
                react_1.default.createElement("div", null)),
            react_1.default.createElement("div", { className: loading ? "mt-20 flex justify-center align-center" : "hidden" },
                react_1.default.createElement(CircularProgress_1.default, null)),
            react_1.default.createElement("div", { className: loading ? "hidden" : "flex  " },
                react_1.default.createElement("div", { className: socials.length === 0 || connect
                        ? "hidden"
                        : "flex flex-col  space-y-6 m-auto items-center" },
                    react_1.default.createElement("div", { className: "flex flex-col m-auto items-center space-y-12 " },
                        react_1.default.createElement("h2", { className: "text-[20px] md:text-3xl   mt-10 text-center" }, "Your social media profiles")),
                    socials.map((social) => (react_1.default.createElement("div", { className: "flex flex-col space-y-4" },
                        react_1.default.createElement("div", { className: "flex space-x-6 items-center" },
                            react_1.default.createElement("div", { className: "flex space-x-2 items-center text-lg md:text-xl" },
                                react_1.default.createElement("img", { className: "w-5 h-5", src: socialImage(social.type) }),
                                react_1.default.createElement("p", { className: "" },
                                    "@",
                                    social.username)),
                            react_1.default.createElement("div", { className: "text-xl" },
                                react_1.default.createElement(md_1.MdOutlineCancel, { className: "fill-ored cursor-pointer", onClick: (e) => {
                                        if (social.type === "twitter") {
                                            setDeleteTwitter(true);
                                        }
                                        else if (social.type === "facebook") {
                                            setDeleteFacebook(true);
                                        }
                                        else if (social.type === "instagram") {
                                            setDeleteInstagram(true);
                                        }
                                        else if (social.type === "linkedin") {
                                            setDeleteLinkedin(true);
                                        }
                                    } }))),
                        react_1.default.createElement("div", { className: (social.type === "twitter" && deleteTwitter) ||
                                (social.type === "facebook" && deleteFacebook) ||
                                (social.type === "instagram" && deleteInstagram) ||
                                (social.type === "linkedin" && deleteLinkedin)
                                ? "flex flex-col  space-y-4 bg-owhite rounded-lg p-2 "
                                : "hidden" },
                            react_1.default.createElement("p", null, "Are you sure you want to delete account"),
                            react_1.default.createElement("div", { className: "flex justify-center space-x-4" },
                                react_1.default.createElement("button", { onClick: (e) => {
                                        if (social.type === "twitter") {
                                            setDeleteTwitter(false);
                                        }
                                        else if (social.type === "facebook") {
                                            setDeleteFacebook(false);
                                        }
                                        else if (social.type === "instagram") {
                                            setDeleteInstagram(false);
                                        }
                                        else if (social.type === "linkedin") {
                                            setDeleteLinkedin(false);
                                        }
                                    }, className: "rounded-lg p-2 border border-ogray" }, "Cancel"),
                                (social.type === "twitter" && !deleting) ||
                                    (social.type === "facebook" && !deletingFacebook) ||
                                    (social.type === "instagram" && !deletingInstagram) ||
                                    (social.type === "linkedin" && !deletingLinkedin) ? (react_1.default.createElement("button", { onClick: (e) => {
                                        if (social.type === "twitter") {
                                            logoutTwitter(e);
                                        }
                                        else if (social.type === "facebook") {
                                            logoutFacebook();
                                        }
                                        else if (social.type === "instagram") {
                                            logoutInstagram();
                                        }
                                        else if (social.type === "linkedin") {
                                            logoutLinkedin();
                                        }
                                    }, className: "rounded-lg p-2 bg-ored text-owhite border" }, "Delete")) : (react_1.default.createElement(CircularProgress_1.default, null))))))),
                    react_1.default.createElement("div", { onClick: (e) => {
                            setConnect(true);
                        }, className: "hover:bg-dblue hover:text-owhite  cursor-pointer self-center border w-full max-w-[300px] border-dashed border-dblue p-2 rounded-lg flex space-x-3 items-center justify-center" },
                        react_1.default.createElement(bs_1.BsPlusCircle, null),
                        react_1.default.createElement("p", { className: " " }, "Add new social media profile"))),
                react_1.default.createElement("div", { className: socials.length === 0 || connect
                        ? "flex flex-col m-auto items-center space-y-12 "
                        : "hidden" },
                    react_1.default.createElement("h2", { className: "text-[25px] md:text-3xl   mt-10 text-center" }, "Connect your social media profiles"),
                    react_1.default.createElement("div", { className: "flex justify-center space-x-4 max-w-{500px} w-full md:space-x-10  w-full md:w-auto items-center" },
                        socials.some((e) => e.type === "twitter") === false &&
                            connecting ? (react_1.default.createElement(CircularProgress_1.default, null)) : (socials.some((e) => e.type === "twitter") === false && (react_1.default.createElement("img", { onClick: (e) => {
                                user.email.toLowerCase() ===
                                    "futuristicaistore@gmail.com"
                                    ? showPopup()
                                    : connectTwitter();
                            }, className: "w-12 h-12 md:w-20 md:h-20 cursor-pointer ", src: twitter_png_1.default }))),
                        socials.some((e) => e.type === "facebook") === false &&
                            loadingFacebook ? (react_1.default.createElement(CircularProgress_1.default, null)) : (socials.some((e) => e.type === "facebook") === false && (react_1.default.createElement("img", { onClick: (e) => user.email.toLowerCase() ===
                                "futuristicaistore@gmail.com"
                                ? showPopup()
                                : connectFacebook(), className: "w-12 h-12 md:w-20 md:h-20 cursor-pointer ", src: facebook_png_1.default }))),
                        socials.some((e) => e.type === "instagram") === false &&
                            loadingInstagram ? (react_1.default.createElement(CircularProgress_1.default, null)) : (socials.some((e) => e.type === "instagram") === false && (react_1.default.createElement("img", { onClick: (e) => user.email.toLowerCase() ===
                                "futuristicaistore@gmail.com"
                                ? showPopup()
                                : connectInstagram(), className: "w-12 h-12 md:w-20 md:h-20 cursor-pointer ", src: instagram_png_1.default }))),
                        " ",
                        socials.some((e) => e.type === "linkedin") === false &&
                            loadingLinkedin ? (react_1.default.createElement(CircularProgress_1.default, null)) : (socials.some((e) => e.type === "linkedin") === false && (react_1.default.createElement("img", { onClick: (e) => user.email.toLowerCase() ===
                                "futuristicaistore@gmail.com"
                                ? showPopup()
                                : connectLinkedin(), className: "w-12 h-12 md:w-20 md:h-20 cursor-pointer ", src: linkedin_png_1.default })))),
                    react_1.default.createElement("div", { className: "cursor-pointer self-center border w-full max-w-[300px] hover:bg-dblue hover:text-owhite border-dblue p-2 rounded-lg flex space-x-3 items-center justify-center" },
                        react_1.default.createElement("p", { className: "", onClick: (e) => setConnect(false) }, "View Connected Accounts")))))));
};
exports.default = Dashboard;
