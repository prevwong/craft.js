import { DerivedEventHandlers, EventHandlers } from '@craftjs/utils';

import { DOMRegistry } from './DOMRegistry';

import { NodeId, NodeTree, EditorStore } from '../interfaces';
export interface CreateHandlerOptions {
  onCreate: (nodeTree: NodeTree) => void;
}

export class CoreEventHandlers<O = {}> extends EventHandlers<
  { store: EditorStore } & O
> {
  dom: DOMRegistry = new DOMRegistry();

  handlers() {
    return {
      connect: (el: HTMLElement, id: NodeId) => {},
      select: (el: HTMLElement, id: NodeId) => {},
      hover: (el: HTMLElement, id: NodeId) => {},
      drag: (el: HTMLElement, id: NodeId) => {},
      drop: (el: HTMLElement, id: NodeId) => {},
      create: (
        el: HTMLElement,
        UserElement: React.ReactElement,
        options?: Partial<CreateHandlerOptions>
      ) => {},
    };
  }
}

export abstract class DerivedCoreEventHandlers<
  O = {}
> extends DerivedEventHandlers<CoreEventHandlers, O> {}
