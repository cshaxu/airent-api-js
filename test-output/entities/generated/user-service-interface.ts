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
  beforeGetMany?: (query: GetManyUsersQuery, context: Context) => Promise<void>;
  afterGetMany?: (many: UserEntity[], query: GetManyUsersQuery, context: Context) => Promise<void>;
  getMany: (query: GetManyUsersQuery, context: Context) => Promise<UserEntity[]>;
  beforeGetOne?: (params: GetOneUserParams, context: Context) => Promise<void>;
  afterGetOne?: (one: UserEntity, params: GetOneUserParams, context: Context) => Promise<void>;
  getOne: (params: GetOneUserParams, context: Context) => Promise<UserEntity>;
  beforeGetOneSafe?: (params: GetOneUserParams, context: Context) => Promise<void>;
  afterGetOneSafe?: (one: UserEntity | null, params: GetOneUserParams, context: Context) => Promise<void>;
  getOneSafe: (params: GetOneUserParams, context: Context) => Promise<UserEntity | null>;
  beforeCreateOne?: (body: CreateOneUserBody, context: Context) => Promise<void>;
  afterCreateOne?: (createdOne: UserEntity, body: CreateOneUserBody, context: Context) => Promise<void>;
  createOne: (body: CreateOneUserBody, context: Context) => Promise<UserEntity>;
  beforeUpdateOne?: (one: UserEntity, body: UpdateOneUserBody, context: Context) => Promise<void>;
  afterUpdateOne?: (updatedOne: UserEntity, body: UpdateOneUserBody, context: Context) => Promise<void>;
  updateOne: (one: UserEntity, body: UpdateOneUserBody, context: Context) => Promise<UserEntity>;
  beforeDeleteOne?: (one: UserEntity, context: Context) => Promise<void>;
  afterDeleteOne?: (deletedOne: UserEntity, context: Context) => Promise<void>;
  deleteOne: (one: UserEntity, context: Context) => Promise<UserEntity>;
}
