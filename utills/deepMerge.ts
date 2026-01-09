/* eslint-disable @typescript-eslint/no-explicit-any */
export function deepMerge<T>(target: T, source?: Partial<T>): T {
  if (!source) return target;

  const result: any = { ...target };

  for (const key in source) {
    const value = source[key];

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      result[key] = deepMerge((target as any)[key], value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
