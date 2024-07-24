"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge9 = exports.merge8 = exports.merge7 = exports.merge6 = exports.merge5 = exports.merge4 = exports.merge3 = exports.merge2 = exports.merge1 = void 0;
var utils_1 = require("./utils");
var isBoolean = function (object) { return typeof object === "boolean"; };
var isBothBooleans = function (o1, o2) { return isBoolean(o1) && isBoolean(o2); };
var isObject = function (object) {
    return typeof object === "object" && !Array.isArray(object);
};
var isBothObjects = function (o1, o2) { return isObject(o1) && isObject(o2); };
var isBooleanOrObject = function (object) {
    return isBoolean(object) || isObject(object);
};
function mergeInternal(o1, o2) {
    if (isBothBooleans(o1, o2)) {
        return true;
    }
    if (isBothObjects(o1, o2)) {
        var keys1 = Object.keys(o1);
        var keys2 = Object.keys(o2);
        var result_1 = {};
        new Set(__spreadArray(__spreadArray([], keys1, true), keys2, true)).forEach(function (k) {
            var v1 = o1[k];
            var v2 = o2[k];
            if ((0, utils_1.isNil)(v1)) {
                /* only o2 has k */
                if (isBooleanOrObject(v2)) {
                    result_1[k] = v2;
                }
            }
            else if ((0, utils_1.isNil)(v2)) {
                /* only o1 has k */
                if (isBooleanOrObject(v1)) {
                    result_1[k] = v1;
                }
            }
            else {
                result_1[k] = mergeInternal(v1, v2);
            }
        });
        return result_1;
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
var merge3 = function (o1, o2, o3) { return merge2(merge2(o1, o2), o3); };
exports.merge3 = merge3;
var merge4 = function (o1, o2, o3, o4) {
    return merge2(merge2(o1, o2), merge2(o3, o4));
};
exports.merge4 = merge4;
var merge5 = function (o1, o2, o3, o4, o5) {
    return merge3(merge2(o1, o2), merge2(o3, o4), o5);
};
exports.merge5 = merge5;
var merge6 = function (o1, o2, o3, o4, o5, o6) {
    return merge3(merge2(o1, o2), merge2(o3, o4), merge2(o5, o6));
};
exports.merge6 = merge6;
var merge7 = function (o1, o2, o3, o4, o5, o6, o7) {
    return merge4(merge2(o1, o2), merge2(o3, o4), merge2(o5, o6), o7);
};
exports.merge7 = merge7;
var merge8 = function (o1, o2, o3, o4, o5, o6, o7, o8) {
    return merge4(merge2(o1, o2), merge2(o3, o4), merge2(o5, o6), merge2(o7, o8));
};
exports.merge8 = merge8;
var merge9 = function (o1, o2, o3, o4, o5, o6, o7, o8, o9) {
    return merge5(merge2(o1, o2), merge2(o3, o4), merge2(o5, o6), merge2(o7, o8), o9);
};
exports.merge9 = merge9;
//# sourceMappingURL=merge.js.map