import { CommonResponse, Executor, Parser } from "../src";

export type Context = {};

export const dispatcherConfig = {
  validator,
  errorHandler,
  parserWrapper,
  executorWrapper,
};

async function validator(
  _parsed: any,
  _context: Context,
  _options?: {}
): Promise<void> {}

function errorHandler(_error: any, _ec: any): CommonResponse {
  return { code: 500, error: {} };
}

function parserWrapper<PARSED>(
  parser: Parser<Context, any, PARSED>,
  _options?: {}
): Parser<Context, any, PARSED> {
  return parser;
}

function executorWrapper<PARSED, RESULT>(
  executor: Executor<PARSED, Context, RESULT>,
  _options?: {}
): Executor<PARSED, Context, RESULT> {
  return executor;
}
