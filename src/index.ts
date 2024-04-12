import createHttpError from "http-errors";
import * as z from "zod";

async function fetchJsonOrThrow(
  input: string,
  init?: RequestInit
): Promise<any> {
  const response = await fetch(input, init);
  const json = await response.json();
  if (json.error) {
    throw createHttpError(response.status, json.error);
  }
  return json;
}

function isNil(value: any): value is null | undefined {
  return value === undefined || value === null;
}

function getMin<T>(array: T[]): T | null {
  return array.reduce(
    (acc, value) =>
      isNil(value) ? acc : isNil(acc) ? value : acc < value ? acc : value,
    null as T | null
  );
}

function getMax<T>(array: T[]): T | null {
  return array.reduce(
    (acc, value) =>
      isNil(value) ? acc : isNil(acc) ? value : acc > value ? acc : value,
    null as T | null
  );
}

type Awaitable<T> = T | Promise<T>;

type Authenticator<REQUEST_CONTEXT> = (
  request: Request
) => Awaitable<REQUEST_CONTEXT>;

type Parser<REQUEST_CONTEXT, PARSED> = (
  request: Request,
  rc: REQUEST_CONTEXT
) => Awaitable<PARSED>;

type Validator<PARSED, REQUEST_CONTEXT, OPTIONS> = (
  parsed: PARSED,
  rc: REQUEST_CONTEXT,
  options?: OPTIONS
) => Awaitable<void>;

type Executor<PARSED, REQUEST_CONTEXT, RESULT> = (
  parsed: PARSED,
  rc: REQUEST_CONTEXT
) => Awaitable<RESULT>;

type HandlerContext<REQUEST_CONTEXT, PARSED, RESULT> = {
  rc?: REQUEST_CONTEXT;
  parsed?: PARSED;
  result?: RESULT;
};

type ErrorHandler<REQUEST_CONTEXT, PARSED, RESULT> = (
  error: any,
  context: HandlerContext<REQUEST_CONTEXT, PARSED, RESULT>
) => Awaitable<Response>;

// api action types

