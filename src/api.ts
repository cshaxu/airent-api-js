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

type SearchParsed<QUERY> = GetManyParsed<QUERY>;

type GetOneSafeParsed<PARAMS> = GetOneParsed<PARAMS>;

type DeleteOneParsed<PARAMS> = GetOneParsed<PARAMS>;

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

type SearchAction<QUERY, CONTEXT, RESULT> = GetManyAction<
  QUERY,
  CONTEXT,
  RESULT
>;

type GetOneSafeAction<PARAMS, CONTEXT, RESULT> = GetOneAction<
  PARAMS,
  CONTEXT,
  RESULT
>;

type DeleteOneAction<PARAMS, CONTEXT, RESULT> = GetOneAction<
  PARAMS,
  CONTEXT,
  RESULT
>;

// api dispatcher config types

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

type SearchDispatcherConfig<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  QUERY_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
> = GetManyDispatcherConfig<OPTIONS, CONTEXT, DATA, QUERY_ZOD, RESULT, ERROR>;

type GetOneSafeDispatcherConfig<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  PARAMS_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
> = GetOneDispatcherConfig<OPTIONS, CONTEXT, DATA, PARAMS_ZOD, RESULT, ERROR>;

type DeleteOneDispatcherConfig<
  OPTIONS,
  CONTEXT,
  DATA extends object,
  PARAMS_ZOD extends z.ZodTypeAny,
  RESULT,
  ERROR
> = GetOneDispatcherConfig<OPTIONS, CONTEXT, DATA, PARAMS_ZOD, RESULT, ERROR>;

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

function parseGetOneWith<
  CONTEXT,
  DATA extends object,
  PARAMS_ZOD extends z.ZodTypeAny
>(
  paramsZod: PARAMS_ZOD
): Parser<CONTEXT, DATA, GetOneParsed<z.infer<PARAMS_ZOD>>> {
  return async (data: DATA) => {
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

function parseCreateOneWith<
  CONTEXT,
  DATA extends object,
  BODY_ZOD extends z.ZodTypeAny
>(
  bodyZod: BODY_ZOD
): Parser<CONTEXT, DATA, CreateOneParsed<z.infer<BODY_ZOD>>> {
  return async (data: DATA) => {
    const bodyRaw = "body" in data ? data.body : undefined;
    const fieldRequestRaw =
      "fieldRequest" in data ? data.fieldRequest : undefined;
    if (bodyRaw === undefined) {
      throw createHttpError.BadRequest("Missing `body`");
    }
    if (fieldRequestRaw === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const body = (await bodyZod.parseAsync(bodyRaw)) as z.infer<BODY_ZOD>;
    const fieldRequest = fieldRequestRaw as FieldRequest;
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

const parseSearchWith = parseGetManyWith;
const parseGetOneSafeWith = parseGetOneWith;
const parseDeleteOneWith = parseGetOneWith;

// api executors

function executeGetManyWith<CONTEXT, QUERY_ZOD extends z.ZodTypeAny, RESULT>(
  action: GetManyAction<z.infer<QUERY_ZOD>, CONTEXT, RESULT>
): Executor<GetManyParsed<z.infer<QUERY_ZOD>>, CONTEXT, RESULT> {
  return (parsed: GetManyParsed<z.infer<QUERY_ZOD>>, context: CONTEXT) =>
    action(parsed.query, parsed.fieldRequest, context);
}

function executeGetOneWith<CONTEXT, PARAMS_ZOD extends z.ZodTypeAny, RESULT>(
  action: GetOneAction<z.infer<PARAMS_ZOD>, CONTEXT, RESULT>
): Executor<GetOneParsed<z.infer<PARAMS_ZOD>>, CONTEXT, RESULT> {
  return (parsed: GetOneParsed<z.infer<PARAMS_ZOD>>, context: CONTEXT) =>
    action(parsed.params, parsed.fieldRequest, context);
}

function executeCreateOneWith<CONTEXT, BODY_ZOD extends z.ZodTypeAny, RESULT>(
  action: CreateOneAction<z.infer<BODY_ZOD>, CONTEXT, RESULT>
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
    z.infer<PARAMS_ZOD>,
    z.infer<BODY_ZOD>,
    CONTEXT,
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

const executeSearchWith = executeGetManyWith;
const executeGetOneSafeWith = executeGetOneWith;
const executeDeleteOneWith = executeGetOneWith;

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
): Dispatcher<CONTEXT, DATA, any, ERROR> {
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
): Dispatcher<CONTEXT, DATA, any, ERROR> {
  const parser = parseGetOneWith<CONTEXT, DATA, PARAMS_ZOD>(config.paramsZod);
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
): Dispatcher<CONTEXT, DATA, any, ERROR> {
  const parser = parseCreateOneWith<CONTEXT, DATA, BODY_ZOD>(config.bodyZod);
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
): Dispatcher<CONTEXT, DATA, any, ERROR> {
  const parser = parseUpdateOneWith<CONTEXT, DATA, PARAMS_ZOD, BODY_ZOD>(
    config.paramsZod,
    config.bodyZod as BODY_ZOD
  );
  const executor = executeUpdateOneWith(config.action);
  return dispatchWith({ ...config, parser, executor });
}

const dispatchSearchWith = dispatchGetManyWith;
const dispatchGetOneSafeWith = dispatchGetOneWith;
const dispatchDeleteOneWith = dispatchGetOneWith;

export {
  CreateOneAction,
  CreateOneDispatcherConfig,
  CreateOneParsed,
  DeleteOneAction,
  DeleteOneDispatcherConfig,
  DeleteOneParsed,
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
  GetOneSafeAction,
  GetOneSafeDispatcherConfig,
  GetOneSafeParsed,
  parseCreateOneWith,
  parseDeleteOneWith,
  parseGetManyWith,
  parseGetOneSafeWith,
  parseGetOneWith,
  parseSearchWith,
  parseUpdateOneWith,
  SearchAction,
  SearchDispatcherConfig,
  SearchParsed,
  UpdateOneAction,
  UpdateOneDispatcherConfig,
  UpdateOneParsed,
};
