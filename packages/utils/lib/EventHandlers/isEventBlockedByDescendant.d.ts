import { CraftDOMEvent } from './interfaces';
/**
 * Check if a specified event is blocked by a child
 * that's a descendant of the specified element
 */
export declare function isEventBlockedByDescendant<K extends keyof HTMLElementEventMap>(e: CraftDOMEvent<HTMLElementEventMap[K]>, eventName: K, el: HTMLElement): boolean;
