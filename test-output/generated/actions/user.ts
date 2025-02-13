// airent imports
import { isFunction, max, min } from '../../../src/index';

// config imports
import { Context } from '../../../test-sources/framework';

// entity imports
import {
  UserFieldRequest,
  ManyUsersResponse,
  OneUserResponse,
} from '../types/user';
import { UserEntity } from '../../entities/user';
import { UserModel } from '../types/user';
import {
  SearchUsersQuery,
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../api-types/user';
import UserService from '../../services/user';

// api response builders

async function buildManyResponse<S extends UserFieldRequest>(
  many: UserEntity[],
  fieldRequest: S,
): Promise<ManyUsersResponse<S>> {
  const users = await UserEntity.presentMany(many, fieldRequest);
  const createdAts = many.map((one) => one.createdAt);
  const minCreatedAt = min(createdAts);
  const maxCreatedAt = max(createdAts);
  const cursor = {
    count: many.length,
    minCreatedAt,
    maxCreatedAt,
 };
  return { cursor, users };
}

async function buildOneResponse<S extends UserFieldRequest>(
  one: UserEntity,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const user = await one.present(fieldRequest);
  return { user };
}

async function buildOneSafeResponse<S extends UserFieldRequest>(
  one: UserEntity | null,
  fieldRequest: S,
): Promise<OneUserResponse<S, true>> {
  const user = one === null ? null : await one.present(fieldRequest);
  return { user };
}

// api executors

async function search<S extends UserFieldRequest>(
  query: SearchUsersQuery,
  fieldRequest: S,
  context: Context,
): Promise<ManyUsersResponse<S>> {
  if ('beforeSearch' in UserService && isFunction(UserService.beforeSearch)) {
    await UserService.beforeSearch(query, context);
  }
  const many = await UserService.search(query, context);
  if ('afterSearch' in UserService && isFunction(UserService.afterSearch)) {
    await UserService.afterSearch(many, query, context);
  }
  return await buildManyResponse(many, fieldRequest);
}

async function getMany<S extends UserFieldRequest>(
  query: GetManyUsersQuery,
  fieldRequest: S,
  context: Context,
): Promise<ManyUsersResponse<S>> {
  if ('beforeGetMany' in UserService && isFunction(UserService.beforeGetMany)) {
    await UserService.beforeGetMany(query, context);
  }
  const many = await UserService.getMany(query, context);
  if ('afterGetMany' in UserService && isFunction(UserService.afterGetMany)) {
    await UserService.afterGetMany(many, query, context);
  }
  return await buildManyResponse(many, fieldRequest);
}

async function getOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  context: Context,
): Promise<OneUserResponse<S>> {
  if ('beforeGetOne' in UserService && isFunction(UserService.beforeGetOne)) {
    await UserService.beforeGetOne(params, context);
  }
  const one = await UserService.getOne(params, context);
  if ('afterGetOne' in UserService && isFunction(UserService.afterGetOne)) {
    await UserService.afterGetOne(one, params, context);
  }
  return await buildOneResponse(one, fieldRequest);
}

async function getOneSafe<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  context: Context,
): Promise<OneUserResponse<S, true>> {
  if ('beforeGetOneSafe' in UserService && isFunction(UserService.beforeGetOneSafe)) {
    await UserService.beforeGetOneSafe(params, context);
  }
  const one = await UserService.getOneSafe(params, context);
  if ('afterGetOneSafe' in UserService && isFunction(UserService.afterGetOneSafe)) {
    await UserService.afterGetOneSafe(one, params, context);
  }
  return await buildOneSafeResponse(one, fieldRequest);
}

async function createOne<S extends UserFieldRequest>(
  body: CreateOneUserBody,
  fieldRequest: S,
  context: Context,
): Promise<OneUserResponse<S>> {
  if ('beforeCreateOne' in UserService && isFunction(UserService.beforeCreateOne)) {
    await UserService.beforeCreateOne(body, context);
  }
  const one = await UserService.createOne(body, context);
  if ('afterCreateOne' in UserService && isFunction(UserService.afterCreateOne)) {
    await UserService.afterCreateOne(one, body, context);
  }
  return await buildOneResponse(one, fieldRequest);
}

async function updateOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  fieldRequest: S,
  context: Context,
): Promise<OneUserResponse<S>> {
  const one = await UserService.getOne(params, context);
  if ('beforeUpdateOne' in UserService && isFunction(UserService.beforeUpdateOne)) {
    await UserService.beforeUpdateOne(one, body, context);
  }
  const updatedOne = await UserService.updateOne(one, body, context);
  if ('afterUpdateOne' in UserService && isFunction(UserService.afterUpdateOne)) {
    await UserService.afterUpdateOne(updatedOne, body, context);
  }
  return await buildOneResponse(updatedOne, fieldRequest);
}

async function deleteOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  context: Context,
): Promise<OneUserResponse<S>> {
  const one = await UserService.getOne(params, context);
  if ('beforeDeleteOne' in UserService && isFunction(UserService.beforeDeleteOne)) {
    await UserService.beforeDeleteOne(one, context);
  }
  const deletedOne = await UserService.deleteOne(one, context);
  if ('afterDeleteOne' in UserService && isFunction(UserService.afterDeleteOne)) {
    await UserService.afterDeleteOne(deletedOne, context);
  }
  return await buildOneResponse(deletedOne, fieldRequest);
}

/** @deprecated */
const UserActions = {
  buildManyResponse,
  buildOneResponse,
  buildOneSafeResponse,
  search,
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserActions;
