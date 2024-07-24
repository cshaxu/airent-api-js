import createHttpError from "http-errors";
import * as z from "zod";
import {
  Dispatcher,
  DispatcherConfig,
  dispatchWith,
  Executor,
  Parser,
} from "./dispatcher";
import { FieldRequest } from "./types";
import { isNil } from "./utils";

// api parser types

type GetManyParsed<QUERY> = { query: QUERY; fieldRequest: FieldRequest };

type GetOneParsed<PARAMS> = { params: PARAMS; fieldRequest: FieldRequest };

type CreateOneParsed<BODY> = { body: BODY; fieldRequest: FieldRequest };

type UpdateOneParsed<PARAMS, BODY> = {
  params: PARAMS;
  body: BODY;
  fieldRequest: FieldRequest;
};

// api action types

type GetManyAction<QUERY, CONTEXT, RESULT> = (
  query: QUERY,
  fieldRequest: FieldRequest,
  context: CONTEXT
) => Promise<RESULT>;

type GetOneAction<PARAMS, CONTEXT, RESULT> = (
  params: PARAMS,
  fieldRequest: FieldRequest,
  context: CONTEXT
) => Promise<RESULT>;

type CreateOneAction<BODY, CONTEXT, RESULT> = (
  body: BODY,
  fieldRequest: FieldRequest,
  context: CONTEXT
) => Promise<RESULT>;

type UpdateOneAction<PARAMS, BODY, CONTEXT, RESULT> = (
  params: PARAMS,
  body: BODY,
  fieldRequest: FieldRequest,
  context: CONTEXT
) => Promise<RESULT>;

// api dispatcher types

type GetManyDispatcherConfig<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  QUERY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
> = {
  queryZod: QUERY_ZOD;
  action: GetManyAction<z.infer<QUERY_ZOD>, CONTEXT, RESULT>;
} & Omit<
  DispatcherConfig<
    OPTIONS,
    CONTEXT,
    DATA,
    GetManyParsed<z.infer<QUERY_ZOD>>,
    RESULT,
    ERROR
  >,
  "parser" | "executor"
>;

type GetOneDispatcherConfig<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  PARAMS_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
> = {
  paramsZod: PARAMS_ZOD;
  action: GetOneAction<z.infer<PARAMS_ZOD>, CONTEXT, RESULT>;
} & Omit<
  DispatcherConfig<
    OPTIONS,
    CONTEXT,
    DATA,
    GetOneParsed<z.infer<PARAMS_ZOD>>,
    RESULT,
    ERROR
  >,
  "parser" | "executor"
>;

type CreateOneDispatcherConfig<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  BODY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
> = {
  bodyZod: BODY_ZOD;
  action: CreateOneAction<z.infer<BODY_ZOD>, CONTEXT, RESULT>;
} & Omit<
  DispatcherConfig<
    OPTIONS,
    CONTEXT,
    DATA,
    CreateOneParsed<z.infer<BODY_ZOD>>,
    RESULT,
    ERROR
  >,
  "parser" | "executor"
>;

type UpdateOneDispatcherConfig<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
> = {
  paramsZod: PARAMS_ZOD;
  bodyZod: z.ZodTypeAny;
  action: UpdateOneAction<
    z.infer<PARAMS_ZOD>,
    z.infer<BODY_ZOD>,
    CONTEXT,
    RESULT
  >;
} & Omit<
  DispatcherConfig<
    OPTIONS,
    CONTEXT,
    DATA,
    UpdateOneParsed<z.infer<PARAMS_ZOD>, z.infer<BODY_ZOD>>,
    RESULT,
    ERROR
  >,
  "parser" | "executor"
>;

// api parsers

function parseGetManyWith<
  CONTEXT,
  DATA extends object,
  QUERY_ZOD extends z.ZodTypeAny
>(
  queryZod: QUERY_ZOD
): Parser<CONTEXT, DATA, GetManyParsed<z.infer<QUERY_ZOD>>> {
  return async (data: DATA) => {
    const queryRaw = "query" in data ? data.query : undefined;
    const fieldRequestRaw =
      "fieldRequest" in data ? data.fieldRequest : undefined;
    if (isNil(queryRaw)) {
      throw createHttpError.BadRequest("Missing `query`");
    }
    if (isNil(fieldRequestRaw)) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const query = (await queryZod.parseAsync(queryRaw)) as z.infer<QUERY_ZOD>;
    const fieldRequest = fieldRequestRaw as FieldRequest;
    return { query, fieldRequest };
  };
}

