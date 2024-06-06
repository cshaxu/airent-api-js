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
exports.logWarn = exports.logTime = exports.logInfo = exports.logError = exports.logDebug = exports.getCaller = exports.buildMissingErrorMessage = exports.buildInvalidErrorMessage = void 0;
function logTime(fn, callerDepth) {
    return __awaiter(this, void 0, void 0, function () {
        var start, result, end, props, caller, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = Date.now();
                    return [4 /*yield*/, fn()];
                case 1:
                    result = _a.sent();
                    end = Date.now();
                    props = { name: fn.name, seconds: (end - start) / 1000 };
                    caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
                    message = buildLogMessage("TIMER", caller, props);
                    console.info(message);
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.logTime = logTime;
function logDebug(props, callerDepth) {
    var caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
    var message = buildLogMessage("DEBUG", caller, props);
    console.debug(message);
}
exports.logDebug = logDebug;
function logInfo(props, callerDepth) {
    var caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
    var message = buildLogMessage("INFO", caller, props);
    console.info(message);
}
exports.logInfo = logInfo;
function logWarn(props, callerDepth) {
    var caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
    var message = buildLogMessage("WARN", caller, props);
    console.warn(message);
}
exports.logWarn = logWarn;
function logError(error, context, callerDepth) {
    var props = { error: error, context: context };
    var caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
    var message = buildLogMessage("ERROR", caller, props);
    console.error(message);
}
exports.logError = logError;
function getCaller(depth) {
    if (depth === void 0) { depth = 0; }
    try {
        throw new Error();
    }
    catch (error) {
        return error.stack
            .split("\n")[2 + depth].trim()
            .split(" ")
            .slice(1)
            .join(" ");
    }
}
exports.getCaller = getCaller;
function buildLogMessage(type, caller, props) {
    var message = "[".concat(type, "] ").concat(caller, " -- ").concat(JSON.stringify(props, null, 2));
    return message.split("\n").slice(0, 1000).join("\n");
}
function buildInvalidErrorMessage(name, expected, actual, context) {
    var message = "invalid ".concat(name);
    if (expected !== undefined) {
        message += ": expected \"".concat(JSON.stringify(expected), "\"");
    }
    if (actual !== undefined) {
        message += ", got \"".concat(JSON.stringify(actual), "\"");
    }
    if (context !== undefined) {
        message += " -- ".concat(JSON.stringify(context));
    }
    return message;
}
exports.buildInvalidErrorMessage = buildInvalidErrorMessage;
function buildMissingErrorMessage(names, context) {
    var message = typeof names === "string" ? names : "[".concat(names.join(", "), "]");
    message = "missing ".concat(message);
    if (context !== undefined) {
        message += " -- ".concat(JSON.stringify(context));
    }
    return message;
}
exports.buildMissingErrorMessage = buildMissingErrorMessage;
//# sourceMappingURL=logging.js.map