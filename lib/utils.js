"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports.shuffle = exports.round = exports.race = exports.queryStringify = exports.purify = exports.popular = exports.mockReadableStream = exports.min = exports.max = exports.isUrl = exports.isReadableStream = exports.isNil = exports.isFunction = exports.fetchJsonOrThrow = exports.existify = exports.bufferify = void 0;
// type checks
function isFunction(value) {
    return typeof value === "function";
}
exports.isFunction = isFunction;
function isNil(value) {
    return value === undefined || value === null;
}
exports.isNil = isNil;
function isReadableStream(value) {
    return (value instanceof ReadableStream ||
        (!isNil(value) &&
            isFunction(value.cancel) &&
            isFunction(value.cancel) &&
            isFunction(value.getReader) &&
            isFunction(value.pipeTo) &&
            isFunction(value.pipeThrough) &&
            isFunction(value.tee)));
}
exports.isReadableStream = isReadableStream;
// container modifications
function existify(array) {
    return array.filter(function (o) { return !isNil(o); }).map(function (o) { return o; });
}
exports.existify = existify;
function purify(object) {
    Object.keys(object)
        .filter(function (key) { return object[key] === undefined; })
        .forEach(function (key) { return delete object[key]; });
    return object;
}
exports.purify = purify;
function shuffle(array) {
    var _a;
    var i = array.length;
    // While there remain elements to shuffle.
    while (i > 0) {
        // Pick a remaining element.
        var j = Math.floor(Math.random() * i--);
        // And swap it with the current element.
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
}
exports.shuffle = shuffle;
// container stats
function min(array) {
    return array.reduce(function (acc, value) {
        return isNil(value) ? acc : isNil(acc) ? value : acc < value ? acc : value;
    }, null);
}
exports.min = min;
function max(array) {
    return array.reduce(function (acc, value) {
        return isNil(value) ? acc : isNil(acc) ? value : acc > value ? acc : value;
    }, null);
}
exports.max = max;
function popular(array) {
    var frequency = new Map();
    var maxElement = null;
    var maxCount = 0;
    array.forEach(function (element) {
        var _a;
        frequency.set(element, ((_a = frequency.get(element)) !== null && _a !== void 0 ? _a : 0) + 1);
        if (frequency.get(element) > maxCount) {
            maxElement = element;
            maxCount = frequency.get(element);
        }
    });
    return maxElement;
}
exports.popular = popular;
// promises
function wait(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.wait = wait;
// https://blog.jcore.com/2016/12/promise-me-you-wont-use-promise-race/
function race(promises) {
    var array = Array.from(promises);
    if (!array.length) {
        return Promise.reject("Insufficient promises.");
    }
    // There is no way to know which promise is resolved/rejected.
    // So we map it to a new promise to return the index wether it fails or succeeeds.
    var indexPromises = array.map(function (promise, index) {
        return promise.then(function () { return index; }, function () {
            throw index;
        });
    });
    return Promise.race(indexPromises);
}
exports.race = race;
// stream
function bufferify(stream) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var chunks = [];
                    stream.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                    stream.on("end", function () {
                        var buffer = Buffer.concat(chunks);
                        resolve(buffer);
                    });
                    stream.on("error", function (err) {
                        reject(err);
                    });
                })];
        });
    });
}
exports.bufferify = bufferify;
function mockReadableStream(content) {
    var encoder = new TextEncoder();
    var uint8Array = encoder.encode(content);
    var underlyingSource = {
        start: function (controller) {
            controller.enqueue(uint8Array);
            controller.close();
        },
    };
    return new ReadableStream(underlyingSource);
}
exports.mockReadableStream = mockReadableStream;
// url
function queryStringify(query) {
    var urlSearchParams = new URLSearchParams();
    Object.keys(query).forEach(function (key) {
        if (query[key] instanceof Date) {
            urlSearchParams.append(key, query[key].toISOString());
        }
        else if (!Array.isArray(query[key])) {
            urlSearchParams.append(key, query[key]);
        }
    });
    var nonArrayQuery = urlSearchParams.toString();
    var arrayQuery = Object.keys(query)
        .filter(function (key) { return Array.isArray(query[key]); })
        .map(function (key) {
        return query[key].map(function (value) { return "".concat(key, "[]=").concat(encodeURIComponent(value)); });
    })
        .flat()
        .join("&");
    return [nonArrayQuery, arrayQuery].filter(function (s) { return s.length > 0; }).join("&");
}
exports.queryStringify = queryStringify;
function isUrl(text) {
    try {
        new URL(text);
        return true;
    }
    catch (_) {
        return false;
    }
}
exports.isUrl = isUrl;
function fetchJsonOrThrow(input, init) {
    return __awaiter(this, void 0, void 0, function () {
        var response, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(input, init)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _a.sent();
                    if (json.error) {
                        throw new Error(json.error.message);
                    }
                    return [2 /*return*/, json];
            }
        });
    });
}
exports.fetchJsonOrThrow = fetchJsonOrThrow;
// number
function round(value, digits) {
    var base = Math.pow(10, digits);
    return Math.round(value * base) / base;
}
exports.round = round;
//# sourceMappingURL=utils.js.map