import { UserServiceBase } from "../test-output/entities/generated/user-service";
import { UserEntity } from "../test-output/entities/user";
import {
  CreateOneUserBody,
  GetManyUsersQuery,
  GetOneUserParams,
  UpdateOneUserBody,
} from "./user-type";

export class UserService extends UserServiceBase {
  public async getMany(query: GetManyUsersQuery): Promise<UserEntity[]> {
    return [];
  }

  public async getOne(params: GetOneUserParams): Promise<UserEntity> {
    return UserEntity.fromOne({
      ...params,
      name: "",
      email: "",
      createdAt: new Date(),
    });
  }

  public async createOne(body: CreateOneUserBody): Promise<UserEntity> {
    return UserEntity.fromOne({ ...body, id: "", createdAt: new Date() });
  }

  public async updateOne(
    one: UserEntity,
    _body: UpdateOneUserBody
  ): Promise<UserEntity> {
    return one;
  }

  public async deleteOne(one: UserEntity): Promise<UserEntity> {
    return one;
  }
}
