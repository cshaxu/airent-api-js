const path = require("path");
const utils = require("airent/resources/utils.js");

function enforceRelativePath(relativePath) /* string */ {
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

function joinRelativePath(...elements) /* string */ {
  return enforceRelativePath(path.join(...elements).replaceAll("\\", "/"));
}

function buildRelativePackage(sourcePath, targetPath, config) /* string */ {
  if (!targetPath.startsWith(".")) {
    return targetPath;
  }
  const suffix = utils.getModuleSuffix(config);
  const relativePath = enforceRelativePath(
    path.relative(sourcePath, targetPath).replaceAll("\\", "/")
  );
  return `${relativePath}${suffix}`;
}

// build config

function augmentConfig(config) /* void */ {
  config.api.baseLibPackage = config.api.libImportPath
    ? buildRelativePackage(
        path.join(config.entityPath, "generated"),
        config.api.libImportPath,
        config
      )
    : "@airent/api";
  config.api.entityLibPackage = config.api.libImportPath
    ? buildRelativePackage(config.entityPath, config.api.libImportPath, config)
    : "@airent/api";

  if (config.api.server) {
    config.api.server.serviceContextPackage = buildRelativePackage(
      config.api.server.servicePath,
      config.contextImportPath,
      config
    );
    config.api.server.handlerConfigPackage = buildRelativePackage(
      path.join(config.entityPath, "generated"),
      config.api.server.handlerConfigImportPath,
      config
    );
  }

  if (config.api.client) {
    config.api.client.clientLibPackage = config.api.libImportPath
      ? buildRelativePackage(
          config.api.client.clientPath,
          config.api.libImportPath,
          config
        )
      : "@airent/api";
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
    serviceInterfaceClass: `${singularEntName}ServiceInterface`,
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
  const hasGetOneRequest =
    hasGetOne || hasGetOneSafe || hasUpdateOne | hasDeleteOne;
  const hasAny = hasGetMany || hasGetOneRequest || hasCreateOne;
  entity.api.booleans = {
    hasGetMany,
    hasGetOne,
    hasGetOneSafe,
    hasCreateOne,
    hasUpdateOne,
    hasDeleteOne,
    hasGetOneRequest,
    hasAny,
  };
  (entity.api?.cursors ?? [])
    .flatMap((c) => Object.keys(c).map((n) => ({ name: n, value: c[n] })))
    .map((c) => ({ ...utils.queryField(c.name, entity), value: c.value }))
    .filter(utils.isPrimitiveField)
    .filter(utils.isPresentableField)
    .forEach((field) => {
      if (field.value === "asc") {
        field.strings.maxVar = `max${utils.toTitleCase(field.name)}`;
      }
      if (field.value === "desc") {
        field.strings.minVar = `min${utils.toTitleCase(field.name)}`;
      }
    });

  entity.api.packages = {};
  const kababEntName = utils.toKababCase(entity.name);

  const requestImport = entity.api.request?.import;

  if (config.api.server) {
    if (requestImport) {
      entity.api.packages.baseRequest = buildRelativePackage(
        path.join(config.entityPath, "generated"),
        requestImport,
        config
      );
      entity.api.packages.serviceRequest = buildRelativePackage(
        config.api.server.servicePath,
        requestImport,
        config
      );
    }
    entity.api.packages.baseService = buildRelativePackage(
      path.join(config.entityPath, "generated"),
      joinRelativePath(config.api.server.servicePath, kababEntName),
      config
    );
    entity.api.packages.entityService = buildRelativePackage(
      config.entityPath,
      joinRelativePath(config.api.server.servicePath, kababEntName),
      config
    );
    entity.api.packages.serviceEntity = buildRelativePackage(
      config.api.server.servicePath,
      joinRelativePath(config.entityPath, kababEntName),
      config
    );
    entity.api.packages.serviceInterface = buildRelativePackage(
      config.api.server.servicePath,
      joinRelativePath(
        config.entityPath,
        "generated",
        `${kababEntName}-service-interface`
      ),
      config
    );
    entity.api.packages.serviceType = buildRelativePackage(
      config.api.server.servicePath,
      joinRelativePath(config.entityPath, "generated", `${kababEntName}-type`),
      config
    );
    entity.types.filter(utils.isImportType).forEach((type) => {
      type.packages = type.packages ?? {};
      type.packages.serviceExternal = buildRelativePackage(
        config.api.server.servicePath,
        type.import,
        config
      );
    });
  }

  if (config.api.client) {
    if (requestImport) {
      entity.api.packages.clientRequest = buildRelativePackage(
        config.api.client.clientPath,
        requestImport,
        config
      );
    }
    entity.api.packages.clientType = buildRelativePackage(
      config.api.client.clientPath,
      joinRelativePath(config.entityPath, "generated", `${kababEntName}-type`),
      config
    );
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
    `export type ${entity.api.strings.manyCursor} = {`,
    "  count: number;",
    ...entity.fields
      .filter((f) => f.strings.minVar || f.strings.maxVar)
      .flatMap((field) => [
        ...(field.strings.minVar
          ? [
              ...(field.deprecated ? ["  /** @deprecated */"] : []),
              `  ${field.strings.minVar}: ${field.strings.fieldResponseType} | null;`,
            ]
          : []),
        ...(field.strings.maxVar
          ? [
              ...(field.deprecated ? ["  /** @deprecated */"] : []),
              `  ${field.strings.maxVar}: ${field.strings.fieldResponseType} | null;`,
            ]
          : []),
      ]),
    "};",
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type ${entity.api.strings.manyResponse}<S extends ${entity.strings.fieldRequestClass}> = {`,
    `  cursor: ${entity.api.strings.manyCursor};`,
    ...(entity.deprecated ? ["  /** @deprecated */"] : []),
    `  ${entity.api.strings.manyEntsVar}: ${entity.strings.selectedResponseClass}<S>[];`,
    "};",
    "",
    ...(entity.deprecated ? ["/** @deprecated */"] : []),
    `export type ${entity.api.strings.oneResponse}<S extends ${entity.strings.fieldRequestClass}, N extends boolean = false> = {`,
    ...(entity.deprecated ? ["  /** @deprecated */"] : []),
    `  ${entity.api.strings.oneEntVar}: N extends true ? (${entity.strings.selectedResponseClass}<S> | null) : ${entity.strings.selectedResponseClass}<S>;`,
    "};",
  ];
}

function buildBeforePresent(entity, policies, utils) /* Code[] */ {
  return [
    "",
    `protected async beforePresent<S extends ${entity.strings.fieldRequestClass}>(fieldRequest: S): Promise<void> {`,
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
        entity.strings.fieldRequestClass
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
  entity.code.beforeType.push(...beforeType);

  const afterType = buildAfterType(entity);
  entity.code.afterType.push(...afterType);

  const policies = entity.policies ?? new Map();
  const policyKeys = Object.keys(policies);
  if (policyKeys.length > 0) {
    entity.code.beforeBase.push("import createHttpError from 'http-errors';");
    entity.code.beforeBase.push(
      `import { Awaitable } from '${config.api.baseLibPackage}';`
    );
    const insideBase = buildInsideBase(entity, policies, utils);
    entity.code.insideBase.push(...insideBase);
    entity.code.beforeEntity.push(
      `import { Awaitable } from '${config.api.entityLibPackage}';`
    );
    const insideEntity = buildInsideEntity(policies, utils);
    entity.code.insideEntity.push(...insideEntity);
  }
}

function augment(data, isVerbose) {
  const { entityMap, config } = data;
  augmentConfig(config);
  const entityNames = Object.keys(entityMap).sort();
  const entities = entityNames.map((n) => entityMap[n]);
  entities.forEach((entity) => addStrings(entity, config, isVerbose));
  entities.forEach((entity) => addCode(entity, config, isVerbose));
}

module.exports = { augment };
