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

export const handleGetManyUsers = handleGetMany({
  queryZod: GetManyUsersQuery,
  apiExecutor: UserAction.getManyUsers,
  authenticator,
  options: { requireAdmin: true },
});

export const handleGetOneUser = handleGetOne({
  paramsZod: GetOneUserParams,
  apiExecutor: UserAction.getOneUser,
  authenticator,
  options: { requireLogin: false },
});

export const handleCreateOneUser = handleCreateOne({
  bodyZod: CreateOneUserBody,
  apiExecutor: UserAction.createOneUser,
  authenticator,
  options: { requireLogin: false },
});

export const handleUpdateOneUser = handleUpdateOne({
  paramsZod: GetOneUserParams,
  bodyZod: UpdateOneUserBody,
  apiExecutor: UserAction.updateOneUser,
  authenticator,
  options: { requireLogin: true },
});

export const handleDeleteOneUser = handleDeleteOne({
  paramsZod: GetOneUserParams,
  apiExecutor: UserAction.deleteOneUser,
  authenticator,
  options: { requireLogin: true },
});
