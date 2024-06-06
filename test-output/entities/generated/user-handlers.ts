// airent imports
import {
  handleSearch,
  handleGetMany,
  handleGetOne,
  handleGetOneSafe,
  handleCreateOne,
  handleUpdateOne,
  handleDeleteOne,
} from '../../../src/index';

// config imports
import { handlerConfig } from '../../../test-resources/framework';

// entity imports
import UserActions from './user-actions';
import {
  SearchUsersQuery,
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';

const search = handleSearch({
  ...handlerConfig,
  queryZod: SearchUsersQuery,
  action: UserActions.search,
  options: { requireLogin: false },
});

const getMany = handleGetMany({
  ...handlerConfig,
  queryZod: GetManyUsersQuery,
  action: UserActions.getMany,
  options: { requireAdmin: true },
});

const getOne = handleGetOne({
  ...handlerConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.getOne,
  options: { requireLogin: false },
});

const getOneSafe = handleGetOneSafe({
  ...handlerConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.getOneSafe,
  options: { requireLogin: false },
});

const createOne = handleCreateOne({
  ...handlerConfig,
  bodyZod: CreateOneUserBody,
  action: UserActions.createOne,
  options: { requireLogin: false },
});

const updateOne = handleUpdateOne({
  ...handlerConfig,
  paramsZod: GetOneUserParams,
  bodyZod: UpdateOneUserBody,
  action: UserActions.updateOne,
  options: { requireLogin: true },
});

const deleteOne = handleDeleteOne({
  ...handlerConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.deleteOne,
  options: { requireLogin: true },
});

/** @deprecated */
const UserHandlers = {
  search,
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserHandlers;
