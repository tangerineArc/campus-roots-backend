"use strict";

import { generateKeyPairSync } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

main();

function main() {
  const keyPair = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  const __dirname = dirname(fileURLToPath(import.meta.url));

  try {
    mkdirSync(join(__dirname, "keys"));
  } catch (error) {
    console.log("::: Folder 'keys' already exists");
  }

  try {
    writeFileSync(join(__dirname, "keys", "public-key.pem"), keyPair.publicKey);
    writeFileSync(
      join(__dirname, "keys", "private-key.pem"),
      keyPair.privateKey
    );

    console.log("::: Successfully created keys");
  } catch (error) {
    console.log("::: Couldn't create keys");
  }
}
