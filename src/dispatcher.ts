import { Awaitable } from "airent";
import { CommonResponse } from "./types";

type Authorizer<CONTEXT, OPTIONS> = (
  context: CONTEXT,
  options?: OPTIONS
) => Awaitable<void>;

type Parser<CONTEXT, DATA, PARSED> = (
  data: DATA,
  context: CONTEXT
) => Awaitable<PARSED>;

type Executor<PARSED, CONTEXT, RESULT> = (
  parsed: PARSED,
  context: CONTEXT
) => Awaitable<RESULT>;

type DispatcherContext<CONTEXT, DATA, PARSED, RESULT> = {
  context?: CONTEXT;
  data?: DATA;
  parsed?: PARSED;
  result?: RESULT;
};

type ErrorHandler<CONTEXT, DATA, PARSED, RESULT, ERROR> = (
  error: any,
  context: DispatcherContext<CONTEXT, DATA, PARSED, RESULT>
) => Awaitable<CommonResponse<RESULT, ERROR>>;

type DispatcherConfig<OPTIONS, CONTEXT, DATA, PARSED, RESULT, ERROR> = {
  authorizer?: Authorizer<CONTEXT, OPTIONS>;
  parser: Parser<CONTEXT, DATA, PARSED>;
  parserWrapper?: (
    parser: Parser<CONTEXT, DATA, PARSED>,
    options?: OPTIONS
  ) => Parser<CONTEXT, DATA, PARSED>;
  executor: Executor<PARSED, CONTEXT, RESULT>;
  executorWrapper?: (
    executor: Executor<PARSED, CONTEXT, RESULT>,
    options?: OPTIONS
  ) => Executor<PARSED, CONTEXT, RESULT>;
  errorHandler?: ErrorHandler<CONTEXT, DATA, PARSED, RESULT, ERROR>;
  options?: OPTIONS;
};

type Dispatcher<CONTEXT, DATA, RESULT, ERROR> = (
  data: DATA,
  context: CONTEXT
) => Promise<CommonResponse<RESULT, ERROR>>;

function dispatchWith<OPTIONS, CONTEXT, DATA, PARSED, RESULT, ERROR>(
  config: DispatcherConfig<OPTIONS, CONTEXT, DATA, PARSED, RESULT, ERROR>
): Dispatcher<CONTEXT, DATA, RESULT, ERROR> {
  const { options } = config;
  const authorizer = config.authorizer ?? (() => {});
  const parserWrapper = config.parserWrapper ?? ((f) => f);
  const parser = parserWrapper(config.parser, options);
  const executorWrapper = config.executorWrapper ?? ((f) => f);
  const executor = executorWrapper(config.executor, options);
  const errorHandler =
    config.errorHandler ??
    ((error) => {
      throw error;
    });

  return async (data: DATA, context: CONTEXT) => {
    const dispatcherContext: DispatcherContext<CONTEXT, DATA, PARSED, RESULT> =
      { data, context };
    try {
      await authorizer(context, options);
      dispatcherContext.parsed = await parser(data, context);
      dispatcherContext.result = await executor(
        dispatcherContext.parsed,
        context
      );
      return { code: 200, result: dispatcherContext.result };
    } catch (error) {
      return await errorHandler(error, dispatcherContext);
    }
  };
}

export {
  Authorizer,
  Dispatcher,
  DispatcherConfig,
  DispatcherContext,
  dispatchWith,
  ErrorHandler,
  Executor,
  Parser,
};
