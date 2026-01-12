// Helper functions to transform database snake_case to API camelCase

export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const transformKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = toCamelCase(key);
      result[camelKey] = transformKeys(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};
