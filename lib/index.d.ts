import * as z from "zod";
declare function fetchJsonOrThrow(input: string, init?: RequestInit): Promise<any>;
declare function isNil(value: any): value is null | undefined;
declare function getMin<T>(array: T[]): T | null;
declare function getMax<T>(array: T[]): T | null;
type Awaitable<T> = T | Promise<T>;
type Authenticator<REQUEST_CONTEXT> = (request: Request) => Awaitable<REQUEST_CONTEXT>;
type Parser<REQUEST_CONTEXT, PARSED> = (request: Request, rc: REQUEST_CONTEXT) => Awaitable<PARSED>;
type Validator<PARSED, REQUEST_CONTEXT, OPTIONS> = (parsed: PARSED, rc: REQUEST_CONTEXT, options?: OPTIONS) => Awaitable<void>;
type Executor<PARSED, REQUEST_CONTEXT, RESULT> = (parsed: PARSED, rc: REQUEST_CONTEXT) => Awaitable<RESULT>;
type HandlerContext<REQUEST_CONTEXT, PARSED, RESULT> = {
    request: Request;
    rc?: REQUEST_CONTEXT;
    parsed?: PARSED;
    result?: RESULT;
};
type ErrorHandler<REQUEST_CONTEXT, PARSED, RESULT> = (error: any, context: HandlerContext<REQUEST_CONTEXT, PARSED, RESULT>) => Awaitable<Response>;
type HandlerConfig<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS> = {
    authenticator: Authenticator<REQUEST_CONTEXT>;
    parser: Parser<REQUEST_CONTEXT, PARSED>;
    validator?: Validator<PARSED, REQUEST_CONTEXT, OPTIONS>;
    executor: Executor<PARSED, REQUEST_CONTEXT, RESULT>;
    errorHandler?: ErrorHandler<REQUEST_CONTEXT, PARSED, RESULT>;
    options?: OPTIONS;
    code?: number;
};
type WrappableHandlerConfig<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS> = HandlerConfig<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS> & {
    parserWrapper?: (parser: Parser<REQUEST_CONTEXT, PARSED>, options?: OPTIONS) => Parser<REQUEST_CONTEXT, PARSED>;
    executorWrapper?: (executor: Executor<PARSED, REQUEST_CONTEXT, RESULT>, options?: OPTIONS) => Executor<PARSED, REQUEST_CONTEXT, RESULT>;
};
type GetManyAction<QUERY, FIELD_REQUEST> = (query: QUERY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type GetOneAction<PARAMS, FIELD_REQUEST> = (params: PARAMS, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type CreateOneAction<BODY, FIELD_REQUEST> = (body: BODY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type UpdateOneAction<PARAMS, BODY, FIELD_REQUEST> = (params: PARAMS, body: BODY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type GetManyApiHandlerConfig<REQUEST_CONTEXT, RESULT, OPTIONS, QUERY_ZOD extends z.ZodTypeAny, FIELD_REQUEST> = {
    queryZod: QUERY_ZOD;
    action: GetManyAction<z.infer<QUERY_ZOD>, FIELD_REQUEST>;
} & Omit<WrappableHandlerConfig<REQUEST_CONTEXT, {
    query: z.infer<QUERY_ZOD>;
    fieldRequest: FIELD_REQUEST;
}, RESULT, OPTIONS>, "parser" | "executor">;
type GetOneApiHandlerConfig<REQUEST_CONTEXT, RESULT, OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, FIELD_REQUEST> = {
    paramsZod: PARAMS_ZOD;
    action: GetOneAction<z.infer<PARAMS_ZOD>, FIELD_REQUEST>;
} & Omit<WrappableHandlerConfig<REQUEST_CONTEXT, {
    params: z.infer<PARAMS_ZOD>;
    fieldRequest: FIELD_REQUEST;
}, RESULT, OPTIONS>, "parser" | "executor">;
type CreateOneApiHandlerConfig<REQUEST_CONTEXT, RESULT, OPTIONS, BODY_ZOD extends z.ZodTypeAny, FIELD_REQUEST> = {
    bodyZod: BODY_ZOD;
    action: CreateOneAction<z.infer<BODY_ZOD>, FIELD_REQUEST>;
} & Omit<WrappableHandlerConfig<REQUEST_CONTEXT, {
    body: z.infer<BODY_ZOD>;
    fieldRequest: FIELD_REQUEST;
}, RESULT, OPTIONS>, "parser" | "executor">;
type UpdateOneApiHandlerConfig<REQUEST_CONTEXT, RESULT, OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, BODY, FIELD_REQUEST> = {
    paramsZod: PARAMS_ZOD;
    bodyZod: z.ZodTypeAny;
    action: UpdateOneAction<z.infer<PARAMS_ZOD>, BODY, FIELD_REQUEST>;
} & Omit<WrappableHandlerConfig<REQUEST_CONTEXT, {
    params: z.infer<PARAMS_ZOD>;
    body: BODY;
    fieldRequest: FIELD_REQUEST;
}, RESULT, OPTIONS>, "parser" | "executor">;
declare function handleGetMany<REQUEST_CONTEXT, RESULT, OPTIONS, QUERY_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: GetManyApiHandlerConfig<REQUEST_CONTEXT, RESULT, OPTIONS, QUERY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleGetOne<REQUEST_CONTEXT, RESULT, OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: GetOneApiHandlerConfig<REQUEST_CONTEXT, RESULT, OPTIONS, PARAMS_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleGetOneSafe: typeof handleGetOne;
declare function handleCreateOne<REQUEST_CONTEXT, RESULT, OPTIONS, BODY_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: CreateOneApiHandlerConfig<REQUEST_CONTEXT, RESULT, OPTIONS, BODY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleUpdateOne<REQUEST_CONTEXT, RESULT, OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, BODY, FIELD_REQUEST>(config: UpdateOneApiHandlerConfig<REQUEST_CONTEXT, RESULT, OPTIONS, PARAMS_ZOD, BODY, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleDeleteOne: typeof handleGetOne;
declare function wrappableHandle<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS>(config: WrappableHandlerConfig<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS>): (request: Request) => Promise<Response>;
declare function handle<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS>(config: HandlerConfig<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS>): (request: Request) => Promise<Response>;
export { Authenticator, Awaitable, CreateOneAction, CreateOneApiHandlerConfig, ErrorHandler, Executor, GetManyAction, GetManyApiHandlerConfig, GetOneAction, GetOneApiHandlerConfig, HandlerConfig, HandlerContext, Parser, UpdateOneAction, UpdateOneApiHandlerConfig, Validator, WrappableHandlerConfig, fetchJsonOrThrow, getMax, getMin, handle, handleCreateOne, handleDeleteOne, handleGetMany, handleGetOne, handleGetOneSafe, handleUpdateOne, isNil, wrappableHandle, };
