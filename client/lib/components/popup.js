"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function Popup() {
    return (react_1.default.createElement("div", { className: 'flex flex-col space-y-4 bg-owhite' },
        react_1.default.createElement("p", null, "Are you sure you want to delete Twitter Account"),
        react_1.default.createElement("div", null,
            react_1.default.createElement("button", { className: 'p-2 border border-ogray' }, "Cancel"),
            react_1.default.createElement("button", { className: 'p-2 bg-ored border' }, "Delete"))));
}
exports.default = Popup;
