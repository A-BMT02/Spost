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
const home_png_1 = __importDefault(require("../images/home.png"));
const google_png_1 = __importDefault(require("../images/google.png"));
const AuthContext_1 = require("../Context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
const CircularProgress_1 = __importDefault(require("@mui/material/CircularProgress"));
function Signup() {
    const [emailValue, setEmailValue] = (0, react_1.useState)("");
    const [passwordValue, setPasswordValue] = (0, react_1.useState)("");
    const [secondPassword, setSecondPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [showError, setShowError] = (0, react_1.useState)(false);
    const [show, setShow] = (0, react_1.useState)(false);
    const [login, setLogin] = (0, react_1.useState)(false);
    const [logging, setLogging] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const errorRef = (0, react_1.useRef)(null);
    const { signup } = (0, AuthContext_1.useAuth)();
    const { signin } = (0, AuthContext_1.useAuth)();
    const { user } = (0, AuthContext_1.useAuth)();
    const signupNow = (email, password) => __awaiter(this, void 0, void 0, function* () {
        if (password === secondPassword) {
            setLoading(true);
            const res = yield signup(email.toLowerCase(), password);
            if ((res === null || res === void 0 ? void 0 : res.access) == false) {
                typeof res.error !== 'undefined' && setError(res.error);
                setLoading(false);
                return;
            }
            else if ((res === null || res === void 0 ? void 0 : res.access) === true) {
                navigate("/dashboard");
                setLoading(false);
                return;
            }
        }
        else {
            setError("Passwords do not match");
            return;
        }
    });
    (0, react_1.useEffect)(() => {
        if (error !== "") {
            setShowError(true);
        }
    }, [error]);
    (0, react_1.useEffect)(() => {
        if (Object.keys(user).length !== 0) {
            setShow(false);
            navigate("/dashboard");
        }
        else {
            setShow(true);
        }
    }, []);
    const signinWithGoogle = () => {
        setLogin(true);
        window.open("https://web-production-191a.up.railway.app/api/user/google", "_self");
        setLogin(false);
    };
    const testLogin = () => __awaiter(this, void 0, void 0, function* () {
        setLogging(true);
        const res = yield signin("futuristicaistore@gmail.com", "12345678");
        if ((res === null || res === void 0 ? void 0 : res.access) == false) {
            typeof res.error !== 'undefined' && setError(res.error);
            setLoading(false);
            return setLogging(false);
        }
        else if ((res === null || res === void 0 ? void 0 : res.access) === true) {
            navigate("/dashboard");
            setLoading(false);
            return setLogging(false);
        }
    });
    return (react_1.default.createElement("div", null, show && (react_1.default.createElement("div", { className: "block mx-5 md:mx-auto" },
        react_1.default.createElement("div", { className: "fixed top-2 mx-auto inset-x-0" },
            react_1.default.createElement("div", { ref: errorRef, className: showError
                    ? "flex space-x-6 justify-center mx-auto border border-ored px-4 py-3 text-xl rounded-lg bg-[#D61C4E] text-owhite max-w-[300px]"
                    : "hidden" },
                react_1.default.createElement("p", { className: " " }, error),
                react_1.default.createElement("p", { onClick: (e) => {
                        errorRef.current !== null && errorRef.current.classList.add("hidden");
                        setShowError(false);
                        setError("");
                    }, className: "" }, "X"))),
        react_1.default.createElement("div", { className: "flex flex-col my-5  mx-5 md:w-10/12 mx-auto max-w-lg md:max-w-6xl" },
            react_1.default.createElement("nav", { className: "flex justify-start " },
                react_1.default.createElement("h2", { onClick: (e) => navigate("/"), className: "text-5xl md:text-6xl font-a text-dblue" }, "Spost")),
            react_1.default.createElement("div", { className: "flex  items-start mx-auto" },
                react_1.default.createElement("div", { className: "hidden block w-1/2 max-w-[538px] " },
                    react_1.default.createElement("img", { src: home_png_1.default })),
                react_1.default.createElement("div", { className: " flex flex-col justify-center items-center space-y-4  max-w-[320px]" },
                    react_1.default.createElement("div", { className: "flex justify-center" },
                        react_1.default.createElement("h2", { className: "text-3xl " }, "Sign up")),
                    react_1.default.createElement("div", { className: "relative mx-auto block " },
                        react_1.default.createElement("p", { className: "absolute top-2 left-5 " }, "Email Address"),
                        react_1.default.createElement("input", { value: emailValue, onChange: (e) => setEmailValue(e.target.value), className: "bg-owhite w-lg border border-dblue rounded-lg p-2 md:w-80 pt-7 pl-5 " })),
                    react_1.default.createElement("div", { className: "relative mx-auto block" },
                        react_1.default.createElement("p", { className: "absolute top-2 left-5 " }, "Password"),
                        react_1.default.createElement("input", { value: passwordValue, onChange: (e) => setPasswordValue(e.target.value), type: "password", className: "bg-owhite w-lg border border-dblue rounded-lg p-2 md:w-80 pt-7 pl-5 " })),
                    react_1.default.createElement("div", { className: "relative mx-auto block" },
                        react_1.default.createElement("p", { className: "absolute top-2 left-5 " }, "Password Again"),
                        react_1.default.createElement("input", { value: secondPassword, onChange: (e) => setSecondPassword(e.target.value), type: "password", className: "bg-owhite w-lg border border-dblue rounded-lg p-2 md:w-80 pt-7 pl-5 " })),
                    react_1.default.createElement("div", null, loading ? (react_1.default.createElement(CircularProgress_1.default, null)) : (react_1.default.createElement("button", { onClick: (e) => signupNow(emailValue, passwordValue), className: "bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg  hover:bg-lblue hover:text-dblue hover:border-2" }, "Sign up"))),
                    react_1.default.createElement("div", { className: "flex justify-between w-full" },
                        react_1.default.createElement("hr", { className: "w-2/5 m-auto text-ogray" }),
                        react_1.default.createElement("p", null, "or"),
                        react_1.default.createElement("hr", { className: "w-2/5 m-auto text-ogray" })),
                    react_1.default.createElement("div", { className: "cursor-pointer relative bg-lblue w-lg border border-dblue rounded-lg p-2 md:w-80  hover:bg-dblue hover:text-owhite" }, login ? (react_1.default.createElement(CircularProgress_1.default, null)) : (react_1.default.createElement("div", { className: " flex space-x-6 pointer-events-auto justify-center items-center " },
                        react_1.default.createElement("img", { src: google_png_1.default }),
                        react_1.default.createElement("p", { onClick: (e) => signinWithGoogle(), className: "text-xl " }, "Sign in with Google")))),
                    react_1.default.createElement("p", null,
                        "Already have an account?",
                        " ",
                        react_1.default.createElement("span", { onClick: (e) => navigate("/signin"), className: "cursor-pointer  text-dblue hover:border-b hover:border-b-dblue" }, "Sign in")),
                    logging ? (react_1.default.createElement("div", { className: "flex justify-center items-center w-full" },
                        react_1.default.createElement(CircularProgress_1.default, null))) : (react_1.default.createElement("div", { onClick: (e) => testLogin(), className: "cursor-pointer relative bg-ored text-owhite hover:text-ored hover:bg-owhite w-lg hover:border hover:border-ored rounded-lg p-2 md:w-80 " },
                        react_1.default.createElement("div", { className: " flex space-x-6 pointer-events-auto justify-center items-center " },
                            react_1.default.createElement("p", { className: "text-xl   " }, "Test User login")))))))))));
}
exports.default = Signup;
