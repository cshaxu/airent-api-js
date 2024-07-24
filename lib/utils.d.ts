/// <reference types="node" />
/// <reference types="node" />
import { Readable } from "stream";
declare function isFunction(value: any): value is Function;
declare function isNil(value: any): value is null | undefined;
declare function isReadableStream(value: any): value is ReadableStream;
declare function existify<T>(array: T[]): NonNullable<T>[];
declare function purify<T extends Record<string, any>>(object: T): T;
declare function shuffle<T>(array: T[]): void;
declare function min<T>(array: T[]): T | null;
declare function max<T>(array: T[]): T | null;
declare function popular<T>(array: T[]): T | null;
declare function wait(ms: number): Promise<void>;
declare function race<T>(promises: Promise<T>[]): Promise<number>;
declare function bufferify(stream: Readable): Promise<Buffer>;
declare function mockReadableStream(content: string): ReadableStream<any>;
declare function queryStringify(query: Record<string, any>): string;
declare function isUrl(text: string): boolean;
declare function fetchJsonOrThrow(input: string, init?: RequestInit): Promise<any>;
declare function getJsonOrThrow(response: Response): Promise<any>;
declare function round(value: number, digits: number): number;
export { bufferify, existify, fetchJsonOrThrow, getJsonOrThrow, isFunction, isNil, isReadableStream, isUrl, max, min, mockReadableStream, popular, purify, queryStringify, race, round, shuffle, wait, };
