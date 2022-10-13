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
const react_dropzone_1 = require("react-dropzone");
const upload_png_1 = __importDefault(require("../images/upload.png"));
const DataContext_1 = require("../Context/DataContext");
function Dropzone({ selectImage }) {
    const ref = (0, react_1.useRef)(null);
    const value = (0, DataContext_1.useData)();
    const [mobileMedia, setMobileMedia] = (0, react_1.useState)([]);
    const onDrop = (0, react_1.useCallback)((acceptedFiles) => __awaiter(this, void 0, void 0, function* () { }), []);
    const { getRootProps, getInputProps, acceptedFiles } = (0, react_dropzone_1.useDropzone)({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
            "video/mp4": [".mp4", ".MP4"],
        },
    });
    (0, react_1.useEffect)(() => {
        if (acceptedFiles.length !== 0) {
            selectImage(acceptedFiles[0], value.twitterCounter);
        }
    }, [acceptedFiles]);
    (0, react_1.useEffect)(() => {
        if (mobileMedia.length !== 0) {
            selectImage(mobileMedia[0], value.twitterCounter);
        }
    }, [mobileMedia]);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", Object.assign({ className: "hidden md:flex border w-xl border-dashed border-dblue p-2 rounded-lg flex-col space-y-3 items-center justify-center min-h-[200px] " }, getRootProps()),
            react_1.default.createElement("input", Object.assign({}, getInputProps())),
            react_1.default.createElement("div", { className: "flex flex-col space-y-3 items-center justify-center" },
                react_1.default.createElement("img", { src: upload_png_1.default }),
                react_1.default.createElement("p", { className: "" }, "Drag files here"),
                react_1.default.createElement("p", { className: "text-dblue " }, "Or select file to Upload"))),
        react_1.default.createElement("div", { onClick: (e) => {
                ref.current !== null && ref.current.click();
            }, className: "flex border w-xl border-dashed border-dblue p-2 rounded-lg flex-col space-y-3 items-center justify-center min-h-[200px] md:hidden " },
            react_1.default.createElement("input", { type: "file", onChange: (e) => {
                    setMobileMedia(e.target.files);
                }, ref: ref, accept: "image/*", className: "hidden" }),
            react_1.default.createElement("div", { className: "flex flex-col space-y-3 items-center justify-center" },
                react_1.default.createElement("img", { src: upload_png_1.default }),
                react_1.default.createElement("p", { className: "text-dblue " }, "Select file to Upload")))));
}
exports.default = Dropzone;
