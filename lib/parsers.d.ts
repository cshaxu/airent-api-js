import * as z from "zod";
declare const parseBodyWith: <Z extends z.ZodTypeAny>(bodyZod: Z) => (request: Request) => Promise<z.TypeOf<Z>>;
declare function parseBody<Z extends z.ZodTypeAny>(request: Request, bodyZod: Z): Promise<z.infer<Z>>;
declare const parseQueryWith: <Z extends z.AnyZodObject>(queryZod: Z, arrayKeys?: string[]) => (request: Request) => Promise<z.TypeOf<Z>>;
declare function parseQuery<Z extends z.AnyZodObject>(request: Request, queryZod: Z, arrayKeys?: string[]): Promise<z.infer<Z>>;
declare const parseFormWith: <Z extends z.AnyZodObject>(bodyZod: Z, arrayKeys?: string[]) => (request: Request) => Promise<z.TypeOf<Z>>;
declare function parseForm<Z extends z.AnyZodObject>(request: Request, bodyZod: Z, arrayKeys?: string[]): Promise<z.infer<Z>>;
export { parseBody, parseBodyWith, parseForm, parseFormWith, parseQuery, parseQueryWith, };
