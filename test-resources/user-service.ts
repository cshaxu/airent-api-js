import { UserServiceInterface } from "../test-output/entities/generated/user-service-interface";
import { UserEntity } from "../test-output/entities/user";
import { Context } from "./framework";
import {
  CreateOneUserBody,
  GetManyUsersQuery,
  GetOneUserParams,
  UpdateOneUserBody,
} from "./user-type";

async function getMany(
  _query: GetManyUsersQuery,
  _context: Context
): Promise<UserEntity[]> {
  return [];
}

async function getOne(
  params: GetOneUserParams,
  context: Context
): Promise<UserEntity> {
  return UserEntity.fromOne(
    { ...params, name: "", email: "", createdAt: new Date() },
    context
  );
}

async function getOneSafe(
  params: GetOneUserParams,
  context: Context
): Promise<UserEntity | null> {
  return null;
}

async function createOne(
  body: CreateOneUserBody,
  context: Context
): Promise<UserEntity> {
  return UserEntity.fromOne(
    { ...body, id: "", createdAt: new Date() },
    context
  );
}

async function updateOne(
  one: UserEntity,
  _body: UpdateOneUserBody,
  _context: Context
): Promise<UserEntity> {
  return one;
}

async function deleteOne(
  one: UserEntity,
  _context: Context
): Promise<UserEntity> {
  return one;
}

const UserService: UserServiceInterface = {
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserService;
