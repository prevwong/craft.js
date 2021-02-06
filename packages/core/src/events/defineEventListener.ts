export const defineEventListener = (
  name: string,
  handler: (e: any, payload: any) => void,
  capture?: boolean
): any => [name, handler, capture];
