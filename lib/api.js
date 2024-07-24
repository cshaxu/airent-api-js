"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUpdateOneWith = exports.parseSearchWith = exports.parseGetOneWith = exports.parseGetOneSafeWith = exports.parseGetManyWith = exports.parseDeleteOneWith = exports.parseCreateOneWith = exports.executeUpdateOneWith = exports.executeSearchWith = exports.executeGetOneWith = exports.executeGetOneSafeWith = exports.executeGetManyWith = exports.executeDeleteOneWith = exports.executeCreateOneWith = exports.dispatchUpdateOneWith = exports.dispatchSearchWith = exports.dispatchGetOneWith = exports.dispatchGetOneSafeWith = exports.dispatchGetManyWith = exports.dispatchDeleteOneWith = exports.dispatchCreateOneWith = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
var dispatcher_1 = require("./dispatcher");
var utils_1 = require("./utils");
// api parsers
function parseGetManyWith(queryZod) {
    var _this = this;
    return function (data) { return __awaiter(_this, void 0, void 0, function () {
        var queryRaw, fieldRequestRaw, query, fieldRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryRaw = "query" in data ? data.query : undefined;
                    fieldRequestRaw = "fieldRequest" in data ? data.fieldRequest : undefined;
                    if ((0, utils_1.isNil)(queryRaw)) {
                        throw http_errors_1.default.BadRequest("Missing `query`");
                    }
                    if ((0, utils_1.isNil)(fieldRequestRaw)) {
                        throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
                    }
                    return [4 /*yield*/, queryZod.parseAsync(queryRaw)];
                case 1:
                    query = (_a.sent());
                    fieldRequest = fieldRequestRaw;
                    return [2 /*return*/, { query: query, fieldRequest: fieldRequest }];
            }
        });
    }); };
}
exports.parseGetManyWith = parseGetManyWith;
function parseGetOneWith(paramsZod) {
    var _this = this;
    return function (data) { return __awaiter(_this, void 0, void 0, function () {
        var paramsRaw, fieldRequestRaw, params, fieldRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paramsRaw = "params" in data ? data.params : undefined;
                    fieldRequestRaw = "fieldRequest" in data ? data.fieldRequest : undefined;
                    if ((0, utils_1.isNil)(paramsRaw)) {
                        throw http_errors_1.default.BadRequest("Missing `params`");
                    }
                    if ((0, utils_1.isNil)(fieldRequestRaw)) {
                        throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
                    }
                    return [4 /*yield*/, paramsZod.parseAsync(paramsRaw)];
                case 1:
                    params = (_a.sent());
                    fieldRequest = fieldRequestRaw;
                    return [2 /*return*/, { params: params, fieldRequest: fieldRequest }];
            }
        });
    }); };
}
exports.parseGetOneWith = parseGetOneWith;
function parseCreateOneWith(bodyZod) {
    var _this = this;
    return function (data) { return __awaiter(_this, void 0, void 0, function () {
        var bodyRaw, fieldRequest, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bodyRaw = "body" in data ? data.body : undefined;
                    fieldRequest = "fieldRequest" in data ? data.fieldRequest : undefined;
                    if (bodyRaw === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `body`");
                    }
                    if (fieldRequest === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
                    }
                    return [4 /*yield*/, bodyZod.parseAsync(bodyRaw)];
                case 1:
                    body = (_a.sent());
                    return [2 /*return*/, { body: body, fieldRequest: fieldRequest }];
            }
        });
    }); };
}
exports.parseCreateOneWith = parseCreateOneWith;
function parseUpdateOneWith(paramsZod, bodyZod) {
    var _this = this;
    return function (data) { return __awaiter(_this, void 0, void 0, function () {
        var paramsRaw, bodyRaw, fieldRequestRaw, params, body, fieldRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paramsRaw = "params" in data ? data.params : undefined;
                    bodyRaw = "body" in data ? data.body : undefined;
                    fieldRequestRaw = "fieldRequest" in data ? data.fieldRequest : undefined;
                    if ((0, utils_1.isNil)(paramsRaw)) {
                        throw http_errors_1.default.BadRequest("Missing `params`");
                    }
                    if ((0, utils_1.isNil)(bodyRaw)) {
                        throw http_errors_1.default.BadRequest("Missing `body`");
                    }
                    if ((0, utils_1.isNil)(fieldRequestRaw)) {
                        throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
                    }
                    return [4 /*yield*/, paramsZod.parseAsync(paramsRaw)];
                case 1:
                    params = (_a.sent());
                    return [4 /*yield*/, bodyZod.parseAsync(bodyRaw)];
                case 2:
                    body = (_a.sent());
                    fieldRequest = fieldRequestRaw;
                    return [2 /*return*/, { params: params, body: body, fieldRequest: fieldRequest }];
            }
        });
    }); };
}
exports.parseUpdateOneWith = parseUpdateOneWith;
// api executors
function executeGetManyWith(action) {
    return function (parsed, context) {
        return action(parsed.query, parsed.fieldRequest, context);
    };
}
exports.executeGetManyWith = executeGetManyWith;
function executeGetOneWith(action) {
    return function (parsed, context) {
        return action(parsed.params, parsed.fieldRequest, context);
    };
}
exports.executeGetOneWith = executeGetOneWith;
function executeCreateOneWith(action) {
    return function (parsed, context) {
        return action(parsed.body, parsed.fieldRequest, context);
    };
}
exports.executeCreateOneWith = executeCreateOneWith;
function executeUpdateOneWith(action) {
    return function (parsed, context) { return action(parsed.params, parsed.body, parsed.fieldRequest, context); };
}
exports.executeUpdateOneWith = executeUpdateOneWith;
// api dispatchers
function dispatchGetManyWith(config) {
    var parser = parseGetManyWith(config.queryZod);
    var executor = executeGetManyWith(config.action);
    return (0, dispatcher_1.dispatchWith)(__assign(__assign({}, config), { parser: parser, executor: executor }));
}
exports.dispatchGetManyWith = dispatchGetManyWith;
function dispatchGetOneWith(config) {
    var parser = parseGetOneWith(config.paramsZod);
    var executor = executeGetOneWith(config.action);
    return (0, dispatcher_1.dispatchWith)(__assign(__assign({}, config), { parser: parser, executor: executor }));
}
exports.dispatchGetOneWith = dispatchGetOneWith;
function dispatchCreateOneWith(config) {
    var parser = parseCreateOneWith(config.bodyZod);
    var executor = executeCreateOneWith(config.action);
    return (0, dispatcher_1.dispatchWith)(__assign(__assign({}, config), { parser: parser, executor: executor }));
}
exports.dispatchCreateOneWith = dispatchCreateOneWith;
function dispatchUpdateOneWith(config) {
    var parser = parseUpdateOneWith(config.paramsZod, config.bodyZod);
    var executor = executeUpdateOneWith(config.action);
    return (0, dispatcher_1.dispatchWith)(__assign(__assign({}, config), { parser: parser, executor: executor }));
}
exports.dispatchUpdateOneWith = dispatchUpdateOneWith;
// api aliases
var parseSearchWith = parseGetManyWith;
exports.parseSearchWith = parseSearchWith;
var parseGetOneSafeWith = parseGetOneWith;
exports.parseGetOneSafeWith = parseGetOneSafeWith;
var parseDeleteOneWith = parseGetOneWith;
exports.parseDeleteOneWith = parseDeleteOneWith;
var executeSearchWith = executeGetManyWith;
exports.executeSearchWith = executeSearchWith;
var executeGetOneSafeWith = executeGetOneWith;
exports.executeGetOneSafeWith = executeGetOneSafeWith;
var executeDeleteOneWith = executeGetOneWith;
exports.executeDeleteOneWith = executeDeleteOneWith;
var dispatchSearchWith = dispatchGetManyWith;
exports.dispatchSearchWith = dispatchSearchWith;
var dispatchGetOneSafeWith = dispatchGetOneWith;
exports.dispatchGetOneSafeWith = dispatchGetOneSafeWith;
var dispatchDeleteOneWith = dispatchGetOneWith;
exports.dispatchDeleteOneWith = dispatchDeleteOneWith;
//# sourceMappingURL=api.js.map