/// <reference types="react" />
import { Node } from '../interfaces';
export declare function useInternalNode<S = null>(
  collect?: (node: Node) => S
): Pick<
  import('../editor/useInternalEditor').useInternalEditorReturnType<S>,
  | 'inContext'
  | 'store'
  | Exclude<
      keyof import('@craftjs/utils').ConditionallyMergeRecordTypes<
        S,
        {
          actions: {
            addLinkedNodeFromTree: (
              tree: import('../interfaces').NodeTree,
              parentId: string,
              id: string
            ) => void;
            add: (
              nodeToAdd: Node | Node[],
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
              selector: string | string[] | Node | Node[],
              newParentId: string,
              index: number
            ) => void;
            replaceNodes: (nodes: Record<string, Node>) => void;
            clearEvents: () => void;
            reset: () => void;
            setOptions: (
              cb: (options: Partial<import('../interfaces').Options>) => void
            ) => void;
            setNodeEvent: (
              eventType: import('../interfaces').NodeEventTypes,
              nodeIdSelector: string | string[]
            ) => void;
            setCustom: (
              selector: string | string[],
              cb: (data: any) => void
            ) => void;
            setDOM: (id: string, dom: HTMLElement) => void;
            setIndicator: (
              indicator: import('../interfaces').Indicator
            ) => void;
            setHidden: (id: string, bool: boolean) => void;
            setProp: (
              selector: string | string[],
              cb: (props: any) => void
            ) => void;
            selectNode: (nodeIdSelector?: string | string[]) => void;
            setState: (
              cb: (
                state: import('../interfaces').EditorState,
                actions: Pick<
                  {
                    addLinkedNodeFromTree: (
                      tree: import('../interfaces').NodeTree,
                      parentId: string,
                      id: string
                    ) => void;
                    add: (
                      nodeToAdd: Node | Node[],
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
                      selector: string | string[] | Node | Node[],
                      newParentId: string,
                      index: number
                    ) => void;
                    replaceNodes: (nodes: Record<string, Node>) => void;
                    clearEvents: () => void;
                    reset: () => void;
                    setOptions: (
                      cb: (
                        options: Partial<import('../interfaces').Options>
                      ) => void
                    ) => void;
                    setNodeEvent: (
                      eventType: import('../interfaces').NodeEventTypes,
                      nodeIdSelector: string | string[]
                    ) => void;
                    setCustom: (
                      selector: string | string[],
                      cb: (data: any) => void
                    ) => void;
                    setDOM: (id: string, dom: HTMLElement) => void;
                    setIndicator: (
                      indicator: import('../interfaces').Indicator
                    ) => void;
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
                            tree: import('../interfaces').NodeTree,
                            parentId: string,
                            id: string
                          ) => void;
                          add: (
                            nodeToAdd: Node | Node[],
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
                            selector: string | string[] | Node | Node[],
                            newParentId: string,
                            index: number
                          ) => void;
                          replaceNodes: (nodes: Record<string, Node>) => void;
                          clearEvents: () => void;
                          reset: () => void;
                          setOptions: (
                            cb: (
                              options: Partial<import('../interfaces').Options>
                            ) => void
                          ) => void;
                          setNodeEvent: (
                            eventType: import('../interfaces').NodeEventTypes,
                            nodeIdSelector: string | string[]
                          ) => void;
                          setCustom: (
                            selector: string | string[],
                            cb: (data: any) => void
                          ) => void;
                          setDOM: (id: string, dom: HTMLElement) => void;
                          setIndicator: (
                            indicator: import('../interfaces').Indicator
                          ) => void;
                          setHidden: (id: string, bool: boolean) => void;
                          setProp: (
                            selector: string | string[],
                            cb: (props: any) => void
                          ) => void;
                          selectNode: (
                            nodeIdSelector?: string | string[]
                          ) => void;
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
                            tree: import('../interfaces').NodeTree,
                            parentId: string,
                            id: string
                          ) => void;
                          add: (
                            nodeToAdd: Node | Node[],
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
                            selector: string | string[] | Node | Node[],
                            newParentId: string,
                            index: number
                          ) => void;
                          replaceNodes: (nodes: Record<string, Node>) => void;
                          clearEvents: () => void;
                          reset: () => void;
                          setOptions: (
                            cb: (
                              options: Partial<import('../interfaces').Options>
                            ) => void
                          ) => void;
                          setNodeEvent: (
                            eventType: import('../interfaces').NodeEventTypes,
                            nodeIdSelector: string | string[]
                          ) => void;
                          setCustom: (
                            selector: string | string[],
                            cb: (data: any) => void
                          ) => void;
                          setDOM: (id: string, dom: HTMLElement) => void;
                          setIndicator: (
                            indicator: import('../interfaces').Indicator
                          ) => void;
                          setHidden: (id: string, bool: boolean) => void;
                          setProp: (
                            selector: string | string[],
                            cb: (props: any) => void
                          ) => void;
                          selectNode: (
                            nodeIdSelector?: string | string[]
                          ) => void;
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
                            tree: import('../interfaces').NodeTree,
                            parentId: string,
                            id: string
                          ) => void;
                          add: (
                            nodeToAdd: Node | Node[],
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
                            selector: string | string[] | Node | Node[],
                            newParentId: string,
                            index: number
                          ) => void;
                          replaceNodes: (nodes: Record<string, Node>) => void;
                          clearEvents: () => void;
                          reset: () => void;
                          setOptions: (
                            cb: (
                              options: Partial<import('../interfaces').Options>
                            ) => void
                          ) => void;
                          setNodeEvent: (
                            eventType: import('../interfaces').NodeEventTypes,
                            nodeIdSelector: string | string[]
                          ) => void;
                          setCustom: (
                            selector: string | string[],
                            cb: (data: any) => void
                          ) => void;
                          setDOM: (id: string, dom: HTMLElement) => void;
                          setIndicator: (
                            indicator: import('../interfaces').Indicator
                          ) => void;
                          setHidden: (id: string, bool: boolean) => void;
                          setProp: (
                            selector: string | string[],
                            cb: (props: any) => void
                          ) => void;
                          selectNode: (
                            nodeIdSelector?: string | string[]
                          ) => void;
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
                  addLinkedNodeFromTree: (
                    tree: import('../interfaces').NodeTree,
                    parentId: string,
                    id: string
                  ) => void;
                  add: (
                    nodeToAdd: Node | Node[],
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
                    selector: string | string[] | Node | Node[],
                    newParentId: string,
                    index: number
                  ) => void;
                  replaceNodes: (nodes: Record<string, Node>) => void;
                  clearEvents: () => void;
                  reset: () => void;
                  setOptions: (
                    cb: (
                      options: Partial<import('../interfaces').Options>
                    ) => void
                  ) => void;
                  setNodeEvent: (
                    eventType: import('../interfaces').NodeEventTypes,
                    nodeIdSelector: string | string[]
                  ) => void;
                  setCustom: (
                    selector: string | string[],
                    cb: (data: any) => void
                  ) => void;
                  setDOM: (id: string, dom: HTMLElement) => void;
                  setIndicator: (
                    indicator: import('../interfaces').Indicator
                  ) => void;
                  setHidden: (id: string, bool: boolean) => void;
                  setProp: (
                    selector: string | string[],
                    cb: (props: any) => void
                  ) => void;
                  selectNode: (nodeIdSelector?: string | string[]) => void;
                  setState: (
                    cb: (
                      state: import('../interfaces').EditorState,
                      actions: Pick<
                        {
                          addLinkedNodeFromTree: (
                            tree: import('../interfaces').NodeTree,
                            parentId: string,
                            id: string
                          ) => void;
                          add: (
                            nodeToAdd: Node | Node[],
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
                            selector: string | string[] | Node | Node[],
                            newParentId: string,
                            index: number
                          ) => void;
                          replaceNodes: (nodes: Record<string, Node>) => void;
                          clearEvents: () => void;
                          reset: () => void;
                          setOptions: (
                            cb: (
                              options: Partial<import('../interfaces').Options>
                            ) => void
                          ) => void;
                          setNodeEvent: (
                            eventType: import('../interfaces').NodeEventTypes,
                            nodeIdSelector: string | string[]
                          ) => void;
                          setCustom: (
                            selector: string | string[],
                            cb: (data: any) => void
                          ) => void;
                          setDOM: (id: string, dom: HTMLElement) => void;
                          setIndicator: (
                            indicator: import('../interfaces').Indicator
                          ) => void;
                          setHidden: (id: string, bool: boolean) => void;
                          setProp: (
                            selector: string | string[],
                            cb: (props: any) => void
                          ) => void;
                          selectNode: (
                            nodeIdSelector?: string | string[]
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
                                addLinkedNodeFromTree: (
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                  ) => void;
                },
                | 'addLinkedNodeFromTree'
                | 'add'
                | 'addNodeTree'
                | 'delete'
                | 'deserialize'
                | 'move'
                | 'replaceNodes'
                | 'reset'
                | 'setCustom'
                | 'setHidden'
                | 'setProp'
                | 'setState'
              >;
              merge: () => Pick<
                {
                  addLinkedNodeFromTree: (
                    tree: import('../interfaces').NodeTree,
                    parentId: string,
                    id: string
                  ) => void;
                  add: (
                    nodeToAdd: Node | Node[],
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
                    selector: string | string[] | Node | Node[],
                    newParentId: string,
                    index: number
                  ) => void;
                  replaceNodes: (nodes: Record<string, Node>) => void;
                  clearEvents: () => void;
                  reset: () => void;
                  setOptions: (
                    cb: (
                      options: Partial<import('../interfaces').Options>
                    ) => void
                  ) => void;
                  setNodeEvent: (
                    eventType: import('../interfaces').NodeEventTypes,
                    nodeIdSelector: string | string[]
                  ) => void;
                  setCustom: (
                    selector: string | string[],
                    cb: (data: any) => void
                  ) => void;
                  setDOM: (id: string, dom: HTMLElement) => void;
                  setIndicator: (
                    indicator: import('../interfaces').Indicator
                  ) => void;
                  setHidden: (id: string, bool: boolean) => void;
                  setProp: (
                    selector: string | string[],
                    cb: (props: any) => void
                  ) => void;
                  selectNode: (nodeIdSelector?: string | string[]) => void;
                  setState: (
                    cb: (
                      state: import('../interfaces').EditorState,
                      actions: Pick<
                        {
                          addLinkedNodeFromTree: (
                            tree: import('../interfaces').NodeTree,
                            parentId: string,
                            id: string
                          ) => void;
                          add: (
                            nodeToAdd: Node | Node[],
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
                            selector: string | string[] | Node | Node[],
                            newParentId: string,
                            index: number
                          ) => void;
                          replaceNodes: (nodes: Record<string, Node>) => void;
                          clearEvents: () => void;
                          reset: () => void;
                          setOptions: (
                            cb: (
                              options: Partial<import('../interfaces').Options>
                            ) => void
                          ) => void;
                          setNodeEvent: (
                            eventType: import('../interfaces').NodeEventTypes,
                            nodeIdSelector: string | string[]
                          ) => void;
                          setCustom: (
                            selector: string | string[],
                            cb: (data: any) => void
                          ) => void;
                          setDOM: (id: string, dom: HTMLElement) => void;
                          setIndicator: (
                            indicator: import('../interfaces').Indicator
                          ) => void;
                          setHidden: (id: string, bool: boolean) => void;
                          setProp: (
                            selector: string | string[],
                            cb: (props: any) => void
                          ) => void;
                          selectNode: (
                            nodeIdSelector?: string | string[]
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
                                addLinkedNodeFromTree: (
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                  ) => void;
                },
                | 'addLinkedNodeFromTree'
                | 'add'
                | 'addNodeTree'
                | 'delete'
                | 'deserialize'
                | 'move'
                | 'replaceNodes'
                | 'reset'
                | 'setCustom'
                | 'setHidden'
                | 'setProp'
                | 'setState'
              >;
              ignore: () => Pick<
                {
                  addLinkedNodeFromTree: (
                    tree: import('../interfaces').NodeTree,
                    parentId: string,
                    id: string
                  ) => void;
                  add: (
                    nodeToAdd: Node | Node[],
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
                    selector: string | string[] | Node | Node[],
                    newParentId: string,
                    index: number
                  ) => void;
                  replaceNodes: (nodes: Record<string, Node>) => void;
                  clearEvents: () => void;
                  reset: () => void;
                  setOptions: (
                    cb: (
                      options: Partial<import('../interfaces').Options>
                    ) => void
                  ) => void;
                  setNodeEvent: (
                    eventType: import('../interfaces').NodeEventTypes,
                    nodeIdSelector: string | string[]
                  ) => void;
                  setCustom: (
                    selector: string | string[],
                    cb: (data: any) => void
                  ) => void;
                  setDOM: (id: string, dom: HTMLElement) => void;
                  setIndicator: (
                    indicator: import('../interfaces').Indicator
                  ) => void;
                  setHidden: (id: string, bool: boolean) => void;
                  setProp: (
                    selector: string | string[],
                    cb: (props: any) => void
                  ) => void;
                  selectNode: (nodeIdSelector?: string | string[]) => void;
                  setState: (
                    cb: (
                      state: import('../interfaces').EditorState,
                      actions: Pick<
                        {
                          addLinkedNodeFromTree: (
                            tree: import('../interfaces').NodeTree,
                            parentId: string,
                            id: string
                          ) => void;
                          add: (
                            nodeToAdd: Node | Node[],
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
                            selector: string | string[] | Node | Node[],
                            newParentId: string,
                            index: number
                          ) => void;
                          replaceNodes: (nodes: Record<string, Node>) => void;
                          clearEvents: () => void;
                          reset: () => void;
                          setOptions: (
                            cb: (
                              options: Partial<import('../interfaces').Options>
                            ) => void
                          ) => void;
                          setNodeEvent: (
                            eventType: import('../interfaces').NodeEventTypes,
                            nodeIdSelector: string | string[]
                          ) => void;
                          setCustom: (
                            selector: string | string[],
                            cb: (data: any) => void
                          ) => void;
                          setDOM: (id: string, dom: HTMLElement) => void;
                          setIndicator: (
                            indicator: import('../interfaces').Indicator
                          ) => void;
                          setHidden: (id: string, bool: boolean) => void;
                          setProp: (
                            selector: string | string[],
                            cb: (props: any) => void
                          ) => void;
                          selectNode: (
                            nodeIdSelector?: string | string[]
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
                                addLinkedNodeFromTree: (
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                                  tree: import('../interfaces').NodeTree,
                                  parentId: string,
                                  id: string
                                ) => void;
                                add: (
                                  nodeToAdd: Node | Node[],
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
                                  selector: string | string[] | Node | Node[],
                                  newParentId: string,
                                  index: number
                                ) => void;
                                replaceNodes: (
                                  nodes: Record<string, Node>
                                ) => void;
                                clearEvents: () => void;
                                reset: () => void;
                                setOptions: (
                                  cb: (
                                    options: Partial<
                                      import('../interfaces').Options
                                    >
                                  ) => void
                                ) => void;
                                setNodeEvent: (
                                  eventType: import('../interfaces').NodeEventTypes,
                                  nodeIdSelector: string | string[]
                                ) => void;
                                setCustom: (
                                  selector: string | string[],
                                  cb: (data: any) => void
                                ) => void;
                                setDOM: (id: string, dom: HTMLElement) => void;
                                setIndicator: (
                                  indicator: import('../interfaces').Indicator
                                ) => void;
                                setHidden: (id: string, bool: boolean) => void;
                                setProp: (
                                  selector: string | string[],
                                  cb: (props: any) => void
                                ) => void;
                                selectNode: (
                                  nodeIdSelector?: string | string[]
                                ) => void;
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
                  ) => void;
                },
                | 'addLinkedNodeFromTree'
                | 'add'
                | 'addNodeTree'
                | 'delete'
                | 'deserialize'
                | 'move'
                | 'replaceNodes'
                | 'reset'
                | 'setCustom'
                | 'setHidden'
                | 'setProp'
                | 'setState'
              >;
            };
          };
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
            ) => import('../interfaces').Indicator;
            getOptions: () => import('../interfaces').Options;
            getNodes: () => Record<string, Node>;
            getSerializedNodes: () => Record<
              string,
              import('../interfaces').SerializedNode
            >;
            getEvent: (
              eventType: import('../interfaces').NodeEventTypes
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
            getState: () => import('../interfaces').EditorState;
          } & {
            history: {
              canUndo: () => boolean;
              canRedo: () => boolean;
            };
          };
        }
      >,
      'connectors' | 'actions' | 'query'
    >
> & {
  id: string;
  related: boolean;
  inNodeContext: boolean;
  actions: {
    setProp: (cb: any, throttleRate?: number) => void;
    setCustom: (cb: any, throttleRate?: number) => void;
    setHidden: (bool: boolean) => void;
  };
  connectors: import('@craftjs/utils').ChainableConnectors<
    {
      connect: (dom: HTMLElement) => HTMLElement;
      drag: (dom: HTMLElement) => HTMLElement;
    },
    | HTMLElement
    | import('react').ReactElement<
        any,
        | string
        | ((props: any) => import('react').ReactElement<any, any>)
        | (new (props: any) => import('react').Component<any, any, any>)
      >
  >;
};
