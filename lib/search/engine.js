"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSearchEngine = void 0;
const logging_1 = require("../logging");
const http_errors_1 = __importDefault(require("http-errors"));
class DefaultSearchEngine {
    constructor(registry) {
        this.registry = registry;
    }
    create() {
        return true;
    }
    delete() {
        return true;
    }
    reset(_indexName, _schema, indexer) {
        return indexer();
    }
    index(_indexName, documents) {
        return documents.map(() => true);
    }
    unindex(_indexName, documents) {
        return documents.map(() => true);
    }
    retrieve(indexName, query) {
        const retriever = this.registry[indexName];
        if (retriever) {
            return retriever(query);
        }
        throw http_errors_1.default.InternalServerError((0, logging_1.buildInvalidErrorMessage)('indexName', Object.keys(this.registry), indexName));
    }
}
exports.DefaultSearchEngine = DefaultSearchEngine;
//# sourceMappingURL=engine.js.map