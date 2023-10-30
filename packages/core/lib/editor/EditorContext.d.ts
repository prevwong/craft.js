/// <reference types="react" />
import { EditorStore } from './store';
export declare type EditorContext = EditorStore;
export declare const EditorContext: import('react').Context<import('craftjs-utils-meetovo').SubscriberAndCallbacksFor<
  {
    methods: (
      state: import('..').EditorState,
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
          get(): import('..').Node;
          ancestors(deep?: boolean): string[];
          descendants(
            deep?: boolean,
            includeOnly?: 'linkedNodes' | 'childNodes'
          ): string[];
          linkedNodes(): string[];
          childNodes(): string[];
          isDraggable(onError?: (err: string) => void): boolean;
          isDroppable(
            selector:
              | string
              | import('..').Node
              | string[]
              | import('..').Node[],
            onError?: (err: string) => void
          ): boolean;
          toSerializedNode(): import('..').SerializedNode;
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
          source: string | import('..').Node | string[] | import('..').Node[],
          target: string,
          pos: {
            x: number;
            y: number;
          },
          nodesToDOM?: (node: import('..').Node) => HTMLElement
        ) => import('..').Indicator;
        getOptions: () => import('..').Options;
        getNodes: () => Record<string, import('..').Node>;
        getSerializedNodes: () => Record<string, import('..').SerializedNode>;
        getEvent: (
          eventType: import('..').NodeEventTypes
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
              node: import('..').Node,
              jsx: import('react').ReactElement<
                any,
                | string
                | ((props: any) => import('react').ReactElement<any, any>)
                | (new (props: any) => import('react').Component<any, any, any>)
              >
            ) => void
          ): import('..').NodeTree;
        };
        parseSerializedNode: (
          serializedNode: import('..').SerializedNode
        ) => {
          toNode(
            normalize?: (node: import('..').Node) => void
          ): import('..').Node;
        };
        parseFreshNode: (
          node: import('..').FreshNode
        ) => {
          toNode(
            normalize?: (node: import('..').Node) => void
          ): import('..').Node;
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
        getState: () => import('..').EditorState;
      } & {
        history: {
          canUndo: () => boolean;
          canRedo: () => boolean;
        };
      }
    ) => {
      setState(
        cb: (
          state: import('..').EditorState,
          actions: Pick<
            {
              setDOM: (id: string, dom: HTMLElement) => void;
              setNodeEvent: (
                eventType: import('..').NodeEventTypes,
                nodeIdSelector: string | string[]
              ) => void;
              selectNode: (nodeIdSelector?: string | string[]) => void;
              clearEvents: () => void;
              setOptions: (
                cb: (options: Partial<import('..').Options>) => void
              ) => void;
              setIndicator: (indicator: import('..').Indicator) => void;
              reset: () => void;
              addLinkedNodeFromTree: (
                tree: import('..').NodeTree,
                parentId: string,
                id: string
              ) => void;
              add: (
                nodeToAdd: import('..').Node | import('..').Node[],
                parentId: string,
                index?: number
              ) => void;
              addNodeTree: (
                tree: import('..').NodeTree,
                parentId?: string,
                index?: number
              ) => void;
              delete: (selector: string | string[]) => void;
              deserialize: (
                input: string | Record<string, import('..').SerializedNode>
              ) => void;
              move: (
                selector:
                  | string
                  | import('..').Node
                  | string[]
                  | import('..').Node[],
                newParentId: string,
                index: number
              ) => void;
              replaceNodes: (nodes: Record<string, import('..').Node>) => void;
              setCustom: (
                selector: string | string[],
                cb: (data: any) => void
              ) => void;
              setHidden: (id: string, bool: boolean) => void;
              setProp: (
                selector: string | string[],
                cb: (props: any) => void
              ) => void;
            } & {
              history: {
                undo: () => void;
                redo: () => void;
                clear: () => void;
                throttle: (
                  rate?: number
                ) => Pick<
                  {
                    setDOM: (id: string, dom: HTMLElement) => void;
                    setNodeEvent: (
                      eventType: import('..').NodeEventTypes,
                      nodeIdSelector: string | string[]
                    ) => void;
                    selectNode: (nodeIdSelector?: string | string[]) => void;
                    clearEvents: () => void;
                    setOptions: (
                      cb: (options: Partial<import('..').Options>) => void
                    ) => void;
                    setIndicator: (indicator: import('..').Indicator) => void;
                    reset: () => void;
                    addLinkedNodeFromTree: (
                      tree: import('..').NodeTree,
                      parentId: string,
                      id: string
                    ) => void;
                    add: (
                      nodeToAdd: import('..').Node | import('..').Node[],
                      parentId: string,
                      index?: number
                    ) => void;
                    addNodeTree: (
                      tree: import('..').NodeTree,
                      parentId?: string,
                      index?: number
                    ) => void;
                    delete: (selector: string | string[]) => void;
                    deserialize: (
                      input:
                        | string
                        | Record<string, import('..').SerializedNode>
                    ) => void;
                    move: (
                      selector:
                        | string
                        | import('..').Node
                        | string[]
                        | import('..').Node[],
                      newParentId: string,
                      index: number
                    ) => void;
                    replaceNodes: (
                      nodes: Record<string, import('..').Node>
                    ) => void;
                    setCustom: (
                      selector: string | string[],
                      cb: (data: any) => void
                    ) => void;
                    setHidden: (id: string, bool: boolean) => void;
                    setProp: (
                      selector: string | string[],
                      cb: (props: any) => void
                    ) => void;
                  },
                  | 'setDOM'
                  | 'setNodeEvent'
                  | 'selectNode'
                  | 'clearEvents'
                  | 'setOptions'
                  | 'setIndicator'
                  | 'reset'
                  | 'addLinkedNodeFromTree'
                  | 'add'
                  | 'addNodeTree'
                  | 'delete'
                  | 'deserialize'
                  | 'move'
                  | 'replaceNodes'
                  | 'setCustom'
                  | 'setHidden'
                  | 'setProp'
                >;
                merge: () => Pick<
                  {
                    setDOM: (id: string, dom: HTMLElement) => void;
                    setNodeEvent: (
                      eventType: import('..').NodeEventTypes,
                      nodeIdSelector: string | string[]
                    ) => void;
                    selectNode: (nodeIdSelector?: string | string[]) => void;
                    clearEvents: () => void;
                    setOptions: (
                      cb: (options: Partial<import('..').Options>) => void
                    ) => void;
                    setIndicator: (indicator: import('..').Indicator) => void;
                    reset: () => void;
                    addLinkedNodeFromTree: (
                      tree: import('..').NodeTree,
                      parentId: string,
                      id: string
                    ) => void;
                    add: (
                      nodeToAdd: import('..').Node | import('..').Node[],
                      parentId: string,
                      index?: number
                    ) => void;
                    addNodeTree: (
                      tree: import('..').NodeTree,
                      parentId?: string,
                      index?: number
                    ) => void;
                    delete: (selector: string | string[]) => void;
                    deserialize: (
                      input:
                        | string
                        | Record<string, import('..').SerializedNode>
                    ) => void;
                    move: (
                      selector:
                        | string
                        | import('..').Node
                        | string[]
                        | import('..').Node[],
                      newParentId: string,
                      index: number
                    ) => void;
                    replaceNodes: (
                      nodes: Record<string, import('..').Node>
                    ) => void;
                    setCustom: (
                      selector: string | string[],
                      cb: (data: any) => void
                    ) => void;
                    setHidden: (id: string, bool: boolean) => void;
                    setProp: (
                      selector: string | string[],
                      cb: (props: any) => void
                    ) => void;
                  },
                  | 'setDOM'
                  | 'setNodeEvent'
                  | 'selectNode'
                  | 'clearEvents'
                  | 'setOptions'
                  | 'setIndicator'
                  | 'reset'
                  | 'addLinkedNodeFromTree'
                  | 'add'
                  | 'addNodeTree'
                  | 'delete'
                  | 'deserialize'
                  | 'move'
                  | 'replaceNodes'
                  | 'setCustom'
                  | 'setHidden'
                  | 'setProp'
                >;
                ignore: () => Pick<
                  {
                    setDOM: (id: string, dom: HTMLElement) => void;
                    setNodeEvent: (
                      eventType: import('..').NodeEventTypes,
                      nodeIdSelector: string | string[]
                    ) => void;
                    selectNode: (nodeIdSelector?: string | string[]) => void;
                    clearEvents: () => void;
                    setOptions: (
                      cb: (options: Partial<import('..').Options>) => void
                    ) => void;
                    setIndicator: (indicator: import('..').Indicator) => void;
                    reset: () => void;
                    addLinkedNodeFromTree: (
                      tree: import('..').NodeTree,
                      parentId: string,
                      id: string
                    ) => void;
                    add: (
                      nodeToAdd: import('..').Node | import('..').Node[],
                      parentId: string,
                      index?: number
                    ) => void;
                    addNodeTree: (
                      tree: import('..').NodeTree,
                      parentId?: string,
                      index?: number
                    ) => void;
                    delete: (selector: string | string[]) => void;
                    deserialize: (
                      input:
                        | string
                        | Record<string, import('..').SerializedNode>
                    ) => void;
                    move: (
                      selector:
                        | string
                        | import('..').Node
                        | string[]
                        | import('..').Node[],
                      newParentId: string,
                      index: number
                    ) => void;
                    replaceNodes: (
                      nodes: Record<string, import('..').Node>
                    ) => void;
                    setCustom: (
                      selector: string | string[],
                      cb: (data: any) => void
                    ) => void;
                    setHidden: (id: string, bool: boolean) => void;
                    setProp: (
                      selector: string | string[],
                      cb: (props: any) => void
                    ) => void;
                  },
                  | 'setDOM'
                  | 'setNodeEvent'
                  | 'selectNode'
                  | 'clearEvents'
                  | 'setOptions'
                  | 'setIndicator'
                  | 'reset'
                  | 'addLinkedNodeFromTree'
                  | 'add'
                  | 'addNodeTree'
                  | 'delete'
                  | 'deserialize'
                  | 'move'
                  | 'replaceNodes'
                  | 'setCustom'
                  | 'setHidden'
                  | 'setProp'
                >;
              };
            },
            | 'setDOM'
            | 'setNodeEvent'
            | 'selectNode'
            | 'clearEvents'
            | 'setOptions'
            | 'setIndicator'
            | 'reset'
            | 'addLinkedNodeFromTree'
            | 'add'
            | 'addNodeTree'
            | 'delete'
            | 'deserialize'
            | 'move'
            | 'replaceNodes'
            | 'setCustom'
            | 'setHidden'
            | 'setProp'
          >
        ) => void
      ): void;
      addLinkedNodeFromTree(
        tree: import('..').NodeTree,
        parentId: string,
        id: string
      ): void;
      add(
        nodeToAdd: import('..').Node | import('..').Node[],
        parentId: string,
        index?: number
      ): void;
      addNodeTree(
        tree: import('..').NodeTree,
        parentId?: string,
        index?: number
      ): void;
      delete(selector: string | string[]): void;
      deserialize(
        input: string | Record<string, import('..').SerializedNode>
      ): void;
      move(
        selector: string | import('..').Node | string[] | import('..').Node[],
        newParentId: string,
        index: number
      ): void;
      replaceNodes(nodes: Record<string, import('..').Node>): void;
      clearEvents(): void;
      reset(): void;
      setOptions(cb: (options: Partial<import('..').Options>) => void): void;
      setNodeEvent(
        eventType: import('..').NodeEventTypes,
        nodeIdSelector: string | string[]
      ): void;
      setCustom<T extends string>(
        selector: string | string[],
        cb: (data: any) => void
      ): void;
      setDOM(id: string, dom: HTMLElement): void;
      setIndicator(indicator: import('..').Indicator): void;
      setHidden(id: string, bool: boolean): void;
      setProp(selector: string | string[], cb: (props: any) => void): void;
      selectNode(nodeIdSelector?: string | string[]): void;
    };
    ignoreHistoryForActions: readonly [
      'setDOM',
      'setNodeEvent',
      'selectNode',
      'clearEvents',
      'setOptions',
      'setIndicator'
    ];
    normalizeHistory: (state: import('..').EditorState) => void;
  },
  typeof import('./query').QueryMethods
>>;
