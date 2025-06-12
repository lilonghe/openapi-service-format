# openapi-to-request

一个用于生成TypeScript API客户端的命令行工具，基于OpenAPI/Swagger规范。

## 安装

```bash
npm install -g openapi-to-request
```

## 使用方法

1. 在项目根目录创建配置文件 `openapi.format.js`：

```javascript
export default {
    apiConfigPath: "./demo/openapi.json",
    outputPath: "./demo/api.ts",

    // 如果存在多个文件需要处理时
    list: [
        {
            apiConfigPath: "./demo/openapi.json",
            outputPath: "./demo/api.ts"
        }
    ]
}
```


2. 运行命令生成API客户端：

```bash
openapi-to-request
```

## 配置选项

### apiConfig

| 选项 | 类型 | 描述 | 默认值 |
|------|------|------|--------|
| apiConfigPath | string | OpenAPI/Swagger文档路径 | - |
| outputPath | string | 生成文件保存路径 | - |
| cleanup | bool | 是否自动清除非标准属性 | false |

## License

MIT