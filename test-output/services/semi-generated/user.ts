import { RequestContext } from '../../../test-resources/framework';
import { UserEntity } from '../../entities/user';
import {
  UserModel,
} from '../../entities/generated/user-type';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';
import { UserServiceInterface } from '../../entities/generated/user-service-interface';

async function getMany(query: GetManyUsersQuery, rc: RequestContext): Promise<UserEntity[]> {
  throw new Error('Not implemented');
}

async function getOne(params: GetOneUserParams, rc: RequestContext): Promise<UserEntity> {
  throw new Error('Not implemented');
}

async function createOne(body: CreateOneUserBody, rc: RequestContext): Promise<UserEntity> {
  throw new Error('Not implemented');
}

async function updateOne(one: UserEntity, body: UpdateOneUserBody, rc: RequestContext): Promise<UserEntity> {
  throw new Error('Not implemented');
}

async function deleteOne(one: UserEntity, rc: RequestContext): Promise<UserEntity> {
  throw new Error('Not implemented');
}

/** @deprecated */
const UserService: UserServiceInterface = {
  getMany,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};

export default UserService;
