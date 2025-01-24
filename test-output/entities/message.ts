import { Awaitable } from '../../src/index';
// airent imports
import { LoadKey, toArrayMap, toObjectMap } from 'airent';

// config imports
import { Context } from '../../test-sources/framework';

// entity imports
import {
  MessageFieldRequest,
  MessageResponse,
  SelectedMessageResponse,
  MessageModel,
} from '../generated/types/message';
import { MessageEntityBase } from '../generated/entities/message';

export class MessageEntity extends MessageEntityBase {
}
