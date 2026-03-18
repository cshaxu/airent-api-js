import * as z from "zod";
type AnyZodObject = z.ZodObject<any, any>;
declare const parseBodyWith: <Z extends z.ZodTypeAny>(bodyZod: Z) => (request: Request) => Promise<z.core.output<Z>>;
declare function parseBody<Z extends z.ZodTypeAny>(request: Request, bodyZod: Z): Promise<z.infer<Z>>;
declare const parseQueryWith: <Z extends AnyZodObject>(queryZod: Z, arrayKeys?: string[]) => (request: Request) => Promise<z.core.output<Z>>;
declare function parseQuery<Z extends AnyZodObject>(request: Request, queryZod: Z, arrayKeys?: string[]): Promise<z.infer<Z>>;
declare const parseFormWith: <Z extends AnyZodObject>(bodyZod: Z, arrayKeys?: string[]) => (request: Request) => Promise<z.core.output<Z>>;
declare function parseForm<Z extends AnyZodObject>(request: Request, bodyZod: Z, arrayKeys?: string[]): Promise<z.infer<Z>>;
export { parseBody, parseBodyWith, parseForm, parseFormWith, parseQuery, parseQueryWith, };
