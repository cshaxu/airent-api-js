// airent imports
import { fetchJsonOrThrow } from '../../src/index';

// config imports
import { baseUrl } from '../../test-sources/fetch';

// entity imports
import {
  SelectedMessageResponse,
  MessageFieldRequest,
  ManyMessagesResponse,
  OneMessageResponse,
} from '../entities/generated/message-type';

function present<S extends MessageFieldRequest>(
  one: any,
  fieldRequest: S
): SelectedMessageResponse<S> {
  return {
    ...one,
    ...(one.createdAt !== undefined && fieldRequest.createdAt === true && { createdAt: new Date(one.createdAt) }),
  };
}

function presentManyResponse<S extends MessageFieldRequest>(
  response: { cursor: any, messages: any[] },
  fieldRequest: S
): ManyMessagesResponse<S> {
  const cursor = {
    ...response.cursor,
  };
  const { messages: many } = response;
  const messages = many.map((one) => present(one, fieldRequest));
  return { cursor, messages };
}

function presentOneResponse<S extends MessageFieldRequest>(
  response: { message: any },
  fieldRequest: S
): OneMessageResponse<S> {
  const { message: one } = response;
  const message = present(one, fieldRequest);
  return { message };
}

function presentOneSafeResponse<S extends MessageFieldRequest>(
  response: { message: any },
  fieldRequest: S
): OneMessageResponse<S, true> {
  const { message: one } = response;
  const message = one === null ? null : present(one, fieldRequest);
  return { message };
}

const MessageApiClient = {
  present,
  presentManyResponse,
  presentOneResponse,
  presentOneSafeResponse,
};

export default MessageApiClient;
