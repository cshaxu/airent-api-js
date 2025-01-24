// airent imports
import { isFunction, max, min } from '../../../src/index';

// config imports
import { Context } from '../../../test-sources/framework';

// entity imports
import {
  MessageFieldRequest,
  ManyMessagesResponse,
  OneMessageResponse,
} from '../types/message';
import { MessageEntity } from '../../entities/message';
import { MessageModel } from '../types/message';

// api response builders

async function buildManyResponse<S extends MessageFieldRequest>(
  many: MessageEntity[],
  fieldRequest: S,
): Promise<ManyMessagesResponse<S>> {
  const messages = await MessageEntity.presentMany(many, fieldRequest);
  const cursor = {
    count: many.length,
 };
  return { cursor, messages };
}

async function buildOneResponse<S extends MessageFieldRequest>(
  one: MessageEntity,
  fieldRequest: S,
): Promise<OneMessageResponse<S>> {
  const message = await one.present(fieldRequest);
  return { message };
}

async function buildOneSafeResponse<S extends MessageFieldRequest>(
  one: MessageEntity | null,
  fieldRequest: S,
): Promise<OneMessageResponse<S, true>> {
  const message = one === null ? null : await one.present(fieldRequest);
  return { message };
}

const MessageActions = {
  buildManyResponse,
  buildOneResponse,
  buildOneSafeResponse,
};

export default MessageActions;
