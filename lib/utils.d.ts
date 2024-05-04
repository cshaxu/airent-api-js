declare function fetchJsonOrThrow(input: string, init?: RequestInit): Promise<any>;
declare function getMin<T>(array: T[]): T | null;
declare function getMax<T>(array: T[]): T | null;
declare function isNil(value: any): value is null | undefined;
declare const isFunction: (object: any) => boolean;
declare function isReadableStream(object: any): object is ReadableStream;
export { fetchJsonOrThrow, getMax, getMin, isFunction, isNil, isReadableStream, };
