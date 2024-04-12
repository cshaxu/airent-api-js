export type RequestContext = {};

export const handlerConfig = { authenticator, validator, errorHandler };

async function authenticator(_request: Request): Promise<RequestContext> {
  return {};
}

async function validator(
  _parsed: any,
  _rc: RequestContext,
  _options?: {}
): Promise<void> {}

function errorHandler(_error: any, _ec: any): Response {
  return Response.json({}, { status: 500 });
}
