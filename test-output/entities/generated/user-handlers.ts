import {
  handleGetMany,
  handleGetOne,
  handleCreateOne,
  handleUpdateOne,
  handleDeleteOne,
} from '../../../src';
import * as UserAction from './user-action';
import {
GetManyUsersQuery,
GetOneUserParams,
CreateOneUserBody,
UpdateOneUserBody,
} from '../../../test-resources/user-type';
import { authenticator } from '../../../test-resources/framework';
import { errorHandler } from '../../../test-resources/framework';

export const handleGetManyUsers = handleGetMany({
  queryZod: GetManyUsersQuery,
  action: UserAction.getManyUsers,
  authenticator,
  errorHandler,
  options: { requireAdmin: true },
});

export const handleGetOneUser = handleGetOne({
  paramsZod: GetOneUserParams,
  action: UserAction.getOneUser,
  authenticator,
  errorHandler,
  options: { requireLogin: false },
});

export const handleCreateOneUser = handleCreateOne({
  bodyZod: CreateOneUserBody,
  action: UserAction.createOneUser,
  authenticator,
  errorHandler,
  options: { requireLogin: false },
});

export const handleUpdateOneUser = handleUpdateOne({
  paramsZod: GetOneUserParams,
  bodyZod: UpdateOneUserBody,
  action: UserAction.updateOneUser,
  authenticator,
  errorHandler,
  options: { requireLogin: true },
});

export const handleDeleteOneUser = handleDeleteOne({
  paramsZod: GetOneUserParams,
  action: UserAction.deleteOneUser,
  authenticator,
  errorHandler,
  options: { requireLogin: true },
});
