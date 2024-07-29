import { Awaitable } from '../../src/index';
// airent imports
import { LoadKey, toArrayMap, toObjectMap } from 'airent';

// config imports
import { Context } from '../../test-sources/framework';

// entity imports
import { MessageEntity } from './message';
import {
  UserFieldRequest,
  UserResponse,
  SelectedUserResponse,
  UserModel,
} from './generated/user-type';
import { UserEntityBase } from './generated/user-base';

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
