import * as z from "zod";

export const SearchUsersQuery = z.object({ name: z.string() });
export type SearchUsersQuery = z.infer<typeof SearchUsersQuery>;

export const GetManyUsersQuery = z.object({
  ids: z.string().array(),
  createdAtBefore: z.date(),
});
export type GetManyUsersQuery = z.infer<typeof GetManyUsersQuery>;

export const GetOneUserParams = z.object({ id: z.string() });
export type GetOneUserParams = z.infer<typeof GetOneUserParams>;

export const CreateOneUserBody = z.object({
  name: z.string(),
  email: z.string().email(),
});
export type CreateOneUserBody = z.infer<typeof CreateOneUserBody>;

export const UpdateOneUserBody = z.object({ name: z.string() });
export type UpdateOneUserBody = z.infer<typeof UpdateOneUserBody>;
