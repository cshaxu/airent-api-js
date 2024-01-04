export type GetManyUsersQuery = { ids: string[]; createdAtBefore: Date };

export type GetOneUserParams = { id: string };

export type CreateOneUserBody = { name: string; email: string };

export type UpdateOneUserBody = { name: string; email: string };
