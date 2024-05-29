// library imports
import createHttpError from 'http-errors';

// config imports
import { Context } from '../../test-resources/framework';

// entity imports
import { UserEntity } from '../entities/user';
import {
  UserModel,
} from '../entities/generated/user-type';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../test-resources/user-type';
import { UserServiceInterface } from '../entities/generated/user-service-interface';

async function getMany(query: GetManyUsersQuery, context: Context): Promise<UserEntity[]> {
  throw createHttpError.NotImplemented();
}

async function getOne(params: GetOneUserParams, context: Context): Promise<UserEntity> {
  const one = await getOneSafe(params, context);
  if (one === null) {
    throw createHttpError.NotFound();
  }
  return one;
}

async function getOneSafe(params: GetOneUserParams, context: Context): Promise<UserEntity | null> {
  throw createHttpError.NotImplemented();
}

async function createOne(body: CreateOneUserBody, context: Context): Promise<UserEntity> {
  throw createHttpError.NotImplemented();
}

async function updateOne(one: UserEntity, body: UpdateOneUserBody, context: Context): Promise<UserEntity> {
  throw createHttpError.NotImplemented();
}

async function deleteOne(one: UserEntity, context: Context): Promise<UserEntity> {
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
