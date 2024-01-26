import { getMax, getMin } from '../../../src';
import {
  UserFieldRequest,
  UserResponse,
  ManyUsersResponse,
  OneUserResponse,
} from './user-type';
import { UserEntity } from '../user';
import { UserModel } from './user-type';
import { RequestContext } from '../../../test-resources/framework';
import { UserService } from '../../../test-resources/user-service';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';

// api response builders

export async function buildManyUsersResponse<S extends UserFieldRequest>(
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

export async function buildOneUserResponse<S extends UserFieldRequest>(
  one: UserEntity,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const user = await one.present(fieldRequest);
  return { user };
}

// api executors

export async function getManyUsers<S extends UserFieldRequest>(
  query: GetManyUsersQuery,
  rc: RequestContext,
  fieldRequest: S,
): Promise<ManyUsersResponse<S>> {
  const service = new UserService();
  await service.beforeGetMany(query, rc);
  const many = await service.getMany(query, rc);
  await service.afterGetMany(many, query, rc);
  return await buildManyUsersResponse(many, fieldRequest);
}

export async function getOneUser<S extends UserFieldRequest>(
  params: GetOneUserParams,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const service = new UserService();
  await service.beforeGetOne(params, rc);
  const one = await service.getOne(params, rc);
  await service.afterGetOne(one, params, rc);
  return await buildOneUserResponse(one, fieldRequest);
}

export async function createOneUser<S extends UserFieldRequest>(
  body: CreateOneUserBody,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const service = new UserService();
  await service.beforeCreateOne(body, rc);
  const one = await service.createOne(body, rc);
  await service.afterCreateOne(one, body, rc);
  return await buildOneUserResponse(one, fieldRequest);
}

export async function updateOneUser<S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const service = new UserService();
  const one = await service.getOne(params, rc);
  await service.beforeUpdateOne(one, body, rc);
  const updatedOne = await service.updateOne(one, body, rc);
  await service.afterUpdateOne(updatedOne, body, rc);
  return await buildOneUserResponse(updatedOne, fieldRequest);
}

export async function deleteOneUser<S extends UserFieldRequest>(
  params: GetOneUserParams,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const service = new UserService();
  const one = await service.getOne(params, rc);
  await service.beforeDeleteOne(one, rc);
  const deletedOne = await service.deleteOne(one, rc);
  await service.afterDeleteOne(deletedOne, rc);
  return await buildOneUserResponse(deletedOne, fieldRequest);
}
