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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServiceBase = void 0;
var utils_1 = require("./utils");
var SearchServiceBase = /** @class */ (function () {
    function SearchServiceBase() {
    }
    SearchServiceBase.prototype.search = function (query, context) {
        return __awaiter(this, void 0, void 0, function () {
            var engineQuery, documents, entities, entityMap;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prepareQuery(query, context)];
                    case 1:
                        engineQuery = _a.sent();
                        return [4 /*yield*/, this.engine.retrieve(this.indexName, engineQuery)];
                    case 2:
                        documents = _a.sent();
                        return [4 /*yield*/, this.hydrate(documents, context)];
                    case 3:
                        entities = _a.sent();
                        entityMap = new Map(entities.map(function (o) { return [_this.entityKeyMapper(o), o]; }));
                        return [2 /*return*/, (0, utils_1.existify)(documents.map(function (one) { return entityMap.get(_this.documentKeyMapper(one)); }))];
                }
            });
        });
    };
    SearchServiceBase.prototype.indexOne = function (one, context) {
        return __awaiter(this, void 0, void 0, function () {
            var documents, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dehydrate([one], context)];
                    case 1:
                        documents = _a.sent();
                        return [4 /*yield*/, this.engine.index(this.indexName, documents)];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/, results[0]];
                }
            });
        });
    };
    SearchServiceBase.prototype.indexMany = function (many, context) {
        return __awaiter(this, void 0, void 0, function () {
            var documents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (many.length === 0) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.dehydrate(many, context)];
                    case 1:
                        documents = _a.sent();
                        return [4 /*yield*/, this.engine.index(this.indexName, documents)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SearchServiceBase.prototype.unindexOne = function (one, context) {
        return __awaiter(this, void 0, void 0, function () {
            var documents, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dehydrate([one], context)];
                    case 1:
                        documents = _a.sent();
                        return [4 /*yield*/, this.engine.unindex(this.indexName, documents)];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/, results[0]];
                }
            });
        });
    };
    SearchServiceBase.prototype.unindexMany = function (many, context) {
        return __awaiter(this, void 0, void 0, function () {
            var documents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dehydrate(many, context)];
                    case 1:
                        documents = _a.sent();
                        return [4 /*yield*/, this.engine.unindex(this.indexName, documents)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SearchServiceBase.prototype.resetIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.engine.reset(this.indexName, this.indexSchema)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return SearchServiceBase;
}());
exports.SearchServiceBase = SearchServiceBase;
//# sourceMappingURL=search.js.map