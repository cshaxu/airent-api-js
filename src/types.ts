// generic

type Awaitable<T> = T | Promise<T>;

type CommonResponse<RESULT = unknown, ERROR = unknown> = {
  code: number;
  result?: RESULT;
  error?: ERROR;
};

type NormalizedError = {
  name: string;
  status: number;
  message: string;
  stack?: string[];
  original?: any;
};

interface FieldRequestInterface {
  [key: string]: boolean | FieldRequestInterface;
}

type FieldRequest = FieldRequestInterface;

export {
  Awaitable,
  CommonResponse,
  FieldRequest,
  FieldRequestInterface,
  NormalizedError,
};
