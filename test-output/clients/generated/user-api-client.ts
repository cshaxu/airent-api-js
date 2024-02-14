import { Select } from 'airent';
import {
  UserResponse,
  UserFieldRequest,
  ManyUsersResponse,
  OneUserResponse,
} from '../../entities/generated/user-type';
import { fetchJsonOrThrow } from '../../../src';
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
  return { cursor, users: response.users.map((one) => present(one, fieldRequest)) };
}

function presentOneResponse<S extends UserFieldRequest>(
  response: { user: any },
  fieldRequest: S
): OneUserResponse<S> {
  return { user: present(response.user, fieldRequest) };
}

const GET_MANY_PATH = '/api/data/get-many-users';
const GET_ONE_PATH = '/api/data/get-one-user';
const CREATE_ONE_PATH = '/api/data/create-one-user';
const UPDATE_ONE_PATH = '/api/data/update-one-user';
const DELETE_ONE_PATH = '/api/data/delete-one-user';

async function callApi(
  path: string, 
  body: Record<string, any>,
  options: RequestInit = {}
): Promise<any> {
  const input = `${baseUrl ?? ''}${path}`;
  const init = {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  };
  return await fetchJsonOrThrow(input, init);
}


async function getMany<S extends UserFieldRequest>(
  query: GetManyUsersQuery,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<ManyUsersResponse<S>> {
  const data = { query, fieldRequest };
  const response = await callApi(GET_MANY_PATH, data, options);
  return presentManyResponse(response, fieldRequest);
}

async function getOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const data = { params, fieldRequest };
  const response = await callApi(GET_ONE_PATH, data, options);
  return presentOneResponse(response, fieldRequest);
}

async function createOne<S extends UserFieldRequest>(
  body: CreateOneUserBody,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const data = { body, fieldRequest };
  const response = await callApi(CREATE_ONE_PATH, data, options);
  return presentOneResponse(response, fieldRequest);
}

async function updateOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const data = { params, body, fieldRequest };
  const response = await callApi(UPDATE_ONE_PATH, data, options);
  return presentOneResponse(response, fieldRequest);
}

async function deleteOne<S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
): Promise<OneUserResponse<S>> {
  const data = { params, fieldRequest };
  const response = await callApi(DELETE_ONE_PATH, data, options)
  return presentOneResponse(response, fieldRequest);
}

const UserApiClient = {
  present,
  presentManyResponse,
  presentOneResponse,
  getMany,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};

export default UserApiClient;
