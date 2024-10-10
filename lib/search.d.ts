import { Awaitable } from "./types";
interface SearchEngineBase<DOCUMENT, ENGINE_QUERY, SCHEMA> {
    create(indexName: string, schema: SCHEMA): Awaitable<boolean>;
    delete(indexName: string): Awaitable<boolean>;
    alias(indexName: string, aliasIndexName: string): Awaitable<boolean>;
    unalias(aliasIndexName: string): Awaitable<string | null>;
    index(indexName: string, documents: DOCUMENT[]): Awaitable<boolean[]>;
    unindex(indexName: string, documents: DOCUMENT[]): Awaitable<boolean[]>;
    retrieve(indexName: string, query: ENGINE_QUERY): Awaitable<DOCUMENT[]>;
}
declare abstract class SearchServiceBase<ENTITY, SERVICE_QUERY, CONTEXT, DOCUMENT, ENGINE_QUERY, SCHEMA> {
    protected abstract engine: SearchEngineBase<DOCUMENT, ENGINE_QUERY, SCHEMA>;
    protected abstract indexName: string;
    protected abstract indexSchema: SCHEMA;
    protected abstract entityKeyMapper(one: ENTITY): string;
    protected abstract documentKeyMapper(one: DOCUMENT): string;
    protected abstract dehydrate(entities: ENTITY[], context: CONTEXT): Awaitable<DOCUMENT[]>;
    protected abstract hydrate(documents: DOCUMENT[], context: CONTEXT): Awaitable<ENTITY[]>;
    protected abstract prepareQuery(query: SERVICE_QUERY, context: CONTEXT): Awaitable<ENGINE_QUERY>;
    abstract resetIndex(context: CONTEXT): Awaitable<boolean>;
    indexOne(one: ENTITY, context: CONTEXT): Promise<boolean>;
    indexMany(many: ENTITY[], context: CONTEXT): Promise<boolean[]>;
    unindexOne(one: ENTITY, context: CONTEXT): Promise<boolean>;
    unindexMany(many: ENTITY[], context: CONTEXT): Promise<boolean[]>;
    search(query: SERVICE_QUERY, context: CONTEXT): Promise<(ENTITY & {})[]>;
}
export { SearchEngineBase, SearchServiceBase };
