import { CommonResponse, DispatcherContext, Executor, Parser } from "../src";

export type Context = {};

export const dispatcherConfig = {
  authorizer,
  errorHandler,
  parserWrapper,
  executorWrapper,
};

async function authorizer(_context: Context, _options?: {}): Promise<void> {}

function errorHandler<DATA, PARSED, RESULT>(
  _error: any,
  _dc: DispatcherContext<Context, DATA, PARSED, RESULT>
): CommonResponse<RESULT, {}> {
  return { code: 500, error: {} };
}

function parserWrapper<DATA, PARSED>(
  parser: Parser<Context, DATA, PARSED>,
  _options?: {}
): Parser<Context, DATA, PARSED> {
  return parser;
}

function executorWrapper<PARSED, RESULT>(
  executor: Executor<PARSED, Context, RESULT>,
  _options?: {}
): Executor<PARSED, Context, RESULT> {
  return executor;
}
