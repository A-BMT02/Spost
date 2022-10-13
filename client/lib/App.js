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
const Home_1 = __importDefault(require("./Pages/Home"));
const react_router_dom_1 = require("react-router-dom");
const Signup_1 = __importDefault(require("./Pages/Signup"));
const Signin_1 = __importDefault(require("./Pages/Signin"));
const Dashboard_1 = __importDefault(require("./Pages/Dashboard"));
const Newpost_1 = __importDefault(require("./Pages/Newpost"));
const PreviewImage_1 = __importDefault(require("./Pages/PreviewImage"));
const DataContext_1 = require("./Context/DataContext");
const AuthContext_1 = require("./Context/AuthContext");
const ProtectedRoute_1 = __importDefault(require("./utilities/ProtectedRoute"));
const react_ga4_1 = __importDefault(require("react-ga4"));
const modal_1 = __importDefault(require("./components/modal"));
function App() {
    //initialize google analytics
    (0, react_1.useEffect)(() => {
        const TRACKING_ID = "G-68HCGL7WDH";
        react_ga4_1.default.initialize(TRACKING_ID);
        react_ga4_1.default.send("pageview");
    }, []);
    return (react_1.default.createElement(DataContext_1.DataContextProvider, null,
        react_1.default.createElement(AuthContext_1.UserProvider, null,
            react_1.default.createElement("div", null,
                react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
                    react_1.default.createElement(react_router_dom_1.Routes, null,
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(Home_1.default, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/signup", element: react_1.default.createElement(Signup_1.default, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/signin", element: react_1.default.createElement(Signin_1.default, null) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/modal", element: react_1.default.createElement(modal_1.default, { message: '', showModal: true, setShowModal: false, successProfile: [] }) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/dashboard", element: react_1.default.createElement(ProtectedRoute_1.default, null,
                                react_1.default.createElement(Dashboard_1.default, null)) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/newpost", element: react_1.default.createElement(ProtectedRoute_1.default, null,
                                react_1.default.createElement(Newpost_1.default, null)) }),
                        react_1.default.createElement(react_router_dom_1.Route, { path: "/previewImage", element: react_1.default.createElement(ProtectedRoute_1.default, null,
                                react_1.default.createElement(PreviewImage_1.default, null)) })))))));
}
exports.default = App;
