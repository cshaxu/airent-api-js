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
exports.buildInvalidErrorMessage = buildInvalidErrorMessage;
exports.buildMissingErrorMessage = buildMissingErrorMessage;
exports.getCaller = getCaller;
exports.logDebug = logDebug;
exports.logError = logError;
exports.logInfo = logInfo;
exports.logTime = logTime;
exports.logWarn = logWarn;
function logTime(fn, callerDepth) {
    return __awaiter(this, void 0, void 0, function* () {
        const start = Date.now();
        const result = yield fn();
        const end = Date.now();
        const props = { name: fn.name, seconds: (end - start) / 1000 };
        const caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
        const message = buildLogMessage("TIMER", caller, props);
        console.info(message);
        return result;
    });
}
function logDebug(props, callerDepth) {
    const caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
    const message = buildLogMessage("DEBUG", caller, props);
    console.debug(message);
}
function logInfo(props, callerDepth) {
    const caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
    const message = buildLogMessage("INFO", caller, props);
    console.info(message);
}
function logWarn(props, callerDepth) {
    const caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
    const message = buildLogMessage("WARN", caller, props);
    console.warn(message);
}
function logError(error, context, callerDepth) {
    const props = { error, context };
    const caller = getCaller(1 + (callerDepth !== null && callerDepth !== void 0 ? callerDepth : 0));
    const message = buildLogMessage("ERROR", caller, props);
    console.error(message);
}
function getCaller(depth = 0) {
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
function buildLogMessage(type, caller, props) {
    const message = `[${type}] ${caller} -- ${JSON.stringify(props, null, 2)}`;
    return message.split("\n").slice(0, 1000).join("\n");
}
function buildInvalidErrorMessage(name, expected, actual, context) {
    let message = `invalid ${name}`;
    if (expected !== undefined) {
        message += `: expected "${JSON.stringify(expected)}"`;
    }
    if (actual !== undefined) {
        message += `, got "${JSON.stringify(actual)}"`;
    }
    if (context !== undefined) {
        message += ` -- ${JSON.stringify(context)}`;
    }
    return message;
}
function buildMissingErrorMessage(names, context) {
    let message = typeof names === "string" ? names : `[${names.join(", ")}]`;
    message = `missing ${message}`;
    if (context !== undefined) {
        message += ` -- ${JSON.stringify(context)}`;
    }
    return message;
}
//# sourceMappingURL=logging.js.map