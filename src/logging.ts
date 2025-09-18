import { Awaitable } from "airent";
import { NormalizedError } from "./types";

async function logTime<T>(
  fn: () => Awaitable<T>,
  callerDepth?: number
): Promise<T> {
  const start = Date.now();
  const result = await fn();
  const end = Date.now();
  const props = { name: fn.name, seconds: (end - start) / 1000 };
  const caller = getCaller(1 + (callerDepth ?? 0));
  const message = buildLogMessage("TIMER", caller, props);
  console.info(message);
  return result;
}

function logDebug(props?: any, callerDepth?: number): void {
  const caller = getCaller(1 + (callerDepth ?? 0));
  const message = buildLogMessage("DEBUG", caller, props);
  console.debug(message);
}

function logInfo(props?: any, callerDepth?: number): void {
  const caller = getCaller(1 + (callerDepth ?? 0));
  const message = buildLogMessage("INFO", caller, props);
  console.info(message);
}

function logWarn(props?: any, callerDepth?: number): void {
  const caller = getCaller(1 + (callerDepth ?? 0));
  const message = buildLogMessage("WARN", caller, props);
  console.warn(message);
}

function logError(
  error: NormalizedError,
  context?: Record<string, any>,
  callerDepth?: number
): void {
  const props = { error, context };
  const caller = getCaller(1 + (callerDepth ?? 0));
  const message = buildLogMessage("ERROR", caller, props);
  console.error(message);
}

function getCaller(depth: number = 0): string {
  try {
    throw new Error();
  } catch (error: any) {
    return error.stack
      .split("\n")
      [2 + depth].trim()
      .split(" ")
      .slice(1)
      .join(" ");
  }
}

function buildLogMessage(type: string, caller: string, props: any): string {
  const message = `[${type}] ${caller} -- ${JSON.stringify(props, null, 2)}`;
  return message.split("\n").slice(0, 1000).join("\n");
}

function buildInvalidErrorMessage(
  name: string,
  expected?: any,
  actual?: any,
  context?: any
): string {
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

function buildMissingErrorMessage(
  names: string | string[],
  context?: any
): string {
  let message = typeof names === "string" ? names : `[${names.join(", ")}]`;
  message = `missing ${message}`;
  if (context !== undefined) {
    message += ` -- ${JSON.stringify(context)}`;
  }
  return message;
}

export {
  buildInvalidErrorMessage,
  buildMissingErrorMessage,
  getCaller,
  logDebug,
  logError,
  logInfo,
  logTime,
  logWarn,
  NormalizedError,
};
