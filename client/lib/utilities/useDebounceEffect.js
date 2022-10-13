"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounceEffect = void 0;
const react_1 = require("react");
function useDebounceEffect(fn, waitTime, deps) {
    (0, react_1.useEffect)(() => {
        const t = setTimeout(() => {
            fn.apply(undefined, deps);
        }, waitTime);
        return () => {
            clearTimeout(t);
        };
    }, deps);
}
exports.useDebounceEffect = useDebounceEffect;
