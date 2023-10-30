/// <reference types="react" />
import {
  SubscriberAndCallbacksFor,
  PatchListener,
} from 'craftjs-utils-meetovo';
import { QueryMethods } from './query';
import { EditorState, Options, NodeEventTypes } from '../interfaces';
export declare const editorInitialState: EditorState;
export declare const ActionMethodsWithConfig: {
  methods: (
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
        get(): import('../interfaces').Node;
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
            | import('../interfaces').Node
            | string[]
            | import('../interfaces').Node[],
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
        source:
          | string
          | import('../interfaces').Node
          | string[]
          | import('../interfaces').Node[],
        target: string,
        pos: {
          x: number;
          y: number;
        },
        nodesToDOM?: (node: import('../interfaces').Node) => HTMLElement
      ) => import('../interfaces').Indicator;
      getOptions: () => Options;
      getNodes: () => Record<string, import('../interfaces').Node>;
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
            node: import('../interfaces').Node,
            jsx: import('react').ReactElement<
              any,
              | string
              | ((props: any) => import('react').ReactElement<any, any>)
              | (new (props: any) => import('react').Component<any, any, any>)
            >
          ) => void
        ): import('../interfaces').NodeTree;
      };
      parseSerializedNode: (
        serializedNode: import('../interfaces').SerializedNode
      ) => {
        toNode(
          normalize?: (node: import('../interfaces').Node) => void
        ): import('../interfaces').Node;
      };
      parseFreshNode: (
        node: import('../interfaces').FreshNode
      ) => {
        toNode(
          normalize?: (node: import('../interfaces').Node) => void
        ): import('../interfaces').Node;
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
            setDOM: (id: string, dom: HTMLElement) => void;
            setNodeEvent: (
              eventType: NodeEventTypes,
              nodeIdSelector: string | string[]
            ) => void;
            selectNode: (nodeIdSelector?: string | string[]) => void;
            clearEvents: () => void;
            setOptions: (cb: (options: Partial<Options>) => void) => void;
            setIndicator: (
              indicator: import('../interfaces').Indicator
            ) => void;
            reset: () => void;
            addLinkedNodeFromTree: (
              tree: import('../interfaces').NodeTree,
              parentId: string,
              id: string
            ) => void;
            add: (
              nodeToAdd:
                | import('../interfaces').Node
                | import('../interfaces').Node[],
              parentId: string,
              index?: number
            ) => void;
            addNodeTree: (
              tree: import('../interfaces').NodeTree,
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
              selector:
                | string
                | import('../interfaces').Node
                | string[]
                | import('../interfaces').Node[],
              newParentId: string,
              index: number
            ) => void;
            replaceNodes: (
              nodes: Record<string, import('../interfaces').Node>
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
                    eventType: NodeEventTypes,
                    nodeIdSelector: string | string[]
                  ) => void;
                  selectNode: (nodeIdSelector?: string | string[]) => void;
                  clearEvents: () => void;
                  setOptions: (cb: (options: Partial<Options>) => void) => void;
                  setIndicator: (
                    indicator: import('../interfaces').Indicator
                  ) => void;
                  reset: () => void;
                  addLinkedNodeFromTree: (
                    tree: import('../interfaces').NodeTree,
                    parentId: string,
                    id: string
                  ) => void;
                  add: (
                    nodeToAdd:
                      | import('../interfaces').Node
                      | import('../interfaces').Node[],
                    parentId: string,
                    index?: number
                  ) => void;
                  addNodeTree: (
                    tree: import('../interfaces').NodeTree,
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
                    selector:
                      | string
                      | import('../interfaces').Node
                      | string[]
                      | import('../interfaces').Node[],
                    newParentId: string,
                    index: number
                  ) => void;
                  replaceNodes: (
                    nodes: Record<string, import('../interfaces').Node>
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
                    eventType: NodeEventTypes,
                    nodeIdSelector: string | string[]
                  ) => void;
                  selectNode: (nodeIdSelector?: string | string[]) => void;
                  clearEvents: () => void;
                  setOptions: (cb: (options: Partial<Options>) => void) => void;
                  setIndicator: (
                    indicator: import('../interfaces').Indicator
                  ) => void;
                  reset: () => void;
                  addLinkedNodeFromTree: (
                    tree: import('../interfaces').NodeTree,
                    parentId: string,
                    id: string
                  ) => void;
                  add: (
                    nodeToAdd:
                      | import('../interfaces').Node
                      | import('../interfaces').Node[],
                    parentId: string,
                    index?: number
                  ) => void;
                  addNodeTree: (
                    tree: import('../interfaces').NodeTree,
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
                    selector:
                      | string
                      | import('../interfaces').Node
                      | string[]
                      | import('../interfaces').Node[],
                    newParentId: string,
                    index: number
                  ) => void;
                  replaceNodes: (
                    nodes: Record<string, import('../interfaces').Node>
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
                    eventType: NodeEventTypes,
                    nodeIdSelector: string | string[]
                  ) => void;
                  selectNode: (nodeIdSelector?: string | string[]) => void;
                  clearEvents: () => void;
                  setOptions: (cb: (options: Partial<Options>) => void) => void;
                  setIndicator: (
                    indicator: import('../interfaces').Indicator
                  ) => void;
                  reset: () => void;
                  addLinkedNodeFromTree: (
                    tree: import('../interfaces').NodeTree,
                    parentId: string,
                    id: string
                  ) => void;
                  add: (
                    nodeToAdd:
                      | import('../interfaces').Node
                      | import('../interfaces').Node[],
                    parentId: string,
                    index?: number
                  ) => void;
                  addNodeTree: (
                    tree: import('../interfaces').NodeTree,
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
                    selector:
                      | string
                      | import('../interfaces').Node
                      | string[]
                      | import('../interfaces').Node[],
                    newParentId: string,
                    index: number
                  ) => void;
                  replaceNodes: (
                    nodes: Record<string, import('../interfaces').Node>
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
      tree: import('../interfaces').NodeTree,
      parentId: string,
      id: string
    ): void;
    add(
      nodeToAdd: import('../interfaces').Node | import('../interfaces').Node[],
      parentId: string,
      index?: number
    ): void;
    addNodeTree(
      tree: import('../interfaces').NodeTree,
      parentId?: string,
      index?: number
    ): void;
    delete(selector: string | string[]): void;
    deserialize(
      input: string | Record<string, import('../interfaces').SerializedNode>
    ): void;
    move(
      selector:
        | string
        | import('../interfaces').Node
        | string[]
        | import('../interfaces').Node[],
      newParentId: string,
      index: number
    ): void;
    replaceNodes(nodes: Record<string, import('../interfaces').Node>): void;
    clearEvents(): void;
    reset(): void;
    setOptions(cb: (options: Partial<Options>) => void): void;
    setNodeEvent(
      eventType: NodeEventTypes,
      nodeIdSelector: string | string[]
    ): void;
    setCustom<T extends string>(
      selector: string | string[],
      cb: (data: any) => void
    ): void;
    setDOM(id: string, dom: HTMLElement): void;
    setIndicator(indicator: import('../interfaces').Indicator): void;
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
  normalizeHistory: (state: EditorState) => void;
};
export declare type EditorStore = SubscriberAndCallbacksFor<
  typeof ActionMethodsWithConfig,
  typeof QueryMethods
