#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const configUtils = require("airent/resources/utils/configurator.js");
const {
  addTemplate,
  createPrompt,
  getShouldEnable,
  loadJsonConfig,
  normalizeConfigCollections,
  writeJsonConfig,
} = configUtils;
const prompt = createPrompt();
const { askQuestion } = prompt;

/** @typedef {Object} ApiServerConfig
 *  @property {string} servicePath
 *  @property {string} dispatcherConfigImportPath
 */

/** @typedef {Object} ApiClientConfig
 *  @property {string} baseUrlImportPath
 */

/** @typedef {Object} ApiConfig
 *  @property {?string} libImportPath
 *  @property {string} typesPath
 *  @property {ApiServerConfig} server
 *  @property {ApiClientConfig} client
 */

/** @typedef {Object} Config
 *  @property {"commonjs" | "module"} type
 *  @property {?string} libImportPath
 *  @property {string} schemaPath
 *  @property {string} entityPath
 *  @property {string} contextImportPath
 *  @property {?string[]} [augmentors]
 *  @property {?Template[]} [templates]
 *  @property {?ApiConfig} api
 */

const PROJECT_PATH = process.cwd();
const CONFIG_FILE_PATH = path.join(PROJECT_PATH, "airent.config.json");

const AIRENT_API_RESOURCES_PATH = "node_modules/@airent/api/resources";
const API_AUGMENTOR_PATH = `${AIRENT_API_RESOURCES_PATH}/augmentor.js`;

const API_TYPE_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/type-template.ts.ejs`,
  outputPath: "{api.typesPath}/{kababEntityName}.ts",
  skippable: true,
};

const API_CLIENT_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/client-template.ts.ejs`,
  outputPath: "{generatedPath}/clients/{kababEntityName}.ts",
  skippable: false,
};
const API_CLIENT_TEMPLATE_CONFIGS = [API_CLIENT_TEMPLATE_CONFIG];

const API_SERVER_DISPATCHER_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/dispatcher-template.ts.ejs`,
  outputPath: "{generatedPath}/dispatchers/{kababEntityName}.ts",
  skippable: false,
};
const API_SERVER_ACTIONS_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/actions-template.ts.ejs`,
  outputPath: "{generatedPath}/actions/{kababEntityName}.ts",
  skippable: false,
};
const API_SERVER_SERVICE_INTERFACE_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/service-interface-template.ts.ejs`,
  outputPath: "{generatedPath}/services/{kababEntityName}.ts",
  skippable: false,
};
const API_SERVER_SERVICE_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/service-template.ts.ejs`,
  outputPath: "{api.server.servicePath}/{kababEntityName}.ts",
  skippable: true,
};
const API_SERVER_SEARCH_SERVICE_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/search-service-template.ts.ejs`,
  outputPath: "{api.server.servicePath}/{kababEntityName}-search.ts",
  skippable: true,
};
const API_SERVER_TEMPLATE_CONFIGS = [
  API_SERVER_DISPATCHER_TEMPLATE_CONFIG,
  API_SERVER_ACTIONS_TEMPLATE_CONFIG,
  API_SERVER_SERVICE_INTERFACE_TEMPLATE_CONFIG,
  API_SERVER_SERVICE_TEMPLATE_CONFIG,
  API_SERVER_SEARCH_SERVICE_TEMPLATE_CONFIG,
];

async function loadConfig() {
  return normalizeConfigCollections(await loadJsonConfig(CONFIG_FILE_PATH));
}

async function configureApiTypes(config) {
  const { templates } = config;
  const isApiTypesEnabled = templates.some(
    (t) => t.name === API_TYPE_TEMPLATE_CONFIG.name
  );
  if (!isApiTypesEnabled) {
    addTemplate(config, API_TYPE_TEMPLATE_CONFIG);
  }

  config.api.typesPath = await askQuestion(
    "Output path for Api Type",
    config.api.typesPath ?? "./src/api-types"
  );
}

async function configureApiClient(config) {
  const { templates } = config;
  const isApiClientEnabled = templates.some((t) =>
    API_CLIENT_TEMPLATE_CONFIGS.some((c) => c.name === t.name)
  );
  const shouldEnableApiClient = isApiClientEnabled
    ? true
    : await getShouldEnable(askQuestion, "Api Client");
  if (!shouldEnableApiClient) {
    return;
  }
  API_CLIENT_TEMPLATE_CONFIGS.forEach((t) => addTemplate(config, t));

  config.api.client = config.api.client ?? {};

  config.api.client.baseUrlImportPath = await askQuestion(
    'Import path for "baseUrl"',
    config.api.client.baseUrlImportPath ?? "./config"
  );
}

async function configureApiServer(config) {
  const { templates } = config;
  const isApiServerEnabled = templates.some((t) =>
    API_SERVER_TEMPLATE_CONFIGS.some((c) => c.name === t.name)
  );
  const shouldEnableApiServer = isApiServerEnabled
    ? true
    : await getShouldEnable(askQuestion, "Api Server");
  if (!shouldEnableApiServer) {
    return;
  }
  API_SERVER_TEMPLATE_CONFIGS.forEach((t) => addTemplate(config, t));

  config.api.server = config.api.server ?? {};

  config.api.server.servicePath = await askQuestion(
    "Output path for Api Service",
    config.api.server.servicePath ?? "./src/services"
  );

  config.api.server.dispatcherConfigImportPath = await askQuestion(
    'Import path for "dispatcherConfig"',
    config.api.server.dispatcherConfigImportPath ?? "./src/framework"
  );
}

async function configure() {
  const config = await loadConfig();
  const { augmentors } = config;
  const isApiEnabled = augmentors.includes(API_AUGMENTOR_PATH);
  const shouldEnableApi = isApiEnabled
    ? true
    : await getShouldEnable(askQuestion, "Api");
  if (!shouldEnableApi) {
    return;
  }
  if (!isApiEnabled) {
    augmentors.push(API_AUGMENTOR_PATH);
  }

  config.api = config.api ?? {};
  await configureApiTypes(config);
  await configureApiServer(config);
  await configureApiClient(config);

  await writeJsonConfig(CONFIG_FILE_PATH, config);
  console.log(`[AIRENT-API/INFO] Package configured.`);
}

async function main() {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      throw new Error('[AIRENT-API/ERROR] "airent.config.json" not found');
    }

    await configure();
  } finally {
    prompt.close();
  }
}

main().catch(console.error);
