const path = require("path");

const codeUtils = require("airent/resources/utils/code.js");
const pathUtils = require("airent/resources/utils/path.js");

// build config

function augmentConfig(config) /* void */ {
  config._packages.api = config._packages.api ?? {};
  config._packages.api.baseToLibFull = config.api.libImportPath
    ? pathUtils.buildRelativeFull(
        path.join(config.generatedPath, "entities"),
        config.api.libImportPath,
        config,
        codeUtils.getModuleSuffix
      )
    : "@airent/api";
  config._packages.api.entityToLibFull = config.api.libImportPath
    ? pathUtils.buildRelativeFull(
        config.entityPath,
        config.api.libImportPath,
        config,
        codeUtils.getModuleSuffix
      )
    : "@airent/api";

  if (config.api.server) {
    config._packages.api.dispatcherToLibFull = config.api.libImportPath
      ? pathUtils.buildRelativeFull(
          path.join(config.generatedPath, "dispatchers"),
          config.api.libImportPath,
          config,
          codeUtils.getModuleSuffix
        )
      : "@airent/api";
    config._packages.api.actionToLibFull = config.api.libImportPath
      ? pathUtils.buildRelativeFull(
          path.join(config.generatedPath, "actions"),
          config.api.libImportPath,
          config,
          codeUtils.getModuleSuffix
        )
      : "@airent/api";
    config._packages.api.serviceInterfaceToLibFull = config.api.libImportPath
      ? pathUtils.buildRelativeFull(
          path.join(config.generatedPath, "services"),
          config.api.libImportPath,
          config,
          codeUtils.getModuleSuffix
        )
      : "@airent/api";
    config._packages.api.serviceToLibFull = config.api.libImportPath
      ? pathUtils.buildRelativeFull(
          config.api.server.servicePath,
          config.api.libImportPath,
          config,
          codeUtils.getModuleSuffix
        )
      : "@airent/api";

    config._packages.api.actionToContextFull = pathUtils.buildRelativeFull(
      path.join(config.generatedPath, "actions"),
      config.contextImportPath,
      config,
      codeUtils.getModuleSuffix
    );
    config._packages.api.serviceInterfaceToContextFull =
      pathUtils.buildRelativeFull(
        path.join(config.generatedPath, "services"),
        config.contextImportPath,
        config,
        codeUtils.getModuleSuffix
      );
    config._packages.api.serviceToContextFull = pathUtils.buildRelativeFull(
      config.api.server.servicePath,
      config.contextImportPath,
      config,
      codeUtils.getModuleSuffix
    );
    config._packages.api.dispatcherToDispatcherConfigFull =
      pathUtils.buildRelativeFull(
        path.join(config.generatedPath, "dispatchers"),
        config.api.server.dispatcherConfigImportPath,
        config,
        codeUtils.getModuleSuffix
      );
  }

  if (config.api.client) {
    config._packages.api.clientToLibFull = config.api.libImportPath
      ? pathUtils.buildRelativeFull(
          path.join(config.generatedPath, "clients"),
          config.api.libImportPath,
          config,
          codeUtils.getModuleSuffix
        )
      : "@airent/api";
    config._packages.api.clientToBaseUrlFull = pathUtils.buildRelativeFull(
      path.join(config.generatedPath, "clients"),
      config.api.client.baseUrlImportPath,
      config,
      codeUtils.getModuleSuffix
    );
  }
}

/**
 * SCHEMA FLAGS
 * - internal: false | undefined, top-level flag, false to skip generating ManyResponse/OneResponse
 * - api: object | undefined, top-level field, defined to generate api actions and services
 */

function hasApiMethod(entity, methodName) {
  return Object.keys(entity.api?.methods ?? {}).includes(methodName);
}

// augment entity - add api strings

