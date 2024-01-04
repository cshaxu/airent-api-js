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
exports.handleUpdateOne = exports.handleSearch = exports.handleGetOne = exports.handleGetMany = exports.handleDeleteOne = exports.handleCreateOne = exports.getMin = exports.getMax = exports.dispatch = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
var lodash_1 = require("lodash");
var zod_1 = require("zod");
function getMin(array) {
    return array.reduce(function (acc, value) {
        return (0, lodash_1.isNil)(value) ? acc : (0, lodash_1.isNil)(acc) ? value : acc < value ? acc : value;
    }, null);
}
exports.getMin = getMin;
function getMax(array) {
    return array.reduce(function (acc, value) {
        return (0, lodash_1.isNil)(value) ? acc : (0, lodash_1.isNil)(acc) ? value : acc > value ? acc : value;
    }, null);
}
exports.getMax = getMax;
// api handlers
function handleGetMany(config) {
    var _this = this;
    var validator = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, queryRaw, fieldRequest, query;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, request.json()];
                case 1:
                    _a = _b.sent(), queryRaw = _a.query, fieldRequest = _a.fieldRequest;
                    return [4 /*yield*/, config.queryZod.parseAsync(queryRaw)];
                case 2:
                    query = (_b.sent());
                    return [2 /*return*/, { query: query, fieldRequest: fieldRequest }];
            }
        });
    }); };
    var executor = function (parsed, rc) { return config.apiExecutor(parsed.query, rc, parsed.fieldRequest); };
    return function (request) {
        return dispatch(config.authenticator, validator, executor, request, config.options);
    };
}
exports.handleGetMany = handleGetMany;
var handleSearch = handleGetMany;
exports.handleSearch = handleSearch;
function handleGetOne(config) {
    var _this = this;
    var validator = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, paramsRaw, fieldRequest, params;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, request.json()];
                case 1:
                    _a = _b.sent(), paramsRaw = _a.params, fieldRequest = _a.fieldRequest;
                    return [4 /*yield*/, config.paramsZod.parseAsync(paramsRaw)];
                case 2:
                    params = (_b.sent());
                    return [2 /*return*/, { params: params, fieldRequest: fieldRequest }];
            }
        });
    }); };
    var executor = function (parsed, rc) { return config.apiExecutor(parsed.params, rc, parsed.fieldRequest); };
    return function (request) {
        return dispatch(config.authenticator, validator, executor, request, config.options);
    };
}
exports.handleGetOne = handleGetOne;
function handleCreateOne(config) {
    var _this = this;
    var validator = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, bodyRaw, fieldRequest, body;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, request.json()];
                case 1:
                    _a = _b.sent(), bodyRaw = _a.body, fieldRequest = _a.fieldRequest;
                    return [4 /*yield*/, config.bodyZod.parseAsync(bodyRaw)];
                case 2:
                    body = (_b.sent());
                    return [2 /*return*/, { body: body, fieldRequest: fieldRequest }];
            }
        });
    }); };
    var executor = function (parsed, rc) { return config.apiExecutor(parsed.body, rc, parsed.fieldRequest); };
    return function (request) {
        return dispatch(config.authenticator, validator, executor, request, config.options);
    };
}
exports.handleCreateOne = handleCreateOne;
function handleUpdateOne(config) {
    var _this = this;
    var validator = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, paramsRaw, bodyRaw, fieldRequest, params, body;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, request.json()];
                case 1:
                    _a = _b.sent(), paramsRaw = _a.params, bodyRaw = _a.body, fieldRequest = _a.fieldRequest;
                    return [4 /*yield*/, config.paramsZod.parseAsync(paramsRaw)];
                case 2:
                    params = (_b.sent());
                    return [4 /*yield*/, config.bodyZod.parseAsync(bodyRaw)];
                case 3:
                    body = (_b.sent());
                    return [2 /*return*/, { params: params, body: body, fieldRequest: fieldRequest }];
            }
        });
    }); };
    var executor = function (parsed, rc) { return config.apiExecutor(parsed.params, parsed.body, rc, parsed.fieldRequest); };
    return function (request) {
        return dispatch(config.authenticator, validator, executor, request, config.options);
    };
}
exports.handleUpdateOne = handleUpdateOne;
var handleDeleteOne = handleGetOne;
exports.handleDeleteOne = handleDeleteOne;
// Note: request => validate => execute => response
function dispatch(authenticate, validate, execute, request, options) {
    return __awaiter(this, void 0, void 0, function () {
        var rc, parsed, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rc = null;
                    parsed = null;
                    result = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    kill();
                    return [4 /*yield*/, authenticate(request.headers, options)];
                case 2:
                    rc = _a.sent();
                    return [4 /*yield*/, validate(request, rc)];
                case 3:
                    parsed = _a.sent();
                    return [4 /*yield*/, execute(parsed, rc)];
                case 4:
                    result = _a.sent();
                    return [2 /*return*/, respond(result)];
                case 5:
                    error_1 = _a.sent();
                    record(error_1, request, rc, parsed, result);
                    return [2 /*return*/, handle(error_1)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.dispatch = dispatch;
function kill() {
    if (process.env.KILL_SWITCH) {
        throw http_errors_1.default.ServiceUnavailable();
    }
}
function respond(result) {
    if (isReadableStream(result)) {
        var headers = { "Content-Type": "text/plain" };
        return new Response(result, { headers: headers });
    }
    return Response.json(result, { status: 200 });
}
function isReadableStream(object) {
    return (object instanceof ReadableStream ||
        (isFunction(object.cancel) &&
            isFunction(object.cancel) &&
            isFunction(object.getReader) &&
            isFunction(object.pipeTo) &&
            isFunction(object.pipeThrough) &&
            isFunction(object.tee)));
}
var isFunction = function (object) { return typeof object === "function"; };
function record(error, request, rc, parsed, result) {
    var method = request.method, url = request.url;
    var requestLog = { method: method, url: url, rc: rc, parsed: parsed, result: result };
    var errorLog = __assign(__assign(__assign({}, ((error === null || error === void 0 ? void 0 : error.name) && { name: error === null || error === void 0 ? void 0 : error.name })), ((error === null || error === void 0 ? void 0 : error.message) && { message: error === null || error === void 0 ? void 0 : error.message })), ((error === null || error === void 0 ? void 0 : error.stack) && { stack: error === null || error === void 0 ? void 0 : error.stack }));
    console.error("[ERROR] ".concat(JSON.stringify({ request: requestLog, error: errorLog })));
}
function handle(error) {
    if (error instanceof zod_1.ZodError) {
        return Response.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof http_errors_1.default.HttpError) {
        return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
}
//# sourceMappingURL=index.js.map