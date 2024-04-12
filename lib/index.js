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
exports.isNil = exports.handleUpdateOne = exports.handleGetOneSafe = exports.handleGetOne = exports.handleGetMany = exports.handleDeleteOne = exports.handleCreateOne = exports.handle = exports.getMin = exports.getMax = exports.fetchJsonOrThrow = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
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
                        throw (0, http_errors_1.default)(response.status, json.error);
                    }
                    return [2 /*return*/, json];
            }
        });
    });
}
exports.fetchJsonOrThrow = fetchJsonOrThrow;
function isNil(value) {
    return value === undefined || value === null;
}
exports.isNil = isNil;
function getMin(array) {
    return array.reduce(function (acc, value) {
        return isNil(value) ? acc : isNil(acc) ? value : acc < value ? acc : value;
    }, null);
}
exports.getMin = getMin;
function getMax(array) {
    return array.reduce(function (acc, value) {
        return isNil(value) ? acc : isNil(acc) ? value : acc > value ? acc : value;
    }, null);
}
exports.getMax = getMax;
// api handlers
function handleGetMany(config) {
    var _this = this;
    var parser = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, queryRaw, fieldRequest, query;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getRequestJson(request)];
                case 1:
                    _a = _b.sent(), queryRaw = _a.query, fieldRequest = _a.fieldRequest;
                    if (queryRaw === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `query`");
                    }
                    if (fieldRequest === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
                    }
                    return [4 /*yield*/, config.queryZod.parseAsync(queryRaw)];
                case 2:
                    query = (_b.sent());
                    return [2 /*return*/, { query: query, fieldRequest: fieldRequest }];
            }
        });
    }); };
    var executor = function (parsed, rc) { return config.action(parsed.query, rc, parsed.fieldRequest); };
    return handle(__assign(__assign({}, config), { parser: parser, executor: executor }));
}
exports.handleGetMany = handleGetMany;
function handleGetOne(config) {
    var _this = this;
    var parser = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, paramsRaw, fieldRequest, params;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getRequestJson(request)];
                case 1:
                    _a = _b.sent(), paramsRaw = _a.params, fieldRequest = _a.fieldRequest;
                    if (paramsRaw === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `params`");
                    }
                    if (fieldRequest === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
                    }
                    return [4 /*yield*/, config.paramsZod.parseAsync(paramsRaw)];
                case 2:
                    params = (_b.sent());
                    return [2 /*return*/, { params: params, fieldRequest: fieldRequest }];
            }
        });
    }); };
    var executor = function (parsed, rc) { return config.action(parsed.params, rc, parsed.fieldRequest); };
    return handle(__assign(__assign({}, config), { parser: parser, executor: executor }));
}
exports.handleGetOne = handleGetOne;
var handleGetOneSafe = handleGetOne;
exports.handleGetOneSafe = handleGetOneSafe;
function handleCreateOne(config) {
    var _this = this;
    var parser = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, bodyRaw, fieldRequest, body;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getRequestJson(request)];
                case 1:
                    _a = _b.sent(), bodyRaw = _a.body, fieldRequest = _a.fieldRequest;
                    if (bodyRaw === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `body`");
                    }
                    if (fieldRequest === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
                    }
                    return [4 /*yield*/, config.bodyZod.parseAsync(bodyRaw)];
                case 2:
                    body = (_b.sent());
                    return [2 /*return*/, { body: body, fieldRequest: fieldRequest }];
            }
        });
    }); };
    var executor = function (parsed, rc) { return config.action(parsed.body, rc, parsed.fieldRequest); };
    return handle(__assign(__assign({}, config), { parser: parser, executor: executor, code: 201 }));
}
exports.handleCreateOne = handleCreateOne;
function handleUpdateOne(config) {
    var _this = this;
    var parser = function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, paramsRaw, bodyRaw, fieldRequest, params, body;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getRequestJson(request)];
                case 1:
                    _a = _b.sent(), paramsRaw = _a.params, bodyRaw = _a.body, fieldRequest = _a.fieldRequest;
                    if (paramsRaw === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `params`");
                    }
                    if (bodyRaw === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `body`");
                    }
                    if (fieldRequest === undefined) {
                        throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
                    }
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
    var executor = function (parsed, rc) { return config.action(parsed.params, parsed.body, rc, parsed.fieldRequest); };
    return handle(__assign(__assign({}, config), { parser: parser, executor: executor }));
}
exports.handleUpdateOne = handleUpdateOne;
var handleDeleteOne = handleGetOne;
exports.handleDeleteOne = handleDeleteOne;
function getRequestJson(request) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, request.json()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    throw http_errors_1.default.BadRequest(error_1.message);
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Note: request => authenticate => parse => execute => respond
function handle(config) {
    var _this = this;
    return function (request) { return __awaiter(_this, void 0, void 0, function () {
        var rc, parsed, result, error_2, method, url, context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rc = null;
                    parsed = null;
                    result = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    kill();
                    return [4 /*yield*/, config.authenticator(request)];
                case 2:
                    rc = _a.sent();
                    return [4 /*yield*/, config.parser(request, rc)];
                case 3:
                    parsed = _a.sent();
                    if (!(config.validator !== undefined)) return [3 /*break*/, 5];
                    return [4 /*yield*/, config.validator(parsed, rc, config.options)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, config.executor(parsed, rc)];
                case 6:
                    result = _a.sent();
                    return [2 /*return*/, respond(result, config.code)];
                case 7:
                    error_2 = _a.sent();
                    if (config.errorHandler === undefined) {
                        throw error_2;
                    }
                    else {
                        method = request.method, url = request.url;
                        context = { method: method, url: url, rc: rc, parsed: parsed, result: result };
                        return [2 /*return*/, config.errorHandler(error_2, context)];
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
}
exports.handle = handle;
function kill() {
    if (process.env.KILL_SWITCH) {
        throw http_errors_1.default.ServiceUnavailable();
    }
}
function respond(result, status) {
    if (status === void 0) { status = 200; }
    if (isReadableStream(result)) {
        var headers = { "Content-Type": "text/plain" };
        return new Response(result, { headers: headers });
    }
    return Response.json(result, { status: status });
}
function isReadableStream(object) {
    return (object instanceof ReadableStream ||
        (!isNil(object) &&
            isFunction(object.cancel) &&
            isFunction(object.cancel) &&
            isFunction(object.getReader) &&
            isFunction(object.pipeTo) &&
            isFunction(object.pipeThrough) &&
            isFunction(object.tee)));
}
var isFunction = function (object) { return typeof object === "function"; };
//# sourceMappingURL=index.js.map