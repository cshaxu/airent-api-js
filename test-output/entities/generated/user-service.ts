import { RequestContext } from '../../../test-resources/rc';
import { UserEntity } from '../user';
import {
  UserModel,
} from './user-type';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';

export abstract class UserServiceBase {

  public async beforeGetMany(query: GetManyUsersQuery, rc: RequestContext): Promise<void> {}

  public async afterGetMany(many: UserEntity[], query: GetManyUsersQuery, rc: RequestContext): Promise<void> {}

  public abstract getMany(query: GetManyUsersQuery, rc: RequestContext): Promise<UserEntity[]>;

  public async beforeGetOne(params: GetOneUserParams, rc: RequestContext): Promise<void> {}

  public async afterGetOne(one: UserEntity, params: GetOneUserParams, rc: RequestContext): Promise<void> {}

  public abstract getOne(params: GetOneUserParams, rc: RequestContext): Promise<UserEntity>;

  public async beforeCreateOne(body: CreateOneUserBody, rc: RequestContext): Promise<void> {}

  public async afterCreateOne(createdOne: UserEntity, body: CreateOneUserBody, rc: RequestContext): Promise<void> {}

  public abstract createOne(body: CreateOneUserBody, rc: RequestContext): Promise<UserEntity>;

  public async beforeUpdateOne(one: UserEntity, body: UpdateOneUserBody, rc: RequestContext): Promise<void> {}

  public async afterUpdateOne(updatedOne: UserEntity, body: UpdateOneUserBody, rc: RequestContext): Promise<void> {}

  public abstract updateOne(one: UserEntity, body: UpdateOneUserBody, rc: RequestContext): Promise<UserEntity>;

  public async beforeDeleteOne(one: UserEntity, rc: RequestContext): Promise<void> {}

  public async afterDeleteOne(deletedOne: UserEntity, rc: RequestContext): Promise<void> {}

  public abstract deleteOne(one: UserEntity, rc: RequestContext): Promise<UserEntity>;
}
