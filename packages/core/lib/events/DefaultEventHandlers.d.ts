/// <reference types="react" />
import { CoreEventHandlers, CreateHandlerOptions } from './CoreEventHandlers';
import { Positioner } from './Positioner';
import { DragTarget } from '../interfaces';
export declare type DefaultEventHandlersOptions = {
  isMultiSelectEnabled: (e: MouseEvent) => boolean;
};
/**
 * Specifies Editor-wide event handlers and connectors
 */
export declare class DefaultEventHandlers<O = {}> extends CoreEventHandlers<
  DefaultEventHandlersOptions & O
> {
  /**
   * Note: Multiple drag shadows (ie: via multiselect in v0.2 and higher) do not look good on Linux Chromium due to way it renders drag shadows in general,
   * so will have to fallback to the single shadow approach above for the time being
   * see: https://bugs.chromium.org/p/chromium/issues/detail?id=550999
   */
  static forceSingleDragShadow: boolean;
  draggedElementShadow: HTMLElement;
  dragTarget: DragTarget;
  positioner: Positioner | null;
  currentSelectedElementIds: any[];
  onDisable(): void;
  handlers(): {
    connect: (el: HTMLElement, id: string) => () => void;
    select: (el: HTMLElement, id: string) => () => void;
    hover: (el: HTMLElement, id: string) => () => void;
    drop: (el: HTMLElement, targetId: string) => () => void;
    drag: (el: HTMLElement, id: string) => () => void;
    create: (
      el: HTMLElement,
      userElement: import('react').ReactElement<
        any,
        | string
        | ((props: any) => import('react').ReactElement<any, any>)
        | (new (props: any) => import('react').Component<any, any, any>)
      >,
      options?: Partial<CreateHandlerOptions>
    ) => () => void;
  };
  private dropElement;
}
