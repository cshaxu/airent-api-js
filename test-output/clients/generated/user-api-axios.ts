import { Select } from 'airent';
import {
  UserResponse,
  UserFieldRequest,
  ManyUsersResponse,
  OneUserResponse,
} from '../../entities/generated/user-type';
import axios from 'axios';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';

function present<S extends UserFieldRequest>(one: any, fieldRequest: S): Select<UserResponse, S> {
  return {
    ...one,
    ...(one.createdAt !== undefined && fieldRequest.createdAt === true && { createdAt: new Date(one.createdAt) }),
  };
}

function presentManyResponse<S extends UserFieldRequest>(response: any, fieldRequest: S): ManyUsersResponse<S> {
  const cursor = {
    ...response.cursor,
    minCreatedAt: new Date(response.cursor.minCreatedAt),
    maxCreatedAt: new Date(response.cursor.maxCreatedAt),
  };
  return { cursor, users: response.users.map((one: any) => present(one, fieldRequest)) };
}

function presentOneResponse<S extends UserFieldRequest>(response: any, fieldRequest: S): OneUserResponse<S> {
  return { user: present(response.user, fieldRequest) };
}

async function getMany<S extends UserFieldRequest>(query: GetManyUsersQuery, fieldRequest: S): Promise<ManyUsersResponse<S>> {
  const requestBody = { query, fieldRequest };
  const path = `/api/data/users/get-many`;
  const { data } = await axios.post(path, requestBody);
  return presentManyResponse(data, fieldRequest);
}

async function getOne<S extends UserFieldRequest>(params: GetOneUserParams, fieldRequest: S): Promise<OneUserResponse<S>> {
  const requestBody = { params, fieldRequest };
  const path = `/api/data/users/get-one`;
  const { data } = await axios.post(path, requestBody);
  return presentOneResponse(data, fieldRequest);
}

async function createOne<S extends UserFieldRequest>(body: CreateOneUserBody, fieldRequest: S): Promise<OneUserResponse<S>> {
  const requestBody = { body, fieldRequest };
  const path = `/api/data/users/create-one`;
  const { data } = await axios.post(path, requestBody);
  return presentOneResponse(data, fieldRequest);
}

async function updateOne<S extends UserFieldRequest>(params: GetOneUserParams, body: UpdateOneUserBody, fieldRequest: S): Promise<OneUserResponse<S>> {
  const requestBody = { params, body, fieldRequest };
  const path = `/api/data/users/update-one`;
  const { data } = await axios.post(path, requestBody);
  return presentOneResponse(data, fieldRequest);
}

async function deleteOne<S extends UserFieldRequest>(params: GetOneUserParams, fieldRequest: S): Promise<OneUserResponse<S>> {
  const requestBody = { params, fieldRequest };
  const path = `/api/data/users/delete-one`;
  const { data } = await axios.post(path, requestBody);
  return presentOneResponse(data, fieldRequest);
}

const UserApiAxios = {
  present,
  presentManyResponse,
  presentOneResponse,
  getMany,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};

export default UserApiAxios;
