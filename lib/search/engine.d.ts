import { Awaitable } from "airent";
interface SearchEngineBase<DOCUMENT, ENGINE_QUERY, SCHEMA> {
    create(indexName: string, schema: SCHEMA): Awaitable<boolean>;
    delete(indexName: string): Awaitable<boolean>;
    reset(indexName: string, schema: SCHEMA, indexer: () => Awaitable<boolean>): Awaitable<boolean>;
    index(indexName: string, documents: DOCUMENT[]): Awaitable<boolean[]>;
    unindex(indexName: string, documents: DOCUMENT[]): Awaitable<boolean[]>;
    retrieve(indexName: string, query: ENGINE_QUERY): Awaitable<DOCUMENT[]>;
}
type DefaultSearchQuery = {
    q?: string;
};
type DefaultSearchDocument = {
    id: string;
};
type DefaultSearchRetriever = (query: DefaultSearchQuery) => Promise<DefaultSearchDocument[]>;
declare class DefaultSearchEngine implements SearchEngineBase<DefaultSearchDocument, DefaultSearchQuery, object> {
    constructor(registry: Record<string, DefaultSearchRetriever>);
    private registry;
    create(): Awaitable<boolean>;
    delete(): Awaitable<boolean>;
    reset(_indexName: string, _schema: object, indexer: () => Awaitable<boolean>): Awaitable<boolean>;
    index(_indexName: string, documents: DefaultSearchDocument[]): Awaitable<boolean[]>;
    unindex(_indexName: string, documents: DefaultSearchDocument[]): Awaitable<boolean[]>;
    retrieve(indexName: string, query: DefaultSearchQuery): Promise<DefaultSearchDocument[]>;
}
export { SearchEngineBase, DefaultSearchQuery, DefaultSearchDocument, DefaultSearchRetriever, DefaultSearchEngine };
