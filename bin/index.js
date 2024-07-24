#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask a question and store the answer in the config object
async function askQuestion(question, defaultAnswer) {
  const a = await new Promise((resolve) =>
    rl.question(`${question} (${defaultAnswer}): `, resolve)
  );
  return a?.length ? a : defaultAnswer;
}

async function getShouldEnable(name) {
  const shouldEnable = await askQuestion(`Enable "${name}"`, "yes");
  return shouldEnable === "yes";
}

/** @typedef {Object} ApiServerConfig
 *  @property {string} servicePath
 *  @property {string} dispatcherConfigImportPath
 */

/** @typedef {Object} ApiClientConfig
 * @property {string} clientPath
 * @property {string} baseUrlImport

/** @typedef {Object} ApiConfig
 *  @property {?string} libImportPath
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

const API_CLIENT_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/client-template.ts.ejs`,
  outputPath: "{api.client.clientPath}/{kababEntityName}.ts",
  skippable: false,
};
const API_CLIENT_TEMPLATE_CONFIGS = [API_CLIENT_TEMPLATE_CONFIG];

const API_SERVER_DISPATCHER_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/dispatcher-template.ts.ejs`,
  outputPath: "{entityPath}/generated/{kababEntityName}-dispatcher.ts",
  skippable: false,
};
const API_SERVER_ACTIONS_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/actions-template.ts.ejs`,
  outputPath: "{entityPath}/generated/{kababEntityName}-actions.ts",
  skippable: false,
};
const API_SERVER_SERVICE_INTERFACE_TEMPLATE_CONFIG = {
  name: `${AIRENT_API_RESOURCES_PATH}/service-interface-template.ts.ejs`,
  outputPath: "{entityPath}/generated/{kababEntityName}-service-interface.ts",
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
  const configContent = await fs.promises.readFile(CONFIG_FILE_PATH, "utf8");
  const config = JSON.parse(configContent);
  const augmentors = config.augmentors ?? [];
  const templates = config.templates ?? [];
  return { ...config, augmentors, templates };
}

function addTemplate(config, draftTemplate) {
  const { templates } = config;
  const template = templates.find((t) => t.name === draftTemplate.name);
  if (template === undefined) {
    templates.push(draftTemplate);
  }
}

async function configureApiServer(config) {
  const { templates } = config;
  const isApiServerEnabled = templates.some((t) =>
    API_SERVER_TEMPLATE_CONFIGS.some((c) => c.name === t.name)
  );
  const shouldEnableApiServer = isApiServerEnabled
    ? true
    : await getShouldEnable("Api Server");
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

async function configureApiClient(config) {
  const { templates } = config;
  const isApiClientEnabled = templates.some((t) =>
    API_CLIENT_TEMPLATE_CONFIGS.some((c) => c.name === t.name)
  );
  const shouldEnableApiClient = isApiClientEnabled
    ? true
    : await getShouldEnable("Api Client");
  if (!shouldEnableApiClient) {
    return;
  }
  API_CLIENT_TEMPLATE_CONFIGS.forEach((t) => addTemplate(config, t));

  config.api.client = config.api.client ?? {};

  config.api.client.clientPath = await askQuestion(
    "Output path for Api Client",
    config.api.client.clientPath ?? "./src/clients"
  );

  config.api.client.baseUrlImport = await askQuestion(
    "Statement to import 'baseUrl'",
    config.api.client.baseUrlImport ?? "import { baseUrl } from '@/fetch';"
  );
}

async function configure() {
  const config = await loadConfig();
  const { augmentors } = config;
  const isApiEnabled = augmentors.includes(API_AUGMENTOR_PATH);
  const shouldEnableApi = isApiEnabled ? true : await getShouldEnable("Api");
  if (!shouldEnableApi) {
    return;
  }
  if (!isApiEnabled) {
    augmentors.push(API_AUGMENTOR_PATH);
  }

  config.api = config.api ?? {};
  await configureApiServer(config);
  await configureApiClient(config);

  const content = JSON.stringify(config, null, 2) + "\n";
  await fs.promises.writeFile(CONFIG_FILE_PATH, content);
  console.log(`[AIRENT-API/INFO] Package configured.`);
}

async function main() {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      throw new Error('[AIRENT-API/ERROR] "airent.config.json" not found');
    }

    await configure();
  } finally {
    rl.close();
  }
}

main().catch(console.error);
