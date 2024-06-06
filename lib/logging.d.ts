import { Awaitable } from "./types";
type NormalizedError = {
    name: string;
    status: number;
    message: string;
    stack?: string[];
    original?: any;
};
declare function logTime<T>(fn: () => Awaitable<T>, callerDepth?: number): Promise<T>;
declare function logDebug(props?: any, callerDepth?: number): void;
declare function logInfo(props?: any, callerDepth?: number): void;
declare function logWarn(props?: any, callerDepth?: number): void;
declare function logError(error: NormalizedError, context?: Record<string, any>, callerDepth?: number): void;
declare function getCaller(depth?: number): string;
declare function buildInvalidErrorMessage(name: string, expected?: any, actual?: any, context?: any): string;
declare function buildMissingErrorMessage(names: string | string[], context?: any): string;
export { Awaitable, NormalizedError, buildInvalidErrorMessage, buildMissingErrorMessage, getCaller, logDebug, logError, logInfo, logTime, logWarn, };
