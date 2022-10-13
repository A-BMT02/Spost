"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const twitter_png_1 = __importDefault(require("../images/twitter.png"));
const facebook_png_1 = __importDefault(require("../images/facebook.png"));
const instagram_png_1 = __importDefault(require("../images/instagram.png"));
const linkedin_png_1 = __importDefault(require("../images/linkedin.png"));
const md_1 = require("react-icons/md");
const react_router_dom_1 = require("react-router-dom");
const DataContext_1 = require("../Context/DataContext");
function Modal({ message, showModal, setShowModal, successProfile, }) {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { socials } = (0, DataContext_1.useData)();
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
            case "linkedin":
                return `https://linkedin.com`;
        }
    };
    const findLogo = (target) => {
        switch (target) {
            case "facebook":
                return facebook_png_1.default;
            case "twitter":
                return twitter_png_1.default;
            case "instagram":
                return instagram_png_1.default;
            case "linkedin":
                return linkedin_png_1.default;
        }
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: showModal ? "z-10 w-screen h-screen fixed top-0 left-0 " : "hidden" },
            react_1.default.createElement("div", { className: " w-full h-full  flex justify-center items-center" },
                react_1.default.createElement("div", { className: " bg-lgray opacity-50 w-full h-full fixed top-0" }),
                react_1.default.createElement("div", { className: "fixed rounded-md space-y-3 w-[80%] max-w-[400px] opacity-100  drop-shadow-md rounded-md p-5 bg-owhite justify-center items-center flex flex-col" },
                    react_1.default.createElement(md_1.MdOutlineCancel, { onClick: (e) => {
                            setShowModal(false);
                            successProfile.length > 0 && navigate("/dashboard");
                        }, className: "cursor-pointer absolute text-ored -top-2 -right-2 text-xl md:text-2xl" }),
                    react_1.default.createElement("p", { className: "text-xl text-center" }, message),
                    react_1.default.createElement("div", { className: "flex flex-col space-y-3" }, successProfile.length !== 0 &&
                        successProfile.map((item) => (react_1.default.createElement("div", { className: "flex items-center justify-center items-center space-x-2" },
                            react_1.default.createElement("img", { className: "w-8 h-8", src: findLogo(item) }),
                            react_1.default.createElement("a", { href: setUrl(item), target: "_blank", className: "cursor-pointer text-dblue" }, item.toUpperCase()))))))))));
}
exports.default = Modal;
