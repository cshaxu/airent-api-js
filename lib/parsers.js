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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.parseQueryWith = exports.parseFormWith = exports.parseBodyWith = void 0;
exports.parseBody = parseBody;
exports.parseForm = parseForm;
exports.parseQuery = parseQuery;
const z = __importStar(require("zod"));
const parseBodyWith = (bodyZod) => (request) => parseBody(request, bodyZod);
exports.parseBodyWith = parseBodyWith;
function parseBody(request, bodyZod) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request.json().then(bodyZod.parseAsync);
    });
}
const parseQueryWith = (queryZod, arrayKeys) => (request) => parseQuery(request, queryZod, arrayKeys);
exports.parseQueryWith = parseQueryWith;
function parseQuery(request, queryZod, arrayKeys) {
    return __awaiter(this, void 0, void 0, function* () {
        const { searchParams } = new URL(request.url);
        return yield parse(searchParams, queryZod, arrayKeys);
    });
}
const parseFormWith = (bodyZod, arrayKeys) => (request) => parseForm(request, bodyZod, arrayKeys);
exports.parseFormWith = parseFormWith;
function parseForm(request, bodyZod, arrayKeys) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = yield request
            .formData()
            .then((data) => data);
        return yield parse(formData, bodyZod, arrayKeys);
    });
}
function parse(urlSearchParams, zodObject, arrayKeys) {
    return __awaiter(this, void 0, void 0, function* () {
        arrayKeys = arrayKeys === undefined ? getArrayKeys(zodObject) : arrayKeys;
        const parsedRaw = buildObject(urlSearchParams, arrayKeys);
        return yield zodObject.parseAsync(parsedRaw);
    });
}
function getArrayKeys(zodObject) {
    const keys = Object.keys(zodObject.shape);
    return keys.filter((key) => isZodArray(zodObject.shape[key]));
}
function isZodArray(zodType) {
    let zt = zodType;
    while (zt instanceof z.ZodOptional || zt instanceof z.ZodNullable) {
        zt = zt.unwrap();
    }
    return zt instanceof z.ZodArray;
}
function buildObject(urlSearchParams, arrayKeys) {
    return Array.from(urlSearchParams.keys()).reduce((acc, key) => {
        const k = key.endsWith("[]") ? key.slice(0, -2) : key;
        if (arrayKeys.includes(k)) {
            const value = urlSearchParams.getAll(key);
            if (value.length > 0) {
                acc[k] = value;
            }
        }
        else {
            const value = urlSearchParams.get(key);
            if (value !== null) {
                acc[k] = value;
            }
        }
        return acc;
    }, {});
}
//# sourceMappingURL=parsers.js.map