import * as z from "zod";
import { Dispatcher, DispatcherConfig, Executor, Parser } from "./dispatcher";
import { FieldRequest } from "./types";
type GetManyParsed<QUERY> = {
    query: QUERY;
    fieldRequest: FieldRequest;
};
type GetOneParsed<PARAMS> = {
    params: PARAMS;
    fieldRequest: FieldRequest;
};
type CreateOneParsed<BODY> = {
    body: BODY;
    fieldRequest: FieldRequest;
};
type UpdateOneParsed<PARAMS, BODY> = {
    params: PARAMS;
    body: BODY;
    fieldRequest: FieldRequest;
};
type GetManyAction<QUERY, CONTEXT, RESULT> = (query: QUERY, fieldRequest: FieldRequest, context: CONTEXT) => Promise<RESULT>;
type GetOneAction<PARAMS, CONTEXT, RESULT> = (params: PARAMS, fieldRequest: FieldRequest, context: CONTEXT) => Promise<RESULT>;
type CreateOneAction<BODY, CONTEXT, RESULT> = (body: BODY, fieldRequest: FieldRequest, context: CONTEXT) => Promise<RESULT>;
type UpdateOneAction<PARAMS, BODY, CONTEXT, RESULT> = (params: PARAMS, body: BODY, fieldRequest: FieldRequest, context: CONTEXT) => Promise<RESULT>;
type GetManyDispatcherConfig<OPTIONS, CONTEXT, DATA extends object, QUERY_ZOD extends z.ZodTypeAny, RESULT, ERROR> = {
    queryZod: QUERY_ZOD;
    action: GetManyAction<z.infer<QUERY_ZOD>, CONTEXT, RESULT>;
} & Omit<DispatcherConfig<OPTIONS, CONTEXT, DATA, GetManyParsed<z.infer<QUERY_ZOD>>, RESULT, ERROR>, "parser" | "executor">;
type GetOneDispatcherConfig<OPTIONS, CONTEXT, DATA extends object, PARAMS_ZOD extends z.ZodTypeAny, RESULT, ERROR> = {
    paramsZod: PARAMS_ZOD;
    action: GetOneAction<z.infer<PARAMS_ZOD>, CONTEXT, RESULT>;
} & Omit<DispatcherConfig<OPTIONS, CONTEXT, DATA, GetOneParsed<z.infer<PARAMS_ZOD>>, RESULT, ERROR>, "parser" | "executor">;
type CreateOneDispatcherConfig<OPTIONS, CONTEXT, DATA extends object, BODY_ZOD extends z.ZodTypeAny, RESULT, ERROR> = {
    bodyZod: BODY_ZOD;
    action: CreateOneAction<z.infer<BODY_ZOD>, CONTEXT, RESULT>;
} & Omit<DispatcherConfig<OPTIONS, CONTEXT, DATA, CreateOneParsed<z.infer<BODY_ZOD>>, RESULT, ERROR>, "parser" | "executor">;
type UpdateOneDispatcherConfig<OPTIONS, CONTEXT, DATA extends object, PARAMS_ZOD extends z.ZodTypeAny, BODY_ZOD extends z.ZodTypeAny, RESULT, ERROR> = {
    paramsZod: PARAMS_ZOD;
    bodyZod: z.ZodTypeAny;
    action: UpdateOneAction<z.infer<PARAMS_ZOD>, z.infer<BODY_ZOD>, CONTEXT, RESULT>;
} & Omit<DispatcherConfig<OPTIONS, CONTEXT, DATA, UpdateOneParsed<z.infer<PARAMS_ZOD>, z.infer<BODY_ZOD>>, RESULT, ERROR>, "parser" | "executor">;
declare function parseGetManyWith<CONTEXT, DATA extends object, QUERY_ZOD extends z.ZodTypeAny>(queryZod: QUERY_ZOD): Parser<CONTEXT, DATA, GetManyParsed<z.infer<QUERY_ZOD>>>;
declare function parseGetOneWith<CONTEXT, DATA, PARAMS_ZOD extends z.ZodTypeAny>(paramsZod: PARAMS_ZOD): Parser<CONTEXT, DATA, GetOneParsed<z.infer<PARAMS_ZOD>>>;
declare function parseCreateOneWith<CONTEXT, DATA, BODY_ZOD extends z.ZodTypeAny>(bodyZod: BODY_ZOD): Parser<CONTEXT, DATA, CreateOneParsed<z.infer<BODY_ZOD>>>;
declare function parseUpdateOneWith<CONTEXT, DATA extends object, PARAMS_ZOD extends z.ZodTypeAny, BODY_ZOD extends z.ZodTypeAny>(paramsZod: PARAMS_ZOD, bodyZod: BODY_ZOD): Parser<CONTEXT, DATA, UpdateOneParsed<z.infer<PARAMS_ZOD>, z.infer<BODY_ZOD>>>;
declare function executeGetManyWith<CONTEXT, QUERY_ZOD extends z.ZodTypeAny, RESULT>(action: GetManyAction<z.infer<QUERY_ZOD>, CONTEXT, RESULT>): Executor<GetManyParsed<z.infer<QUERY_ZOD>>, CONTEXT, RESULT>;
declare function executeGetOneWith<CONTEXT, PARAMS_ZOD extends z.ZodTypeAny, RESULT>(action: GetOneAction<CONTEXT, z.infer<PARAMS_ZOD>, RESULT>): Executor<GetOneParsed<z.infer<PARAMS_ZOD>>, CONTEXT, RESULT>;
declare function executeCreateOneWith<CONTEXT, BODY_ZOD extends z.ZodTypeAny, RESULT>(action: CreateOneAction<CONTEXT, z.infer<BODY_ZOD>, RESULT>): Executor<CreateOneParsed<z.infer<BODY_ZOD>>, CONTEXT, RESULT>;
declare function executeUpdateOneWith<CONTEXT, PARAMS_ZOD extends z.ZodTypeAny, BODY_ZOD extends z.ZodTypeAny, RESULT>(action: UpdateOneAction<CONTEXT, z.infer<PARAMS_ZOD>, z.infer<BODY_ZOD>, RESULT>): Executor<UpdateOneParsed<z.infer<PARAMS_ZOD>, z.infer<BODY_ZOD>>, CONTEXT, RESULT>;
declare function dispatchGetManyWith<OPTIONS, CONTEXT, DATA extends object, QUERY_ZOD extends z.ZodTypeAny, RESULT, ERROR>(config: GetManyDispatcherConfig<OPTIONS, CONTEXT, DATA, QUERY_ZOD, RESULT, ERROR>): Dispatcher<CONTEXT, DATA, RESULT, ERROR>;
declare function dispatchGetOneWith<OPTIONS, CONTEXT, DATA extends object, PARAMS_ZOD extends z.ZodTypeAny, RESULT, ERROR>(config: GetOneDispatcherConfig<OPTIONS, CONTEXT, DATA, PARAMS_ZOD, RESULT, ERROR>): Dispatcher<CONTEXT, DATA, RESULT, ERROR>;
declare function dispatchCreateOneWith<OPTIONS, CONTEXT, DATA extends object, BODY_ZOD extends z.ZodTypeAny, RESULT, ERROR>(config: CreateOneDispatcherConfig<OPTIONS, CONTEXT, DATA, BODY_ZOD, RESULT, ERROR>): Dispatcher<CONTEXT, DATA, RESULT, ERROR>;
declare function dispatchUpdateOneWith<OPTIONS, CONTEXT, DATA extends object, PARAMS_ZOD extends z.ZodTypeAny, BODY_ZOD extends z.ZodTypeAny, RESULT, ERROR>(config: UpdateOneDispatcherConfig<OPTIONS, CONTEXT, DATA, PARAMS_ZOD, BODY_ZOD, RESULT, ERROR>): Dispatcher<CONTEXT, DATA, RESULT, ERROR>;
declare const parseSearchWith: typeof parseGetManyWith;
declare const parseGetOneSafeWith: typeof parseGetOneWith;
declare const parseDeleteOneWith: typeof parseGetOneWith;
declare const executeSearchWith: typeof executeGetManyWith;
declare const executeGetOneSafeWith: typeof executeGetOneWith;
declare const executeDeleteOneWith: typeof executeGetOneWith;
declare const dispatchSearchWith: typeof dispatchGetManyWith;
declare const dispatchGetOneSafeWith: typeof dispatchGetOneWith;
declare const dispatchDeleteOneWith: typeof dispatchGetOneWith;
export { CreateOneAction, CreateOneDispatcherConfig, CreateOneParsed, dispatchCreateOneWith, dispatchDeleteOneWith, dispatchGetManyWith, dispatchGetOneSafeWith, dispatchGetOneWith, dispatchSearchWith, dispatchUpdateOneWith, executeCreateOneWith, executeDeleteOneWith, executeGetManyWith, executeGetOneSafeWith, executeGetOneWith, executeSearchWith, executeUpdateOneWith, GetManyAction, GetManyDispatcherConfig, GetManyParsed, GetOneAction, GetOneDispatcherConfig, GetOneParsed, parseCreateOneWith, parseDeleteOneWith, parseGetManyWith, parseGetOneSafeWith, parseGetOneWith, parseSearchWith, parseUpdateOneWith, UpdateOneAction, UpdateOneDispatcherConfig, UpdateOneParsed, };
