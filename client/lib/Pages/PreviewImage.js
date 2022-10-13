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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const react_image_crop_1 = __importStar(require("react-image-crop"));
const canvasPreview_1 = require("../utilities/canvasPreview");
const useDebounceEffect_1 = require("../utilities/useDebounceEffect");
const DataContext_1 = require("../Context/DataContext");
require("react-image-crop/dist/ReactCrop.css");
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return (0, react_image_crop_1.centerCrop)((0, react_image_crop_1.makeAspectCrop)({
        unit: '%',
        width: 90,
    }, aspect, mediaWidth, mediaHeight), mediaWidth, mediaHeight);
}
function PreviewImage() {
    const location = (0, react_router_dom_1.useLocation)();
    const state = location.state;
    const [image, setImage] = (0, react_1.useState)(state.image);
    const value = (0, DataContext_1.useData)();
    const previewCanvasRef = (0, react_1.useRef)(null);
    const imgRef = (0, react_1.useRef)(null);
    const [crop, setCrop] = (0, react_1.useState)({
        unit: "%",
        x: 0,
        y: 0,
        minWidth: 600,
        minHeight: 335,
    });
    const [completedCrop, setCompletedCrop] = (0, react_1.useState)();
    const [scale, setScale] = (0, react_1.useState)(1);
    const [rotate, setRotate] = (0, react_1.useState)(0);
    const [aspect, setAspect] = (0, react_1.useState)();
    const [showError, setShowError] = (0, react_1.useState)(false);
    const [imageError, setImageError] = (0, react_1.useState)("");
    const navigate = (0, react_router_dom_1.useNavigate)();
    const error = (0, react_1.useRef)(null);
    const { dispatch } = (0, DataContext_1.useData)();
    function onImageLoad(e) {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    }
    const checkImageSpec = () => {
        let pass = false;
        const url = previewCanvasRef.current !== null && previewCanvasRef.current.toDataURL();
        const width = previewCanvasRef.current !== null && previewCanvasRef.current.width;
        const height = previewCanvasRef.current !== null && previewCanvasRef.current.height;
        if (state.social === "twitter") {
            if ((width >= 600) && (height >= 335)) {
                pass = true;
            }
            else {
                pass = false;
                setImageError("Image width must be at least 600 X 335");
                return;
            }
        }
        else if (state.social === "facebook") {
            if ((width >= 600) && (height >= 315)) {
                pass = true;
            }
            else {
                pass = false;
                setImageError("Image width must be at least 600 X 315");
                return;
            }
        }
        let extension = "";
        if (state.extension === "jpg" || state.extension === "png") {
            extension = "image/jpeg";
        }
        else if (state.extension === "gif") {
            extension = "image/gif";
        }
        convertAndSave(extension, pass);
    };
    const convertAndSave = (extension, pass) => {
        previewCanvasRef.current !== null && previewCanvasRef.current.toBlob(function (blob) {
            if (blob !== null) {
                const imageObject = URL.createObjectURL(blob);
                const blobSize = blob.size / 1000000;
                if (blobSize <= 5) {
                    pass = true;
                }
                else {
                    pass = false;
                    setImageError("image size must not exceed 5mb");
                    return;
                }
                pass = true;
                setImageError("");
                switch (state.for) {
                    case "twitter":
                        let type;
                        if (imageObject.indexOf("blob") !== -1) {
                            type = "image";
                        }
                        dispatch({
                            type: "addPicture",
                            fileType: type,
                            file: imageObject,
                            index: value.twitterCounter,
                        });
                        navigate("/newpost");
                    case "facebook":
                        return typeof value.setFacebookPicture !== 'undefined' && value.setFacebookPicture(state.image);
                    case "linkedin":
                        return typeof value.setLinkedinPicture !== 'undefined' && value.setLinkedinPicture(state.image);
                }
                navigate("/newpost");
            }
        }, extension);
    };
    (0, react_1.useEffect)(() => {
        if (imageError !== "") {
            setShowError(true);
        }
    }, [imageError]);
    (0, useDebounceEffect_1.useDebounceEffect)(() => __awaiter(this, void 0, void 0, function* () {
        if ((completedCrop === null || completedCrop === void 0 ? void 0 : completedCrop.width) &&
            (completedCrop === null || completedCrop === void 0 ? void 0 : completedCrop.height) &&
            imgRef.current &&
            previewCanvasRef.current) {
            (0, canvasPreview_1.canvasPreview)(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
        }
    }), 100, [completedCrop, scale, rotate]);
    return (react_1.default.createElement("div", { className: "flex flex-col space-y-6 w-full h-screen items-center mt-10 " },
        react_1.default.createElement("div", { ref: error, className: showError
                ? "flex space-x-6 ixed  top-2 mx-auto border border-ored px-4 py-3 text-xl rounded-lg bg-[#D61C4E] text-owhite "
                : "hidden" },
            react_1.default.createElement("p", { className: " font-bold" }, imageError),
            react_1.default.createElement("p", { onClick: (e) => {
                    error.current !== null && error.current.classList.add("hidden");
                    setShowError(false);
                    setImageError("");
                }, className: " font-black" }, "X")),
        react_1.default.createElement("div", { className: "border-b pb-2 border-dblue mt-12" },
            react_1.default.createElement("p", { className: "text-3xl text-dblue" },
                "Crop Image for ",
                state.social)),
        react_1.default.createElement(react_image_crop_1.default, { crop: crop, onChange: (_, percentCrop) => setCrop(percentCrop), onComplete: (c) => setCompletedCrop(c), aspect: aspect },
            react_1.default.createElement("img", { className: "!max-w-lg", ref: imgRef, alt: "Cropped image", src: image, style: { transform: `scale(${scale}) rotate(${rotate}deg)` }, onLoad: onImageLoad })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("button", { className: "bg-dblue text-sm py-4 px-9 md:text-lg  text-owhite rounded-lg font-bold hover:bg-lblue hover:text-dblue hover:border-2", onClick: (e) => checkImageSpec() }, "Save")),
        react_1.default.createElement("div", { className: "hidden" }, Boolean(completedCrop) && (react_1.default.createElement("canvas", { ref: previewCanvasRef, style: {
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
            } }))),
        react_1.default.createElement("div", { className: "flex justify-center mx-5 md:mx-0" },
            react_1.default.createElement("div", { className: "flex flex-col  font-bold space-y-2 " },
                react_1.default.createElement("div", { className: "border-b pb-2 border-dblue w-fit mb-3" },
                    react_1.default.createElement("h2", { className: "font-bold text-dblue text-xl" },
                        state.social,
                        " image specifications")),
                state.social === "twitter" && (react_1.default.createElement("div", { className: "flex flex-col  font-bold space-y-2" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement("span", { className: "text-ored" }, "*"),
                            "Minimum size: 600 by 335 pixels")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement("span", { className: "text-ored" }, "*"),
                            "Recommended aspect ratio: any aspect between 2:1 and 1:1 on desktop; 2:1, 3:4 and 16:9 on mobile")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement("span", { className: "text-ored" }, "*"),
                            "Supported formats: GIF, JPG and PNG")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement("span", { className: "text-ored" }, "*"),
                            "Maximum file size: Up to 5MB for photos and GIFs on mobile. Up to 15MB on the web.")))),
                state.social === "facebook" && (react_1.default.createElement("div", { className: "flex flex-col  font-bold space-y-2" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement("span", { className: "text-ored" }, "*"),
                            "Minimum size: 600 x 315 pixels")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement("span", { className: "text-ored" }, "*"),
                            "Recommended size: 1200 x 630 pixels")))),
                state.social === "linkedin" && (react_1.default.createElement("div", { className: "flex flex-col  font-bold space-y-2" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement("span", { className: "text-ored" }, "*"),
                            "Recommended size: 1200 x 627 pixels"))))))));
}
exports.default = PreviewImage;
