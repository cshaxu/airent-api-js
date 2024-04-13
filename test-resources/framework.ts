import { Executor, Parser } from "../src";

export type RequestContext = {};

export const handlerConfig = {
  authenticator,
  validator,
  errorHandler,
  parserWrapper,
  executorWrapper,
};

async function authenticator(_request: Request): Promise<RequestContext> {
  return {};
}

async function validator(
  _parsed: any,
  _rc: RequestContext,
  _options?: {}
): Promise<void> {}

function errorHandler(_error: any, _ec: any): Response {
  return Response.json({}, { status: 500 });
}

function parserWrapper<PARSED>(
  parser: Parser<RequestContext, PARSED>,
  _options?: {}
): Parser<RequestContext, PARSED> {
  return parser;
}

function executorWrapper<PARSED, RESULT>(
  executor: Executor<PARSED, RequestContext, RESULT>,
  _options?: {}
): Executor<PARSED, RequestContext, RESULT> {
  return executor;
}
