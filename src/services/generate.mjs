import path from "path";
import { generateApi } from "swagger-typescript-api";

await generateApi({
    name: "api.ts",
    output: path.resolve(process.cwd(), "./src/services"),
    input: path.resolve(process.cwd(), "./src/services/openapi.json"),
    httpClientType: "axios",
    unwrapResponseData: true,
    hooks: {
        onFormatRouteName: (routeInfo) => {
            const str = routeInfo.summary.replaceAll(" ", "")
            return str[0].toLowerCase() + str.substring(1);
        },
    }
})