// airent imports
import { Select } from 'airent';

// entity imports

/** structs */

export type MessageModel = { id: string; createdAt: Date; userId: string; text: string | null };

export type MessageFieldRequest = {
  id?: boolean;
  createdAt?: boolean;
  userId?: boolean;
  text?: boolean;
};

export type MessageResponse = {
  id?: string;
  createdAt?: Date;
  userId?: string;
  text?: string | null;
};

export type SelectedMessageResponse<S extends MessageFieldRequest> = Select<MessageResponse, S>;

export type ManyMessagesCursor = {
  count: number;
};

export type ManyMessagesResponse<S extends MessageFieldRequest> = {
  cursor: ManyMessagesCursor;
  messages: SelectedMessageResponse<S>[];
};

export type OneMessageResponse<S extends MessageFieldRequest, N extends boolean = false> = {
  message: N extends true ? (SelectedMessageResponse<S> | null) : SelectedMessageResponse<S>;
};
