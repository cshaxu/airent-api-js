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
exports.dispatchWith = void 0;
function dispatchWith(config) {
    var _a, _b, _c, _d;
    const { options } = config;
    const authorizer = (_a = config.authorizer) !== null && _a !== void 0 ? _a : (() => { });
    const parserWrapper = (_b = config.parserWrapper) !== null && _b !== void 0 ? _b : ((f) => f);
    const parser = parserWrapper(config.parser, options);
    const executorWrapper = (_c = config.executorWrapper) !== null && _c !== void 0 ? _c : ((f) => f);
    const executor = executorWrapper(config.executor, options);
    const errorHandler = (_d = config.errorHandler) !== null && _d !== void 0 ? _d : ((error) => {
        throw error;
    });
    return (data, context) => __awaiter(this, void 0, void 0, function* () {
        const dispatcherContext = { data, context };
        try {
            yield authorizer(context, options);
            dispatcherContext.parsed = yield parser(data, context);
            dispatcherContext.result = yield executor(dispatcherContext.parsed, context);
            return { code: 200, result: dispatcherContext.result };
        }
        catch (error) {
            return yield errorHandler(error, dispatcherContext);
        }
    });
}
exports.dispatchWith = dispatchWith;
//# sourceMappingURL=dispatcher.js.map