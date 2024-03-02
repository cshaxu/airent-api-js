import { RequestContext } from '../../../test-resources/framework';
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
  beforeGetMany?: (query: GetManyUsersQuery, rc: RequestContext) => Promise<void>;
  afterGetMany?: (many: UserEntity[], query: GetManyUsersQuery, rc: RequestContext) => Promise<void>;
  getMany: (query: GetManyUsersQuery, rc: RequestContext) => Promise<UserEntity[]>;
  beforeGetOne?: (params: GetOneUserParams, rc: RequestContext) => Promise<void>;
  afterGetOne?: (one: UserEntity, params: GetOneUserParams, rc: RequestContext) => Promise<void>;
  getOne: (params: GetOneUserParams, rc: RequestContext) => Promise<UserEntity>;
  beforeGetOneSafe?: (params: GetOneUserParams, rc: RequestContext) => Promise<void>;
  afterGetOneSafe?: (one: UserEntity | null, params: GetOneUserParams, rc: RequestContext) => Promise<void>;
  getOneSafe: (params: GetOneUserParams, rc: RequestContext) => Promise<UserEntity | null>;
  beforeCreateOne?: (body: CreateOneUserBody, rc: RequestContext) => Promise<void>;
  afterCreateOne?: (createdOne: UserEntity, body: CreateOneUserBody, rc: RequestContext) => Promise<void>;
  createOne: (body: CreateOneUserBody, rc: RequestContext) => Promise<UserEntity>;
  beforeUpdateOne?: (one: UserEntity, body: UpdateOneUserBody, rc: RequestContext) => Promise<void>;
  afterUpdateOne?: (updatedOne: UserEntity, body: UpdateOneUserBody, rc: RequestContext) => Promise<void>;
  updateOne: (one: UserEntity, body: UpdateOneUserBody, rc: RequestContext) => Promise<UserEntity>;
  beforeDeleteOne?: (one: UserEntity, rc: RequestContext) => Promise<void>;
  afterDeleteOne?: (deletedOne: UserEntity, rc: RequestContext) => Promise<void>;
  deleteOne: (one: UserEntity, rc: RequestContext) => Promise<UserEntity>;
}
