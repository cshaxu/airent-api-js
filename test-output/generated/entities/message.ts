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
import {
  MessageFieldRequest,
  MessageResponse,
  SelectedMessageResponse,
  MessageModel,
} from '../types/message';

export class MessageEntityBase extends BaseEntity<
  MessageModel, Context, MessageFieldRequest, MessageResponse
> {
  public id!: string;
  public createdAt!: Date;
  public userId!: string;
  public text!: string | null;

  public constructor(
    model: MessageModel,
    context: Context,
    group: MessageEntityBase[],
    lock: AsyncLock,
  ) {
    super(context, group, lock);
    this._aliasMapFromModel['id'] = 'id';
    this._aliasMapToModel['id'] = 'id';
    this._aliasMapFromModel['createdAt'] = 'createdAt';
    this._aliasMapToModel['createdAt'] = 'createdAt';
    this._aliasMapFromModel['userId'] = 'userId';
    this._aliasMapToModel['userId'] = 'userId';
    this._aliasMapFromModel['text'] = 'text';
    this._aliasMapToModel['text'] = 'text';
    this.fromModelInner(model, true);
    this.initialize(model, context);
  }

  public async present<S extends MessageFieldRequest>(fieldRequest: S): Promise<SelectedMessageResponse<S>> {
    await this.beforePresent(fieldRequest);
    const response = {
      ...(fieldRequest.id !== undefined && { id: this.id }),
      ...(fieldRequest.createdAt !== undefined && { createdAt: this.createdAt }),
      ...(fieldRequest.userId !== undefined && { userId: this.userId }),
      ...(fieldRequest.text !== undefined && { text: this.text }),
    };
    await this.afterPresent(fieldRequest, response as Select<MessageResponse, S>);
    return response as SelectedMessageResponse<S>;
  }

  public static async presentMany<
    ENTITY extends MessageEntityBase,
    S extends MessageFieldRequest
  >(entities: ENTITY[], fieldRequest: S): Promise<SelectedMessageResponse<S>[]> {
    return await sequential(entities.map((one) => () => one.present(fieldRequest)));
  }

  /** self creator */

  public static async createOne<ENTITY extends MessageEntityBase>(
    this: EntityConstructor<MessageModel, Context, ENTITY>,
    model: Partial<MessageModel>,
    context: Context
  ): Promise<ENTITY | null> {
    const createdModel = {/* TODO: create model for MessageEntity */};
    return (this as any).fromOne(createdModel, context);
  }

  /** self loaders */

  public static async getOne<ENTITY extends MessageEntityBase>(
    this: EntityConstructor<MessageModel, Context, ENTITY>,
    key: LoadKey,
    context: Context
  ): Promise<ENTITY | null> {
    return await (this as any)
      .getMany([key], context)
      .then((array: ENTITY[]) => array.length > 0 ? array[0] : null);
  }

  public static async getMany<ENTITY extends MessageEntityBase>(
    this: EntityConstructor<MessageModel, Context, ENTITY>,
    keys: LoadKey[],
    context: Context
  ): Promise<ENTITY[]> {
    const models = [/* TODO: load models for MessageEntity */];
    return (this as any).fromArray(models, context);
  }
}
