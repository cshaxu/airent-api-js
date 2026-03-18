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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchWith = exports.parseGetOneSafeWith = exports.parseDeleteOneWith = exports.executeSearchWith = exports.executeGetOneSafeWith = exports.executeDeleteOneWith = exports.dispatchSearchWith = exports.dispatchGetOneSafeWith = exports.dispatchDeleteOneWith = void 0;
exports.dispatchCreateOneWith = dispatchCreateOneWith;
exports.dispatchGetManyWith = dispatchGetManyWith;
exports.dispatchGetOneWith = dispatchGetOneWith;
exports.dispatchUpdateOneWith = dispatchUpdateOneWith;
exports.executeCreateOneWith = executeCreateOneWith;
exports.executeGetManyWith = executeGetManyWith;
exports.executeGetOneWith = executeGetOneWith;
exports.executeUpdateOneWith = executeUpdateOneWith;
exports.parseCreateOneWith = parseCreateOneWith;
exports.parseGetManyWith = parseGetManyWith;
exports.parseGetOneWith = parseGetOneWith;
exports.parseUpdateOneWith = parseUpdateOneWith;
const http_errors_1 = __importDefault(require("http-errors"));
const dispatcher_1 = require("./dispatcher");
const utils_1 = require("./utils");
// api parsers
function parseGetManyWith(queryZod) {
    return (data) => __awaiter(this, void 0, void 0, function* () {
        const queryRaw = "query" in data ? data.query : undefined;
        const fieldRequestRaw = "fieldRequest" in data ? data.fieldRequest : undefined;
        if ((0, utils_1.isNil)(queryRaw)) {
            throw http_errors_1.default.BadRequest("Missing `query`");
        }
        if ((0, utils_1.isNil)(fieldRequestRaw)) {
            throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
        }
        const query = (yield queryZod.parseAsync(queryRaw));
        const fieldRequest = fieldRequestRaw;
        return { query, fieldRequest };
    });
}
function parseGetOneWith(paramsZod) {
    return (data) => __awaiter(this, void 0, void 0, function* () {
        const paramsRaw = "params" in data ? data.params : undefined;
        const fieldRequestRaw = "fieldRequest" in data ? data.fieldRequest : undefined;
        if ((0, utils_1.isNil)(paramsRaw)) {
            throw http_errors_1.default.BadRequest("Missing `params`");
        }
        if ((0, utils_1.isNil)(fieldRequestRaw)) {
            throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
        }
        const params = (yield paramsZod.parseAsync(paramsRaw));
        const fieldRequest = fieldRequestRaw;
        return { params, fieldRequest };
    });
}
function parseCreateOneWith(bodyZod) {
    return (data) => __awaiter(this, void 0, void 0, function* () {
        const bodyRaw = "body" in data ? data.body : undefined;
        const fieldRequestRaw = "fieldRequest" in data ? data.fieldRequest : undefined;
        if (bodyRaw === undefined) {
            throw http_errors_1.default.BadRequest("Missing `body`");
        }
        if (fieldRequestRaw === undefined) {
            throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
        }
        const body = (yield bodyZod.parseAsync(bodyRaw));
        const fieldRequest = fieldRequestRaw;
        return { body, fieldRequest };
    });
}
function parseUpdateOneWith(paramsZod, bodyZod) {
    return (data) => __awaiter(this, void 0, void 0, function* () {
        const paramsRaw = "params" in data ? data.params : undefined;
        const bodyRaw = "body" in data ? data.body : undefined;
        const fieldRequestRaw = "fieldRequest" in data ? data.fieldRequest : undefined;
        if ((0, utils_1.isNil)(paramsRaw)) {
            throw http_errors_1.default.BadRequest("Missing `params`");
        }
        if ((0, utils_1.isNil)(bodyRaw)) {
            throw http_errors_1.default.BadRequest("Missing `body`");
        }
        if ((0, utils_1.isNil)(fieldRequestRaw)) {
            throw http_errors_1.default.BadRequest("Missing `fieldRequest`");
        }
        const params = (yield paramsZod.parseAsync(paramsRaw));
        const body = (yield bodyZod.parseAsync(bodyRaw));
        const fieldRequest = fieldRequestRaw;
        return { params, body, fieldRequest };
    });
}
const parseSearchWith = parseGetManyWith;
exports.parseSearchWith = parseSearchWith;
const parseGetOneSafeWith = parseGetOneWith;
exports.parseGetOneSafeWith = parseGetOneSafeWith;
const parseDeleteOneWith = parseGetOneWith;
exports.parseDeleteOneWith = parseDeleteOneWith;
// api executors
function executeGetManyWith(action) {
    return (parsed, context) => action(parsed.query, parsed.fieldRequest, context);
}
function executeGetOneWith(action) {
    return (parsed, context) => action(parsed.params, parsed.fieldRequest, context);
}
function executeCreateOneWith(action) {
    return (parsed, context) => action(parsed.body, parsed.fieldRequest, context);
}
function executeUpdateOneWith(action) {
    return (parsed, context) => action(parsed.params, parsed.body, parsed.fieldRequest, context);
}
const executeSearchWith = executeGetManyWith;
exports.executeSearchWith = executeSearchWith;
const executeGetOneSafeWith = executeGetOneWith;
exports.executeGetOneSafeWith = executeGetOneSafeWith;
const executeDeleteOneWith = executeGetOneWith;
exports.executeDeleteOneWith = executeDeleteOneWith;
// api dispatchers
function dispatchGetManyWith(config) {
    const parser = parseGetManyWith(config.queryZod);
    const executor = executeGetManyWith(config.action);
    return (0, dispatcher_1.dispatchWith)(Object.assign(Object.assign({}, config), { parser, executor }));
}
function dispatchGetOneWith(config) {
    const parser = parseGetOneWith(config.paramsZod);
    const executor = executeGetOneWith(config.action);
    return (0, dispatcher_1.dispatchWith)(Object.assign(Object.assign({}, config), { parser, executor }));
}
function dispatchCreateOneWith(config) {
    const parser = parseCreateOneWith(config.bodyZod);
    const executor = executeCreateOneWith(config.action);
    return (0, dispatcher_1.dispatchWith)(Object.assign(Object.assign({}, config), { parser, executor }));
}
function dispatchUpdateOneWith(config) {
    const parser = parseUpdateOneWith(config.paramsZod, config.bodyZod);
    const executor = executeUpdateOneWith(config.action);
    return (0, dispatcher_1.dispatchWith)(Object.assign(Object.assign({}, config), { parser, executor }));
}
const dispatchSearchWith = dispatchGetManyWith;
exports.dispatchSearchWith = dispatchSearchWith;
const dispatchGetOneSafeWith = dispatchGetOneWith;
exports.dispatchGetOneSafeWith = dispatchGetOneSafeWith;
const dispatchDeleteOneWith = dispatchGetOneWith;
exports.dispatchDeleteOneWith = dispatchDeleteOneWith;
//# sourceMappingURL=api.js.map