function addStrings(entity, config, isVerbose) {
  const pluralEntName = codeUtils.toPascalCase(codeUtils.pluralize(entity.name));
  const singularEntName = codeUtils.toPascalCase(entity.name);
  if (isVerbose) {
    console.log(
      `[AIRENT-API/INFO] augmenting ${entity.name} - add strings ...`
    );
  }
  entity._strings.api = {
    manyEntsVar: codeUtils.toCamelCase(codeUtils.pluralize(entity.name)),
    oneEntVar: codeUtils.toCamelCase(entity.name),
    dispatcherClass: `${singularEntName}Dispatcher`,
    actionsClass: `${singularEntName}Actions`,
    serviceClass: `${singularEntName}Service`,
    searchServiceClass: `${codeUtils.toPascalCase(entity.name)}SearchService`,
    searchServiceModuleName: `${codeUtils.toKababCase(
      entity.name
    )}-search${codeUtils.getModuleSuffix(config)}`,
    serviceInterfaceClass: `${singularEntName}ServiceInterface`,
    apiClientClass: `${singularEntName}ApiClient`,
    manyCursor: `Many${pluralEntName}Cursor`,
    manyResponse: `Many${pluralEntName}Response`,
    oneResponse: `One${singularEntName}Response`,
    searchDocument: `${singularEntName}SearchDocument`,
    searchQuery: `Search${pluralEntName}Query`,
    getManyQuery: `GetMany${pluralEntName}Query`,
    getOneParams: `GetOne${singularEntName}Params`,
    createOneBody: `CreateOne${singularEntName}Body`,
    updateOneBody: `UpdateOne${singularEntName}Body`,
  };

  entity.fields.forEach(
    (field) => (field._strings.api = field._strings.api ?? {})
  );

  (entity.api?.cursors ?? [])
    .flatMap((c) => Object.keys(c).map((n) => ({ name: n, value: c[n] })))
    .map((c) => ({ ...codeUtils.queryField(c.name, entity), value: c.value }))
    .forEach((field) => {
      if (Object.keys(field) === 0) {
        console.error("[AIRENT-API/ERROR] invalid cursor field - missing");
      }
      if (!codeUtils.isPresentableField(field)) {
        console.error("[AIRENT-API/ERROR] invalid cursor field - internal");
      }
      if (field.value === "asc") {
        field._strings.api.maxVar = `max${codeUtils.toPascalCase(field.name)}`;
      }
      if (field.value === "desc") {
        field._strings.api.minVar = `min${codeUtils.toPascalCase(field.name)}`;
      }
    });
}

function addBooleans(entity) {
  const hasSearch = hasApiMethod(entity, "search");
  const hasGetMany = hasApiMethod(entity, "getMany");
  const hasGetOne = hasApiMethod(entity, "getOne");
  const hasGetOneSafe = hasApiMethod(entity, "getOneSafe");
  const hasCreateOne = hasApiMethod(entity, "createOne");
  const hasUpdateOne = hasApiMethod(entity, "updateOne");
  const hasDeleteOne = hasApiMethod(entity, "deleteOne");
  const hasGetOneRequest =
    hasGetOne || hasGetOneSafe || hasUpdateOne | hasDeleteOne;
  const hasAny = hasSearch || hasGetMany || hasGetOneRequest || hasCreateOne;
  entity._booleans = entity._booleans ?? {};
  entity._booleans.api = {
    hasSearch,
    hasGetMany,
    hasGetOne,
    hasGetOneSafe,
    hasCreateOne,
    hasUpdateOne,
    hasDeleteOne,
    hasGetOneRequest,
    hasAny,
  };
}

// augment entity - add api packages
function buildTypePackages(type, config) /* Object */ {
  if (type._entity !== undefined) {
    return {};
  } else if (codeUtils.isImportType(type)) {
    const actionToExternalFull = pathUtils.buildRelativeFull(
      path.join(config.generatedPath, "actions"),
      type.import,
      config,
      codeUtils.getModuleSuffix
    );
    const serviceInterfaceToExternalFull = pathUtils.buildRelativeFull(
      path.join(config.generatedPath, "services"),
      type.import,
      config,
      codeUtils.getModuleSuffix
    );
    const serviceToExternalFull = pathUtils.buildRelativeFull(
      path.join(config.api.server.servicePath),
      type.import,
      config,
      codeUtils.getModuleSuffix
    );
    return {
      actionToExternalFull,
      serviceInterfaceToExternalFull,
      serviceToExternalFull,
    };
  } else if (codeUtils.isDefineType(type)) {
    return {};
  } else if (codeUtils.isEnumType(type)) {
    return {};
  }
}

