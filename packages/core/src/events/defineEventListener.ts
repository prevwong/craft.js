import { CraftDOMEvent, CraftEventListener } from '../interfaces';

export const defineEventListener = (
  name: string,
  handler: (e: CraftDOMEvent<Event>, payload: any) => void,
  capture?: boolean
): CraftEventListener => [name, handler, capture];