>;
export declare const useEditorStore: (
  options: Partial<Options>,
  patchListener: PatchListener<
    EditorState,
    {
      methods: (
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
            get(): import('../interfaces').Node;
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
                | import('../interfaces').Node
                | string[]
                | import('../interfaces').Node[],
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
            source:
              | string
              | import('../interfaces').Node
              | string[]
              | import('../interfaces').Node[],
            target: string,
            pos: {
              x: number;
              y: number;
            },
            nodesToDOM?: (node: import('../interfaces').Node) => HTMLElement
          ) => import('../interfaces').Indicator;
          getOptions: () => Options;
          getNodes: () => Record<string, import('../interfaces').Node>;
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
                node: import('../interfaces').Node,
                jsx: import('react').ReactElement<
                  any,
                  | string
                  | ((props: any) => import('react').ReactElement<any, any>)
                  | (new (props: any) => import('react').Component<
                      any,
                      any,
                      any
                    >)
                >
              ) => void
            ): import('../interfaces').NodeTree;
          };
          parseSerializedNode: (
            serializedNode: import('../interfaces').SerializedNode
          ) => {
            toNode(
              normalize?: (node: import('../interfaces').Node) => void
            ): import('../interfaces').Node;
          };
          parseFreshNode: (
            node: import('../interfaces').FreshNode
          ) => {
            toNode(
              normalize?: (node: import('../interfaces').Node) => void
            ): import('../interfaces').Node;
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
                setDOM: (id: string, dom: HTMLElement) => void;
                setNodeEvent: (
                  eventType: NodeEventTypes,
                  nodeIdSelector: string | string[]
                ) => void;
                selectNode: (nodeIdSelector?: string | string[]) => void;
                clearEvents: () => void;
                setOptions: (cb: (options: Partial<Options>) => void) => void;
                setIndicator: (
                  indicator: import('../interfaces').Indicator
                ) => void;
                reset: () => void;
                addLinkedNodeFromTree: (
                  tree: import('../interfaces').NodeTree,
                  parentId: string,
                  id: string
                ) => void;
                add: (
                  nodeToAdd:
                    | import('../interfaces').Node
                    | import('../interfaces').Node[],
                  parentId: string,
                  index?: number
                ) => void;
                addNodeTree: (
                  tree: import('../interfaces').NodeTree,
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
                  selector:
                    | string
                    | import('../interfaces').Node
                    | string[]
                    | import('../interfaces').Node[],
                  newParentId: string,
                  index: number
                ) => void;
                replaceNodes: (
                  nodes: Record<string, import('../interfaces').Node>
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
                        eventType: NodeEventTypes,
                        nodeIdSelector: string | string[]
                      ) => void;
                      selectNode: (nodeIdSelector?: string | string[]) => void;
                      clearEvents: () => void;
                      setOptions: (
                        cb: (options: Partial<Options>) => void
                      ) => void;
                      setIndicator: (
                        indicator: import('../interfaces').Indicator
                      ) => void;
                      reset: () => void;
                      addLinkedNodeFromTree: (
                        tree: import('../interfaces').NodeTree,
                        parentId: string,
                        id: string
                      ) => void;
                      add: (
                        nodeToAdd:
                          | import('../interfaces').Node
                          | import('../interfaces').Node[],
                        parentId: string,
                        index?: number
                      ) => void;
                      addNodeTree: (
                        tree: import('../interfaces').NodeTree,
                        parentId?: string,
                        index?: number
                      ) => void;
                      delete: (selector: string | string[]) => void;
                      deserialize: (
                        input:
                          | string
                          | Record<
                              string,
                              import('../interfaces').SerializedNode
                            >
                      ) => void;
                      move: (
                        selector:
                          | string
                          | import('../interfaces').Node
                          | string[]
                          | import('../interfaces').Node[],
                        newParentId: string,
                        index: number
                      ) => void;
                      replaceNodes: (
                        nodes: Record<string, import('../interfaces').Node>
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
                        eventType: NodeEventTypes,
                        nodeIdSelector: string | string[]
                      ) => void;
                      selectNode: (nodeIdSelector?: string | string[]) => void;
                      clearEvents: () => void;
                      setOptions: (
                        cb: (options: Partial<Options>) => void
                      ) => void;
                      setIndicator: (
                        indicator: import('../interfaces').Indicator
                      ) => void;
                      reset: () => void;
                      addLinkedNodeFromTree: (
                        tree: import('../interfaces').NodeTree,
                        parentId: string,
                        id: string
                      ) => void;
                      add: (
                        nodeToAdd:
                          | import('../interfaces').Node
                          | import('../interfaces').Node[],
                        parentId: string,
                        index?: number
                      ) => void;
                      addNodeTree: (
                        tree: import('../interfaces').NodeTree,
                        parentId?: string,
                        index?: number
                      ) => void;
                      delete: (selector: string | string[]) => void;
                      deserialize: (
                        input:
                          | string
                          | Record<
                              string,
                              import('../interfaces').SerializedNode
                            >
                      ) => void;
                      move: (
                        selector:
                          | string
                          | import('../interfaces').Node
                          | string[]
                          | import('../interfaces').Node[],
                        newParentId: string,
                        index: number
                      ) => void;
                      replaceNodes: (
                        nodes: Record<string, import('../interfaces').Node>
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
                        eventType: NodeEventTypes,
                        nodeIdSelector: string | string[]
                      ) => void;
                      selectNode: (nodeIdSelector?: string | string[]) => void;
                      clearEvents: () => void;
                      setOptions: (
                        cb: (options: Partial<Options>) => void
                      ) => void;
                      setIndicator: (
                        indicator: import('../interfaces').Indicator
                      ) => void;
                      reset: () => void;
                      addLinkedNodeFromTree: (
                        tree: import('../interfaces').NodeTree,
                        parentId: string,
                        id: string
                      ) => void;
                      add: (
                        nodeToAdd:
                          | import('../interfaces').Node
                          | import('../interfaces').Node[],
                        parentId: string,
                        index?: number
                      ) => void;
                      addNodeTree: (
                        tree: import('../interfaces').NodeTree,
                        parentId?: string,
                        index?: number
                      ) => void;
                      delete: (selector: string | string[]) => void;
                      deserialize: (
                        input:
                          | string
                          | Record<
                              string,
                              import('../interfaces').SerializedNode
                            >
                      ) => void;
                      move: (
                        selector:
                          | string
                          | import('../interfaces').Node
                          | string[]
                          | import('../interfaces').Node[],
                        newParentId: string,
                        index: number
                      ) => void;
                      replaceNodes: (
                        nodes: Record<string, import('../interfaces').Node>
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
          tree: import('../interfaces').NodeTree,
          parentId: string,
          id: string
        ): void;
        add(
          nodeToAdd:
            | import('../interfaces').Node
            | import('../interfaces').Node[],
          parentId: string,
          index?: number
        ): void;
        addNodeTree(
          tree: import('../interfaces').NodeTree,
          parentId?: string,
          index?: number
        ): void;
        delete(selector: string | string[]): void;
        deserialize(
          input: string | Record<string, import('../interfaces').SerializedNode>
        ): void;
        move(
          selector:
            | string
            | import('../interfaces').Node
            | string[]
            | import('../interfaces').Node[],
          newParentId: string,
          index: number
        ): void;
        replaceNodes(nodes: Record<string, import('../interfaces').Node>): void;
        clearEvents(): void;
        reset(): void;
        setOptions(cb: (options: Partial<Options>) => void): void;
        setNodeEvent(
          eventType: NodeEventTypes,
          nodeIdSelector: string | string[]
        ): void;
        setCustom<T extends string>(
          selector: string | string[],
          cb: (data: any) => void
        ): void;
        setDOM(id: string, dom: HTMLElement): void;
        setIndicator(indicator: import('../interfaces').Indicator): void;
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
      normalizeHistory: (state: EditorState) => void;
    },
    typeof QueryMethods
  >
) => SubscriberAndCallbacksFor<
  {
    methods: (
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
          get(): import('../interfaces').Node;
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
              | import('../interfaces').Node
              | string[]
              | import('../interfaces').Node[],
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
          source:
            | string
            | import('../interfaces').Node
            | string[]
            | import('../interfaces').Node[],
          target: string,
          pos: {
            x: number;
            y: number;
          },
          nodesToDOM?: (node: import('../interfaces').Node) => HTMLElement
        ) => import('../interfaces').Indicator;
        getOptions: () => Options;
        getNodes: () => Record<string, import('../interfaces').Node>;
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
              node: import('../interfaces').Node,
              jsx: import('react').ReactElement<
                any,
                | string
                | ((props: any) => import('react').ReactElement<any, any>)
                | (new (props: any) => import('react').Component<any, any, any>)
              >
            ) => void
          ): import('../interfaces').NodeTree;
        };
        parseSerializedNode: (
          serializedNode: import('../interfaces').SerializedNode
        ) => {
          toNode(
            normalize?: (node: import('../interfaces').Node) => void
          ): import('../interfaces').Node;
        };
        parseFreshNode: (
          node: import('../interfaces').FreshNode
        ) => {
          toNode(
            normalize?: (node: import('../interfaces').Node) => void
          ): import('../interfaces').Node;
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
              setDOM: (id: string, dom: HTMLElement) => void;
              setNodeEvent: (
                eventType: NodeEventTypes,
                nodeIdSelector: string | string[]
              ) => void;
              selectNode: (nodeIdSelector?: string | string[]) => void;
              clearEvents: () => void;
              setOptions: (cb: (options: Partial<Options>) => void) => void;
              setIndicator: (
                indicator: import('../interfaces').Indicator
              ) => void;
              reset: () => void;
              addLinkedNodeFromTree: (
                tree: import('../interfaces').NodeTree,
                parentId: string,
                id: string
              ) => void;
              add: (
                nodeToAdd:
                  | import('../interfaces').Node
                  | import('../interfaces').Node[],
                parentId: string,
                index?: number
              ) => void;
              addNodeTree: (
                tree: import('../interfaces').NodeTree,
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
                selector:
                  | string
                  | import('../interfaces').Node
                  | string[]
                  | import('../interfaces').Node[],
                newParentId: string,
                index: number
              ) => void;
              replaceNodes: (
                nodes: Record<string, import('../interfaces').Node>
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
                      eventType: NodeEventTypes,
                      nodeIdSelector: string | string[]
                    ) => void;
                    selectNode: (nodeIdSelector?: string | string[]) => void;
                    clearEvents: () => void;
                    setOptions: (
                      cb: (options: Partial<Options>) => void
                    ) => void;
                    setIndicator: (
                      indicator: import('../interfaces').Indicator
                    ) => void;
                    reset: () => void;
                    addLinkedNodeFromTree: (
                      tree: import('../interfaces').NodeTree,
                      parentId: string,
                      id: string
                    ) => void;
                    add: (
                      nodeToAdd:
                        | import('../interfaces').Node
                        | import('../interfaces').Node[],
                      parentId: string,
                      index?: number
                    ) => void;
                    addNodeTree: (
                      tree: import('../interfaces').NodeTree,
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
                      selector:
                        | string
                        | import('../interfaces').Node
                        | string[]
                        | import('../interfaces').Node[],
                      newParentId: string,
                      index: number
                    ) => void;
                    replaceNodes: (
                      nodes: Record<string, import('../interfaces').Node>
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
                      eventType: NodeEventTypes,
                      nodeIdSelector: string | string[]
                    ) => void;
                    selectNode: (nodeIdSelector?: string | string[]) => void;
                    clearEvents: () => void;
                    setOptions: (
                      cb: (options: Partial<Options>) => void
                    ) => void;
                    setIndicator: (
                      indicator: import('../interfaces').Indicator
                    ) => void;
                    reset: () => void;
                    addLinkedNodeFromTree: (
                      tree: import('../interfaces').NodeTree,
                      parentId: string,
                      id: string
                    ) => void;
                    add: (
                      nodeToAdd:
                        | import('../interfaces').Node
                        | import('../interfaces').Node[],
                      parentId: string,
                      index?: number
                    ) => void;
                    addNodeTree: (
                      tree: import('../interfaces').NodeTree,
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
                      selector:
                        | string
                        | import('../interfaces').Node
                        | string[]
                        | import('../interfaces').Node[],
                      newParentId: string,
                      index: number
                    ) => void;
                    replaceNodes: (
                      nodes: Record<string, import('../interfaces').Node>
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
                      eventType: NodeEventTypes,
                      nodeIdSelector: string | string[]
                    ) => void;
                    selectNode: (nodeIdSelector?: string | string[]) => void;
                    clearEvents: () => void;
                    setOptions: (
                      cb: (options: Partial<Options>) => void
                    ) => void;
                    setIndicator: (
                      indicator: import('../interfaces').Indicator
                    ) => void;
                    reset: () => void;
                    addLinkedNodeFromTree: (
                      tree: import('../interfaces').NodeTree,
                      parentId: string,
                      id: string
                    ) => void;
                    add: (
                      nodeToAdd:
                        | import('../interfaces').Node
                        | import('../interfaces').Node[],
                      parentId: string,
                      index?: number
                    ) => void;
                    addNodeTree: (
                      tree: import('../interfaces').NodeTree,
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
                      selector:
                        | string
                        | import('../interfaces').Node
                        | string[]
                        | import('../interfaces').Node[],
                      newParentId: string,
                      index: number
                    ) => void;
                    replaceNodes: (
                      nodes: Record<string, import('../interfaces').Node>
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
        tree: import('../interfaces').NodeTree,
        parentId: string,
        id: string
      ): void;
      add(
        nodeToAdd:
          | import('../interfaces').Node
          | import('../interfaces').Node[],
        parentId: string,
        index?: number
      ): void;
      addNodeTree(
        tree: import('../interfaces').NodeTree,
        parentId?: string,
        index?: number
      ): void;
      delete(selector: string | string[]): void;
      deserialize(
        input: string | Record<string, import('../interfaces').SerializedNode>
      ): void;
      move(
        selector:
          | string
          | import('../interfaces').Node
          | string[]
          | import('../interfaces').Node[],
        newParentId: string,
        index: number
      ): void;
      replaceNodes(nodes: Record<string, import('../interfaces').Node>): void;
      clearEvents(): void;
      reset(): void;
      setOptions(cb: (options: Partial<Options>) => void): void;
      setNodeEvent(
        eventType: NodeEventTypes,
        nodeIdSelector: string | string[]
      ): void;
      setCustom<T extends string>(
        selector: string | string[],
        cb: (data: any) => void
      ): void;
      setDOM(id: string, dom: HTMLElement): void;
      setIndicator(indicator: import('../interfaces').Indicator): void;
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
    normalizeHistory: (state: EditorState) => void;
  },
  typeof QueryMethods
>;