function addPackages(entity, config, isVerbose) {
  if (isVerbose) {
    console.log(
      `[AIRENT-API/INFO] augmenting ${entity.name} - add packages ...`
    );
  }

  entity._packages = entity._packages ?? {};
  entity._packages.api = entity._packages.api ?? {};

  if (config.api.server) {
    entity._packages.api.dispatcherToActionFull = pathUtils.buildRelativePath(
      path.join(config.generatedPath, "dispatchers"),
      path.join(config.generatedPath, "actions", entity._strings.moduleName)
    );

    entity._packages.api.actionToTypeFull = pathUtils.buildRelativePath(
      path.join(config.generatedPath, "actions"),
      path.join(config.generatedPath, "types", entity._strings.moduleName)
    );
    entity._packages.api.actionToEntityFull = pathUtils.buildRelativePath(
      path.join(config.generatedPath, "actions"),
      path.join(config.entityPath, entity._strings.moduleName)
    );
    entity._packages.api.actionToServiceFull = pathUtils.buildRelativePath(
      path.join(config.generatedPath, "actions"),
      path.join(config.api.server.servicePath, entity._strings.moduleName)
    );

    entity._packages.api.serviceInterfaceToTypeFull =
      pathUtils.buildRelativePath(
      path.join(config.generatedPath, "services"),
      path.join(config.generatedPath, "types", entity._strings.moduleName)
    );
    entity._packages.api.serviceInterfaceToEntityFull =
      pathUtils.buildRelativePath(
        path.join(config.generatedPath, "services"),
        path.join(config.entityPath, entity._strings.moduleName)
      );

    entity._packages.api.serviceToTypeFull = pathUtils.buildRelativePath(
      config.api.server.servicePath,
      path.join(config.generatedPath, "types", entity._strings.moduleName)
    );
    entity._packages.api.serviceToEntityFull = pathUtils.buildRelativePath(
      config.api.server.servicePath,
      path.join(config.entityPath, entity._strings.moduleName)
    );
    entity._packages.api.serviceToServiceInterfaceFull =
      pathUtils.buildRelativePath(
        config.api.server.servicePath,
        path.join(config.generatedPath, "services", entity._strings.moduleName)
      );

    entity.types.forEach(
      (t) => (t._packages.api = buildTypePackages(t, config))
    );

    entity._packages.api.dispatcherToRequestFull = pathUtils.buildRelativePath(
      path.join(config.generatedPath, "dispatchers"),
      path.join(config.api.typesPath, entity._strings.moduleName)
    );
    entity._packages.api.actionToRequestFull = pathUtils.buildRelativePath(
      path.join(config.generatedPath, "actions"),
      path.join(config.api.typesPath, entity._strings.moduleName)
    );
    entity._packages.api.serviceInterfaceToRequestFull =
      pathUtils.buildRelativePath(
        path.join(config.generatedPath, "services"),
        path.join(config.api.typesPath, entity._strings.moduleName)
      );
    entity._packages.api.serviceToRequestFull = pathUtils.buildRelativePath(
      config.api.server.servicePath,
      path.join(config.api.typesPath, entity._strings.moduleName)
    );
  }

  if (config.api.client) {
    entity._packages.api.clientToTypeFull = pathUtils.buildRelativePath(
      path.join(config.generatedPath, "clients"),
      path.join(config.generatedPath, "types", entity._strings.moduleName)
    );
    entity._packages.api.clientToRequestFull = pathUtils.buildRelativePath(
      path.join(config.generatedPath, "clients"),
      path.join(config.api.typesPath, entity._strings.moduleName)
    );
  }
}

// augment entity - add api code

function buildBeforeType(entity) /* Code[] */ {
  if (!codeUtils.isPresentableEntity(entity)) {
    return [];
  }
  return [];
}

