import { Awaitable, CommonResponse } from "./types";
type Authorizer<CONTEXT, OPTIONS> = (context: CONTEXT, options?: OPTIONS) => Awaitable<void>;
type Parser<CONTEXT, DATA, PARSED> = (data: DATA, context: CONTEXT) => Awaitable<PARSED>;
type Executor<PARSED, CONTEXT, RESULT> = (parsed: PARSED, context: CONTEXT) => Awaitable<RESULT>;
type DispatcherContext<CONTEXT, DATA, PARSED, RESULT> = {
    context?: CONTEXT;
    data?: DATA;
    parsed?: PARSED;
    result?: RESULT;
};
type ErrorHandler<CONTEXT, DATA, PARSED, RESULT, ERROR> = (error: any, context: DispatcherContext<CONTEXT, DATA, PARSED, RESULT>) => Awaitable<CommonResponse<RESULT, ERROR>>;
type DispatcherConfig<OPTIONS, CONTEXT, DATA, PARSED, RESULT, ERROR> = {
    authorizer?: Authorizer<CONTEXT, OPTIONS>;
    parser: Parser<CONTEXT, DATA, PARSED>;
    parserWrapper?: (parser: Parser<CONTEXT, DATA, PARSED>, options?: OPTIONS) => Parser<CONTEXT, DATA, PARSED>;
    executor: Executor<PARSED, CONTEXT, RESULT>;
    executorWrapper?: (executor: Executor<PARSED, CONTEXT, RESULT>, options?: OPTIONS) => Executor<PARSED, CONTEXT, RESULT>;
    errorHandler?: ErrorHandler<CONTEXT, DATA, PARSED, RESULT, ERROR>;
    options?: OPTIONS;
};
type Dispatcher<CONTEXT, DATA, RESULT, ERROR> = (data: DATA, context: CONTEXT) => Promise<CommonResponse<RESULT, ERROR>>;
declare function dispatchWith<OPTIONS, CONTEXT, DATA, PARSED, RESULT, ERROR>(config: DispatcherConfig<OPTIONS, CONTEXT, DATA, PARSED, RESULT, ERROR>): Dispatcher<CONTEXT, DATA, RESULT, ERROR>;
export { Authorizer, Dispatcher, DispatcherConfig, DispatcherContext, dispatchWith, ErrorHandler, Executor, Parser, };
