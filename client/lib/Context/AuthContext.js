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
exports.UserProvider = exports.useAuth = exports.UserContext = void 0;
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const CircularProgress_1 = __importDefault(require("@mui/material/CircularProgress"));
exports.UserContext = (0, react_1.createContext)({
    signin: (email, password) => null,
    signup: (email, password) => null,
    logout: () => null,
});
function useAuth() {
    return (0, react_1.useContext)(exports.UserContext);
}
exports.useAuth = useAuth;
const UserProvider = (props) => {
    const [user, setUser] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [isAuth, setIsAuth] = (0, react_1.useState)(false);
    const signup = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield axios_1.default.post("https://web-production-191a.up.railway.app/api/user/register", {
            email,
            password,
        });
        if (result.data.status === "ok") {
            const value = yield signin(email, password);
            return value;
        }
        else {
            return { access: false, error: result.data.error };
        }
    });
    const signin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield axios_1.default.post("https://web-production-191a.up.railway.app/api/user/login", {
            email,
            password,
        });
        if (result.data.status === "ok") {
            setUser({ token: result.data.token, email: result.data.email });
            localStorage.setItem("token", result.data.token);
            setIsAuth(true);
            return { access: true, data: result.data };
        }
        else {
            setIsAuth(false);
            return { access: false, error: result.data.error };
        }
    });
    const logout = () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get("https://web-production-191a.up.railway.app/api/user/logout", {
            withCredentials: true,
        });
        localStorage.removeItem("token");
        setIsAuth(false);
        return res.data;
    });
    const value = {
        signin,
        signup,
        user,
        logout,
        setUser,
    };
    (0, react_1.useEffect)(() => {
        setLoading(true);
        const token = localStorage.getItem("token");
        axios_1.default
            .get("https://web-production-191a.up.railway.app/api/user/login/success", {
            withCredentials: true,
            headers: {
                token: token,
            },
        })
            .then((res) => {
            if (typeof res.data.data == "undefined") {
                setUser({});
            }
            else if (res.data.data) {
                setUser(res.data.data);
            }
            else {
                setUser({});
            }
            setLoading(false);
        });
    }, [isAuth]);
    return (react_1.default.createElement(exports.UserContext.Provider, { value: value }, loading ? (react_1.default.createElement("div", { className: "w-screen h-screen flex justify-center items-center" },
        react_1.default.createElement(CircularProgress_1.default, null))) : (props.children)));
};
exports.UserProvider = UserProvider;
