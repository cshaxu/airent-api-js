import { UserServiceBase } from "../test-output/entities/generated/user-service";
import { UserEntity } from "../test-output/entities/user";
import { RequestContext } from "./rc";
import {
  CreateOneUserBody,
  GetManyUsersQuery,
  GetOneUserParams,
  UpdateOneUserBody,
} from "./user-type";

export class UserService extends UserServiceBase {
  public async getMany(
    _query: GetManyUsersQuery,
    _rc: RequestContext
  ): Promise<UserEntity[]> {
    return [];
  }

  public async getOne(
    params: GetOneUserParams,
    _rc: RequestContext
  ): Promise<UserEntity> {
    return UserEntity.fromOne({
      ...params,
      name: "",
      email: "",
      createdAt: new Date(),
    });
  }

  public async createOne(
    body: CreateOneUserBody,
    _rc: RequestContext
  ): Promise<UserEntity> {
    return UserEntity.fromOne({ ...body, id: "", createdAt: new Date() });
  }

  public async updateOne(
    one: UserEntity,
    _body: UpdateOneUserBody,
    _rc: RequestContext
  ): Promise<UserEntity> {
    return one;
  }

  public async deleteOne(
    one: UserEntity,
    _rc: RequestContext
  ): Promise<UserEntity> {
    return one;
  }
}
