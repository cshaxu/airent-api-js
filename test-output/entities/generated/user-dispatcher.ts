// airent imports
import {
  dispatchSearchWith,
  dispatchGetManyWith,
  dispatchGetOneWith,
  dispatchGetOneSafeWith,
  dispatchCreateOneWith,
  dispatchUpdateOneWith,
  dispatchDeleteOneWith,
} from '../../../src/index';

// config imports
import { dispatcherConfig } from '../../../test-resources/framework';

// entity imports
import UserActions from './user-actions';
import {
  SearchUsersQuery,
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../../test-resources/user-type';

const searchConfig = {
  queryZod: SearchUsersQuery,
  action: UserActions.search,
  options: { requireLogin: false },
};

const search = dispatchSearchWith({
  ...dispatcherConfig,
  ...searchConfig,
});

const getManyConfig = {
  queryZod: GetManyUsersQuery,
  action: UserActions.getMany,
  options: { requireAdmin: true },
};

const getMany = dispatchGetManyWith({
  ...dispatcherConfig,
  ...getManyConfig,
});

const getOneConfig = {
  paramsZod: GetOneUserParams,
  action: UserActions.getOne,
  options: { requireLogin: false },
};

const getOne = dispatchGetOneWith({
  ...dispatcherConfig,
  ...getOneConfig,
});

const getOneSafeConfig = {
  paramsZod: GetOneUserParams,
  action: UserActions.getOneSafe,
  options: { requireLogin: false },
};

const getOneSafe = dispatchGetOneSafeWith({
  ...dispatcherConfig,
  ...getOneSafeConfig,
});

const createOneConfig = {
  bodyZod: CreateOneUserBody,
  action: UserActions.createOne,
  options: { requireLogin: false },
};

const createOne = dispatchCreateOneWith({
  ...dispatcherConfig,
  ...createOneConfig,
});

const updateOneConfig = {
  paramsZod: GetOneUserParams,
  bodyZod: UpdateOneUserBody,
  action: UserActions.updateOne,
  options: { requireLogin: true },
};

const updateOne = dispatchUpdateOneWith({
  ...dispatcherConfig,
  ...updateOneConfig,
});

const deleteOneConfig = {
  paramsZod: GetOneUserParams,
  action: UserActions.deleteOne,
  options: { requireLogin: true },
};

const deleteOne = dispatchDeleteOneWith({
  ...dispatcherConfig,
  ...deleteOneConfig,
});

/** @deprecated */
const UserDispatcher = {
  search,
  getMany,
  getOne,
  getOneSafe,
  createOne,
  updateOne,
  deleteOne,
};

export default UserDispatcher;
