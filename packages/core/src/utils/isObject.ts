export const isObject = (value) =>
  value && typeof value === 'object' && value.constructor === Object;
