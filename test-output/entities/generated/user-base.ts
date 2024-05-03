import createHttpError from 'http-errors';
import { Awaitable } from '../../../src';
import {
  AsyncLock,
  BaseEntity,
  EntityConstructor,
  LoadConfig,
  LoadKey,
  Select,
  sequential,
  toArrayMap,
  toObjectMap,
} from 'airent';
import { Context } from '../../../test-resources/framework';

/** generated */
import {
  UserFieldRequest,
  UserResponse,
  SelectedUserResponse,
  UserModel,
} from './user-type';

/** @deprecated */
export class UserEntityBase extends BaseEntity<
  UserModel, Context, UserFieldRequest, UserResponse
> {
  public id: string;
  public createdAt: Date;
  public name: string;
  public email: string;

  public constructor(
    model: UserModel,
    context: Context,
    group: UserEntityBase[],
    lock: AsyncLock,
  ) {
    super(context, group, lock);

    this.id = model.id;
    this.createdAt = model.createdAt;
    this.name = model.name;
    this.email = model.email;

    this.initialize(model, context);
  }

  public async present<S extends UserFieldRequest>(fieldRequest: S): Promise<SelectedUserResponse<S>> {
    await this.beforePresent(fieldRequest);
    const response = {
      ...(fieldRequest.id !== undefined && { id: this.id }),
      ...(fieldRequest.createdAt !== undefined && { createdAt: this.createdAt }),
      ...(fieldRequest.name !== undefined && { name: this.name }),
      ...(fieldRequest.email !== undefined && { email: this.email }),
    };
    await this.afterPresent(fieldRequest, response as Select<UserResponse, S>);
    return response as SelectedUserResponse<S>;
  }

  public static async presentMany<
    ENTITY extends UserEntityBase,
    S extends UserFieldRequest
  >(entities: ENTITY[], fieldRequest: S): Promise<SelectedUserResponse<S>[]> {
    return await sequential(entities.map((one) => () => one.present(fieldRequest)));
  }

  /** self loaders */

  public static async getOne<ENTITY extends UserEntityBase>(
    this: EntityConstructor<UserModel, Context, ENTITY>,
    key: LoadKey
  ): Promise<ENTITY | null> {
    return await (this as any)
      .getMany([key])
      .then((array: ENTITY[]) => array.at(0) ?? null);
  }

  public static async getMany<ENTITY extends UserEntityBase>(
    this: EntityConstructor<UserModel, Context, ENTITY>,
    keys: LoadKey[],
    context: Context
  ): Promise<ENTITY[]> {
    const models = [/* TODO: load models for UserEntity */];
    return (this as any).fromArray(models, context);
  }

  protected privateFields = [
    'email',
  ];

  protected async checkPrivateFields(fieldRequest: UserFieldRequest): Promise<void> {
    const fields = Object.keys(fieldRequest).filter((key) => this.privateFields.includes(key));
    if (fields.length === 0) {
      return;
    }
    const isAuthorized = await this.authorizePrivate();
    if (!isAuthorized) {
      const errorMessage = `Unauthorized access to [${fields.map((field) => `'${field}'`).join(', ')}] on User`;
      throw createHttpError.Forbidden(errorMessage);
    }
  }

  protected authorizePrivate(): Awaitable<boolean> {
    throw new Error('not implemented');
  }

  protected async beforePresent<S extends UserFieldRequest>(fieldRequest: S): Promise<void> {
    await this.checkPrivateFields(fieldRequest);
  }
}
