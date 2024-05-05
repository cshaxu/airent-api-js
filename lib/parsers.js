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
exports.parseQueryWith = exports.parseQuery = exports.parseFormWith = exports.parseForm = exports.parseBodyWith = exports.parseBody = void 0;
var z = __importStar(require("zod"));
var parseBodyWith = function (bodyZod) {
    return function (request) {
        return parseBody(request, bodyZod);
    };
};
exports.parseBodyWith = parseBodyWith;
function parseBody(request, bodyZod) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.json().then(bodyZod.parseAsync)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.parseBody = parseBody;
var parseQueryWith = function (queryZod, arrayKeys) {
    return function (request) {
        return parseQuery(request, queryZod, arrayKeys);
    };
};
exports.parseQueryWith = parseQueryWith;
function parseQuery(request, queryZod, arrayKeys) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    searchParams = new URL(request.url).searchParams;
                    return [4 /*yield*/, parse(searchParams, queryZod, arrayKeys)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.parseQuery = parseQuery;
var parseFormWith = function (bodyZod, arrayKeys) {
    return function (request) {
        return parseForm(request, bodyZod, arrayKeys);
    };
};
exports.parseFormWith = parseFormWith;
function parseForm(request, bodyZod, arrayKeys) {
    return __awaiter(this, void 0, void 0, function () {
        var formData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request
                        .formData()
                        .then(function (data) { return data; })];
                case 1:
                    formData = _a.sent();
                    return [4 /*yield*/, parse(formData, bodyZod, arrayKeys)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.parseForm = parseForm;
function parse(urlSearchParams, zodObject, arrayKeys) {
    return __awaiter(this, void 0, void 0, function () {
        var parsedRaw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    arrayKeys = arrayKeys === undefined ? getArrayKeys(zodObject) : arrayKeys;
                    parsedRaw = buildObject(urlSearchParams, arrayKeys);
                    return [4 /*yield*/, zodObject.parseAsync(parsedRaw)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getArrayKeys(zodObject) {
    var keys = Object.keys(zodObject.shape);
    return keys.filter(function (key) { return isZodArray(zodObject.shape[key]); });
}
function isZodArray(zodType) {
    var zt = zodType;
    while (zt instanceof z.ZodOptional || zt instanceof z.ZodNullable) {
        zt = zt._def.innerType;
    }
    return zt instanceof z.ZodArray;
}
function buildObject(urlSearchParams, arrayKeys) {
    return Array.from(urlSearchParams.keys()).reduce(function (acc, key) {
        var k = key.endsWith("[]") ? key.slice(0, -2) : key;
        if (arrayKeys.includes(k)) {
            var value = urlSearchParams.getAll(key);
            if (value.length > 0) {
                acc[k] = value;
            }
        }
        else {
            var value = urlSearchParams.get(key);
            if (value !== null) {
                acc[k] = value;
            }
        }
        return acc;
    }, {});
}
//# sourceMappingURL=parsers.js.map