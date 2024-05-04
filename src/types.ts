import * as z from "zod";

type Awaitable<T> = T | Promise<T>;

type Authenticator<CONTEXT> = (request: Request) => Awaitable<CONTEXT>;

type Parser<CONTEXT, PARSED> = (
  request: Request,
  context: CONTEXT
) => Awaitable<PARSED>;

type Validator<PARSED, CONTEXT, OPTIONS> = (
  parsed: PARSED,
  context: CONTEXT,
  options?: OPTIONS
) => Awaitable<void>;

type Executor<PARSED, CONTEXT, RESULT> = (
  parsed: PARSED,
  context: CONTEXT
) => Awaitable<RESULT>;

type HandlerContext<CONTEXT, PARSED, RESULT> = {
  request: Request;
  context?: CONTEXT;
  parsed?: PARSED;
  result?: RESULT;
};

type ErrorHandler<CONTEXT, PARSED, RESULT> = (
  error: any,
  context: HandlerContext<CONTEXT, PARSED, RESULT>
) => Awaitable<Response>;

type HandlerConfig<CONTEXT, PARSED, RESULT, OPTIONS> = {
  authenticator: Authenticator<CONTEXT>;
  parser: Parser<CONTEXT, PARSED>;
  validator?: Validator<PARSED, CONTEXT, OPTIONS>;
  executor: Executor<PARSED, CONTEXT, RESULT>;
  errorHandler?: ErrorHandler<CONTEXT, PARSED, RESULT>;
  options?: OPTIONS;
  code?: number;
};

type WrappableHandlerConfig<CONTEXT, PARSED, RESULT, OPTIONS> = HandlerConfig<
  CONTEXT,
  PARSED,
  RESULT,
  OPTIONS
> & {
  parserWrapper?: (
    parser: Parser<CONTEXT, PARSED>,
    options?: OPTIONS
  ) => Parser<CONTEXT, PARSED>;
  executorWrapper?: (
    executor: Executor<PARSED, CONTEXT, RESULT>,
    options?: OPTIONS
  ) => Executor<PARSED, CONTEXT, RESULT>;
};

// api action types

type GetManyAction<QUERY, FIELD_REQUEST> = (
  query: QUERY,
  context: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type GetOneAction<PARAMS, FIELD_REQUEST> = (
  params: PARAMS,
  context: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type CreateOneAction<BODY, FIELD_REQUEST> = (
  body: BODY,
  context: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type UpdateOneAction<PARAMS, BODY, FIELD_REQUEST> = (
  params: PARAMS,
  body: BODY,
  context: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

// rpc api handler config types

type GetManyApiHandlerConfig<
  CONTEXT,
  RESULT,
  OPTIONS,
  QUERY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  queryZod: QUERY_ZOD;
  action: GetManyAction<z.infer<QUERY_ZOD>, FIELD_REQUEST>;
} & Omit<
  WrappableHandlerConfig<
    CONTEXT,
    { query: z.infer<QUERY_ZOD>; fieldRequest: FIELD_REQUEST },
    RESULT,
    OPTIONS
  >,
  "parser" | "executor"
>;

type GetOneApiHandlerConfig<
  CONTEXT,
  RESULT,
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  paramsZod: PARAMS_ZOD;
  action: GetOneAction<z.infer<PARAMS_ZOD>, FIELD_REQUEST>;
} & Omit<
  WrappableHandlerConfig<
    CONTEXT,
    { params: z.infer<PARAMS_ZOD>; fieldRequest: FIELD_REQUEST },
    RESULT,
    OPTIONS
  >,
  "parser" | "executor"
>;

type CreateOneApiHandlerConfig<
  CONTEXT,
  RESULT,
  OPTIONS,
  BODY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  bodyZod: BODY_ZOD;
  action: CreateOneAction<z.infer<BODY_ZOD>, FIELD_REQUEST>;
} & Omit<
  WrappableHandlerConfig<
    CONTEXT,
    { body: z.infer<BODY_ZOD>; fieldRequest: FIELD_REQUEST },
    RESULT,
    OPTIONS
  >,
  "parser" | "executor"
>;

type UpdateOneApiHandlerConfig<
  CONTEXT,
  RESULT,
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY,
  FIELD_REQUEST
> = {
  paramsZod: PARAMS_ZOD;
  bodyZod: z.ZodTypeAny;
  action: UpdateOneAction<z.infer<PARAMS_ZOD>, BODY, FIELD_REQUEST>;
} & Omit<
  WrappableHandlerConfig<
    CONTEXT,
    { params: z.infer<PARAMS_ZOD>; body: BODY; fieldRequest: FIELD_REQUEST },
    RESULT,
    OPTIONS
  >,
  "parser" | "executor"
>;

export {
  Authenticator,
  Awaitable,
  CreateOneAction,
  CreateOneApiHandlerConfig,
  ErrorHandler,
  Executor,
  GetManyAction,
  GetManyApiHandlerConfig,
  GetOneAction,
  GetOneApiHandlerConfig,
  HandlerConfig,
  HandlerContext,
  Parser,
  UpdateOneAction,
  UpdateOneApiHandlerConfig,
  Validator,
  WrappableHandlerConfig,
};
