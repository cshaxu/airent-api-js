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
  protected rc: RequestContext;

  public constructor(rc: RequestContext) {
    this.rc = rc;
  }

  public async beforeGetMany(query: GetManyUsersQuery): Promise<void> {}

  public async afterGetMany(many: UserEntity[], query: GetManyUsersQuery): Promise<void> {}

  public abstract getMany(query: GetManyUsersQuery): Promise<UserEntity[]>;

  public async beforeGetOne(params: GetOneUserParams): Promise<void> {}

  public async afterGetOne(one: UserEntity, params: GetOneUserParams): Promise<void> {}

  public abstract getOne(params: GetOneUserParams): Promise<UserEntity>;

  public async beforeCreateOne(body: CreateOneUserBody): Promise<void> {}

  public async afterCreateOne(createdOne: UserEntity, body: CreateOneUserBody): Promise<void> {}

  public abstract createOne(body: CreateOneUserBody): Promise<UserEntity>;

  public async beforeUpdateOne(one: UserEntity, body: UpdateOneUserBody): Promise<void> {}

  public async afterUpdateOne(updatedOne: UserEntity, body: UpdateOneUserBody): Promise<void> {}

  public abstract updateOne(one: UserEntity, body: UpdateOneUserBody): Promise<UserEntity>;

  public async beforeDeleteOne(one: UserEntity): Promise<void> {}

  public async afterDeleteOne(deletedOne: UserEntity): Promise<void> {}

  public abstract deleteOne(one: UserEntity): Promise<UserEntity>;
}
