import * as z from "zod";
declare function getMin<T>(array: T[]): T | null;
declare function getMax<T>(array: T[]): T | null;
type Authenticator<OPTIONS, REQUEST_CONTEXT> = (headers: Headers, options?: OPTIONS) => Promise<REQUEST_CONTEXT>;
type GetManyApiExecutor<QUERY, FIELD_REQUEST> = (query: QUERY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type GetOneApiExecutor<PARAMS, FIELD_REQUEST> = (params: PARAMS, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type CreateOneApiExecutor<BODY, FIELD_REQUEST> = (body: BODY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type UpdateOneApiExecutor<PARAMS, BODY, FIELD_REQUEST> = (params: PARAMS, body: BODY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type GetManyApiHandlerConfig<OPTIONS, QUERY_ZOD extends z.AnyZodObject, FIELD_REQUEST> = {
    queryZod: QUERY_ZOD;
    authenticator: Authenticator<OPTIONS, any>;
    apiExecutor: GetManyApiExecutor<z.infer<QUERY_ZOD>, FIELD_REQUEST>;
    options?: OPTIONS;
};
type GetOneApiHandlerConfig<OPTIONS, PARAMS_ZOD extends z.AnyZodObject, FIELD_REQUEST> = {
    paramsZod: PARAMS_ZOD;
    apiExecutor: GetOneApiExecutor<z.infer<PARAMS_ZOD>, FIELD_REQUEST>;
    authenticator: Authenticator<OPTIONS, any>;
    options?: OPTIONS;
};
type CreateOneApiHandlerConfig<OPTIONS, BODY_ZOD extends z.AnyZodObject, FIELD_REQUEST> = {
    bodyZod: BODY_ZOD;
    apiExecutor: CreateOneApiExecutor<z.infer<BODY_ZOD>, FIELD_REQUEST>;
    authenticator: Authenticator<OPTIONS, any>;
    options?: OPTIONS;
};
type UpdateOneApiHandlerConfig<OPTIONS, PARAMS_ZOD extends z.AnyZodObject, BODY, FIELD_REQUEST> = {
    paramsZod: PARAMS_ZOD;
    bodyZod: z.AnyZodObject;
    apiExecutor: UpdateOneApiExecutor<z.infer<PARAMS_ZOD>, BODY, FIELD_REQUEST>;
    authenticator: Authenticator<OPTIONS, any>;
    options?: OPTIONS;
};
declare function handleGetMany<OPTIONS, QUERY_ZOD extends z.AnyZodObject, FIELD_REQUEST>(config: GetManyApiHandlerConfig<OPTIONS, QUERY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleSearch: typeof handleGetMany;
declare function handleGetOne<OPTIONS, PARAMS_ZOD extends z.AnyZodObject, FIELD_REQUEST>(config: GetOneApiHandlerConfig<OPTIONS, PARAMS_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleCreateOne<OPTIONS, BODY_ZOD extends z.AnyZodObject, FIELD_REQUEST>(config: CreateOneApiHandlerConfig<OPTIONS, BODY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleUpdateOne<OPTIONS, PARAMS_ZOD extends z.AnyZodObject, BODY, FIELD_REQUEST>(config: UpdateOneApiHandlerConfig<OPTIONS, PARAMS_ZOD, BODY, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleDeleteOne: typeof handleGetOne;
type HandlerConfig<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT> = {
    authenticator: Authenticator<OPTIONS, REQUEST_CONTEXT>;
    validator: (request: Request, rc: REQUEST_CONTEXT) => Promise<PARSED>;
    executor: (parsed: PARSED, rc: REQUEST_CONTEXT) => Promise<RESULT>;
    options?: OPTIONS;
};
declare function handle<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT>(config: HandlerConfig<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT>): (request: Request) => Promise<Response>;
export { Authenticator, CreateOneApiExecutor, CreateOneApiHandlerConfig, GetManyApiExecutor, GetManyApiHandlerConfig, GetOneApiExecutor, GetOneApiHandlerConfig, HandlerConfig, UpdateOneApiExecutor, UpdateOneApiHandlerConfig, getMax, getMin, handle, handleCreateOne, handleDeleteOne, handleGetMany, handleGetOne, handleSearch, handleUpdateOne, };
