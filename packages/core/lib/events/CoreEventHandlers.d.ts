/// <reference types="react" />
import { DerivedEventHandlers, EventHandlers } from '@craftjs/utils';
import { EditorStore } from '../editor/store';
import { NodeTree } from '../interfaces/nodes';
export interface CreateHandlerOptions {
  onCreate: (nodeTree: NodeTree) => void;
}
export declare class CoreEventHandlers<O = {}> extends EventHandlers<
  {
    store: EditorStore;
  } & O
> {
  handlers(): {
    connect: (el: HTMLElement, id: string) => void;
    select: (el: HTMLElement, id: string) => void;
    hover: (el: HTMLElement, id: string) => void;
    drag: (el: HTMLElement, id: string) => void;
    drop: (el: HTMLElement, id: string) => void;
    create: (
      el: HTMLElement,
      UserElement: import('react').ReactElement<
        any,
        | string
        | ((props: any) => import('react').ReactElement<any, any>)
        | (new (props: any) => import('react').Component<any, any, any>)
      >,
      options?: Partial<CreateHandlerOptions>
    ) => void;
  };
}
export declare abstract class DerivedCoreEventHandlers<
  O = {}
> extends DerivedEventHandlers<CoreEventHandlers, O> {}
