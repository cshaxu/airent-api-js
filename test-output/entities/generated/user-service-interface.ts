import { Awaitable } from '../../../src/index';

import { Context } from '../../../test-resources/framework';

import { UserEntity } from '../user';
import {
  UserModel,
} from './user-type';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';

/** @deprecated */
export interface UserServiceInterface {
  beforeGetMany?: (query: GetManyUsersQuery, context: Context) => Awaitable<void>;
  afterGetMany?: (many: UserEntity[], query: GetManyUsersQuery, context: Context) => Awaitable<void>;
  getMany: (query: GetManyUsersQuery, context: Context) => Awaitable<UserEntity[]>;
  beforeGetOne?: (params: GetOneUserParams, context: Context) => Awaitable<void>;
  afterGetOne?: (one: UserEntity, params: GetOneUserParams, context: Context) => Awaitable<void>;
  getOne: (params: GetOneUserParams, context: Context) => Awaitable<UserEntity>;
  beforeGetOneSafe?: (params: GetOneUserParams, context: Context) => Awaitable<void>;
  afterGetOneSafe?: (one: UserEntity | null, params: GetOneUserParams, context: Context) => Awaitable<void>;
  getOneSafe: (params: GetOneUserParams, context: Context) => Awaitable<UserEntity | null>;
  beforeCreateOne?: (body: CreateOneUserBody, context: Context) => Awaitable<void>;
  afterCreateOne?: (createdOne: UserEntity, body: CreateOneUserBody, context: Context) => Awaitable<void>;
  createOne: (body: CreateOneUserBody, context: Context) => Awaitable<UserEntity>;
  beforeUpdateOne?: (one: UserEntity, body: UpdateOneUserBody, context: Context) => Awaitable<void>;
  afterUpdateOne?: (updatedOne: UserEntity, body: UpdateOneUserBody, context: Context) => Awaitable<void>;
  updateOne: (one: UserEntity, body: UpdateOneUserBody, context: Context) => Awaitable<UserEntity>;
  beforeDeleteOne?: (one: UserEntity, context: Context) => Awaitable<void>;
  afterDeleteOne?: (deletedOne: UserEntity, context: Context) => Awaitable<void>;
  deleteOne: (one: UserEntity, context: Context) => Awaitable<UserEntity>;
}