function parseGetOneWith<CONTEXT, DATA, PARAMS_ZOD extends z.ZodTypeAny>(
  paramsZod: PARAMS_ZOD
): Parser<CONTEXT, DATA, GetOneParsed<z.infer<PARAMS_ZOD>>> {
  return async (data: any) => {
    const paramsRaw = "params" in data ? data.params : undefined;
    const fieldRequestRaw =
      "fieldRequest" in data ? data.fieldRequest : undefined;
    if (isNil(paramsRaw)) {
      throw createHttpError.BadRequest("Missing `params`");
    }
    if (isNil(fieldRequestRaw)) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const params = (await paramsZod.parseAsync(
      paramsRaw
    )) as z.infer<PARAMS_ZOD>;
    const fieldRequest = fieldRequestRaw as FieldRequest;
    return { params, fieldRequest };
  };
}

function parseCreateOneWith<CONTEXT, DATA, BODY_ZOD extends z.ZodTypeAny>(
  bodyZod: BODY_ZOD
): Parser<CONTEXT, DATA, CreateOneParsed<z.infer<BODY_ZOD>>> {
  return async (data: any) => {
    const bodyRaw = "body" in data ? data.body : undefined;
    const fieldRequest = "fieldRequest" in data ? data.fieldRequest : undefined;
    if (bodyRaw === undefined) {
      throw createHttpError.BadRequest("Missing `body`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const body = (await bodyZod.parseAsync(bodyRaw)) as z.infer<BODY_ZOD>;
    return { body, fieldRequest };
  };
}

function parseUpdateOneWith<
  CONTEXT,
  DATA extends object,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY_ZOD extends z.ZodTypeAny
>(
  paramsZod: PARAMS_ZOD,
  bodyZod: BODY_ZOD
): Parser<
  CONTEXT,
  DATA,
  UpdateOneParsed<z.infer<PARAMS_ZOD>, z.infer<BODY_ZOD>>
> {
  return async (data: DATA) => {
    const paramsRaw = "params" in data ? data.params : undefined;
    const bodyRaw = "body" in data ? data.body : undefined;
    const fieldRequestRaw =
      "fieldRequest" in data ? data.fieldRequest : undefined;
    if (isNil(paramsRaw)) {
      throw createHttpError.BadRequest("Missing `params`");
    }
    if (isNil(bodyRaw)) {
      throw createHttpError.BadRequest("Missing `body`");
    }
    if (isNil(fieldRequestRaw)) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const params = (await paramsZod.parseAsync(
      paramsRaw
    )) as z.infer<PARAMS_ZOD>;
    const body = (await bodyZod.parseAsync(bodyRaw)) as z.infer<BODY_ZOD>;
    const fieldRequest = fieldRequestRaw as FieldRequest;
    return { params, body, fieldRequest };
  };
}

// api executors

function executeGetManyWith<CONTEXT, QUERY_ZOD extends z.ZodTypeAny, RESULT>(
  action: GetManyAction<z.infer<QUERY_ZOD>, CONTEXT, RESULT>
): Executor<GetManyParsed<z.infer<QUERY_ZOD>>, CONTEXT, RESULT> {
  return (parsed: GetManyParsed<z.infer<QUERY_ZOD>>, context: CONTEXT) =>
    action(parsed.query, parsed.fieldRequest, context);
}

function executeGetOneWith<CONTEXT, PARAMS_ZOD extends z.ZodTypeAny, RESULT>(
  action: GetOneAction<CONTEXT, z.infer<PARAMS_ZOD>, RESULT>
): Executor<GetOneParsed<z.infer<PARAMS_ZOD>>, CONTEXT, RESULT> {
  return (parsed: GetOneParsed<z.infer<PARAMS_ZOD>>, context: CONTEXT) =>
    action(parsed.params, parsed.fieldRequest, context);
}

function executeCreateOneWith<CONTEXT, BODY_ZOD extends z.ZodTypeAny, RESULT>(
  action: CreateOneAction<CONTEXT, z.infer<BODY_ZOD>, RESULT>
): Executor<CreateOneParsed<z.infer<BODY_ZOD>>, CONTEXT, RESULT> {
  return (parsed: CreateOneParsed<z.infer<BODY_ZOD>>, context: CONTEXT) =>
    action(parsed.body, parsed.fieldRequest, context);
}

function executeUpdateOneWith<
  CONTEXT,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY_ZOD extends z.ZodTypeAny,
  RESULT
>(
  action: UpdateOneAction<
    CONTEXT,
    z.infer<PARAMS_ZOD>,
    z.infer<BODY_ZOD>,
    RESULT
  >
): Executor<
  UpdateOneParsed<z.infer<PARAMS_ZOD>, z.infer<BODY_ZOD>>,
  CONTEXT,
  RESULT
> {
  return (
    parsed: {
      params: z.infer<PARAMS_ZOD>;
      body: z.infer<BODY_ZOD>;
      fieldRequest: FieldRequest;
    },
    context: CONTEXT
  ) => action(parsed.params, parsed.body, parsed.fieldRequest, context);
}

// api dispatchers

function dispatchGetManyWith<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  QUERY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
>(
  config: GetManyDispatcherConfig<
    OPTIONS,
    CONTEXT,
    DATA,
    QUERY_ZOD,
    RESULT,
    ERROR
  >
): Dispatcher<CONTEXT, DATA, RESULT, ERROR> {
  const parser = parseGetManyWith(config.queryZod);
  const executor = executeGetManyWith(config.action);
  return dispatchWith({ ...config, parser, executor });
}

function dispatchGetOneWith<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  PARAMS_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
>(
  config: GetOneDispatcherConfig<
    OPTIONS,
    CONTEXT,
    DATA,
    PARAMS_ZOD,
    RESULT,
    ERROR
  >
): Dispatcher<CONTEXT, DATA, RESULT, ERROR> {
  const parser = parseGetOneWith(config.paramsZod);
  const executor = executeGetOneWith(config.action);
  return dispatchWith({ ...config, parser, executor });
}

function dispatchCreateOneWith<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  BODY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
>(
  config: CreateOneDispatcherConfig<
    OPTIONS,
    CONTEXT,
    DATA,
    BODY_ZOD,
    RESULT,
    ERROR
  >
): Dispatcher<CONTEXT, DATA, RESULT, ERROR> {
  const parser = parseCreateOneWith(config.bodyZod);
  const executor = executeCreateOneWith(config.action);
  return dispatchWith({ ...config, parser, executor });
}

function dispatchUpdateOneWith<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
>(
  config: UpdateOneDispatcherConfig<
    OPTIONS,
    CONTEXT,
    DATA,
    PARAMS_ZOD,
    BODY_ZOD,
    RESULT,
    ERROR
  >
): Dispatcher<CONTEXT, DATA, RESULT, ERROR> {
  const parser = parseUpdateOneWith(config.paramsZod, config.bodyZod);
  const executor = executeUpdateOneWith(config.action);
  return dispatchWith({ ...config, parser, executor });
}

// api aliases

const parseSearchWith = parseGetManyWith;
const parseGetOneSafeWith = parseGetOneWith;
const parseDeleteOneWith = parseGetOneWith;

const executeSearchWith = executeGetManyWith;
const executeGetOneSafeWith = executeGetOneWith;
const executeDeleteOneWith = executeGetOneWith;

const dispatchSearchWith = dispatchGetManyWith;
const dispatchGetOneSafeWith = dispatchGetOneWith;
const dispatchDeleteOneWith = dispatchGetOneWith;

export {
  CreateOneAction,
  CreateOneDispatcherConfig,
  CreateOneParsed,
  dispatchCreateOneWith,
  dispatchDeleteOneWith,
  dispatchGetManyWith,
  dispatchGetOneSafeWith,
  dispatchGetOneWith,
  dispatchSearchWith,
  dispatchUpdateOneWith,
  executeCreateOneWith,
  executeDeleteOneWith,
  executeGetManyWith,
  executeGetOneSafeWith,
  executeGetOneWith,
  executeSearchWith,
  executeUpdateOneWith,
  GetManyAction,
  GetManyDispatcherConfig,
  GetManyParsed,
  GetOneAction,
  GetOneDispatcherConfig,
  GetOneParsed,
  parseCreateOneWith,
  parseDeleteOneWith,
  parseGetManyWith,
  parseGetOneSafeWith,
  parseGetOneWith,
  parseSearchWith,
  parseUpdateOneWith,
  UpdateOneAction,
  UpdateOneDispatcherConfig,
  UpdateOneParsed,
};
