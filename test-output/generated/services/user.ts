// airent imports
import { Awaitable } from '../../../src/index';

// config imports
import { Context } from '../../../test-sources/framework';

// entity imports
import { UserEntity } from '../../entities/user';
import {
  UserModel,
} from '../types/user';
import {
  SearchUsersQuery,
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../api-types/user';

/** @deprecated */
export interface UserServiceInterface {
  beforeSearch?: (query: SearchUsersQuery, context: Context) => Awaitable<void>;
  afterSearch?: (many: UserEntity[], query: SearchUsersQuery, context: Context) => Awaitable<void>;
  search: (query: SearchUsersQuery, context: Context) => Promise<UserEntity[]>;
  beforeGetMany?: (query: GetManyUsersQuery, context: Context) => Awaitable<void>;
  afterGetMany?: (many: UserEntity[], query: GetManyUsersQuery, context: Context) => Awaitable<void>;
  getMany: (query: GetManyUsersQuery, context: Context) => Promise<UserEntity[]>;
  beforeGetOne?: (params: GetOneUserParams, context: Context) => Awaitable<void>;
  afterGetOne?: (one: UserEntity, params: GetOneUserParams, context: Context) => Awaitable<void>;
  getOne: (params: GetOneUserParams, context: Context) => Promise<UserEntity>;
  beforeGetOneSafe?: (params: GetOneUserParams, context: Context) => Awaitable<void>;
  afterGetOneSafe?: (one: UserEntity | null, params: GetOneUserParams, context: Context) => Awaitable<void>;
  getOneSafe: (params: GetOneUserParams, context: Context) => Promise<UserEntity | null>;
  beforeCreateOne?: (body: CreateOneUserBody, context: Context) => Awaitable<void>;
  afterCreateOne?: (createdOne: UserEntity, body: CreateOneUserBody, context: Context) => Awaitable<void>;
  createOne: (body: CreateOneUserBody, context: Context) => Promise<UserEntity>;
  beforeUpdateOne?: (one: UserEntity, body: UpdateOneUserBody, context: Context) => Awaitable<void>;
  afterUpdateOne?: (updatedOne: UserEntity, body: UpdateOneUserBody, context: Context) => Awaitable<void>;
  updateOne: (one: UserEntity, body: UpdateOneUserBody, context: Context) => Promise<UserEntity>;
  beforeDeleteOne?: (one: UserEntity, context: Context) => Awaitable<void>;
  afterDeleteOne?: (deletedOne: UserEntity, context: Context) => Awaitable<void>;
  deleteOne: (one: UserEntity, context: Context) => Promise<UserEntity>;
}
