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
import createHttpError from 'http-errors';

async function getMany(query: GetManyUsersQuery, rc: RequestContext): Promise<UserEntity[]> {
  throw createHttpError.NotImplemented();
}

async function getOne(params: GetOneUserParams, rc: RequestContext): Promise<UserEntity> {
  const one = await getOneSafe(params, rc);
  if (one === null) {
    throw createHttpError.NotFound();
  }
  return one;
}

async function getOneSafe(params: GetOneUserParams, rc: RequestContext): Promise<UserEntity | null> {
  throw createHttpError.NotImplemented();
}

async function createOne(body: CreateOneUserBody, rc: RequestContext): Promise<UserEntity> {
  throw createHttpError.NotImplemented();
}

async function updateOne(one: UserEntity, body: UpdateOneUserBody, rc: RequestContext): Promise<UserEntity> {
  throw createHttpError.NotImplemented();
}

async function deleteOne(one: UserEntity, rc: RequestContext): Promise<UserEntity> {
  throw createHttpError.NotImplemented();
}

/** @deprecated */
const UserService: UserServiceInterface = {
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserService;
