import { NodeId, Node } from './nodes';

export type NodeInfo = {
  id?: NodeId;
} & DOMInfo;

export type DOMInfo = Record<
  | 'x'
  | 'y'
  | 'top'
  | 'left'
  | 'bottom'
  | 'right'
  | 'width'
  | 'height'
  | 'outerWidth'
  | 'outerHeight',
  number
> & {
  inFlow: boolean;
  margin: Record<'top' | 'left' | 'bottom' | 'right', number>;
  padding: Record<'top' | 'left' | 'bottom' | 'right', number>;
};

export interface DropAction {
  parent: Node;
  index: number;
  where: string;
}

export type Placement = DropAction & {
  currentNode: Node | null;
};

export type CraftDOMEvent<T extends Event> = T & {
  craft: {
    stopPropagation: () => void;
    blockedEvents: Record<string, boolean>;
  };
};

export type CraftEventListener = [
  string,
  (e: CraftDOMEvent<Event>, opts: any) => void,
  boolean
];

export type Handler = {
  /**
   * The DOM manipulations to perform on the attached DOM element
   * @returns function that reverts the DOM manipulations performed
   */
  init: (el: HTMLElement, opts: any) => any;

  /**
   * List of Event Listeners to add to the attached DOM element
   */
  events: readonly CraftEventListener[];
};
