import { Select } from 'airent';

/** structs */

export type UserModel = { id: string; createdAt: Date; name: string; email: string };

export type UserFieldRequest = {
  id?: boolean;
  createdAt?: boolean;
  name?: boolean;
  email?: boolean;
};

export type UserResponse = {
  id?: string;
  createdAt?: Date;
  name?: string;
  email?: string;
};

export type ManyUsersCursor = {
  count: number;
  minCreatedAt: Date | null;
  maxCreatedAt: Date | null;
};

export type ManyUsersResponse<S extends UserFieldRequest | true> = {
  cursor: ManyUsersCursor;
  users: Select<UserResponse, S>[];
};

export type OneUserResponse<S extends UserFieldRequest | true> = {
  user: Select<UserResponse, S>;
};
