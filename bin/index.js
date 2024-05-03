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

async function getShouldEnable(name, isEnabled) {
  if (isEnabled) {
    return false;
  }
  const shouldEnable = await askQuestion(`Enable "${name}"`, "yes");
  return shouldEnable === "yes";
}

/** @typedef {Object} ApiServerConfig
 *  @property {string} actionServicePath semi-generated
 *  @property {string} serviceInterfacePath semi-generated
 *  @property {string} serviceEntityPath semi-generated
 *  @property {string} handlerConfigImport
 */

/** @typedef {Object} ApiClientConfig
 * @property {string} clientTypePath semi-generated
 * @property {string} baseUrlImport
 * @property {?string} fetchOptionsImport

/** @typedef {Object} ApiConfig
 *  @property {?string} airentApiPackage
 *  @property {ApiServerConfig} server
 *  @property {ApiClientConfig} client
 */

/** @typedef {Object} Config
 *  @property {"commonjs" | "module"} type
 *  @property {?string} airentPackage
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
const API_CLIENT_TEMPLATE_PATH = `${AIRENT_API_RESOURCES_PATH}/client-template.ts.ejs`;
const API_SERVER_HANDLERS_TEMPLATE_PATH = `${AIRENT_API_RESOURCES_PATH}/handlers-template.ts.ejs`;
const API_SERVER_ACTIONS_TEMPLATE_PATH = `${AIRENT_API_RESOURCES_PATH}/actions-template.ts.ejs`;
const API_SERVER_SERVICE_INTERFACE_TEMPLATE_PATH = `${AIRENT_API_RESOURCES_PATH}/service-interface-template.ts.ejs`;
const API_SERVER_SERVICE_TEMPLATE_PATH = `${AIRENT_API_RESOURCES_PATH}/service-template.ts.ejs`;

async function loadConfig() {
  const configContent = await fs.promises.readFile(CONFIG_FILE_PATH, "utf8");
  const config = JSON.parse(configContent);
  const augmentors = config.augmentors ?? [];
  const templates = config.templates ?? [];
  return { ...config, augmentors, templates };
}

async function configureApiServer(config) {
  const { templates } = config;
  const isApiServerHandlersEnabled =
    templates.find((t) => t.name === API_SERVER_HANDLERS_TEMPLATE_PATH) !==
    undefined;
  const isApiServerActionsEnabled =
    templates.find((t) => t.name === API_SERVER_ACTIONS_TEMPLATE_PATH) !==
    undefined;
  const isApiServerServiceEnabled =
    templates.find(
      (t) => t.name === API_SERVER_SERVICE_INTERFACE_TEMPLATE_PATH
    ) !== undefined;
  const isApiServerEnabled =
    isApiServerHandlersEnabled &&
    isApiServerActionsEnabled &&
    isApiServerServiceEnabled;
  const shouldEnableApiServer = await getShouldEnable(
    "Api Server",
    isApiServerEnabled
  );
  if (!shouldEnableApiServer) {
    return;
  }
  config.api.server = config.api.server ?? {};

  if (!isApiServerHandlersEnabled) {
    templates.push({
      name: API_SERVER_HANDLERS_TEMPLATE_PATH,
      outputPath: "{entityPath}/generated/{kababEntityName}-handlers.ts",
      skippable: false,
    });
  }
  if (!isApiServerActionsEnabled) {
    templates.push({
      name: API_SERVER_ACTIONS_TEMPLATE_PATH,
      outputPath: "{entityPath}/generated/{kababEntityName}-actions.ts",
      skippable: false,
    });
  }
  if (!isApiServerServiceEnabled) {
    templates.push({
      name: API_SERVER_SERVICE_INTERFACE_TEMPLATE_PATH,
      outputPath:
        "{entityPath}/generated/{kababEntityName}-service-interface.ts",
      skippable: false,
    });
    const servicePath = await askQuestion("Service path", "./src/services");
    if (config.api.server.actionServicePath === undefined) {
      config.api.server.actionServicePath = path
        .relative(
          path.join(PROJECT_PATH, config.entityPath, "/generated"),
          path.join(PROJECT_PATH, servicePath)
        )
        .replaceAll("\\", "/");
    }
    if (config.api.server.serviceInterfacePath === undefined) {
      config.api.server.serviceInterfacePath = path
        .relative(
          path.join(PROJECT_PATH, servicePath),
          path.join(PROJECT_PATH, config.entityPath, "/generated")
        )
        .replaceAll("\\", "/");
    }
    if (config.api.server.serviceEntityPath === undefined) {
      config.api.server.serviceEntityPath = path
        .relative(
          path.join(PROJECT_PATH, servicePath),
          path.join(PROJECT_PATH, config.entityPath)
        )
        .replaceAll("\\", "/");
    }
    templates.push({
      name: API_SERVER_SERVICE_TEMPLATE_PATH,
      outputPath: `${servicePath}/{kababEntityName}.ts`,
      skippable: true,
    });
  }

  if (config.api.server.handlerConfigImport === undefined) {
    config.api.server.handlerConfigImport = await askQuestion(
      'Statement to import "handlerConfig"',
      "import { handlerConfig } from '@/framework';"
    );
  }
}

async function configureApiClient(config) {
  const { templates } = config;
  const isApiClientEnabled =
    templates.find((t) => t.name === API_CLIENT_TEMPLATE_PATH) !== undefined;
  const shouldEnableApiClient = await getShouldEnable(
    "Api Client",
    isApiClientEnabled
  );
  if (!shouldEnableApiClient) {
    return;
  }

  config.api.client = config.api.client ?? {};

  const outputPath = await askQuestion(
    "Output path for Api Client",
    "src/clients"
  );
  if (config.api.client.clientTypePath === undefined) {
    config.api.client.clientTypePath = path
      .relative(
        path.join(PROJECT_PATH, outputPath),
        path.join(PROJECT_PATH, config.entityPath, "/generated")
      )
      .replaceAll("\\", "/");
  }
  templates.push({
    name: API_CLIENT_TEMPLATE_PATH,
    outputPath: `${outputPath}/{kababEntityName}.ts`,
    skippable: false,
  });

  if (config.api.client.baseUrlImport === undefined) {
    config.api.client.baseUrlImport = await askQuestion(
      "Statement to import 'baseUrl'",
      "import { baseUrl } from '@/fetch';"
    );
  }

  if (config.api.client.fetchOptionsImport === undefined) {
    config.api.client.fetchOptionsImport = await askQuestion(
      "Statement to import 'fetchOptions'",
      "import { fetchOptions } from '@/fetch';"
    );
  }
}

async function configure() {
  const config = await loadConfig();
  const { augmentors } = config;
  const isApiEnabled = augmentors.includes(API_AUGMENTOR_PATH);
  const shouldEnableApi = await getShouldEnable("Api", isApiEnabled);
  if (shouldEnableApi) {
    augmentors.push(API_AUGMENTOR_PATH);
  } else if (!isApiEnabled) {
    return;
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
