// generic

type CommonResponse<RESULT = unknown, ERROR = unknown> = {
  code: number;
  result?: RESULT;
  error?: ERROR;
};

interface FieldRequestInterface {
  [key: string]: boolean | FieldRequestInterface;
}
type FieldRequest = FieldRequestInterface;

type NormalizedError = {
  name: string;
  status: number;
  message: string;
  stack?: string[];
  original?: any;
};

export { CommonResponse, FieldRequest, FieldRequestInterface, NormalizedError };
