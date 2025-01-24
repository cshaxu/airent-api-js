const path = require("path");
const utils = require("airent/resources/utils.js");

function buildRelativePath(sourcePath, targetPath) /* string */ {
  const rawRelativePath = path
    .relative(sourcePath, targetPath)
    .replaceAll("\\", "/");
  return rawRelativePath.startsWith(".")
    ? rawRelativePath
    : `./${rawRelativePath}`;
}

function buildRelativeFull(sourcePath, targetPath, config) /* string */ {
  if (!targetPath.startsWith(".")) {
    return targetPath;
  }
  const suffix = utils.getModuleSuffix(config);
  const relativePath = buildRelativePath(sourcePath, targetPath);
  return `${relativePath}${suffix}`;
}

// build config

function augmentConfig(config) /* void */ {
  config._packages.api = config._packages.api ?? {};
  config._packages.api.baseToLibFull = config.api.libImportPath
    ? buildRelativeFull(
        path.join(config.generatedPath, "entities"),
        config.api.libImportPath,
        config
      )
    : "@airent/api";
  config._packages.api.entityToLibFull = config.api.libImportPath
    ? buildRelativeFull(config.entityPath, config.api.libImportPath, config)
    : "@airent/api";

  if (config.api.server) {
    config._packages.api.dispatcherToLibFull = config.api.libImportPath
      ? buildRelativeFull(
          path.join(config.generatedPath, "dispatchers"),
          config.api.libImportPath,
          config
        )
      : "@airent/api";
    config._packages.api.actionToLibFull = config.api.libImportPath
      ? buildRelativeFull(
          path.join(config.generatedPath, "actions"),
          config.api.libImportPath,
          config
        )
      : "@airent/api";
    config._packages.api.serviceInterfaceToLibFull = config.api.libImportPath
      ? buildRelativeFull(
          path.join(config.generatedPath, "services"),
          config.api.libImportPath,
          config
        )
      : "@airent/api";
    config._packages.api.serviceToLibFull = config.api.libImportPath
      ? buildRelativeFull(
          config.api.server.servicePath,
          config.api.libImportPath,
          config
        )
      : "@airent/api";

    config._packages.api.actionToContextFull = buildRelativeFull(
      path.join(config.generatedPath, "actions"),
      config.contextImportPath,
      config
    );
    config._packages.api.serviceInterfaceToContextFull = buildRelativeFull(
      path.join(config.generatedPath, "services"),
      config.contextImportPath,
      config
    );
    config._packages.api.serviceToContextFull = buildRelativeFull(
      config.api.server.servicePath,
      config.contextImportPath,
      config
    );
    config._packages.api.dispatcherToDispatcherConfigFull = buildRelativeFull(
      path.join(config.generatedPath, "dispatchers"),
      config.api.server.dispatcherConfigImportPath,
      config
    );
  }

  if (config.api.client) {
    config._packages.api.clientToLibFull = config.api.libImportPath
      ? buildRelativeFull(
          path.join(config.generatedPath, "clients"),
          config.api.libImportPath,
          config
        )
      : "@airent/api";
    config._packages.api.clientToBaseUrlFull = buildRelativeFull(
      path.join(config.generatedPath, "clients"),
      config.api.client.baseUrlImportPath,
      config
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
  const pluralEntName = utils.toTitleCase(utils.pluralize(entity.name));
  const singularEntName = utils.toTitleCase(entity.name);
  if (isVerbose) {
    console.log(
      `[AIRENT-API/INFO] augmenting ${entity.name} - add strings ...`
    );
  }
  entity._strings.api = {
    manyEntsVar: utils.toCamelCase(utils.pluralize(entity.name)),
    oneEntVar: utils.toCamelCase(entity.name),
    dispatcherClass: `${singularEntName}Dispatcher`,
    actionsClass: `${singularEntName}Actions`,
    serviceClass: `${singularEntName}Service`,
    searchServiceClass: `${utils.toTitleCase(entity.name)}SearchService`,
    searchServiceModuleName: `${utils.toKababCase(
      entity.name
    )}-search${utils.getModuleSuffix(config)}`,
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
    .map((c) => ({ ...utils.queryField(c.name, entity), value: c.value }))
    .filter(utils.isPrimitiveField)
    .filter(utils.isPresentableField)
    .forEach((field) => {
      if (field.value === "asc") {
        field._strings.api.maxVar = `max${utils.toTitleCase(field.name)}`;
      }
      if (field.value === "desc") {
        field._strings.api.minVar = `min${utils.toTitleCase(field.name)}`;
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
  } else if (utils.isImportType(type)) {
    const actionToExternalFull = buildRelativeFull(
      path.join(config.generatedPath, "actions"),
      type.import,
      config
    );
    const serviceInterfaceToExternalFull = buildRelativeFull(
      path.join(config.generatedPath, "services"),
      type.import,
      config
    );
    const serviceToExternalFull = buildRelativeFull(
      path.join(config.api.server.servicePath),
      type.import,
      config
    );
    return {
      actionToExternalFull,
      serviceInterfaceToExternalFull,
      serviceToExternalFull,
    };
  } else if (utils.isDefineType(type)) {
    return {};
  } else if (utils.isEnumType(type)) {
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

  const requestImport = entity.api.request?.import;

  if (config.api.server) {
    entity._packages.api.dispatcherToActionFull = buildRelativePath(
      path.join(config.generatedPath, "dispatchers"),
      path.join(config.generatedPath, "actions", entity._strings.moduleName)
    );

    entity._packages.api.actionToTypeFull = buildRelativePath(
      path.join(config.generatedPath, "actions"),
      path.join(config.generatedPath, "types", entity._strings.moduleName)
    );
    entity._packages.api.actionToEntityFull = buildRelativePath(
      path.join(config.generatedPath, "actions"),
      path.join(config.entityPath, entity._strings.moduleName)
    );
    entity._packages.api.actionToServiceFull = buildRelativePath(
      path.join(config.generatedPath, "actions"),
      path.join(config.api.server.servicePath, entity._strings.moduleName)
    );

    entity._packages.api.serviceInterfaceToTypeFull = buildRelativePath(
      path.join(config.generatedPath, "services"),
      path.join(config.generatedPath, "types", entity._strings.moduleName),
      config
    );
    entity._packages.api.serviceInterfaceToEntityFull = buildRelativePath(
      path.join(config.generatedPath, "services"),
      path.join(config.entityPath, entity._strings.moduleName),
      config
    );

    entity._packages.api.serviceToTypeFull = buildRelativePath(
      config.api.server.servicePath,
      path.join(config.generatedPath, "types", entity._strings.moduleName),
      config
    );
    entity._packages.api.serviceToEntityFull = buildRelativePath(
      config.api.server.servicePath,
      path.join(config.entityPath, entity._strings.moduleName),
      config
    );
    entity._packages.api.serviceToServiceInterfaceFull = buildRelativePath(
      config.api.server.servicePath,
      path.join(config.generatedPath, "services", entity._strings.moduleName)
    );

    entity.types.forEach(
      (t) => (t._packages.api = buildTypePackages(t, config))
    );

    if (requestImport) {
      entity._packages.api.dispatcherToRequestFull = buildRelativeFull(
        path.join(config.generatedPath, "dispatchers"),
        requestImport,
        config
      );
      entity._packages.api.actionToRequestFull = buildRelativeFull(
        path.join(config.generatedPath, "actions"),
        requestImport,
        config
      );
      entity._packages.api.serviceInterfaceToRequestFull = buildRelativeFull(
        path.join(config.generatedPath, "services"),
        requestImport,
        config
      );
      entity._packages.api.serviceToRequestFull = buildRelativeFull(
        config.api.server.servicePath,
        requestImport,
        config
      );
    }
  }

  if (config.api.client) {
    entity._packages.api.clientToTypeFull = buildRelativePath(
      path.join(config.generatedPath, "clients"),
      path.join(config.generatedPath, "types", entity._strings.moduleName)
    );

    if (requestImport) {
      entity._packages.api.clientToRequestFull = buildRelativeFull(
        path.join(config.generatedPath, "clients"),
        requestImport,
        config
      );
    }
  }
}

// augment entity - add api code

function buildBeforeType(entity) /* Code[] */ {
  if (!utils.isPresentableEntity(entity)) {
    return [];
  }
  return [];
}

function buildAfterType(entity) /* Code[] */ {
  if (!utils.isPresentableEntity(entity)) {
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
        ? `  await this.check${utils.toTitleCase(policy)}Fields(fieldRequest);`
        : `  await this.check${utils.toTitleCase(policy)}();`
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
      `protected async check${utils.toTitleCase(policy)}Fields(fieldRequest: ${
        entity._strings.fieldRequestClass
      }): Promise<void> {`,
      `  const fields = Object.keys(fieldRequest).filter((key) => this.${utils.toCamelCase(
        policy
      )}Fields.includes(key));`,
      "  if (fields.length === 0) {",
      "    return;",
      "  }",
      `  const isAuthorized = await this.authorize${utils.toTitleCase(
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
      `protected async check${utils.toTitleCase(policy)}(): Promise<void> {`,
      `  const isAuthorized = await this.authorize${utils.toTitleCase(
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
    `protected authorize${utils.toTitleCase(policy)}(): Awaitable<boolean> {`,
    "  throw new Error('not implemented');",
    "}",
  ];
}

function buildBeforeBase(entity, config) /* Code[] */ {
  if (!utils.isPresentableEntity(entity)) {
    return [];
  }
  return [`import { Awaitable } from '${config._packages.api.baseToLibFull}';`];
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

function buildBeforeEntity(entity, config) /* Code[] */ {
  if (!utils.isPresentableEntity(entity)) {
    return [];
  }
  return [
    `import { Awaitable } from '${config._packages.api.entityToLibFull}';`,
  ];
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

  const beforeBase = buildBeforeBase(entity, config);
  entity._code.beforeBase.push(...beforeBase);

  const beforeEntity = buildBeforeEntity(entity, config);
  entity._code.beforeEntity.push(...beforeEntity);

  const policies = entity.policies ?? new Map();
  const policyKeys = Object.keys(policies);
  if (policyKeys.length > 0) {
    entity._code.beforeBase.push("import createHttpError from 'http-errors';");
    const insideBase = buildInsideBase(entity, policies, utils);
    entity._code.insideBase.push(...insideBase);
    const insideEntity = buildInsideEntity(policies, utils);
    entity._code.insideEntity.push(...insideEntity);
  }

  const apiCallerLines = [
    "const init = {",
    "  credentials: 'include' as RequestCredentials,",
    "  method: 'POST',",
    "  body: JSON.stringify(data),",
    "  ...options,",
    "};",
    "const response = await fetchJsonOrThrow(input, init);",
  ];
  const pluralKababEntityName = utils.toKababCase(utils.pluralize(entity.name));
  const singularKababEntityName = utils.toKababCase(entity.name);

  entity._code.api = entity._code.api ?? {};
  if (config.api.client) {
    entity._code.api.beforeClient = entity._code.api.beforeClient ?? [
      "// airent imports",
      `import { fetchJsonOrThrow } from '${config._packages.api.clientToLibFull}';`,
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
