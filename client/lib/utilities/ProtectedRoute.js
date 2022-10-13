"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AuthContext_1 = require("../Context/AuthContext");
const react_router_dom_1 = require("react-router-dom");
function ProtectedRoute({ children }) {
    const { user } = (0, AuthContext_1.useAuth)();
    return Object.keys(user).length !== 0 ? children : react_1.default.createElement(react_router_dom_1.Navigate, { to: "/signin" });
}
exports.default = ProtectedRoute;
