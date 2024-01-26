import {
  handleGetMany,
  handleGetOne,
  handleCreateOne,
  handleUpdateOne,
  handleDeleteOne,
} from '../../../src';
import * as UserActions from './user-actions';
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
  action: UserActions.getManyUsers,
  authenticator,
  errorHandler,
  options: { requireAdmin: true },
});

export const handleGetOneUser = handleGetOne({
  paramsZod: GetOneUserParams,
  action: UserActions.getOneUser,
  authenticator,
  errorHandler,
  options: { requireLogin: false },
});

export const handleCreateOneUser = handleCreateOne({
  bodyZod: CreateOneUserBody,
  action: UserActions.createOneUser,
  authenticator,
  errorHandler,
  options: { requireLogin: false },
});

export const handleUpdateOneUser = handleUpdateOne({
  paramsZod: GetOneUserParams,
  bodyZod: UpdateOneUserBody,
  action: UserActions.updateOneUser,
  authenticator,
  errorHandler,
  options: { requireLogin: true },
});

export const handleDeleteOneUser = handleDeleteOne({
  paramsZod: GetOneUserParams,
  action: UserActions.deleteOneUser,
  authenticator,
  errorHandler,
  options: { requireLogin: true },
});
