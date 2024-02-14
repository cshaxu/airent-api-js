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

type Authenticator<OPTIONS, REQUEST_CONTEXT> = (
  headers: Headers,
  options?: OPTIONS
) => Promise<REQUEST_CONTEXT>;

type ErrorContext = {
  method: string;
  url: string;
  rc: any;
  parsed: any;
  result: any;
};

type ErrorHandler = (error: any, ec: ErrorContext) => Response;

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
  OPTIONS,
  QUERY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  queryZod: QUERY_ZOD;
  action: GetManyAction<z.infer<QUERY_ZOD>, FIELD_REQUEST>;
} & Omit<HandlerConfig<OPTIONS, any, any, any>, "validator" | "executor">;

type GetOneApiHandlerConfig<
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  paramsZod: PARAMS_ZOD;
  action: GetOneAction<z.infer<PARAMS_ZOD>, FIELD_REQUEST>;
} & Omit<HandlerConfig<OPTIONS, any, any, any>, "validator" | "executor">;

type CreateOneApiHandlerConfig<
  OPTIONS,
  BODY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
> = {
  bodyZod: BODY_ZOD;
  action: CreateOneAction<z.infer<BODY_ZOD>, FIELD_REQUEST>;
} & Omit<HandlerConfig<OPTIONS, any, any, any>, "validator" | "executor">;

type UpdateOneApiHandlerConfig<
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY,
  FIELD_REQUEST
> = {
  paramsZod: PARAMS_ZOD;
  bodyZod: z.ZodTypeAny;
  action: UpdateOneAction<z.infer<PARAMS_ZOD>, BODY, FIELD_REQUEST>;
} & Omit<HandlerConfig<OPTIONS, any, any, any>, "validator" | "executor">;

// api handlers

function handleGetMany<OPTIONS, QUERY_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(
  config: GetManyApiHandlerConfig<OPTIONS, QUERY_ZOD, FIELD_REQUEST>
): (request: Request) => Promise<Response> {
  const validator = async (request: Request) => {
    const { query: queryRaw, fieldRequest } = await request.json();
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
  return handle({ ...config, validator, executor });
}

const handleSearch = handleGetMany;

function handleGetOne<OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(
  config: GetOneApiHandlerConfig<OPTIONS, PARAMS_ZOD, FIELD_REQUEST>
): (request: Request) => Promise<Response> {
  const validator = async (request: Request) => {
    const { params: paramsRaw, fieldRequest } = await request.json();
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
  return handle({ ...config, validator, executor });
}

function handleCreateOne<OPTIONS, BODY_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(
  config: CreateOneApiHandlerConfig<OPTIONS, BODY_ZOD, FIELD_REQUEST>
): (request: Request) => Promise<Response> {
  const validator = async (request: Request) => {
    const { body: bodyRaw, fieldRequest } = await request.json();
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
  return handle({ ...config, validator, executor, code: 201 });
}

function handleUpdateOne<
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY,
  FIELD_REQUEST
>(
  config: UpdateOneApiHandlerConfig<OPTIONS, PARAMS_ZOD, BODY, FIELD_REQUEST>
): (request: Request) => Promise<Response> {
  const validator = async (request: Request) => {
    const {
      params: paramsRaw,
      body: bodyRaw,
      fieldRequest,
    } = await request.json();
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
  return handle({ ...config, validator, executor });
}

const handleDeleteOne = handleGetOne;

type HandlerConfig<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT> = {
  authenticator: Authenticator<OPTIONS, REQUEST_CONTEXT>;
  validator: (request: Request, rc: REQUEST_CONTEXT) => Promise<PARSED>;
  executor: (parsed: PARSED, rc: REQUEST_CONTEXT) => Promise<RESULT>;
  errorHandler?: ErrorHandler;
  options?: OPTIONS;
  code?: number;
};

// Note: request => validate => execute => response
function handle<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT>(
  config: HandlerConfig<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    let rc = null;
    let parsed = null;
    let result = null;
    try {
      kill();
      rc = await config.authenticator(request.headers, config.options);
      parsed = await config.validator(request, rc);
      result = await config.executor(parsed, rc);
      return respond(result, config.code);
    } catch (error) {
      if (config.errorHandler === undefined) {
        throw error;
      } else {
        const { method, url } = request;
        const ec = { method, url, rc, parsed, result };
        return config.errorHandler(error, ec);
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
    (isFunction(object.cancel) &&
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
  CreateOneAction,
  CreateOneApiHandlerConfig,
  ErrorContext,
  ErrorHandler,
  GetManyAction,
  GetManyApiHandlerConfig,
  GetOneAction,
  GetOneApiHandlerConfig,
  HandlerConfig,
  UpdateOneAction,
  UpdateOneApiHandlerConfig,
  fetchJsonOrThrow,
  getMax,
  getMin,
  handle,
  handleCreateOne,
  handleDeleteOne,
  handleGetMany,
  handleGetOne,
  handleSearch,
  handleUpdateOne,
};
