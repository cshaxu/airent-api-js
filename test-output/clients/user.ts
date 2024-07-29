// airent imports
import { fetchJsonOrThrow } from '../../src/index';

// config imports
import { baseUrl } from '../../test-sources/fetch';

// entity imports
import {
  SelectedUserResponse,
  UserFieldRequest,
  ManyUsersResponse,
  OneUserResponse,
} from '../entities/generated/user-type';
import MessageApiClient from './message';
import {
  SearchUsersQuery,
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../test-sources/user-type';

function present<S extends UserFieldRequest>(
  one: any,
  fieldRequest: S
): SelectedUserResponse<S> {
  return {
    ...one,
    ...(one.createdAt !== undefined && fieldRequest.createdAt === true && { createdAt: new Date(one.createdAt) }),
    ...(one.messages !== undefined && fieldRequest.messages !== undefined && { messages: one.messages.map((nested: any) => MessageApiClient.present(nested, fieldRequest.messages!)) }),
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

async function search<S extends UserFieldRequest>(
  query: SearchUsersQuery,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<ManyUsersResponse<S>> {
  const input = `${baseUrl}/search-users`;
  const data = { query, fieldRequest };
  const init = {
    credentials: 'include' as RequestCredentials,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetchJsonOrThrow(input, init);
  return presentManyResponse(response, fieldRequest);
}

async function getMany<S extends UserFieldRequest>(
  query: GetManyUsersQuery,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<ManyUsersResponse<S>> {
  const input = `${baseUrl}/get-many-users`;
  const data = { query, fieldRequest };
  const init = {
    credentials: 'include' as RequestCredentials,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetchJsonOrThrow(input, init);
  return presentManyResponse(response, fieldRequest);
}

async function getOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const input = `${baseUrl}/get-one-user`;
  const data = { params, fieldRequest };
  const init = {
    credentials: 'include' as RequestCredentials,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetchJsonOrThrow(input, init);
  return presentOneResponse(response, fieldRequest);
}

async function getOneSafe<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S, true>> {
  const input = `${baseUrl}/get-one-user-safe`;
  const data = { params, fieldRequest };
  const init = {
    credentials: 'include' as RequestCredentials,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetchJsonOrThrow(input, init);
  return presentOneSafeResponse(response, fieldRequest);
}

async function createOne<S extends UserFieldRequest>(
  body: CreateOneUserBody,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const input = `${baseUrl}/create-one-user`;
  const data = { body, fieldRequest };
  const init = {
    credentials: 'include' as RequestCredentials,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetchJsonOrThrow(input, init);
  return presentOneResponse(response, fieldRequest);
}

async function updateOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const input = `${baseUrl}/update-one-user`;
  const data = { params, body, fieldRequest };
  const init = {
    credentials: 'include' as RequestCredentials,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetchJsonOrThrow(input, init);
  return presentOneResponse(response, fieldRequest);
}

async function deleteOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const input = `${baseUrl}/delete-one-user`;
  const data = { params, fieldRequest };
  const init = {
    credentials: 'include' as RequestCredentials,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetchJsonOrThrow(input, init);
  return presentOneResponse(response, fieldRequest);
}

/** @deprecated */
const UserApiClient = {
  present,
  presentManyResponse,
  presentOneResponse,
  presentOneSafeResponse,
  search,
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserApiClient;
