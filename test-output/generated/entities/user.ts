import createHttpError from 'http-errors';
// airent imports
import {
  AsyncLock,
  Awaitable,
  BaseEntity,
  EntityConstructor,
  LoadConfig,
  LoadKey,
  Select,
  batch,
  clone,
  sequential,
  toArrayMap,
  toObjectMap,
} from 'airent';

// config imports
import { Context } from '../../../test-sources/framework';

// entity imports
import { MessageEntity } from '../../entities/message';
import {
  UserFieldRequest,
  UserResponse,
  SelectedUserResponse,
  UserModel,
} from '../types/user';

/** @deprecated */
export class UserEntityBase extends BaseEntity<
  UserModel, Context, UserFieldRequest, UserResponse
> {
  public id!: string;
  public createdAt!: Date;
  public name!: string;
  public email!: string;

  protected messages?: MessageEntity[];

  public constructor(
    model: UserModel,
    context: Context,
    group: UserEntityBase[],
    lock: AsyncLock,
  ) {
    super(context, group, lock);
    this._aliasMapFromModel['id'] = 'id';
    this._aliasMapToModel['id'] = 'id';
    this._aliasMapFromModel['createdAt'] = 'createdAt';
    this._aliasMapToModel['createdAt'] = 'createdAt';
    this._aliasMapFromModel['name'] = 'name';
    this._aliasMapToModel['name'] = 'name';
    this._aliasMapFromModel['email'] = 'email';
    this._aliasMapToModel['email'] = 'email';
    this.fromModelInner(model, true);
    this.initialize(model, context);
  }

  public async present<S extends UserFieldRequest>(fieldRequest: S): Promise<SelectedUserResponse<S>> {
    await this.beforePresent(fieldRequest);
    const response = {
      ...(fieldRequest.id !== undefined && { id: this.id }),
      ...(fieldRequest.createdAt !== undefined && { createdAt: this.createdAt }),
      ...(fieldRequest.name !== undefined && { name: this.name }),
      ...(fieldRequest.email !== undefined && { email: this.email }),
      ...(fieldRequest.messages !== undefined && { messages: await this.getMessages().then((a) => Promise.all(a.map((one) => one.present(fieldRequest.messages!)))) }),
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

  /** self creator */

  public static async createOne<ENTITY extends UserEntityBase>(
    this: EntityConstructor<UserModel, Context, ENTITY>,
    model: Partial<UserModel>,
    context: Context
  ): Promise<ENTITY | null> {
    const createdModel = {/* TODO: create model for UserEntity */};
    return (this as any).fromOne(createdModel, context);
  }

  /** self loaders */

  public static async getOne<ENTITY extends UserEntityBase>(
    this: EntityConstructor<UserModel, Context, ENTITY>,
    key: LoadKey,
    context: Context
  ): Promise<ENTITY | null> {
    return await (this as any)
      .getMany([key], context)
      .then((array: ENTITY[]) => array.length > 0 ? array[0] : null);
  }

  public static async getMany<ENTITY extends UserEntityBase>(
    this: EntityConstructor<UserModel, Context, ENTITY>,
    keys: LoadKey[],
    context: Context
  ): Promise<ENTITY[]> {
    const models = [/* TODO: load models for UserEntity */];
    return (this as any).fromArray(models, context);
  }

  /** associations */

  protected messagesLoadConfig: LoadConfig<UserEntityBase, MessageEntity> = {
    name: 'UserEntity.messages',
    filter: (one: UserEntityBase) => one.messages === undefined,
    getter: (sources: UserEntityBase[]) => {
      return sources
        .map((one) => ({
          userId: one.id,
        }));
    },
    // TODO: build your association data loader
    // loader: async (keys: LoadKey[]) => {
    //   const models = [/* TODO: load MessageEntity models */];
    //   return MessageEntity.fromArray(models, this.context);
    // },
    setter: (sources: UserEntityBase[], targets: MessageEntity[]) => {
      const map = toArrayMap(targets, (one) => JSON.stringify({ userId: one.userId }));
      sources.forEach((one) => (one.messages = map.get(JSON.stringify({ userId: one.id })) ?? []));
    },
  };

  public async getMessages(): Promise<MessageEntity[]> {
    if (this.messages !== undefined) {
      return this.messages;
    }
    await this.load(this.messagesLoadConfig);
    return this.messages!;
  }

  public setMessages(messages?: MessageEntity[]): void {
    this.messages = messages;
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
