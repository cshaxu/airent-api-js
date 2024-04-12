import {
  handleGetMany,
  handleGetOne,
  handleGetOneSafe,
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
import { handlerConfig } from '../../../test-resources/framework';

/** @deprecated */
const getMany = handleGetMany({
  ...handlerConfig,
  queryZod: GetManyUsersQuery,
  action: UserActions.getMany,
  options: { requireAdmin: true },
});

/** @deprecated */
const getOne = handleGetOne({
  ...handlerConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.getOne,
  options: { requireLogin: false },
});

/** @deprecated */
const getOneSafe = handleGetOneSafe({
  ...handlerConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.getOneSafe,
  options: { requireLogin: false },
});

/** @deprecated */
const createOne = handleCreateOne({
  ...handlerConfig,
  bodyZod: CreateOneUserBody,
  action: UserActions.createOne,
  options: { requireLogin: false },
});

/** @deprecated */
const updateOne = handleUpdateOne({
  ...handlerConfig,
  paramsZod: GetOneUserParams,
  bodyZod: UpdateOneUserBody,
  action: UserActions.updateOne,
  options: { requireLogin: true },
});

/** @deprecated */
const deleteOne = handleDeleteOne({
  ...handlerConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.deleteOne,
  options: { requireLogin: true },
});

/** @deprecated */
const UserHandlers = {
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserHandlers;