function buildAfterType(entity) /* Code[] */ {
  if (!codeUtils.isPresentableEntity(entity)) {
    return [];
  }
  return [
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type ${entity._strings.api.manyCursor} = {`,
    "  count: number;",
    ...entity.fields
      .filter((f) => f._strings.api.minVar || f._strings.api.maxVar)
      .flatMap((field) => [
        ...(field._strings.api.minVar
          ? [
              ...(field.deprecated ? ["  /** @deprecated */"] : []),
              `  ${field._strings.api.minVar}: ${field._strings.fieldResponseType} | null;`,
            ]
          : []),
        ...(field._strings.api.maxVar
          ? [
              ...(field.deprecated ? ["  /** @deprecated */"] : []),
              `  ${field._strings.api.maxVar}: ${field._strings.fieldResponseType} | null;`,
            ]
          : []),
      ]),
    "};",
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type ${entity._strings.api.manyResponse}<S extends ${entity._strings.fieldRequestClass}> = {`,
    `  cursor: ${entity._strings.api.manyCursor};`,
    ...(entity.deprecated ? ["  /** @deprecated */"] : []),
    `  ${entity._strings.api.manyEntsVar}: ${entity._strings.selectedResponseClass}<S>[];`,
    "};",
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type ${entity._strings.api.oneResponse}<S extends ${entity._strings.fieldRequestClass}, N extends boolean = false> = {`,
    ...(entity.deprecated ? ["  /** @deprecated */"] : []),
    `  ${entity._strings.api.oneEntVar}: N extends true ? (${entity._strings.selectedResponseClass}<S> | null) : ${entity._strings.selectedResponseClass}<S>;`,
    "};",
  ];
}

function buildBeforePresent(entity, policies, utils) /* Code[] */ {
  return [
    "",
    `protected async beforePresent<S extends ${entity._strings.fieldRequestClass}>(fieldRequest: S): Promise<void> {`,
    ...Object.entries(policies).map(([policy, fields]) =>
      fields?.length
        ? `  await this.check${utils.toPascalCase(policy)}Fields(fieldRequest);`
        : `  await this.check${utils.toPascalCase(policy)}();`
    ),
    "}",
  ];
}

function buildPolicyChecker(entity, policy, fields, utils) /* Code[] */ {
  if (fields?.length) {
    return [
      "",
      `protected ${utils.toCamelCase(policy)}Fields = [`,
      ...fields.map((field) => `  '${field}',`),
      "];",
      "",
      `protected async check${utils.toPascalCase(policy)}Fields(fieldRequest: ${
        entity._strings.fieldRequestClass
      }): Promise<void> {`,
      `  const fields = Object.keys(fieldRequest).filter((key) => this.${utils.toCamelCase(
        policy
      )}Fields.includes(key));`,
      "  if (fields.length === 0) {",
      "    return;",
      "  }",
      `  const isAuthorized = await this.authorize${utils.toPascalCase(
        policy
      )}();`,
      `  if (!isAuthorized) {`,
      `    const errorMessage = \`Unauthorized access to [\${fields.map((field) => \`'\${field}'\`).join(', ')}] on ${entity.name}\`;`,
      "    throw createHttpError.Forbidden(errorMessage);",
      "  }",
      "}",
    ];
  } else {
    return [
      "",
      `protected async check${utils.toPascalCase(policy)}(): Promise<void> {`,
      `  const isAuthorized = await this.authorize${utils.toPascalCase(
        policy
      )}();`,
      `  if (!isAuthorized) {`,
      `    const errorMessage = \`Unauthorized access to ${entity.name}\`;`,
      "    throw createHttpError.Forbidden(errorMessage);",
      "  }",
      "}",
    ];
  }
}

function buildPolicyAuthorizer(policy, utils) /* Code[] */ {
  return [
    "",
    `protected authorize${utils.toPascalCase(policy)}(): Awaitable<boolean> {`,
    "  throw new Error('not implemented');",
    "}",
  ];
}

function buildInsideBase(entity, policies, utils) /* Code[] */ {
  const policyCheckerAndAuthorizerBundles = Object.entries(policies).flatMap(
    ([policy, fields]) => [
      ...buildPolicyChecker(entity, policy, fields, utils),
      ...buildPolicyAuthorizer(policy, utils),
    ]
  );
  const beforePresent = buildBeforePresent(entity, policies, utils);
  return [...policyCheckerAndAuthorizerBundles, ...beforePresent];
}

function buildInsideEntity(policies, utils) /* Code[] */ {
  return Object.keys(policies).flatMap((policy) =>
    buildPolicyAuthorizer(policy, utils)
  );
}

function addCode(entity, config, isVerbose) {
  if (isVerbose) {
    console.log(`[AIRENT-API/INFO] augmenting ${entity.name} - add code ...`);
  }

  const beforeType = buildBeforeType(entity);
  entity._code.beforeType.push(...beforeType);

  const afterType = buildAfterType(entity);
  entity._code.afterType.push(...afterType);

  const policies = entity.policies ?? new Map();
  const policyKeys = Object.keys(policies);
  if (policyKeys.length > 0) {
    entity._code.beforeBase.push("import createHttpError from 'http-errors';");
    const insideBase = buildInsideBase(entity, policies, codeUtils);
    entity._code.insideBase.push(...insideBase);
    const insideEntity = buildInsideEntity(policies, codeUtils);
    entity._code.insideEntity.push(...insideEntity);
  }

  const apiCallerLines = [
    "const init = buildJsonRequestInit(data, options);",
    "const response = await fetchJsonOrThrow(input, init);",
  ];
  const pluralKababEntityName = codeUtils.toKababCase(codeUtils.pluralize(entity.name));
  const singularKababEntityName = codeUtils.toKababCase(entity.name);

  entity._code.api = entity._code.api ?? {};
  if (config.api.client) {
    entity._code.api.beforeClient = entity._code.api.beforeClient ?? [
      "// airent imports",
      `import { buildJsonRequestInit, fetchJsonOrThrow } from '${config._packages.api.clientToLibFull}';`,
      "",
      "// config imports",
      `import { baseUrl } from '${config._packages.api.clientToBaseUrlFull}';`,
    ];
    entity._code.api.searchCaller = entity._code.api.searchCaller ?? [
      `const input = \`\${baseUrl}/search-${pluralKababEntityName}\`;`,
      "const data = { query, fieldRequest };",
      ...apiCallerLines,
      "return presentManyResponse(response, fieldRequest);",
    ];
    entity._code.api.getManyCaller = entity._code.api.getManyCaller ?? [
      `const input = \`\${baseUrl}/get-many-${pluralKababEntityName}\`;`,
      "const data = { query, fieldRequest };",
      ...apiCallerLines,
      "return presentManyResponse(response, fieldRequest);",
    ];
    entity._code.api.getOneCaller = entity._code.api.getOneCaller ?? [
      `const input = \`\${baseUrl}/get-one-${singularKababEntityName}\`;`,
      "const data = { params, fieldRequest };",
      ...apiCallerLines,
      "return presentOneResponse(response, fieldRequest);",
    ];
    entity._code.api.getOneSafeCaller = entity._code.api.getOneSafeCaller ?? [
      `const input = \`\${baseUrl}/get-one-${singularKababEntityName}-safe\`;`,
      "const data = { params, fieldRequest };",
      ...apiCallerLines,
      "return presentOneSafeResponse(response, fieldRequest);",
    ];
    entity._code.api.createOneCaller = entity._code.api.createOneCaller ?? [
      `const input = \`\${baseUrl}/create-one-${singularKababEntityName}\`;`,
      "const data = { body, fieldRequest };",
      ...apiCallerLines,
      "return presentOneResponse(response, fieldRequest);",
    ];
    entity._code.api.updateOneCaller = entity._code.api.updateOneCaller ?? [
      `const input = \`\${baseUrl}/update-one-${singularKababEntityName}\`;`,
      "const data = { params, body, fieldRequest };",
      ...apiCallerLines,
      "return presentOneResponse(response, fieldRequest);",
    ];
    entity._code.api.deleteOneCaller = entity._code.api.deleteOneCaller ?? [
      `const input = \`\${baseUrl}/delete-one-${singularKababEntityName}\`;`,
      "const data = { params, fieldRequest };",
      ...apiCallerLines,
      "return presentOneResponse(response, fieldRequest);",
    ];
  }
}

function augment(data, isVerbose) {
  const { entityMap, config } = data;
  augmentConfig(config);
  const entityNames = Object.keys(entityMap).sort();
  const entities = entityNames.map((n) => entityMap[n]);
  entities.forEach((entity) => (entity.api = entity.api ?? {}));
  entities.forEach((entity) => addStrings(entity, config, isVerbose));
  entities.forEach((entity) => addBooleans(entity));
  entities.forEach((entity) => addPackages(entity, config, isVerbose));
  entities.forEach((entity) => addCode(entity, config, isVerbose));
}

module.exports = { augment };
