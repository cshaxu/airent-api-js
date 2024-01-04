import { getMax, getMin } from '../../../src';
import {
  UserFieldRequest,
  UserResponse,
  ManyUsersResponse,
  OneUserResponse,
} from './user-type';
import { UserEntity } from '../user';
import { UserModel } from './user-type';
import { RequestContext } from '../../../test-resources/rc';
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
  const service = new UserService(rc);
  await service.beforeGetMany(query);
  const many = await service.getMany(query);
  await service.afterGetMany(many, query);
  return await buildManyUsersResponse(many, fieldRequest);
}

export async function getOneUser<S extends UserFieldRequest>(
  params: GetOneUserParams,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const service = new UserService(rc);
  await service.beforeGetOne(params);
  const one = await service.getOne(params);
  await service.afterGetOne(one, params);
  return await buildOneUserResponse(one, fieldRequest);
}
      
export async function createOneUser<S extends UserFieldRequest>(
  body: CreateOneUserBody,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const service = new UserService(rc);
  await service.beforeCreateOne(body);
  const one = await service.createOne(body);
  await service.afterCreateOne(one, body);
  return await buildOneUserResponse(one, fieldRequest);
}

export async function updateOneUser<S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  rc: RequestContext,
  fieldRequest: S,
): Promise<OneUserResponse<S>> {
  const service = new UserService(rc);
  const one = await service.getOne(params);
  await service.beforeUpdateOne(one, body);
  const updatedOne = await service.updateOne(one, body);
  await service.afterUpdateOne(updatedOne, body);
  return await buildOneUserResponse(updatedOne, fieldRequest);
}

export async function deleteOneUser<S extends UserFieldRequest>(
  params: GetOneUserParams,
  rc: RequestContext,
  fieldRequest: S
): Promise<OneUserResponse<S>> {
  const service = new UserService(rc);
  const one = await service.getOne(params);
  await service.beforeDeleteOne(one);
  const deletedOne = await service.deleteOne(one);
  await service.afterDeleteOne(deletedOne);
  return await buildOneUserResponse(deletedOne, fieldRequest);
}
