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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports.shuffle = exports.round = exports.race = exports.queryStringify = exports.purify = exports.popular = exports.mockReadableStream = exports.min = exports.max = exports.isUrl = exports.isReadableStream = exports.isNil = exports.isFunction = exports.getJsonOrThrow = exports.fetchJsonOrThrow = exports.existify = exports.buildJsonRequestInit = exports.bufferify = void 0;
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
    return array.filter((o) => !isNil(o)).map((o) => o);
}
exports.existify = existify;
function purify(object) {
    Object.keys(object)
        .filter((key) => object[key] === undefined)
        .forEach((key) => delete object[key]);
    return object;
}
exports.purify = purify;
function shuffle(array) {
    let i = array.length;
    // While there remain elements to shuffle.
    while (i > 0) {
        // Pick a remaining element.
        const j = Math.floor(Math.random() * i--);
        // And swap it with the current element.
        [array[i], array[j]] = [array[j], array[i]];
    }
}
exports.shuffle = shuffle;
// container stats
function min(array) {
    return array.reduce((acc, value) => isNil(value) ? acc : isNil(acc) ? value : acc < value ? acc : value, null);
}
exports.min = min;
function max(array) {
    return array.reduce((acc, value) => isNil(value) ? acc : isNil(acc) ? value : acc > value ? acc : value, null);
}
exports.max = max;
function popular(array) {
    const frequency = new Map();
    let maxElement = null;
    let maxCount = 0;
    array.forEach((element) => {
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
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.wait = wait;
// https://blog.jcore.com/2016/12/promise-me-you-wont-use-promise-race/
function race(promises) {
    const array = Array.from(promises);
    if (!array.length) {
        return Promise.reject("Insufficient promises.");
    }
    // There is no way to know which promise is resolved/rejected.
    // So we map it to a new promise to return the index wether it fails or succeeeds.
    const indexPromises = array.map((promise, index) => promise.then(() => index, () => {
        throw index;
    }));
    return Promise.race(indexPromises);
}
exports.race = race;
// stream
function bufferify(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on("data", (chunk) => {
                chunks.push(chunk);
            });
            stream.on("end", () => {
                const buffer = Buffer.concat(chunks);
                resolve(buffer);
            });
            stream.on("error", (err) => {
                reject(err);
            });
        });
    });
}
exports.bufferify = bufferify;
function mockReadableStream(content) {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(content);
    const underlyingSource = {
        start(controller) {
            controller.enqueue(uint8Array);
            controller.close();
        },
    };
    return new ReadableStream(underlyingSource);
}
exports.mockReadableStream = mockReadableStream;
// http
function queryStringify(query) {
    const urlSearchParams = new URLSearchParams();
    Object.keys(query).forEach((key) => {
        if (query[key] instanceof Date) {
            urlSearchParams.append(key, query[key].toISOString());
        }
        else if (!Array.isArray(query[key])) {
            urlSearchParams.append(key, query[key]);
        }
    });
    const nonArrayQuery = urlSearchParams.toString();
    const arrayQuery = Object.keys(query)
        .filter((key) => Array.isArray(query[key]))
        .map((key) => query[key].map((value) => `${key}[]=${encodeURIComponent(value)}`))
        .flat()
        .join("&");
    return [nonArrayQuery, arrayQuery].filter((s) => s.length > 0).join("&");
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
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(input, init);
        return yield getJsonOrThrow(response);
    });
}
exports.fetchJsonOrThrow = fetchJsonOrThrow;
function getJsonOrThrow(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = yield response.json();
        if (json.error) {
            throw new Error(json.error.message);
        }
        return json;
    });
}
exports.getJsonOrThrow = getJsonOrThrow;
function buildJsonRequestInit(data, options = {}) {
    const body = JSON.stringify(data);
    const headers = buildHeaders(body.length, options.headers);
    return Object.assign(Object.assign({ credentials: "include", method: "POST", body }, options), { headers });
}
exports.buildJsonRequestInit = buildJsonRequestInit;
function buildHeaders(length, headers) {
    const entries = headers === undefined ? [] : getHeaderEntries(headers);
    const results = entries
        .filter(([k]) => !["content-type", "content-length"].includes(k.toLowerCase()))
        .reduce((acc, [k, v]) => (Object.assign(Object.assign({}, acc), { [k]: v })), {
        "content-type": "application/json",
        "content-length": length.toString(),
    });
    return new Headers(results);
}
function getHeaderEntries(headers) {
    if (headers instanceof Headers) {
        return Array.from(headers.entries());
    }
    if (Array.isArray(headers)) {
        return headers;
    }
    return Object.entries(headers);
}
// number
function round(value, digits) {
    const base = Math.pow(10, digits);
    return Math.round(value * base) / base;
}
exports.round = round;
//# sourceMappingURL=utils.js.map