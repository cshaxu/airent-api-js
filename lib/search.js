"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServiceBase = void 0;
const utils_1 = require("./utils");
class SearchServiceBase {
    resetIndex(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexer = () => this.indexAll(context);
            return yield this.engine.reset(this.indexName, this.indexSchema, indexer);
        });
    }
    indexOne(one, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.dehydrate([one], context);
            const results = yield this.engine.index(this.indexName, documents);
            return results[0];
        });
    }
    indexMany(many, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (many.length === 0) {
                return [];
            }
            const documents = yield this.dehydrate(many, context);
            return yield this.engine.index(this.indexName, documents);
        });
    }
    unindexOne(one, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.dehydrate([one], context);
            const results = yield this.engine.unindex(this.indexName, documents);
            return results[0];
        });
    }
    unindexMany(many, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.dehydrate(many, context);
            return yield this.engine.unindex(this.indexName, documents);
        });
    }
    search(query, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const engineQuery = yield this.prepareQuery(query, context);
            const documents = yield this.engine.retrieve(this.indexName, engineQuery);
            const entities = yield this.hydrate(documents, context);
            const entityMap = new Map(entities.map((o) => [this.entityKeyMapper(o), o]));
            return (0, utils_1.existify)(documents.map((one) => entityMap.get(this.documentKeyMapper(one))));
        });
    }
}
exports.SearchServiceBase = SearchServiceBase;
//# sourceMappingURL=search.js.map