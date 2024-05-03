import { Awaitable } from '../../src/index';
import { LoadKey, toArrayMap, toObjectMap } from 'airent';
import { Context } from '../../test-resources/framework';
import { UserEntityBase } from './generated/user-base';
import {
  UserFieldRequest,
  UserResponse,
  SelectedUserResponse,
  UserModel,
} from './generated/user-type';
import { MessageEntity } from './message';

/** @deprecated */
export class UserEntity extends UserEntityBase {
  protected initialize(model: UserModel, context: Context) {
    super.initialize(model, context);

    /** associations */

    this.messagesLoadConfig.loader = async (keys: LoadKey[]) => {
      const models = [/* TODO: load MessageEntity models */];
      return MessageEntity.fromArray(models, this.context);
    };
  }

  protected authorizePrivate(): Awaitable<boolean> {
    throw new Error('not implemented');
  }
}
