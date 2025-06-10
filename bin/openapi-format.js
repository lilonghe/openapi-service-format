#!/usr/bin/env node

import path from "path";
import { generateApi } from "swagger-typescript-api";
import fs from "fs";

async function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'openapi.config.js');
  if (!fs.existsSync(configPath)) {
    console.error('Error: openapi.config.js configuration file not found in current directory');
    process.exit(1);
  }
  return (await import(configPath)).default;
}

async function generateApiService() {
  try {
    const config = await loadConfig();
    if (config.list) {
      for (const item of config.list) {
        console.log(item)
        await generate(item);
      }
    } else {
      await generate(config);
    }
  
    console.log('API generation completed successfully!');
  } catch (error) {
    console.error('Error generating API:', error);
    process.exit(1);
  }
}

async function generate(config) {
  try {
    const file = config.outputPath.split('/').pop();
    const outputPath = config.outputPath.replace(file, '');

    await generateApi({
      ...config,
      fileName: file,
      output: path.resolve(process.cwd(), outputPath),
      input: path.resolve(process.cwd(), config.apiConfigPath),
      httpClientType: config.client || "axios",
      unwrapResponseData: true,
    });
  } catch (error) {
    console.error('Error generating API:', error);
    process.exit(1);
  }
}

generateApiService();