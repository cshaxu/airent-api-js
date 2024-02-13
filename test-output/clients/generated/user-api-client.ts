import { Select } from 'airent';
import {
  UserResponse,
  UserFieldRequest,
  ManyUsersResponse,
  OneUserResponse,
} from '../../entities/generated/user-type';
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

const callApi = (
  path: string, 
  body: Record<string, any>,
  options: RequestInit = {}
) =>
  fetch(`${baseUrl ?? ''}${path}`, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  }).then((r) => r.json());


const getMany = <S extends UserFieldRequest>(
  query: GetManyUsersQuery,
  fieldRequest: S,
  options: RequestInit = {}
) =>
  callApi(GET_MANY_PATH, { query, fieldRequest }, options)
    .then((r) => presentManyResponse(r, fieldRequest));

const getOne = <S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
) =>
  callApi(GET_ONE_PATH, { params, fieldRequest }, options)
    .then((r) => presentOneResponse(r, fieldRequest));

const createOne = <S extends UserFieldRequest>(
  body: CreateOneUserBody,
  fieldRequest: S,
  options: RequestInit = {}
) =>
  callApi(CREATE_ONE_PATH, { body, fieldRequest }, options)
    .then((r) => presentOneResponse(r, fieldRequest));

const updateOne = <S extends UserFieldRequest>(
  params: GetOneUserParams,
  body: UpdateOneUserBody,
  fieldRequest: S,
  options: RequestInit = {}
) =>
  callApi(UPDATE_ONE_PATH, { params, body, fieldRequest }, options)
    .then((r) => presentOneResponse(r, fieldRequest));

const deleteOne = <S extends UserFieldRequest>(
  params: GetOneUserParams,
  fieldRequest: S,
  options: RequestInit = {}
) =>
  callApi(DELETE_ONE_PATH, { params, fieldRequest }, options)
    .then((r) => presentOneResponse(r, fieldRequest));

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
