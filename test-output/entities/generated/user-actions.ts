import { getMax, getMin } from '../../../src';
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
import { RequestContext } from '../../../test-resources/framework';
import UserService from '../../services/semi-generated/user';

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

// api executors

/** @deprecated */
async function getMany<S extends UserFieldRequest>(
  query: GetManyUsersQuery,
  rc: RequestContext,
  fieldRequest: S,
): Promise<ManyUsersResponse<S>> {
  if (UserService.beforeGetMany !== undefined) {
    await UserService.beforeGetMany(query, rc);
  }
  const many = await UserService.getMany(query, rc);
  if (UserService.afterGetMany !== undefined) {
    await UserService.afterGetMany(many, query, rc);
  }
  return await buildManyResponse(many, fieldRequest);
}

/** @deprecated */
async function getOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  if (UserService.beforeGetOne !== undefined) {
    await UserService.beforeGetOne(params, rc);
  }
  const one = await UserService.getOne(params, rc);
  if (UserService.afterGetOne !== undefined) {
    await UserService.afterGetOne(one, params, rc);
  }
  return await buildOneResponse(one, fieldRequest);
}

/** @deprecated */
async function createOne<S extends UserFieldRequest>(
  body: CreateOneUserBody,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  if (UserService.beforeCreateOne !== undefined) {
    await UserService.beforeCreateOne(body, rc);
  }
  const one = await UserService.createOne(body, rc);
  if (UserService.afterCreateOne !== undefined) {
    await UserService.afterCreateOne(one, body, rc);
  }
  return await buildOneResponse(one, fieldRequest);
}

/** @deprecated */
async function updateOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const one = await UserService.getOne(params, rc);
  if (UserService.beforeUpdateOne !== undefined) {
    await UserService.beforeUpdateOne(one, body, rc);
  }
  const updatedOne = await UserService.updateOne(one, body, rc);
  if (UserService.afterUpdateOne !== undefined) {
    await UserService.afterUpdateOne(updatedOne, body, rc);
  }
  return await buildOneResponse(updatedOne, fieldRequest);
}

/** @deprecated */
async function deleteOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const one = await UserService.getOne(params, rc);
  if (UserService.beforeDeleteOne !== undefined) {
    await UserService.beforeDeleteOne(one, rc);
  }
  const deletedOne = await UserService.deleteOne(one, rc);
  if (UserService.afterDeleteOne !== undefined) {
    await UserService.afterDeleteOne(deletedOne, rc);
  }
  return await buildOneResponse(deletedOne, fieldRequest);
}

/** @deprecated */
const UserActions = {
  buildManyResponse,
  buildOneResponse,
  getMany,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};

export default UserActions;
