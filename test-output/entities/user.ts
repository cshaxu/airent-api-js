import { Awaitable } from '../../../src';
import { LoadKey, toArrayMap, toObjectMap } from 'airent';
import { Context } from '../../test-resources/framework';
import { UserEntityBase } from './generated/user-base';
import {
  UserFieldRequest,
  UserResponse,
  SelectedUserResponse,
  UserModel,
} from './generated/user-type';

/** @deprecated */
export class UserEntity extends UserEntityBase {

  protected authorizePrivate(): Awaitable<boolean> {
    throw new Error('not implemented');
  }
}
