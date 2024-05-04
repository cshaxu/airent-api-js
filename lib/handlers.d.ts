import * as z from "zod";
import { CreateOneApiHandlerConfig, GetManyApiHandlerConfig, GetOneApiHandlerConfig, HandlerConfig, UpdateOneApiHandlerConfig, WrappableHandlerConfig } from "./types";
declare function handleGetMany<CONTEXT, RESULT, OPTIONS, QUERY_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: GetManyApiHandlerConfig<CONTEXT, RESULT, OPTIONS, QUERY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleGetOne<CONTEXT, RESULT, OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: GetOneApiHandlerConfig<CONTEXT, RESULT, OPTIONS, PARAMS_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleGetOneSafe: typeof handleGetOne;
declare function handleCreateOne<CONTEXT, RESULT, OPTIONS, BODY_ZOD extends z.ZodTypeAny, FIELD_REQUEST>(config: CreateOneApiHandlerConfig<CONTEXT, RESULT, OPTIONS, BODY_ZOD, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare function handleUpdateOne<CONTEXT, RESULT, OPTIONS, PARAMS_ZOD extends z.ZodTypeAny, BODY, FIELD_REQUEST>(config: UpdateOneApiHandlerConfig<CONTEXT, RESULT, OPTIONS, PARAMS_ZOD, BODY, FIELD_REQUEST>): (request: Request) => Promise<Response>;
declare const handleDeleteOne: typeof handleGetOne;
declare function wrappableHandle<CONTEXT, PARSED, RESULT, OPTIONS>(config: WrappableHandlerConfig<CONTEXT, PARSED, RESULT, OPTIONS>): (request: Request) => Promise<Response>;
declare function handle<CONTEXT, PARSED, RESULT, OPTIONS>(config: HandlerConfig<CONTEXT, PARSED, RESULT, OPTIONS>): (request: Request) => Promise<Response>;
export { handle, handleCreateOne, handleDeleteOne, handleGetMany, handleGetOne, handleGetOneSafe, handleUpdateOne, wrappableHandle, };