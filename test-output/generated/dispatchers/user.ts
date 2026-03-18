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
import { dispatcherConfig } from '../../../test-sources/framework';

// entity imports
import UserActions from '../actions/user';
import {
  SearchUsersQuery,
  GetManyUsersQuery,
  GetOneUserParams,
  CreateOneUserBody,
  UpdateOneUserBody,
} from '../../api-types/user';

const search = dispatchSearchWith({
  ...dispatcherConfig,
  queryZod: SearchUsersQuery,
  action: UserActions.search,
  options: { requireLogin: false },
});

const getMany = dispatchGetManyWith({
  ...dispatcherConfig,
  queryZod: GetManyUsersQuery,
  action: UserActions.getMany,
  options: { requireAdmin: true },
});

const getOne = dispatchGetOneWith({
  ...dispatcherConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.getOne,
  options: { requireLogin: false },
});

const getOneSafe = dispatchGetOneSafeWith({
  ...dispatcherConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.getOneSafe,
  options: { requireLogin: false },
});

const createOne = dispatchCreateOneWith({
  ...dispatcherConfig,
  bodyZod: CreateOneUserBody,
  action: UserActions.createOne,
  options: { requireLogin: false },
});

const updateOne = dispatchUpdateOneWith({
  ...dispatcherConfig,
  paramsZod: GetOneUserParams,
  bodyZod: UpdateOneUserBody,
  action: UserActions.updateOne,
  options: { requireLogin: true },
});

const deleteOne = dispatchDeleteOneWith({
  ...dispatcherConfig,
  paramsZod: GetOneUserParams,
  action: UserActions.deleteOne,
  options: { requireLogin: true },
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
