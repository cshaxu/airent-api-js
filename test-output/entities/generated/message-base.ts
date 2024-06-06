import { Awaitable } from '../../../src/index';
// airent imports
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

// config imports
import { Context } from '../../../test-resources/framework';

// entity imports
import {
  MessageFieldRequest,
  MessageResponse,
  SelectedMessageResponse,
  MessageModel,
} from './message-type';

export class MessageEntityBase extends BaseEntity<
  MessageModel, Context, MessageFieldRequest, MessageResponse
> {
  public id: string;
  public createdAt: Date;
  public userId: string;
  public text: string | null;

  public constructor(
    model: MessageModel,
    context: Context,
    group: MessageEntityBase[],
    lock: AsyncLock,
  ) {
    super(context, group, lock);

    this.id = model.id;
    this.createdAt = model.createdAt;
    this.userId = model.userId;
    this.text = model.text;

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

  /** self loaders */

  public static async getOne<ENTITY extends MessageEntityBase>(
    this: EntityConstructor<MessageModel, Context, ENTITY>,
    key: LoadKey
  ): Promise<ENTITY | null> {
    return await (this as any)
      .getMany([key])
      .then((array: ENTITY[]) => array.at(0) ?? null);
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
