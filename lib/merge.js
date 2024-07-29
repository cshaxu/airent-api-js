"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge9 = exports.merge8 = exports.merge7 = exports.merge6 = exports.merge5 = exports.merge4 = exports.merge3 = exports.merge2 = exports.merge1 = void 0;
const utils_1 = require("./utils");
const isBoolean = (object) => typeof object === "boolean";
const isBothBooleans = (o1, o2) => isBoolean(o1) && isBoolean(o2);
const isObject = (object) => typeof object === "object" && !Array.isArray(object);
const isBothObjects = (o1, o2) => isObject(o1) && isObject(o2);
const isBooleanOrObject = (object) => isBoolean(object) || isObject(object);
function mergeInternal(o1, o2) {
    if (isBothBooleans(o1, o2)) {
        return true;
    }
    if (isBothObjects(o1, o2)) {
        const keys1 = Object.keys(o1);
        const keys2 = Object.keys(o2);
        const result = {};
        new Set([...keys1, ...keys2]).forEach((k) => {
            const v1 = o1[k];
            const v2 = o2[k];
            if ((0, utils_1.isNil)(v1)) {
                /* only o2 has k */
                if (isBooleanOrObject(v2)) {
                    result[k] = v2;
                }
            }
            else if ((0, utils_1.isNil)(v2)) {
                /* only o1 has k */
                if (isBooleanOrObject(v1)) {
                    result[k] = v1;
                }
            }
            else {
                result[k] = mergeInternal(v1, v2);
            }
        });
        return result;
    }
    throw new Error("both arguments must be booleans or objects");
}
function merge1(o1) {
    if (isObject(o1)) {
        return o1;
    }
    throw new Error("argument must be object");
}
exports.merge1 = merge1;
function merge2(o1, o2) {
    if (isBothObjects(o1, o2)) {
        return mergeInternal(o1, o2);
    }
    throw new Error("both arguments must be objects");
}
exports.merge2 = merge2;
const merge3 = (o1, o2, o3) => merge2(merge2(o1, o2), o3);
exports.merge3 = merge3;
const merge4 = (o1, o2, o3, o4) => merge2(merge2(o1, o2), merge2(o3, o4));
exports.merge4 = merge4;
const merge5 = (o1, o2, o3, o4, o5) => merge3(merge2(o1, o2), merge2(o3, o4), o5);
exports.merge5 = merge5;
const merge6 = (o1, o2, o3, o4, o5, o6) => merge3(merge2(o1, o2), merge2(o3, o4), merge2(o5, o6));
exports.merge6 = merge6;
const merge7 = (o1, o2, o3, o4, o5, o6, o7) => merge4(merge2(o1, o2), merge2(o3, o4), merge2(o5, o6), o7);
exports.merge7 = merge7;
const merge8 = (o1, o2, o3, o4, o5, o6, o7, o8) => merge4(merge2(o1, o2), merge2(o3, o4), merge2(o5, o6), merge2(o7, o8));
exports.merge8 = merge8;
const merge9 = (o1, o2, o3, o4, o5, o6, o7, o8, o9) => merge5(merge2(o1, o2), merge2(o3, o4), merge2(o5, o6), merge2(o7, o8), o9);
exports.merge9 = merge9;
//# sourceMappingURL=merge.js.map