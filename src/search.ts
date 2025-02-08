import { Awaitable } from "./types";
import { existify } from "./utils";

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

abstract class SearchServiceBase<
  ENTITY,
  SERVICE_QUERY,
  CONTEXT,
  DOCUMENT,
  ENGINE_QUERY,
  SCHEMA
> {
  protected abstract engine: SearchEngineBase<DOCUMENT, ENGINE_QUERY, SCHEMA>;

  protected abstract indexName: string;

  protected abstract indexSchema: SCHEMA;

  protected abstract entityKeyMapper(one: ENTITY): string;

  protected abstract documentKeyMapper(one: DOCUMENT): string;

  protected abstract dehydrate(
    entities: ENTITY[],
    context: CONTEXT
  ): Awaitable<DOCUMENT[]>;

  protected abstract hydrate(
    documents: DOCUMENT[],
    context: CONTEXT
  ): Awaitable<ENTITY[]>;

  protected abstract prepareQuery(
    query: SERVICE_QUERY,
    context: CONTEXT
  ): Awaitable<ENGINE_QUERY>;

  public abstract indexAll(context: CONTEXT): Awaitable<boolean>;

  public async resetIndex(context: CONTEXT): Promise<boolean> {
    const indexer = () => this.indexAll(context);
    return await this.engine.reset(this.indexName, this.indexSchema, indexer);
  }

  public async indexOne(one: ENTITY, context: CONTEXT): Promise<boolean> {
    const documents = await this.dehydrate([one], context);
    const results = await this.engine.index(this.indexName, documents);
    return results[0];
  }

  public async indexMany(many: ENTITY[], context: CONTEXT): Promise<boolean[]> {
    if (many.length === 0) {
      return [];
    }
    const documents = await this.dehydrate(many, context);
    return await this.engine.index(this.indexName, documents);
  }

  public async unindexOne(one: ENTITY, context: CONTEXT): Promise<boolean> {
    const documents = await this.dehydrate([one], context);
    const results = await this.engine.unindex(this.indexName, documents);
    return results[0];
  }

  public async unindexMany(
    many: ENTITY[],
    context: CONTEXT
  ): Promise<boolean[]> {
    const documents = await this.dehydrate(many, context);
    return await this.engine.unindex(this.indexName, documents);
  }

  public async search(query: SERVICE_QUERY, context: CONTEXT) {
    const engineQuery = await this.prepareQuery(query, context);
    const documents = await this.engine.retrieve(this.indexName, engineQuery);
    const entities = await this.hydrate(documents, context);
    const entityMap = new Map(
      entities.map((o) => [this.entityKeyMapper(o), o])
    );
    return existify(
      documents.map((one) => entityMap.get(this.documentKeyMapper(one)))
    );
  }
}

export { SearchEngineBase, SearchServiceBase };
