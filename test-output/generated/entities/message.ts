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
  private _originalModel: MessageModel;

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
    this._originalModel = { ...model };
    this.fromModelInner(model, false);
    this.initialize(model, context);
  }

  public fromModel(model: Partial<MessageModel>): void {
    this.fromModelInner(model, false);
  }

  private fromModelInner(model: Partial<MessageModel>, isResetOriginalModel: boolean): void {
    if ('id' in model && model['id'] !== undefined) {
      if (isResetOriginalModel) {
        this._originalModel['id'] = model['id'];
      }
      this.id = model.id;
    }
    if ('createdAt' in model && model['createdAt'] !== undefined) {
      if (isResetOriginalModel) {
        this._originalModel['createdAt'] = model['createdAt'];
      }
      this.createdAt = structuredClone(model.createdAt);
    }
    if ('userId' in model && model['userId'] !== undefined) {
      if (isResetOriginalModel) {
        this._originalModel['userId'] = model['userId'];
      }
      this.userId = model.userId;
    }
    if ('text' in model && model['text'] !== undefined) {
      if (isResetOriginalModel) {
        this._originalModel['text'] = model['text'];
      }
      this.text = model.text;
    }
  }

  public toModel(): Partial<MessageModel> {
    return {
      id: this.id,
      createdAt: structuredClone(this.createdAt),
      userId: this.userId,
      text: this.text,
    };
  }

  public toDirtyModel(): Partial<MessageModel> {
    const dirtyModel: Partial<MessageModel> = {};
    if ('id' in this._originalModel && this._originalModel['id'] !== this.id) {
      dirtyModel['id'] = this.id;
    }
    if ('createdAt' in this._originalModel && JSON.stringify(this._originalModel['createdAt']) !== JSON.stringify(this.createdAt)) {
      dirtyModel['createdAt'] = structuredClone(this.createdAt);
    }
    if ('userId' in this._originalModel && this._originalModel['userId'] !== this.userId) {
      dirtyModel['userId'] = this.userId;
    }
    if ('text' in this._originalModel && this._originalModel['text'] !== this.text) {
      dirtyModel['text'] = this.text;
    }
    return dirtyModel;
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
