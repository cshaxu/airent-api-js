#!/usr/bin/env node

const cp = require("child_process");
const fs = require("fs");
const path = require("path");

// configurations //
const PACKAGES = [{ name: "airent", scripts: ["airent"] }];
const COMMANDS = ["npm install"];
const GENERATED_FILES = [];

const PROJECT_PATH = process.cwd();
const LOCK_FILE_PATH = path.join(PROJECT_PATH, "package-lock.json");
const NODE_MODULES_KEYS = PACKAGES.map((pkg) => `node_modules/${pkg.name}`);

function execute(command, callback) {
  cp.execSync(command);
  if (typeof callback === "function") {
    callback();
  }
  console.log(` ✓ \`${command}\` done`);
}

function install(pkg) {
  const command = `npm install ${pkg.name}`;
  execute(command, () => {
    pkg.scripts
      .map((s) => `node_modules/.bin/${s}`)
      .forEach((bin) => {
        if (fs.existsSync(bin)) {
          cp.execSync(`chmod +x ${bin}`);
        }
      });
  });
}

async function loadLockFile() {
  const castontent = await fs.promises.readFile(LOCK_FILE_PATH, "utf8");
  return JSON.parse(castontent);
}

async function main() {
  if (!fs.existsSync(LOCK_FILE_PATH)) {
    console.log("⚠️ `package-lock.json` not found");
  } else {
    const packageLockJson = await loadLockFile();
    NODE_MODULES_KEYS.filter((key) => packageLockJson.packages[key]).forEach(
      (key) => delete packageLockJson.packages[key]
    );
    const content = JSON.stringify(packageLockJson, null, 2) + "\n";
    await fs.promises.writeFile(LOCK_FILE_PATH, content);
    console.log(" ✓ `package-lock.json` reset");
  }

  [...NODE_MODULES_KEYS, ...GENERATED_FILES]
    .filter(fs.existsSync)
    .forEach((key) => {
      fs.rmSync(key, { recursive: true });
      console.log(` ✓ \`${key}\` deleted`);
    });

  PACKAGES.forEach(install);
  COMMANDS.forEach(execute);
}

main().catch(console.error);
