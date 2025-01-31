import { Readable } from "stream";

// type checks

function isFunction(value: any): value is Function {
  return typeof value === "function";
}

function isNil(value: any): value is null | undefined {
  return value === undefined || value === null;
}

function isReadableStream(value: any): value is ReadableStream {
  return (
    value instanceof ReadableStream ||
    (!isNil(value) &&
      isFunction(value.cancel) &&
      isFunction(value.cancel) &&
      isFunction(value.getReader) &&
      isFunction(value.pipeTo) &&
      isFunction(value.pipeThrough) &&
      isFunction(value.tee))
  );
}

// container modifications

function existify<T>(array: T[]): NonNullable<T>[] {
  return array.filter((o) => !isNil(o)).map((o) => o!);
}

function purify<T extends Record<string, any>>(object: T): T {
  Object.keys(object)
    .filter((key) => object[key] === undefined)
    .forEach((key) => delete object[key]);
  return object;
}

function shuffle<T>(array: T[]) {
  let i = array.length;
  // While there remain elements to shuffle.
  while (i > 0) {
    // Pick a remaining element.
    const j = Math.floor(Math.random() * i--);
    // And swap it with the current element.
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// container stats

function min<T>(array: T[]): T | null {
  return array.reduce(
    (acc, value) =>
      isNil(value) ? acc : isNil(acc) ? value : acc < value ? acc : value,
    null as T | null
  );
}

function max<T>(array: T[]): T | null {
  return array.reduce(
    (acc, value) =>
      isNil(value) ? acc : isNil(acc) ? value : acc > value ? acc : value,
    null as T | null
  );
}

function popular<T>(array: T[]): T | null {
  const frequency = new Map();
  let maxElement = null;
  let maxCount = 0;
  array.forEach((element) => {
    frequency.set(element, (frequency.get(element) ?? 0) + 1);
    if (frequency.get(element) > maxCount) {
      maxElement = element;
      maxCount = frequency.get(element);
    }
  });
  return maxElement;
}

// promises

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// https://blog.jcore.com/2016/12/promise-me-you-wont-use-promise-race/
function race<T>(promises: Promise<T>[]): Promise<number> {
  const array = Array.from(promises);
  if (!array.length) {
    return Promise.reject("Insufficient promises.");
  }

  // There is no way to know which promise is resolved/rejected.
  // So we map it to a new promise to return the index wether it fails or succeeeds.
  const indexPromises = array.map((promise, index) =>
    promise.then(
      () => index,
      () => {
        throw index;
      }
    )
  );

  return Promise.race(indexPromises);
}

// stream

async function bufferify(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.on("error", (err: Error) => {
      reject(err);
    });
  });
}

function mockReadableStream(content: string): ReadableStream<any> {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(content);
  const underlyingSource = {
    start(controller: ReadableStreamController<any>) {
      controller.enqueue(uint8Array);
      controller.close();
    },
  };
  return new ReadableStream<any>(underlyingSource);
}

// http

function queryStringify(query: Record<string, any>): string {
  const urlSearchParams = new URLSearchParams();
  Object.keys(query).forEach((key) => {
    if (query[key] instanceof Date) {
      urlSearchParams.append(key, query[key].toISOString());
    } else if (!Array.isArray(query[key])) {
      urlSearchParams.append(key, query[key]);
    }
  });
  const nonArrayQuery = urlSearchParams.toString();
  const arrayQuery = Object.keys(query)
    .filter((key) => Array.isArray(query[key]))
    .map((key) =>
      query[key].map((value: any) => `${key}[]=${encodeURIComponent(value)}`)
    )
    .flat()
    .join("&");
  return [nonArrayQuery, arrayQuery].filter((s) => s.length > 0).join("&");
}

function isUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
}

async function fetchJsonOrThrow(
  input: string,
  init?: RequestInit
): Promise<any> {
  const response = await fetch(input, init);
  return await getJsonOrThrow(response);
}

async function getJsonOrThrow(response: Response): Promise<any> {
  const json = await response.json();
  if (json.error) {
    throw new Error(json.error.message);
  }
  return json;
}

function buildJsonRequestInit(
  data: any,
  options: RequestInit = {}
): RequestInit {
  const body = JSON.stringify(data);
  const headers = buildHeaders(body.length, options.headers);
  return { credentials: "include", method: "POST", body, ...options, headers };
}

function buildHeaders(length: number, headers?: HeadersInit): Headers {
  const entries = headers === undefined ? [] : getHeaderEntries(headers);
  const results = entries
    .filter(
      ([k]) => !["content-type", "content-length"].includes(k.toLowerCase())
    )
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {
      "content-type": "application/json",
      "content-length": length.toString(),
    });
  return new Headers(results);
}

function getHeaderEntries(headers: HeadersInit): [string, string][] {
  if (headers instanceof Headers) {
    return Array.from(headers.entries());
  }
  if (Array.isArray(headers)) {
    return headers;
  }
  return Object.entries(headers);
}

// number

function round(value: number, digits: number): number {
  const base = 10 ** digits;
  return Math.round(value * base) / base;
}

export {
  bufferify,
  buildJsonRequestInit,
  existify,
  fetchJsonOrThrow,
  getJsonOrThrow,
  isFunction,
  isNil,
  isReadableStream,
  isUrl,
  max,
  min,
  mockReadableStream,
  popular,
  purify,
  queryStringify,
  race,
  round,
  shuffle,
  wait,
};
