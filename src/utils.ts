import createHttpError from "http-errors";

async function fetchJsonOrThrow(
  input: string,
  init?: RequestInit
): Promise<any> {
  const response = await fetch(input, init);
  const json = await response.json();
  if (json.error) {
    throw createHttpError(response.status, json.error);
  }
  return json;
}

function getMin<T>(array: T[]): T | null {
  return array.reduce(
    (acc, value) =>
      isNil(value) ? acc : isNil(acc) ? value : acc < value ? acc : value,
    null as T | null
  );
}

function getMax<T>(array: T[]): T | null {
  return array.reduce(
    (acc, value) =>
      isNil(value) ? acc : isNil(acc) ? value : acc > value ? acc : value,
    null as T | null
  );
}

function isNil(value: any): value is null | undefined {
  return value === undefined || value === null;
}

const isFunction = (object: any) => typeof object === "function";

function isReadableStream(object: any): object is ReadableStream {
  return (
    object instanceof ReadableStream ||
    (!isNil(object) &&
      isFunction(object.cancel) &&
      isFunction(object.cancel) &&
      isFunction(object.getReader) &&
      isFunction(object.pipeTo) &&
      isFunction(object.pipeThrough) &&
      isFunction(object.tee))
  );
}

export {
  fetchJsonOrThrow,
  getMax,
  getMin,
  isFunction,
  isNil,
  isReadableStream,
};
