import * as z from "zod";

type AnyZodObject = z.ZodObject<any, any>;

const parseBodyWith =
  <Z extends z.ZodTypeAny>(bodyZod: Z) =>
  (request: Request) =>
    parseBody(request, bodyZod);

async function parseBody<Z extends z.ZodTypeAny>(
  request: Request,
  bodyZod: Z
): Promise<z.infer<Z>> {
  return await request.json().then(bodyZod.parseAsync);
}

const parseQueryWith =
  <Z extends AnyZodObject>(queryZod: Z, arrayKeys?: string[]) =>
  (request: Request) =>
    parseQuery(request, queryZod, arrayKeys);

async function parseQuery<Z extends AnyZodObject>(
  request: Request,
  queryZod: Z,
  arrayKeys?: string[]
): Promise<z.infer<Z>> {
  const { searchParams } = new URL(request.url);
  return await parse(searchParams, queryZod, arrayKeys);
}

const parseFormWith =
  <Z extends AnyZodObject>(bodyZod: Z, arrayKeys?: string[]) =>
  (request: Request) =>
    parseForm(request, bodyZod, arrayKeys);

async function parseForm<Z extends AnyZodObject>(
  request: Request,
  bodyZod: Z,
  arrayKeys?: string[]
): Promise<z.infer<Z>> {
  const formData = await request
    .formData()
    .then((data) => data as unknown as URLSearchParams);
  return await parse(formData, bodyZod, arrayKeys);
}

async function parse<Z extends AnyZodObject>(
  urlSearchParams: URLSearchParams,
  zodObject: Z,
  arrayKeys?: string[]
): Promise<z.infer<Z>> {
  arrayKeys = arrayKeys === undefined ? getArrayKeys(zodObject) : arrayKeys;
  const parsedRaw = buildObject(urlSearchParams, arrayKeys);
  return await zodObject.parseAsync(parsedRaw);
}

function getArrayKeys(zodObject: AnyZodObject): string[] {
  const keys = Object.keys(zodObject.shape);
  return keys.filter((key) => isZodArray(zodObject.shape[key]));
}

function isZodArray(zodType: z.ZodTypeAny): boolean {
  let zt = zodType;
  while (zt instanceof z.ZodOptional || zt instanceof z.ZodNullable) {
    zt = zt.unwrap() as z.ZodTypeAny;
  }
  return zt instanceof z.ZodArray;
}

function buildObject(
  urlSearchParams: URLSearchParams,
  arrayKeys: string[]
): Record<string, any> {
  return Array.from(urlSearchParams.keys()).reduce((acc, key) => {
    const k = key.endsWith("[]") ? key.slice(0, -2) : key;
    if (arrayKeys.includes(k)) {
      const value = urlSearchParams.getAll(key);
      if (value.length > 0) {
        acc[k] = value;
      }
    } else {
      const value = urlSearchParams.get(key);
      if (value !== null) {
        acc[k] = value;
      }
    }
    return acc;
  }, {} as Record<string, any>);
}

export {
  parseBody,
  parseBodyWith,
  parseForm,
  parseFormWith,
  parseQuery,
  parseQueryWith,
};
