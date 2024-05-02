import { Executor, Parser } from "../src";

export type Context = {};

export const handlerConfig = {
  authenticator,
  validator,
  errorHandler,
  parserWrapper,
  executorWrapper,
};

async function authenticator(_request: Request): Promise<Context> {
  return {};
}

async function validator(
  _parsed: any,
  _context: Context,
  _options?: {}
): Promise<void> {}

function errorHandler(_error: any, _ec: any): Response {
  return Response.json({}, { status: 500 });
}

function parserWrapper<PARSED>(
  parser: Parser<Context, PARSED>,
  _options?: {}
): Parser<Context, PARSED> {
  return parser;
}

function executorWrapper<PARSED, RESULT>(
  executor: Executor<PARSED, Context, RESULT>,
  _options?: {}
): Executor<PARSED, Context, RESULT> {
  return executor;
}
