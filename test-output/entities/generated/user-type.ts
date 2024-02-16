import { Select } from 'airent';

/** structs */

export type UserModel = { id: string; createdAt: Date; name: string; email: string };

/** @deprecated */
export type UserFieldRequest = {
  id?: boolean;
  createdAt?: boolean;
  name?: boolean;
  email?: boolean;
};

/** @deprecated */
export type UserResponse = {
  id?: string;
  createdAt?: Date;
  name?: string;
  email?: string;
};

/** @deprecated */
export type ManyUsersCursor = {
  count: number;
  minCreatedAt: Date | null;
  maxCreatedAt: Date | null;
};

/** @deprecated */
export type ManyUsersResponse<S extends UserFieldRequest | true> = {
  cursor: ManyUsersCursor;
  /** @deprecated */
  users: Select<UserResponse, S>[];
};

/** @deprecated */
export type OneUserResponse<S extends UserFieldRequest | true> = {
  /** @deprecated */
  user: Select<UserResponse, S>;
};
