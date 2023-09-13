/**
 * Generate a random ID. That ID can for example be used as a node ID.
 *
 * @param size The number of characters that are generated for the ID. Defaults to `10`
 * @returns A random id
 */
export const getRandomId = (size: number = 10) => {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 5);
  return `${timestamp}-${randomChars}`;
};
