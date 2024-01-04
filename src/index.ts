import createHttpError from "http-errors";
import { isNil } from "lodash";
import * as z from "zod";
import { AnyZodObject, ZodError } from "zod";

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

type Authenticator<DISPATCHER_OPTIONS> = (
  headers: Headers,
  options?: DISPATCHER_OPTIONS
) => Promise<any>;

// api executor types

type GetManyApiExecutor<QUERY, FIELD_REQUEST> = (
  query: QUERY,
  rc: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type GetOneApiExecutor<PARAMS, FIELD_REQUEST> = (
  params: PARAMS,
  rc: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type CreateOneApiExecutor<BODY, FIELD_REQUEST> = (
  body: BODY,
  rc: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

type UpdateOneApiExecutor<PARAMS, BODY, FIELD_REQUEST> = (
  params: PARAMS,
  body: BODY,
  rc: any,
  fieldRequest: FIELD_REQUEST
) => Promise<any>;

// rpc api handler config types

type GetManyApiHandlerConfig<
  DISPATCHER_OPTIONS,
  QUERY_ZOD extends AnyZodObject,
  FIELD_REQUEST
> = {
  queryZod: QUERY_ZOD;
  authenticator: Authenticator<DISPATCHER_OPTIONS>;
  apiExecutor: GetManyApiExecutor<z.infer<QUERY_ZOD>, FIELD_REQUEST>;
  options?: DISPATCHER_OPTIONS;
};

type GetOneApiHandlerConfig<
  DISPATCHER_OPTIONS,
  PARAMS_ZOD extends AnyZodObject,
  FIELD_REQUEST
> = {
  paramsZod: PARAMS_ZOD;
  apiExecutor: GetOneApiExecutor<z.infer<PARAMS_ZOD>, FIELD_REQUEST>;
  authenticator: Authenticator<DISPATCHER_OPTIONS>;
  options?: DISPATCHER_OPTIONS;
};

type CreateOneApiHandlerConfig<
  DISPATCHER_OPTIONS,
  BODY_ZOD extends AnyZodObject,
  FIELD_REQUEST
> = {
  bodyZod: BODY_ZOD;
  apiExecutor: CreateOneApiExecutor<z.infer<BODY_ZOD>, FIELD_REQUEST>;
  authenticator: Authenticator<DISPATCHER_OPTIONS>;
  options?: DISPATCHER_OPTIONS;
};

type UpdateOneApiHandlerConfig<
  DISPATCHER_OPTIONS,
  PARAMS_ZOD extends AnyZodObject,
  BODY,
  FIELD_REQUEST
> = {
  paramsZod: PARAMS_ZOD;
  bodyZod: AnyZodObject;
  apiExecutor: UpdateOneApiExecutor<z.infer<PARAMS_ZOD>, BODY, FIELD_REQUEST>;
  authenticator: Authenticator<DISPATCHER_OPTIONS>;
  options?: DISPATCHER_OPTIONS;
};

// api handlers

function handleGetMany<
  DISPATCHER_OPTIONS,
  QUERY_ZOD extends AnyZodObject,
  FIELD_REQUEST
>(
  config: GetManyApiHandlerConfig<DISPATCHER_OPTIONS, QUERY_ZOD, FIELD_REQUEST>
): (request: Request) => Promise<Response> {
  const validator = async (request: Request) => {
    const { query: queryRaw, fieldRequest } = await request.json();
    const query = (await config.queryZod.parseAsync(
      queryRaw
    )) as z.infer<QUERY_ZOD>;
    return { query, fieldRequest };
  };
  const executor = (
    parsed: { query: z.infer<QUERY_ZOD>; fieldRequest: FIELD_REQUEST },
    rc: any
  ) => config.apiExecutor(parsed.query, rc, parsed.fieldRequest);
  return (request: Request) =>
    dispatch(
      config.authenticator,
      validator,
      executor,
      request,
      config.options
    );
}

const handleSearch = handleGetMany;

function handleGetOne<
  DISPATCHER_OPTIONS,
  PARAMS_ZOD extends AnyZodObject,
  FIELD_REQUEST
>(
  config: GetOneApiHandlerConfig<DISPATCHER_OPTIONS, PARAMS_ZOD, FIELD_REQUEST>
): (request: Request) => Promise<Response> {
  const validator = async (request: Request) => {
    const { params: paramsRaw, fieldRequest } = await request.json();
    const params = (await config.paramsZod.parseAsync(
      paramsRaw
    )) as z.infer<PARAMS_ZOD>;
    return { params, fieldRequest };
  };
  const executor = (
    parsed: { params: z.infer<PARAMS_ZOD>; fieldRequest: FIELD_REQUEST },
    rc: any
  ) => config.apiExecutor(parsed.params, rc, parsed.fieldRequest);
  return (request: Request) =>
    dispatch(
      config.authenticator,
      validator,
      executor,
      request,
      config.options
    );
}

function handleCreateOne<
  DISPATCHER_OPTIONS,
  BODY_ZOD extends AnyZodObject,
  FIELD_REQUEST
>(
  config: CreateOneApiHandlerConfig<DISPATCHER_OPTIONS, BODY_ZOD, FIELD_REQUEST>
): (request: Request) => Promise<Response> {
  const validator = async (request: Request) => {
    const { body: bodyRaw, fieldRequest } = await request.json();
    const body = (await config.bodyZod.parseAsync(
      bodyRaw
    )) as z.infer<BODY_ZOD>;
    return { body, fieldRequest };
  };
  const executor = (
    parsed: { body: z.infer<BODY_ZOD>; fieldRequest: FIELD_REQUEST },
    rc: any
  ) => config.apiExecutor(parsed.body, rc, parsed.fieldRequest);
  return (request: Request) =>
    dispatch(
      config.authenticator,
      validator,
      executor,
      request,
      config.options
    );
}

function handleUpdateOne<
  DISPATCHER_OPTIONS,
  PARAMS_ZOD extends AnyZodObject,
  BODY,
  FIELD_REQUEST
>(
  config: UpdateOneApiHandlerConfig<
    DISPATCHER_OPTIONS,
    PARAMS_ZOD,
    BODY,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const validator = async (request: Request) => {
    const {
      params: paramsRaw,
      body: bodyRaw,
      fieldRequest,
    } = await request.json();
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
  ) => config.apiExecutor(parsed.params, parsed.body, rc, parsed.fieldRequest);
  return (request: Request) =>
    dispatch(
      config.authenticator,
      validator,
      executor,
      request,
      config.options
    );
}

const handleDeleteOne = handleGetOne;

// Note: request => validate => execute => response
async function dispatch<DISPATCHER_OPTIONS, REQUEST_CONTEXT, PARSED, RESULT>(
  authenticate: (
    headers: Headers,
    options?: DISPATCHER_OPTIONS
  ) => Promise<REQUEST_CONTEXT>,
  validate: (request: Request, rc: REQUEST_CONTEXT) => Promise<PARSED>,
  execute: (parsed: PARSED, rc: REQUEST_CONTEXT) => Promise<RESULT>,
  request: Request,
  options?: DISPATCHER_OPTIONS
): Promise<Response> {
  let rc = null;
  let parsed = null;
  let result = null;
  try {
    kill();
    rc = await authenticate(request.headers, options);
    parsed = await validate(request, rc);
    result = await execute(parsed, rc);
    return respond(result);
  } catch (error) {
    record(error, request, rc, parsed, result);
    return handle(error);
  }
}

function kill(): void {
  if (process.env.KILL_SWITCH) {
    throw createHttpError.ServiceUnavailable();
  }
}

function respond<RESULT>(result: RESULT): Response {
  if (isReadableStream(result)) {
    const headers = { "Content-Type": "text/plain" };
    return new Response(result as ReadableStream, { headers });
  }
  return Response.json(result, { status: 200 });
}

function isReadableStream(object: any): boolean {
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

function record<REQUEST_CONTEXT, PARSED, RESULT>(
  error: any,
  request: Request,
  rc: REQUEST_CONTEXT | null,
  parsed: PARSED,
  result: RESULT
): void {
  const { method, url } = request;
  const requestLog = { method, url, rc, parsed, result };
  const errorLog = {
    ...(error?.name && { name: error?.name }),
    ...(error?.message && { message: error?.message }),
    ...(error?.stack && { stack: error?.stack }),
  };
  console.error(
    `[ERROR] ${JSON.stringify({ request: requestLog, error: errorLog })}`
  );
}

function handle(error: unknown): Response {
  if (error instanceof ZodError) {
    return Response.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof createHttpError.HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  return Response.json({ error: "Internal server error" }, { status: 500 });
}

export {
  Authenticator,
  CreateOneApiExecutor,
  CreateOneApiHandlerConfig,
  GetManyApiExecutor,
  GetManyApiHandlerConfig,
  GetOneApiExecutor,
  GetOneApiHandlerConfig,
  UpdateOneApiExecutor,
  UpdateOneApiHandlerConfig,
  dispatch,
  getMax,
  getMin,
  handleCreateOne,
  handleDeleteOne,
  handleGetMany,
  handleGetOne,
  handleSearch,
  handleUpdateOne,
};
