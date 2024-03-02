const utils = require("airent/resources/utils.js");

/**
 * SCHEMA FLAGS
 * - internal: false | undefined, top-level flag, false to skip generating ManyResponse/OneResponse
 * - api: object | undefined, top-level field, defined to generate api actions and services
 */

function isCursorField(field) {
  return (
    !!field._parent.api?.cursors?.includes(field.name) &&
    utils.isPrimitiveField(field) &&
    utils.isPresentableField(field)
  );
}

function hasApiMethod(entity, methodName) {
  return Object.keys(entity.api?.methods ?? {}).includes(methodName);
}

// augment entity - add api strings

function addStrings(entity, isVerbose) {
  const pluralEntName = utils.toTitleCase(utils.pluralize(entity.name));
  const singularEntName = utils.toTitleCase(entity.name);
  entity.api = entity.api ?? {};
  if (isVerbose) {
    console.log(
      `[AIRENT-API/INFO] augmenting ${entity.name} - add strings ...`
    );
  }
  entity.api.strings = {
    manyEntsVar: utils.toCamelCase(utils.pluralize(entity.name)),
    oneEntVar: utils.toCamelCase(entity.name),
    handlersClass: `${singularEntName}Handlers`,
    actionsClass: `${singularEntName}Actions`,
    serviceClass: `${singularEntName}Service`,
    apiClientClass: `${singularEntName}ApiClient`,
    manyCursor: `Many${pluralEntName}Cursor`,
    manyResponse: `Many${pluralEntName}Response`,
    oneResponse: `One${singularEntName}Response`,
    getManyQuery: `GetMany${pluralEntName}Query`,
    getOneParams: `GetOne${singularEntName}Params`,
    createOneBody: `CreateOne${singularEntName}Body`,
    updateOneBody: `UpdateOne${singularEntName}Body`,
  };
  const hasGetMany = hasApiMethod(entity, "getMany");
  const hasGetOne = hasApiMethod(entity, "getOne");
  const hasGetOneSafe = hasApiMethod(entity, "getOneSafe");
  const hasCreateOne = hasApiMethod(entity, "createOne");
  const hasUpdateOne = hasApiMethod(entity, "updateOne");
  const hasDeleteOne = hasApiMethod(entity, "deleteOne");
  entity.api.booleans = {
    hasGetMany,
    hasGetOne,
    hasGetOneSafe,
    hasCreateOne,
    hasUpdateOne,
    hasDeleteOne,
    hasGetOneRequest: hasGetOne || hasGetOneSafe || hasUpdateOne | hasDeleteOne,
  };
  entity.fields.filter(isCursorField).forEach((field) => {
    field.strings.minVar = `min${utils.toTitleCase(field.name)}`;
    field.strings.maxVar = `max${utils.toTitleCase(field.name)}`;
  });
}

// augment entity - add api code

function buildBeforeType(entity) /* Code[] */ {
  if (!utils.isPresentableEntity(entity)) {
    return [];
  }
  return ["import { Select } from 'airent';"];
}

function buildAfterType(entity) /* Code[] */ {
  if (!utils.isPresentableEntity(entity)) {
    return [];
  }
  return [
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type Selected${entity.strings.responseClass}<S extends ${entity.strings.fieldRequestClass}, N extends boolean = false> =`,
    `  N extends true ? (Select<${entity.strings.responseClass}, S> | null) : Select<${entity.strings.responseClass}, S>;`,
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type ${entity.api.strings.manyCursor} = {`,
    "  count: number;",
    ...entity.fields
      .filter((f) => f.strings.minVar && f.strings.maxVar)
      .flatMap((field) => [
        ...(field.deprecated ? ["  /** @deprecated */"] : []),
        `  ${field.strings.minVar}: ${field.strings.fieldResponseType} | null;`,
        ...(field.deprecated ? ["  /** @deprecated */"] : []),
        `  ${field.strings.maxVar}: ${field.strings.fieldResponseType} | null;`,
      ]),
    "};",
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type ${entity.api.strings.manyResponse}<S extends ${entity.strings.fieldRequestClass}> = {`,
    `  cursor: ${entity.api.strings.manyCursor};`,
    ...(entity.deprecated ? ["  /** @deprecated */"] : []),
    `  ${entity.api.strings.manyEntsVar}: Selected${entity.strings.responseClass}<S>[];`,
    "};",
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type ${entity.api.strings.oneResponse}<S extends ${entity.strings.fieldRequestClass}, N extends boolean = false> = {`,
    ...(entity.deprecated ? ["  /** @deprecated */"] : []),
    `  ${entity.api.strings.oneEntVar}: Selected${entity.strings.responseClass}<S, N>;`,
    "};",
  ];
}

function addCode(entity, isVerbose) {
  if (isVerbose) {
    console.log(`[AIRENT-API/INFO] augmenting ${entity.name} - add code ...`);
  }
  const beforeType = buildBeforeType(entity);
  const afterType = buildAfterType(entity);
  entity.code.beforeType.push(...beforeType);
  entity.code.afterType.push(...afterType);
}

function augment(data, isVerbose) {
  const { entityMap } = data;

  const entityNames = Object.keys(entityMap).sort();
  const entities = entityNames.map((n) => entityMap[n]);
  entities.forEach((entity) => addStrings(entity, isVerbose));
  entities.forEach((entity) => addCode(entity, isVerbose));
}

module.exports = { augment };
