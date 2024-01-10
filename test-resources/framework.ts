export type RequestContext = {};

export async function authenticator(
  _headers: Headers,
  _options?: {}
): Promise<RequestContext> {
  return {};
}

export function errorHandler(_error: any, _ec: any): Response {
  return Response.json({}, { status: 500 });
}
