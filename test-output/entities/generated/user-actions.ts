import { getMax, getMin } from '../../../src/index';

import { Context } from '../../../test-resources/framework';

import {
  UserFieldRequest,
  ManyUsersResponse,
  OneUserResponse,
} from './user-type';
import { UserEntity } from '../user';
import { UserModel } from './user-type';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';
import UserService from '../../services/user';

// api response builders

/** @deprecated */
async function buildManyResponse<S extends UserFieldRequest>(
  many: UserEntity[],
  fieldRequest: S,
): Promise<ManyUsersResponse<S>> {
  const users = await UserEntity.presentMany(many, fieldRequest);
  const createdAts = many.map((one) => one.createdAt);
  const minCreatedAt = getMin(createdAts);
  const maxCreatedAt = getMax(createdAts);
  const cursor = {
    count: many.length,
    minCreatedAt,
    maxCreatedAt,
 };
  return { cursor, users };
}

/** @deprecated */
async function buildOneResponse<S extends UserFieldRequest>(
  one: UserEntity,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const user = await one.present(fieldRequest);
  return { user };
}

/** @deprecated */
async function buildOneSafeResponse<S extends UserFieldRequest>(
  one: UserEntity | null,
  fieldRequest: S,
): Promise<OneUserResponse<S, true>> {
  const user = one === null ? null : await one.present(fieldRequest);
  return { user };
}

// api executors

/** @deprecated */
async function getMany<S extends UserFieldRequest>(
  query: GetManyUsersQuery,
  context: Context,
  fieldRequest: S,
): Promise<ManyUsersResponse<S>> {
  if ('beforeGetMany' in UserService && typeof UserService.beforeGetMany === 'function') {
    await UserService.beforeGetMany(query, context);
  }
  const many = await UserService.getMany(query, context);
  if ('afterGetMany' in UserService && typeof UserService.afterGetMany === 'function') {
    await UserService.afterGetMany(many, query, context);
  }
  return await buildManyResponse(many, fieldRequest);
}

/** @deprecated */
async function getOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  context: Context,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  if ('beforeGetOne' in UserService && typeof UserService.beforeGetOne === 'function') {
    await UserService.beforeGetOne(params, context);
  }
  const one = await UserService.getOne(params, context);
  if ('afterGetOne' in UserService && typeof UserService.afterGetOne === 'function') {
    await UserService.afterGetOne(one, params, context);
  }
  return await buildOneResponse(one, fieldRequest);
}

/** @deprecated */
async function getOneSafe<S extends UserFieldRequest>(
  params: GetOneUserParams,
  context: Context,
  fieldRequest: S,
): Promise<OneUserResponse<S, true>> {
  if ('beforeGetOneSafe' in UserService && typeof UserService.beforeGetOneSafe === 'function') {
    await UserService.beforeGetOneSafe(params, context);
  }
  const one = await UserService.getOneSafe(params, context);
  if ('afterGetOneSafe' in UserService && typeof UserService.afterGetOneSafe === 'function') {
    await UserService.afterGetOneSafe(one, params, context);
  }
  return await buildOneSafeResponse(one, fieldRequest);
}

/** @deprecated */
async function createOne<S extends UserFieldRequest>(
  body: CreateOneUserBody,
  context: Context,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  if ('beforeCreateOne' in UserService && typeof UserService.beforeCreateOne === 'function') {
    await UserService.beforeCreateOne(body, context);
  }
  const one = await UserService.createOne(body, context);
  if ('afterCreateOne' in UserService && typeof UserService.afterCreateOne === 'function') {
    await UserService.afterCreateOne(one, body, context);
  }
  return await buildOneResponse(one, fieldRequest);
}

/** @deprecated */
async function updateOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  context: Context,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const one = await UserService.getOne(params, context);
  if ('beforeUpdateOne' in UserService && typeof UserService.beforeUpdateOne === 'function') {
    await UserService.beforeUpdateOne(one, body, context);
  }
  const updatedOne = await UserService.updateOne(one, body, context);
  if ('afterUpdateOne' in UserService && typeof UserService.afterUpdateOne === 'function') {
    await UserService.afterUpdateOne(updatedOne, body, context);
  }
  return await buildOneResponse(updatedOne, fieldRequest);
}

/** @deprecated */
async function deleteOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  context: Context,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const one = await UserService.getOne(params, context);
  if ('beforeDeleteOne' in UserService && typeof UserService.beforeDeleteOne === 'function') {
    await UserService.beforeDeleteOne(one, context);
  }
  const deletedOne = await UserService.deleteOne(one, context);
  if ('afterDeleteOne' in UserService && typeof UserService.afterDeleteOne === 'function') {
    await UserService.afterDeleteOne(deletedOne, context);
  }
  return await buildOneResponse(deletedOne, fieldRequest);
}

/** @deprecated */
const UserActions = {
  buildManyResponse,
  buildOneResponse,
  buildOneSafeResponse,
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserActions;
