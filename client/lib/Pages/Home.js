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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const pointSocial_png_1 = __importDefault(require("../images/pointSocial.png"));
const business_png_1 = __importDefault(require("../images/business.png"));
const publish_png_1 = __importDefault(require("../images/publish.png"));
function Home() {
    const [year, setYear] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const date = new Date();
        setYear(date.getFullYear());
    }, []);
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (react_1.default.createElement("div", { className: "flex justify-center" },
        react_1.default.createElement("div", { className: "flex flex-col my-5 mx-5 md:my-10 md:mx-10 lg:my-15 lg:mx-15 w-full max-w-[1200px]" },
            react_1.default.createElement("nav", { className: "mb-8xl flex justify-between " },
                react_1.default.createElement("h2", { className: "text-5xl md:text-6xl font-a text-dblue" }, "Spost"),
                react_1.default.createElement("div", { className: "flex space-x-6" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("button", { className: "bg-dblue text-sm md:text-lg p-2 md:p-3 text-owhite border border-dblue rounded-lg font-bold  hover:bg-lblue hover:text-dblue", onClick: (e) => navigate("/signup") }, "Sign up")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("button", { className: "bg-lblue border border-dblue text-sm md:text-lg p-2 md:p-3 text-dblue rounded-lg font-bold  hover:bg-dblue hover:text-owhite", onClick: (e) => navigate("/signin") }, "Login")))),
            react_1.default.createElement("div", { className: "flex space-x-12  mt-5 md:m-10 justify-between items-start" },
                react_1.default.createElement("div", { className: "flex flex-col items-center mx-auto " },
                    react_1.default.createElement("div", { className: "mb-5 md:mb-10 max-w-sm md:max-w-none" },
                        react_1.default.createElement("h3", { className: "text-3xl text-center md:text-6xl  font-bold" },
                            "Write ",
                            react_1.default.createElement("span", { className: "text-dblue font-bold" }, "once"),
                            " post",
                            " ",
                            react_1.default.createElement("span", { className: "text-dblue font-bold" }, "everywhere"))),
                    react_1.default.createElement("div", { className: "mb-5 md:mb-6 max-w-sm md:max-w-none" },
                        react_1.default.createElement("p", { className: "text-md md:text-2xl text-center" }, "Write your content once and post to all your favorite social media platforms")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("button", { onClick: (e) => navigate("/signup"), className: "bg-dblue text-sm md:text-lg p-2 md:p-4 text-owhite rounded-lg font-bold hover:bg-lblue hover:text-dblue hover:border-2 hover:border-dblue" }, "Get Started")))),
            react_1.default.createElement("div", { className: "flex flex-col  justify-center items-center" },
                react_1.default.createElement("div", { className: "flex pt-5 pb-5 flex-col my-10 p-10  w-full rounded-md bg-dblue justify-center space-y-6 md:flex-row md:justify-around  max-w-[500px] md:max-w-[900px] md:pt-20 md:pb-20" },
                    react_1.default.createElement("div", { className: "flex flex-col space-y-4 justify-center md:w-7/12 " },
                        react_1.default.createElement("p", { className: "text-owhite text-center font-bold md:text-left md:text-2xl" }, "Supports Facebook Business, Instagram Business/Creator and Twitter accounts"),
                        react_1.default.createElement("p", { className: "text-owhite text-center md:text-left md:text-xl" }, "Create or change your Facebook and Instagram to a Business/Creator account. Works with all twitter accounts")),
                    react_1.default.createElement("div", { className: "flex justify-center " },
                        react_1.default.createElement("img", { src: business_png_1.default, className: " w-[58px] h-[64px]" }))),
                react_1.default.createElement("div", { className: "flex pt-5 pb-5 flex-col my-10 p-10  w-full rounded-md bg-dblue justify-center space-y-6 md:flex-row md:justify-around  max-w-[500px] md:max-w-[900px] md:pt-20 md:pb-20" },
                    react_1.default.createElement("div", { className: "flex flex-col space-y-4 justify-center  md:w-7/12" },
                        react_1.default.createElement("p", { className: "text-owhite text-center font-bold md:text-left md:text-2xl" }, "Connect your social media accounts"),
                        react_1.default.createElement("p", { className: "text-owhite text-center md:text-left md:text-xl" }, "Click on the social media icons to connect your social media account")),
                    react_1.default.createElement("div", { className: "flex justify-center " },
                        react_1.default.createElement("img", { src: pointSocial_png_1.default }))),
                react_1.default.createElement("div", { className: "flex pt-5 pb-5 flex-col my-10 p-10  w-full rounded-md bg-dblue justify-center space-y-6 md:flex-row md:justify-around  max-w-[500px] md:max-w-[900px] md:pt-20 md:pb-20" },
                    react_1.default.createElement("div", { className: "flex flex-col space-y-4 justify-center md:w-7/12" },
                        react_1.default.createElement("p", { className: "text-owhite text-center font-bold md:text-left md:text-2xl" }, "Write your content and post"),
                        react_1.default.createElement("p", { className: "text-owhite text-center md:text-left md:text-xl" }, "Customize your content based on the social media platforms and post with a click of a button")),
                    react_1.default.createElement("div", { className: "flex justify-center " },
                        react_1.default.createElement("img", { src: publish_png_1.default })))),
            react_1.default.createElement("div", { className: "flex justify-center mb-5 font-sm" },
                react_1.default.createElement("p", null,
                    "Spost - All rights reserved ",
                    year,
                    ".")))));
}
exports.default = Home;
