import { Context } from '../../../test-resources/framework';

import {
  MessageFieldRequest,
  ManyMessagesResponse,
  OneMessageResponse,
} from './message-type';
import { MessageEntity } from '../message';
import { MessageModel } from './message-type';

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
