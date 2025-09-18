// airent imports
import { Awaitable } from "airent";
import { SearchEngineBase, SearchServiceBase } from '../../src/index';

// config imports
import { Context } from '../../test-sources/framework';

// entity imports
import { UserEntity } from '../entities/user';
import { SearchUsersQuery } from '../api-types/user';

/** @deprecated */
export type UserSearchDocument = {
  // TODO: add your fields here
};

/** @deprecated */
export class UserSearchService extends SearchServiceBase<
  UserEntity,
  SearchUsersQuery,
  Context,
  UserSearchDocument,
  unknown /* ENGINE_QUERY: the search query type of your search engine */,
  unknown /* SCHEMA: the search index schema type of your search engine */
> {
  protected engine: SearchEngineBase<SearchUsersQuery, unknown /* ENGINE_QUERY */, unknown /* SCHEMA */>;

  protected indexName = 'TODO: set your search index name for User';

  protected indexSchema = {/* TODO: set your search index schema for User */};

  protected entityKeyMapper(one: UserEntity): string {
    // TODO: map your entity to a unique key, e.g. `return one.id;`
    throw new Error('not implemented.');
  }

  protected documentKeyMapper(one: UserSearchDocument): string {
    // TODO: map your entity to a unique key, e.g. `return one.id;`
    throw new Error('not implemented.');
  }

  protected dehydrate(many: UserEntity[], context: Context): Awaitable<UserSearchDocument[]> {
    // TODO: map your entities to search documents
    throw new Error('not implemented.');
  }

  protected async hydrate(
    documents: UserSearchDocument[],
    context: Context
  ): Promise<UserEntity[]> {
    // TODO: map your search documents to entities
    throw new Error('not implemented.');
  }

  protected prepareQuery(query: SearchUsersQuery): Awaitable<unknown /* SCHEMA */> {
    // TODO: map your service query to a search engine query
    throw new Error('not implemented.');
  }

  public indexAll(context: Context): Awaitable<boolean> {
    // TODO: index all data for your search index
    throw new Error('not implemented.');
  }
}
