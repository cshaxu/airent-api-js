import * as z from "zod";
import { dispatchUpdateOneWith } from "../../src/api";

const paramsZod = z.object({
  id: z.string(),
});

const bodyZod = z.object({
  name: z.string(),
});

void dispatchUpdateOneWith({
  paramsZod,
  bodyZod,
  action: async (_params, body, _fieldRequest, _context) => {
    const name: string = body.name;
    return { name };
  },
});