type GetManyAction<QUERY, FIELD_REQUEST> = (
  query: QUERY,
  rc: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type GetOneAction<PARAMS, FIELD_REQUEST> = (
  params: PARAMS,
  rc: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type CreateOneAction<BODY, FIELD_REQUEST> = (
  body: BODY,
  rc: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type UpdateOneAction<PARAMS, BODY, FIELD_REQUEST> = (
  params: PARAMS,
  body: BODY,
  rc: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

// rpc api handler config types

type GetManyApiHandlerConfig<
  REQUEST_CONTEXT,
  RESULT,
  OPTIONS,
  QUERY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  queryZod: QUERY_ZOD;
  action: GetManyAction<z.infer<QUERY_ZOD>, FIELD_REQUEST>;
} & Omit<
  HandlerConfig<
    REQUEST_CONTEXT,
    { query: z.infer<QUERY_ZOD>; fieldRequest: FIELD_REQUEST },
    RESULT,
    OPTIONS
  >,
  "parser" | "executor"
>;

type GetOneApiHandlerConfig<
  REQUEST_CONTEXT,
  RESULT,
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  paramsZod: PARAMS_ZOD;
  action: GetOneAction<z.infer<PARAMS_ZOD>, FIELD_REQUEST>;
} & Omit<
  HandlerConfig<
    REQUEST_CONTEXT,
    { params: z.infer<PARAMS_ZOD>; fieldRequest: FIELD_REQUEST },
    RESULT,
    OPTIONS
  >,
  "parser" | "executor"
>;

type CreateOneApiHandlerConfig<
  REQUEST_CONTEXT,
  RESULT,
  OPTIONS,
  BODY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  bodyZod: BODY_ZOD;
  action: CreateOneAction<z.infer<BODY_ZOD>, FIELD_REQUEST>;
} & Omit<
  HandlerConfig<
    REQUEST_CONTEXT,
    { body: z.infer<BODY_ZOD>; fieldRequest: FIELD_REQUEST },
    RESULT,
    OPTIONS
  >,
  "parser" | "executor"
>;

type UpdateOneApiHandlerConfig<
  REQUEST_CONTEXT,
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
  HandlerConfig<
    REQUEST_CONTEXT,
    { params: z.infer<PARAMS_ZOD>; body: BODY; fieldRequest: FIELD_REQUEST },
    RESULT,
    OPTIONS
  >,
  "parser" | "executor"
>;

// api handlers

function handleGetMany<
  REQUEST_CONTEXT,
  RESULT,
  OPTIONS,
  QUERY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
>(
  config: GetManyApiHandlerConfig<
    REQUEST_CONTEXT,
    RESULT,
    OPTIONS,
    QUERY_ZOD,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const parser = async (request: Request) => {
    const { query: queryRaw, fieldRequest } = await getRequestJson(request);
    if (queryRaw === undefined) {
      throw createHttpError.BadRequest("Missing `query`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const query = (await config.queryZod.parseAsync(
      queryRaw
    )) as z.infer<QUERY_ZOD>;
    return { query, fieldRequest };
  };
  const executor = (
    parsed: { query: z.infer<QUERY_ZOD>; fieldRequest: FIELD_REQUEST },
    rc: any
  ) => config.action(parsed.query, rc, parsed.fieldRequest);
  return handle({ ...config, parser, executor });
}

function handleGetOne<
  REQUEST_CONTEXT,
  RESULT,
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
>(
  config: GetOneApiHandlerConfig<
    REQUEST_CONTEXT,
    RESULT,
    OPTIONS,
    PARAMS_ZOD,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const parser = async (request: Request) => {
    const { params: paramsRaw, fieldRequest } = await getRequestJson(request);
    if (paramsRaw === undefined) {
      throw createHttpError.BadRequest("Missing `params`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const params = (await config.paramsZod.parseAsync(
      paramsRaw
    )) as z.infer<PARAMS_ZOD>;
    return { params, fieldRequest };
  };
  const executor = (
    parsed: { params: z.infer<PARAMS_ZOD>; fieldRequest: FIELD_REQUEST },
    rc: any
  ) => config.action(parsed.params, rc, parsed.fieldRequest);
  return handle({ ...config, parser, executor });
}

const handleGetOneSafe = handleGetOne;

function handleCreateOne<
  REQUEST_CONTEXT,
  RESULT,
  OPTIONS,
  BODY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
>(
  config: CreateOneApiHandlerConfig<
    REQUEST_CONTEXT,
    RESULT,
    OPTIONS,
    BODY_ZOD,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const parser = async (request: Request) => {
    const { body: bodyRaw, fieldRequest } = await getRequestJson(request);
    if (bodyRaw === undefined) {
      throw createHttpError.BadRequest("Missing `body`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const body = (await config.bodyZod.parseAsync(
      bodyRaw
    )) as z.infer<BODY_ZOD>;
    return { body, fieldRequest };
  };
  const executor = (
    parsed: { body: z.infer<BODY_ZOD>; fieldRequest: FIELD_REQUEST },
    rc: any
  ) => config.action(parsed.body, rc, parsed.fieldRequest);
  return handle({ ...config, parser, executor, code: 201 });
}

function handleUpdateOne<
  REQUEST_CONTEXT,
  RESULT,
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY,
  FIELD_REQUEST
>(
  config: UpdateOneApiHandlerConfig<
    REQUEST_CONTEXT,
    RESULT,
    OPTIONS,
    PARAMS_ZOD,
    BODY,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const parser = async (request: Request) => {
    const {
      params: paramsRaw,
      body: bodyRaw,
      fieldRequest,
    } = await getRequestJson(request);
    if (paramsRaw === undefined) {
      throw createHttpError.BadRequest("Missing `params`");
    }
    if (bodyRaw === undefined) {
      throw createHttpError.BadRequest("Missing `body`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const params = (await config.paramsZod.parseAsync(
      paramsRaw
    )) as z.infer<PARAMS_ZOD>;
    const body = (await config.bodyZod.parseAsync(bodyRaw)) as BODY;
    return { params, body, fieldRequest };
  };
  const executor = (
    parsed: {
      params: z.infer<PARAMS_ZOD>;
      body: BODY;
      fieldRequest: FIELD_REQUEST;
    },
    rc: any
  ) => config.action(parsed.params, parsed.body, rc, parsed.fieldRequest);
  return handle({ ...config, parser, executor });
}

const handleDeleteOne = handleGetOne;

async function getRequestJson(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch (error: any) {
    throw createHttpError.BadRequest(error.message);
  }
}

type HandlerConfig<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS> = {
  authenticator: Authenticator<REQUEST_CONTEXT>;
  parser: Parser<REQUEST_CONTEXT, PARSED>;
  validator?: Validator<PARSED, REQUEST_CONTEXT, OPTIONS>;
  executor: Executor<PARSED, REQUEST_CONTEXT, RESULT>;
  errorHandler?: ErrorHandler<REQUEST_CONTEXT, PARSED, RESULT>;
  options?: OPTIONS;
  code?: number;
};

// Note: request => authenticate => parse => execute => respond
function handle<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS>(
  config: HandlerConfig<REQUEST_CONTEXT, PARSED, RESULT, OPTIONS>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const data: HandlerContext<REQUEST_CONTEXT, PARSED, RESULT> = {};
    try {
      kill();
      data.rc = await config.authenticator(request);
      data.parsed = await config.parser(request, data.rc);
      if (config.validator !== undefined) {
        await config.validator(data.parsed, data.rc, config.options);
      }
      data.result = await config.executor(data.parsed, data.rc);
      return respond(data.result, config.code);
    } catch (error) {
      if (config.errorHandler === undefined) {
        throw error;
      } else {
        const { method: _method, url: _url } = request;
        return await config.errorHandler(error, data);
      }
    }
  };
}

function kill(): void {
  if (process.env.KILL_SWITCH) {
    throw createHttpError.ServiceUnavailable();
  }
}

function respond<RESULT>(result: RESULT, status: number = 200): Response {
  if (isReadableStream(result)) {
    const headers = { "Content-Type": "text/plain" };
    return new Response(result as ReadableStream, { headers });
  }
  return Response.json(result, { status });
}

function isReadableStream(object: any): object is ReadableStream {
  return (
    object instanceof ReadableStream ||
    (!isNil(object) &&
      isFunction(object.cancel) &&
      isFunction(object.cancel) &&
      isFunction(object.getReader) &&
      isFunction(object.pipeTo) &&
      isFunction(object.pipeThrough) &&
      isFunction(object.tee))
  );
}

const isFunction = (object: any) => typeof object === "function";

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
  fetchJsonOrThrow,
  getMax,
  getMin,
  handle,
  handleCreateOne,
  handleDeleteOne,
  handleGetMany,
  handleGetOne,
  handleGetOneSafe,
  handleUpdateOne,
  isNil,
};
