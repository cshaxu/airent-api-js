import { Select } from 'airent';
import {
  UserResponse,
  UserFieldRequest,
  ManyUsersResponse,
  OneUserResponse,
} from '../../entities/generated/user-type';
import { fetchJsonOrThrow } from '../../../src';
import { fetchOptions } from '../../../test-resources/fetch';
import { baseUrl } from '../../../test-resources/fetch';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';

function present<S extends UserFieldRequest>(
  one: any,
  fieldRequest: S
): Select<UserResponse, S> {
  return {
    ...one,
    ...(one.createdAt !== undefined && fieldRequest.createdAt === true && { createdAt: new Date(one.createdAt) }),
  };
}

function presentManyResponse<S extends UserFieldRequest>(
  response: { cursor: any, users: any[] },
  fieldRequest: S
): ManyUsersResponse<S> {
  const cursor = {
    ...response.cursor,
    minCreatedAt: new Date(response.cursor.minCreatedAt),
    maxCreatedAt: new Date(response.cursor.maxCreatedAt),
  };
  const { users: many } = response;
  const users = many.map((one) => present(one, fieldRequest));
  return { cursor, users };
}

function presentOneResponse<S extends UserFieldRequest>(
  response: { user: any },
  fieldRequest: S
): OneUserResponse<S> {
  const { user: one } = response;
  const user = present(one, fieldRequest);
  return { user };
}

function presentOneSafeResponse<S extends UserFieldRequest>(
  response: { user: any },
  fieldRequest: S
): OneUserResponse<S, true> {
  const { user: one } = response;
  const user = one === null ? null : present(one, fieldRequest);
  return { user };
}

async function callApi(
  name: string, 
  body: Record<string, any>,
  options: RequestInit = {}
): Promise<any> {
  const input = `${baseUrl}/${name}`;
  const init = {
    credentials: 'include' as RequestCredentials,
    method: 'POST',
    body: JSON.stringify(body),
    ...fetchOptions,
    ...options,
  };
  return await fetchJsonOrThrow(input, init);
}

async function getMany<S extends UserFieldRequest>(
  query: GetManyUsersQuery,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<ManyUsersResponse<S>> {
  const data = { query, fieldRequest };
  const response = await callApi('get-many-users', data, options);
  return presentManyResponse(response, fieldRequest);
}

async function getOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const data = { params, fieldRequest };
  const response = await callApi('get-one-user', data, options);
  return presentOneResponse(response, fieldRequest);
}

async function getOneSafe<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S, true>> {
  const data = { params, fieldRequest };
  const response = await callApi('get-one-user-safe', data, options);
  return presentOneSafeResponse(response, fieldRequest);
}

async function createOne<S extends UserFieldRequest>(
  body: CreateOneUserBody,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const data = { body, fieldRequest };
  const response = await callApi('create-one-user', data, options);
  return presentOneResponse(response, fieldRequest);
}

async function updateOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const data = { params, body, fieldRequest };
  const response = await callApi('update-one-user', data, options);
  return presentOneResponse(response, fieldRequest);
}

async function deleteOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const data = { params, fieldRequest };
  const response = await callApi('delete-one-user', data, options)
  return presentOneResponse(response, fieldRequest);
}

/** @deprecated */
const UserApiClient = {
  /** @deprecated */
  present,
  /** @deprecated */
  presentManyResponse,
  /** @deprecated */
  presentOneResponse,
  /** @deprecated */
  presentOneSafeResponse,
  /** @deprecated */
  getMany,
  /** @deprecated */
  getOne,
  /** @deprecated */
  getOneSafe,
  /** @deprecated */
  createOne,
  /** @deprecated */
  updateOne,
  /** @deprecated */
  deleteOne,
};

export default UserApiClient;
