// airent imports
import {
  AsyncLock,
  Awaitable,
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
import { Context } from '../../test-sources/framework';

// entity imports
import { MessageEntity } from './message';
import {
  UserFieldRequest,
  UserResponse,
  SelectedUserResponse,
  UserModel,
} from '../generated/types/user';
import { UserEntityBase } from '../generated/entities/user';

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
