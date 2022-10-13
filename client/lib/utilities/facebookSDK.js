"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInitFbSDK = void 0;
const react_1 = require("react");
const injectFbSDKScript = () => {
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode !== null && fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
};
const useInitFbSDK = () => {
    const [isInitialized, setIsInitialized] = (0, react_1.useState)(false);
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: "1232028627552604",
            cookie: true,
            autoLogAppEvents: true,
            xfbml: true,
            version: "v14.0",
        });
        window.FB.AppEvents.logPageView();
        setIsInitialized(true);
    };
    injectFbSDKScript();
};
exports.useInitFbSDK = useInitFbSDK;
