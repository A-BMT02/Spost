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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataContextProvider = exports.useData = exports.dataContext = void 0;
const react_1 = __importStar(require("react"));
const Reducers_1 = require("../utilities/Reducers");
exports.dataContext = (0, react_1.createContext)({});
const useData = () => {
    return (0, react_1.useContext)(exports.dataContext);
};
exports.useData = useData;
const DataContextProvider = (props) => {
    const [twitterCounter, setTwitterCounter] = (0, react_1.useState)(0);
    const [twitterContent, setTwitterContent] = (0, react_1.useState)([]);
    const [twitterPreviewCounter, setTwitterPreviewCounter] = (0, react_1.useState)(0);
    const [facebookContent, setFacebookContent] = (0, react_1.useState)("");
    const [linkedinContent, setLinkedinContent] = (0, react_1.useState)("");
    const [instagramContent, setInstagramContent] = (0, react_1.useState)("");
    const [twitterPicture, setTwitterPicture] = (0, react_1.useState)([]);
    const [facebookPicture, setFacebookPicture] = (0, react_1.useState)([]);
    const [linkedinPicture, setLinkedinPicture] = (0, react_1.useState)([]);
    const [target, setTarget] = (0, react_1.useState)("twitter");
    const [previewTarget, setPreviewTarget] = (0, react_1.useState)("twitter");
    const [image, setImage] = (0, react_1.useState)("");
    const [preview, setPreview] = (0, react_1.useState)(false);
    const [socials, setSocials] = (0, react_1.useState)([]);
    const [select, setSelect] = (0, react_1.useState)([]);
    const [twitterMax, setTwitterMax] = (0, react_1.useState)([]);
    const [state, dispatch] = (0, react_1.useReducer)(Reducers_1.reducer, {
        value: [{ text: "", media: [] }],
    });
    const value = {
        twitterMax,
        setTwitterMax,
        twitterPreviewCounter,
        setTwitterPreviewCounter,
        state,
        dispatch,
        twitterCounter,
        setTwitterCounter,
        select,
        setSelect,
        preview,
        setPreview,
        image,
        setImage,
        target,
        setTarget,
        previewTarget,
        setPreviewTarget,
        twitterContent,
        facebookContent,
        linkedinContent,
        setTwitterContent,
        setFacebookContent,
        setLinkedinContent,
        twitterPicture,
        facebookPicture,
        linkedinPicture,
        setTwitterPicture,
        setFacebookPicture,
        setLinkedinPicture,
        socials,
        setSocials,
        instagramContent,
        setInstagramContent,
    };
    return (react_1.default.createElement(exports.dataContext.Provider, { value: value }, props.children));
};
exports.DataContextProvider = DataContextProvider;
