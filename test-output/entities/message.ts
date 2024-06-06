import { Awaitable } from '../../src/index';
// airent imports
import { LoadKey, toArrayMap, toObjectMap } from 'airent';

// config imports
import { Context } from '../../test-resources/framework';

// entity imports
import {
  MessageFieldRequest,
  MessageResponse,
  SelectedMessageResponse,
  MessageModel,
} from './generated/message-type';
import { MessageEntityBase } from './generated/message-base';

export class MessageEntity extends MessageEntityBase {
}
