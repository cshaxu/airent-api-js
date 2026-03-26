import { Awaitable } from "airent";
import { buildInvalidErrorMessage } from "../logging";
import createHttpError from "http-errors";

interface SearchEngineBase<DOCUMENT, ENGINE_QUERY, SCHEMA> {
  create(indexName: string, schema: SCHEMA): Awaitable<boolean>;
  delete(indexName: string): Awaitable<boolean>;
  reset(
    indexName: string,
    schema: SCHEMA,
    indexer: () => Awaitable<boolean>
  ): Awaitable<boolean>;
  index(indexName: string, documents: DOCUMENT[]): Awaitable<boolean[]>;
  unindex(indexName: string, documents: DOCUMENT[]): Awaitable<boolean[]>;
  retrieve(indexName: string, query: ENGINE_QUERY): Awaitable<DOCUMENT[]>;
}

type DefaultSearchQuery = { q?: string };
type DefaultSearchDocument = { id: string };
type DefaultSearchRetriever =
  (query: DefaultSearchQuery) => Promise<DefaultSearchDocument[]>;

class DefaultSearchEngine implements SearchEngineBase<
  DefaultSearchDocument,
  DefaultSearchQuery,
  object
> {
  public constructor(registry: Record<string, DefaultSearchRetriever>) {
    this.registry = registry;
  }

  private registry: Record<string, DefaultSearchRetriever>;

  create(): Awaitable<boolean> {
    return true;
  }

  delete(): Awaitable<boolean> {
    return true;
  }

  reset(
    _indexName: string,
    _schema: object,
    indexer: () => Awaitable<boolean>
  ): Awaitable<boolean> {
    return indexer();
  }

  index(_indexName: string, documents: DefaultSearchDocument[]): Awaitable<boolean[]> {
    return documents.map(() => true);
  }

  unindex(
    _indexName: string,
    documents: DefaultSearchDocument[]
  ): Awaitable<boolean[]> {
    return documents.map(() => true);
  }

  retrieve(
    indexName: string,
    query: DefaultSearchQuery
  ): Promise<DefaultSearchDocument[]> {
    const retriever = this.registry[indexName];
    if (retriever) {
      return retriever(query);
    }
    throw createHttpError.InternalServerError(
      buildInvalidErrorMessage(
        'indexName',
        Object.keys(this.registry),
        indexName
      )
    );
  }
}

export {
  SearchEngineBase,
  DefaultSearchQuery,
  DefaultSearchDocument,
  DefaultSearchRetriever,
  DefaultSearchEngine
};
