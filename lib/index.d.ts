import * as z from "zod";
declare function getMin<T>(array: T[]): T | null;
declare function getMax<T>(array: T[]): T | null;
type Authenticator<OPTIONS, REQUEST_CONTEXT> = (headers: Headers, options?: OPTIONS) => Promise<REQUEST_CONTEXT>;
type ErrorContext = {
    method: string;
    url: string;
    rc: any;
    parsed: any;
    result: any;
};
type ErrorHandler = (error: any, ec: ErrorContext) => Response;
type GetManyAction<QUERY, FIELD_REQUEST> = (query: QUERY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type GetOneAction<PARAMS, FIELD_REQUEST> = (params: PARAMS, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type CreateOneAction<BODY, FIELD_REQUEST> = (body: BODY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type UpdateOneAction<PARAMS, BODY, FIELD_REQUEST> = (params: PARAMS, body: BODY, rc: any, fieldRequest: FIELD_REQUEST) => Promise<any>;
type GetManyApiHandlerConfig<OPTIONS, QUERY_ZOD extends z.ZodTypeAny, FIELD_REQUEST> = {
    queryZod: QUERY_ZOD;
    action: GetManyAction<z.infer<QUERY_ZOD>, FIELD_REQUEST>;
} & Omit<HandlerConfig<OPTIONS, any, any, any>, "validator" | "executor">;
type GetOneApiHandlerConfig<OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, FIELD_REQUEST> = {
    paramsZod: PARAMS_ZOD;
    action: GetOneAction<z.infer<PARAMS_ZOD>, FIELD_REQUEST>;
} & Omit<HandlerConfig<OPTIONS, any, any, any>, "validator" | "executor">;
type CreateOneApiHandlerConfig<OPTIONS, BODY_ZOD extends z.ZodTypeAny, FIELD_REQUEST> = {
    bodyZod: BODY_ZOD;
    action: CreateOneAction<z.infer<BODY_ZOD>, FIELD_REQUEST>;
} & Omit<HandlerConfig<OPTIONS, any, any, any>, "validator" | "executor">;
type UpdateOneApiHandlerConfig<OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, BODY, FIELD_REQUEST> = {
    paramsZod: PARAMS_ZOD;
    bodyZod: z.ZodTypeAny;
    action: UpdateOneAction<z.infer<PARAMS_ZOD>, BODY, FIELD_REQUEST>;
} & Omit<HandlerConfig<OPTIONS, any, any, any>, "validator" | "executor">;
declare function handleGetMany<OPTIONS, QUERY_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: GetManyApiHandlerConfig<OPTIONS, QUERY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleSearch: typeof handleGetMany;
declare function handleGetOne<OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: GetOneApiHandlerConfig<OPTIONS, PARAMS_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleCreateOne<OPTIONS, BODY_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: CreateOneApiHandlerConfig<OPTIONS, BODY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleUpdateOne<OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, BODY, FIELD_REQUEST>(config: UpdateOneApiHandlerConfig<OPTIONS, PARAMS_ZOD, BODY, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleDeleteOne: typeof handleGetOne;
type HandlerConfig<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT> = {
    authenticator: Authenticator<OPTIONS, REQUEST_CONTEXT>;
    validator: (request: Request, rc: REQUEST_CONTEXT) => Promise<PARSED>;
    executor: (parsed: PARSED, rc: REQUEST_CONTEXT) => Promise<RESULT>;
    errorHandler?: ErrorHandler;
    options?: OPTIONS;
    code?: number;
};
declare function handle<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT>(config: HandlerConfig<OPTIONS, REQUEST_CONTEXT, PARSED, RESULT>): (request: Request) => Promise<Response>;
export { Authenticator, CreateOneAction, CreateOneApiHandlerConfig, ErrorContext, ErrorHandler, GetManyAction, GetManyApiHandlerConfig, GetOneAction, GetOneApiHandlerConfig, HandlerConfig, UpdateOneAction, UpdateOneApiHandlerConfig, getMax, getMin, handle, handleCreateOne, handleDeleteOne, handleGetMany, handleGetOne, handleSearch, handleUpdateOne, };
