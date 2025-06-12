export function cleanOpenAPISchema(schema) {
  if (typeof schema !== 'object' || schema === null) return schema;

  // 如果是数组，递归处理每个元素
  if (Array.isArray(schema)) {
    return schema.map(item => cleanOpenAPISchema(item));
  }

  // 创建新对象来存储清理后的结果
  const cleanedSchema = {};

  // 如果存在 $ref，则只保留 $ref
  if (schema.$ref) {
    cleanedSchema.$ref = schema.$ref;
    return cleanedSchema;
  }

  // 递归处理所有属性
  for (const [key, value] of Object.entries(schema)) {
    if (key === 'properties' || key === 'items' || key === 'components' || key === 'definitions') {
      cleanedSchema[key] = cleanOpenAPISchema(value);
    } else if (typeof value === 'object' && value !== null) {
      cleanedSchema[key] = cleanOpenAPISchema(value);
    } else {
      cleanedSchema[key] = value;
    }
  }

  return cleanedSchema;
}