// library imports
import * as z from 'zod';

// query

export const SearchUsersQuery = z.object({});
export type SearchUsersQuery = z.infer<typeof SearchUsersQuery>;

export const GetManyUsersQuery = z.object({});
export type GetManyUsersQuery = z.infer<typeof GetManyUsersQuery>;

// params

export const GetOneUserParams = z.object({});
export type GetOneUserParams = z.infer<typeof GetOneUserParams>;

// body

export const CreateOneUserBody = z.object({});
export type CreateOneUserBody = z.infer<typeof CreateOneUserBody>;

export const UpdateOneUserBody = z.object({});
export type UpdateOneUserBody = z.infer<typeof UpdateOneUserBody>;
