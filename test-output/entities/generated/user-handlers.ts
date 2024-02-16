import {
  handleGetMany,
  handleGetOne,
  handleCreateOne,
  handleUpdateOne,
  handleDeleteOne,
} from '../../../src';
import UserActions from './user-actions';
import {
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';
import { authenticator } from '../../../test-resources/framework';
import { errorHandler } from '../../../test-resources/framework';

/** @deprecated */
const getMany = handleGetMany({
  queryZod: GetManyUsersQuery,
  action: UserActions.getMany,
  authenticator,
  errorHandler,
  options: { requireAdmin: true },
});

/** @deprecated */
const getOne = handleGetOne({
  paramsZod: GetOneUserParams,
  action: UserActions.getOne,
  authenticator,
  errorHandler,
  options: { requireLogin: false },
});

/** @deprecated */
const createOne = handleCreateOne({
  bodyZod: CreateOneUserBody,
  action: UserActions.createOne,
  authenticator,
  errorHandler,
  options: { requireLogin: false },
});

/** @deprecated */
const updateOne = handleUpdateOne({
  paramsZod: GetOneUserParams,
  bodyZod: UpdateOneUserBody,
  action: UserActions.updateOne,
  authenticator,
  errorHandler,
  options: { requireLogin: true },
});

/** @deprecated */
const deleteOne = handleDeleteOne({
  paramsZod: GetOneUserParams,
  action: UserActions.deleteOne,
  authenticator,
  errorHandler,
  options: { requireLogin: true },
});

/** @deprecated */
const UserHandlers = {
  getMany,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};

export default UserHandlers;
