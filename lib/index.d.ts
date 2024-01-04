import * as z from "zod";
declare function getMin<T>(array: T[]): T | null;
declare function getMax<T>(array: T[]): T | null;
type Authenticator<DISPATCHER_OPTIONS> = (headers: Headers, options?: DISPATCHER_OPTIONS) => Promise<any>;
type GetManyApiExecutor<QUERY, FIELD_REQUEST> = (query: QUERY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type GetOneApiExecutor<PARAMS, FIELD_REQUEST> = (params: PARAMS, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type CreateOneApiExecutor<BODY, FIELD_REQUEST> = (body: BODY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type UpdateOneApiExecutor<PARAMS, BODY, FIELD_REQUEST> = (params: PARAMS, body: BODY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type GetManyApiHandlerConfig<DISPATCHER_OPTIONS, QUERY_ZOD extends z.AnyZodObject, FIELD_REQUEST> = {
    queryZod: QUERY_ZOD;
    authenticator: Authenticator<DISPATCHER_OPTIONS>;
    apiExecutor: GetManyApiExecutor<z.infer<QUERY_ZOD>, FIELD_REQUEST>;
    options?: DISPATCHER_OPTIONS;
};
type GetOneApiHandlerConfig<DISPATCHER_OPTIONS, PARAMS_ZOD extends z.AnyZodObject, FIELD_REQUEST> = {
    paramsZod: PARAMS_ZOD;
    apiExecutor: GetOneApiExecutor<z.infer<PARAMS_ZOD>, FIELD_REQUEST>;
    authenticator: Authenticator<DISPATCHER_OPTIONS>;
    options?: DISPATCHER_OPTIONS;
};
type CreateOneApiHandlerConfig<DISPATCHER_OPTIONS, BODY_ZOD extends z.AnyZodObject, FIELD_REQUEST> = {
    bodyZod: BODY_ZOD;
    apiExecutor: CreateOneApiExecutor<z.infer<BODY_ZOD>, FIELD_REQUEST>;
    authenticator: Authenticator<DISPATCHER_OPTIONS>;
    options?: DISPATCHER_OPTIONS;
};
type UpdateOneApiHandlerConfig<DISPATCHER_OPTIONS, PARAMS_ZOD extends z.AnyZodObject, BODY, FIELD_REQUEST> = {
    paramsZod: PARAMS_ZOD;
    bodyZod: z.AnyZodObject;
    apiExecutor: UpdateOneApiExecutor<z.infer<PARAMS_ZOD>, BODY, FIELD_REQUEST>;
    authenticator: Authenticator<DISPATCHER_OPTIONS>;
    options?: DISPATCHER_OPTIONS;
};
declare function handleGetMany<DISPATCHER_OPTIONS, QUERY_ZOD extends z.AnyZodObject, FIELD_REQUEST>(config: GetManyApiHandlerConfig<DISPATCHER_OPTIONS, QUERY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleSearch: typeof handleGetMany;
declare function handleGetOne<DISPATCHER_OPTIONS, PARAMS_ZOD extends z.AnyZodObject, FIELD_REQUEST>(config: GetOneApiHandlerConfig<DISPATCHER_OPTIONS, PARAMS_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleCreateOne<DISPATCHER_OPTIONS, BODY_ZOD extends z.AnyZodObject, FIELD_REQUEST>(config: CreateOneApiHandlerConfig<DISPATCHER_OPTIONS, BODY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleUpdateOne<DISPATCHER_OPTIONS, PARAMS_ZOD extends z.AnyZodObject, BODY, FIELD_REQUEST>(config: UpdateOneApiHandlerConfig<DISPATCHER_OPTIONS, PARAMS_ZOD, BODY, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleDeleteOne: typeof handleGetOne;
declare function dispatch<DISPATCHER_OPTIONS, REQUEST_CONTEXT, PARSED, RESULT>(authenticate: (headers: Headers, options?: DISPATCHER_OPTIONS) => Promise<REQUEST_CONTEXT>, validate: (request: Request, rc: REQUEST_CONTEXT) => Promise<PARSED>, execute: (parsed: PARSED, rc: REQUEST_CONTEXT) => Promise<RESULT>, request: Request, options?: DISPATCHER_OPTIONS): Promise<Response>;
export { Authenticator, CreateOneApiExecutor, CreateOneApiHandlerConfig, dispatch, GetManyApiExecutor, GetManyApiHandlerConfig, getMax, getMin, GetOneApiExecutor, GetOneApiHandlerConfig, handleCreateOne, handleDeleteOne, handleGetMany, handleGetOne, handleSearch, handleUpdateOne, UpdateOneApiExecutor, UpdateOneApiHandlerConfig, };
