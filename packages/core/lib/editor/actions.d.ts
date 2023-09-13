/// <reference types="react" />
import {
  EditorState,
  Indicator,
  Node,
  Options,
  NodeEventTypes,
  NodeTree,
} from '../interfaces';
export declare const ActionMethods: (
  state: EditorState,
  query: {
    node: (
      id: string
    ) => {
      isCanvas(): boolean;
      isRoot(): boolean;
      isLinkedNode(): boolean;
      isTopLevelNode(): any;
      isDeletable(): boolean;
      isParentOfTopLevelNodes: () => boolean;
      isParentOfTopLevelCanvas(): any;
      isSelected(): boolean;
      isHovered(): boolean;
      isDragged(): boolean;
      get(): Node;
      ancestors(deep?: boolean): string[];
      descendants(
        deep?: boolean,
        includeOnly?: 'linkedNodes' | 'childNodes'
      ): string[];
      linkedNodes(): string[];
      childNodes(): string[];
      isDraggable(onError?: (err: string) => void): boolean;
      isDroppable(
        selector: string | string[] | Node | Node[],
        onError?: (err: string) => void
      ): boolean;
      toSerializedNode(): import('../interfaces').SerializedNode;
      toNodeTree(
        includeOnly?: 'linkedNodes' | 'childNodes'
      ): {
        rootNodeId: string;
        nodes: any;
      };
      decendants(deep?: boolean): any;
      isTopLevelCanvas(): boolean;
    };
    getDropPlaceholder: (
      source: string | string[] | Node | Node[],
      target: string,
      pos: {
        x: number;
        y: number;
      },
      nodesToDOM?: (node: Node) => HTMLElement
    ) => Indicator;
    getOptions: () => Options;
    getNodes: () => Record<string, Node>;
    getSerializedNodes: () => Record<
      string,
      import('../interfaces').SerializedNode
    >;
    getEvent: (
      eventType: NodeEventTypes
    ) => {
      contains(id: string): boolean;
      isEmpty(): boolean;
      first(): any;
      last(): any;
      all(): string[];
      size(): any;
      at(i: number): any;
      raw(): Set<string>;
    };
    serialize: () => string;
    parseReactElement: (
      reactElement: import('react').ReactElement<
        any,
        | string
        | ((props: any) => import('react').ReactElement<any, any>)
        | (new (props: any) => import('react').Component<any, any, any>)
      >
    ) => {
      toNodeTree(
        normalize?: (
          node: Node,
          jsx: import('react').ReactElement<
            any,
            | string
            | ((props: any) => import('react').ReactElement<any, any>)
            | (new (props: any) => import('react').Component<any, any, any>)
          >
        ) => void
      ): NodeTree;
    };
    parseSerializedNode: (
      serializedNode: import('../interfaces').SerializedNode
    ) => {
      toNode(normalize?: (node: Node) => void): Node;
    };
    parseFreshNode: (
      node: import('../interfaces').FreshNode
    ) => {
      toNode(normalize?: (node: Node) => void): Node;
    };
    createNode: (
      reactElement: import('react').ReactElement<
        any,
        | string
        | ((props: any) => import('react').ReactElement<any, any>)
        | (new (props: any) => import('react').Component<any, any, any>)
      >,
      extras?: any
    ) => any;
    getState: () => EditorState;
  } & {
    history: {
      canUndo: () => boolean;
      canRedo: () => boolean;
    };
  }
) => {
  setState(
    cb: (
      state: EditorState,
      actions: Pick<
        {
          addLinkedNodeFromTree: (
            tree: NodeTree,
            parentId: string,
            id: string
          ) => void;
          add: (
            nodeToAdd: Node | Node[],
            parentId: string,
            index?: number
          ) => void;
          addNodeTree: (
            tree: NodeTree,
            parentId?: string,
            index?: number
          ) => void;
          delete: (selector: string | string[]) => void;
          deserialize: (
            input:
              | string
              | Record<string, import('../interfaces').SerializedNode>
          ) => void;
          move: (
            selector: string | string[] | Node | Node[],
            newParentId: string,
            index: number
          ) => void;
          replaceNodes: (nodes: Record<string, Node>) => void;
          clearEvents: () => void;
          reset: () => void;
          setOptions: (cb: (options: Partial<Options>) => void) => void;
          setNodeEvent: (
            eventType: NodeEventTypes,
            nodeIdSelector: string | string[]
          ) => void;
          setCustom: (
            selector: string | string[],
            cb: (data: any) => void
          ) => void;
          setDOM: (id: string, dom: HTMLElement) => void;
          setIndicator: (indicator: Indicator) => void;
          setHidden: (id: string, bool: boolean) => void;
          setProp: (
            selector: string | string[],
            cb: (props: any) => void
          ) => void;
          selectNode: (nodeIdSelector?: string | string[]) => void;
        } & {
          history: {
            undo: () => void;
            redo: () => void;
            clear: () => void;
            throttle: (
              rate?: number
            ) => Pick<
              {
                addLinkedNodeFromTree: (
                  tree: NodeTree,
                  parentId: string,
                  id: string
                ) => void;
                add: (
                  nodeToAdd: Node | Node[],
                  parentId: string,
                  index?: number
                ) => void;
                addNodeTree: (
                  tree: NodeTree,
                  parentId?: string,
                  index?: number
                ) => void;
                delete: (selector: string | string[]) => void;
                deserialize: (
                  input:
                    | string
                    | Record<string, import('../interfaces').SerializedNode>
                ) => void;
                move: (
                  selector: string | string[] | Node | Node[],
                  newParentId: string,
                  index: number
                ) => void;
                replaceNodes: (nodes: Record<string, Node>) => void;
                clearEvents: () => void;
                reset: () => void;
                setOptions: (cb: (options: Partial<Options>) => void) => void;
                setNodeEvent: (
                  eventType: NodeEventTypes,
                  nodeIdSelector: string | string[]
                ) => void;
                setCustom: (
                  selector: string | string[],
                  cb: (data: any) => void
                ) => void;
                setDOM: (id: string, dom: HTMLElement) => void;
                setIndicator: (indicator: Indicator) => void;
                setHidden: (id: string, bool: boolean) => void;
                setProp: (
                  selector: string | string[],
                  cb: (props: any) => void
                ) => void;
                selectNode: (nodeIdSelector?: string | string[]) => void;
              },
              | 'addLinkedNodeFromTree'
              | 'add'
              | 'addNodeTree'
              | 'delete'
              | 'deserialize'
              | 'move'
              | 'replaceNodes'
              | 'clearEvents'
              | 'reset'
              | 'setOptions'
              | 'setNodeEvent'
              | 'setCustom'
              | 'setDOM'
              | 'setIndicator'
              | 'setHidden'
              | 'setProp'
              | 'selectNode'
            >;
            merge: () => Pick<
              {
                addLinkedNodeFromTree: (
                  tree: NodeTree,
                  parentId: string,
                  id: string
                ) => void;
                add: (
                  nodeToAdd: Node | Node[],
                  parentId: string,
                  index?: number
                ) => void;
                addNodeTree: (
                  tree: NodeTree,
                  parentId?: string,
                  index?: number
                ) => void;
                delete: (selector: string | string[]) => void;
                deserialize: (
                  input:
                    | string
                    | Record<string, import('../interfaces').SerializedNode>
                ) => void;
                move: (
                  selector: string | string[] | Node | Node[],
                  newParentId: string,
                  index: number
                ) => void;
                replaceNodes: (nodes: Record<string, Node>) => void;
                clearEvents: () => void;
                reset: () => void;
                setOptions: (cb: (options: Partial<Options>) => void) => void;
                setNodeEvent: (
                  eventType: NodeEventTypes,
                  nodeIdSelector: string | string[]
                ) => void;
                setCustom: (
                  selector: string | string[],
                  cb: (data: any) => void
                ) => void;
                setDOM: (id: string, dom: HTMLElement) => void;
                setIndicator: (indicator: Indicator) => void;
                setHidden: (id: string, bool: boolean) => void;
                setProp: (
                  selector: string | string[],
                  cb: (props: any) => void
                ) => void;
                selectNode: (nodeIdSelector?: string | string[]) => void;
              },
              | 'addLinkedNodeFromTree'
              | 'add'
              | 'addNodeTree'
              | 'delete'
              | 'deserialize'
              | 'move'
              | 'replaceNodes'
              | 'clearEvents'
              | 'reset'
              | 'setOptions'
              | 'setNodeEvent'
              | 'setCustom'
              | 'setDOM'
              | 'setIndicator'
              | 'setHidden'
              | 'setProp'
              | 'selectNode'
            >;
            ignore: () => Pick<
              {
                addLinkedNodeFromTree: (
                  tree: NodeTree,
                  parentId: string,
                  id: string
                ) => void;
                add: (
                  nodeToAdd: Node | Node[],
                  parentId: string,
                  index?: number
                ) => void;
                addNodeTree: (
                  tree: NodeTree,
                  parentId?: string,
                  index?: number
                ) => void;
                delete: (selector: string | string[]) => void;
                deserialize: (
                  input:
                    | string
                    | Record<string, import('../interfaces').SerializedNode>
                ) => void;
                move: (
                  selector: string | string[] | Node | Node[],
                  newParentId: string,
                  index: number
                ) => void;
                replaceNodes: (nodes: Record<string, Node>) => void;
                clearEvents: () => void;
                reset: () => void;
                setOptions: (cb: (options: Partial<Options>) => void) => void;
                setNodeEvent: (
                  eventType: NodeEventTypes,
                  nodeIdSelector: string | string[]
                ) => void;
                setCustom: (
                  selector: string | string[],
                  cb: (data: any) => void
                ) => void;
                setDOM: (id: string, dom: HTMLElement) => void;
                setIndicator: (indicator: Indicator) => void;
                setHidden: (id: string, bool: boolean) => void;
                setProp: (
                  selector: string | string[],
                  cb: (props: any) => void
                ) => void;
                selectNode: (nodeIdSelector?: string | string[]) => void;
              },
              | 'addLinkedNodeFromTree'
              | 'add'
              | 'addNodeTree'
              | 'delete'
              | 'deserialize'
              | 'move'
              | 'replaceNodes'
              | 'clearEvents'
              | 'reset'
              | 'setOptions'
              | 'setNodeEvent'
              | 'setCustom'
              | 'setDOM'
              | 'setIndicator'
              | 'setHidden'
              | 'setProp'
              | 'selectNode'
            >;
          };
        },
        | 'addLinkedNodeFromTree'
        | 'add'
        | 'addNodeTree'
        | 'delete'
        | 'deserialize'
        | 'move'
        | 'replaceNodes'
        | 'clearEvents'
        | 'reset'
        | 'setOptions'
        | 'setNodeEvent'
        | 'setCustom'
        | 'setDOM'
        | 'setIndicator'
        | 'setHidden'
        | 'setProp'
        | 'selectNode'
      >
    ) => void
  ): void;
  /**
   * @private
   * Add a new linked Node to the editor.
   * Only used internally by the <Element /> component
   *
   * @param tree
   * @param parentId
   * @param id
   */
  addLinkedNodeFromTree(tree: NodeTree, parentId: string, id: string): void;
  /**
   * Add a new Node to the editor.
   *
   * @param nodeToAdd
   * @param parentId
   * @param index
   */
  add(nodeToAdd: Node | Node[], parentId: string, index?: number): void;
  /**
   * Add a NodeTree to the editor
   *
   * @param tree
   * @param parentId
   * @param index
   */
  addNodeTree(tree: NodeTree, parentId?: string, index?: number): void;
  /**
   * Delete a Node
   * @param id
   */
  delete(selector: string | string[]): void;
  deserialize(
    input: string | Record<string, import('../interfaces').SerializedNode>
  ): void;
  /**
   * Move a target Node to a new Parent at a given index
   * @param targetId
   * @param newParentId
   * @param index
   */
  move(
    selector: string | string[] | Node | Node[],
    newParentId: string,
    index: number
  ): void;
  replaceNodes(nodes: Record<string, Node>): void;
  clearEvents(): void;
  /**
   * Resets all the editor state.
   */
  reset(): void;
  /**
   * Set editor options via a callback function
   *
   * @param cb: function used to set the options.
   */
  setOptions(cb: (options: Partial<Options>) => void): void;
  setNodeEvent(
    eventType: NodeEventTypes,
    nodeIdSelector: string | string[]
  ): void;
  /**
   * Set custom values to a Node
   * @param id
   * @param cb
   */
  setCustom<T extends string>(
    selector: string | string[],
    cb: (data: any) => void
  ): void;
  /**
   * Given a `id`, it will set the `dom` porperty of that node.
   *
   * @param id of the node we want to set
   * @param dom
   */
  setDOM(id: string, dom: HTMLElement): void;
  setIndicator(indicator: Indicator): void;
  /**
   * Hide a Node
   * @param id
   * @param bool
   */
  setHidden(id: string, bool: boolean): void;
  /**
   * Update the props of a Node
   * @param id
   * @param cb
   */
  setProp(selector: string | string[], cb: (props: any) => void): void;
  selectNode(nodeIdSelector?: string | string[]): void;
};
