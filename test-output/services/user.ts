// library imports
import createHttpError from 'http-errors';

// config imports
import { Context } from '../../test-sources/framework';

// entity imports
import { UserEntity } from '../entities/user';
import {
  UserModel,
} from '../generated/types/user';
import {
  SearchUsersQuery,
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../test-sources/user-type';
import { UserServiceInterface } from '../generated/services/user';
import { UserSearchService } from './user-search';

async function search(query: SearchUsersQuery, context: Context): Promise<UserEntity[]> {
  return await new UserSearchService().search(query, context);
}

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
  search,
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserService;
