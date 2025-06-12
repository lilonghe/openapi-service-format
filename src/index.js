#!/usr/bin/env node

import path from "path";
import { generateApi } from "swagger-typescript-api";
import fs from "fs";
import { cleanOpenAPISchema } from "./utils.js";


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

    // 读取并清理 OpenAPI 文件
    const apiPath = path.resolve(process.cwd(), config.apiConfigPath);
    let apiContent;
    
    try {
      if (apiPath.endsWith('.json')) {
        apiContent = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
      } else if (apiPath.endsWith('.yaml') || apiPath.endsWith('.yml')) {
        const yaml = (await import('js-yaml')).default;
        apiContent = yaml.load(fs.readFileSync(apiPath, 'utf8'));
      } else {
        throw new Error('Unsupported OpenAPI file format. Only JSON and YAML are supported.');
      }
    } catch (error) {
      console.error('Error reading OpenAPI file:', error);
      process.exit(1);
    }

    // 清理 schema
    const cleanedContent = config.cleanup ? cleanOpenAPISchema(apiContent) : apiContent;

    // 创建临时文件存储清理后的内容
    const tempFile = path.join(process.cwd(), '.temp-openapi.json');
    fs.writeFileSync(tempFile, JSON.stringify(cleanedContent, null, 2));

    await generateApi({
      ...config,
      fileName: file,
      output: path.resolve(process.cwd(), outputPath),
      input: tempFile,
      httpClientType: config.client || "axios",
      unwrapResponseData: true,
    });

    if (!config.debug) {
      // 删除临时文件
      fs.unlinkSync(tempFile);
    }
  } catch (error) {
    console.error('Error generating API:', error);
    process.exit(1);
  }
}

generateApiService(); 