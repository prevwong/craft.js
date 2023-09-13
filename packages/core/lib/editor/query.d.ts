import React from 'react';
import {
  EditorState,
  Indicator,
  Node,
  Options,
  NodeEventTypes,
  NodeTree,
  SerializedNode,
  FreshNode,
} from '../interfaces';
export declare function QueryMethods(
  state: EditorState
): {
  /**
   * Determine the best possible location to drop the source Node relative to the target Node
   *
   * TODO: replace with Positioner.computeIndicator();
   */
  getDropPlaceholder: (
    source: string | string[] | Node | Node[],
    target: string,
    pos: {
      x: number;
      y: number;
    },
    nodesToDOM?: (node: Node) => HTMLElement
  ) => Indicator;
  /**
   * Get the current Editor options
   */
  getOptions(): Options;
  getNodes(): Record<string, Node>;
  /**
   * Helper methods to describe the specified Node
   * @param id
   */
  node(
    id: string
  ): {
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
    toSerializedNode(): SerializedNode;
    toNodeTree(
      includeOnly?: 'linkedNodes' | 'childNodes'
    ): {
      rootNodeId: string;
      nodes: any;
    };
    decendants(deep?: boolean): any;
    isTopLevelCanvas(): boolean;
  };
  /**
   * Returns all the `nodes` in a serialized format
   */
  getSerializedNodes(): Record<string, SerializedNode>;
  getEvent(
    eventType: NodeEventTypes
  ): {
    contains(id: string): boolean;
    isEmpty(): boolean;
    first(): any;
    last(): any;
    all(): string[];
    size(): any;
    at(i: number): any;
    raw(): Set<string>;
  };
  /**
   * Retrieve the JSON representation of the editor's Nodes
   */
  serialize(): string;
  parseReactElement: (
    reactElement: React.ReactElement<
      any,
      | string
      | ((props: any) => React.ReactElement<any, any>)
      | (new (props: any) => React.Component<any, any, any>)
    >
  ) => {
    toNodeTree(
      normalize?: (
        node: Node,
        jsx: React.ReactElement<
          any,
          | string
          | ((props: any) => React.ReactElement<any, any>)
          | (new (props: any) => React.Component<any, any, any>)
        >
      ) => void
    ): NodeTree;
  };
  parseSerializedNode: (
    serializedNode: SerializedNode
  ) => {
    toNode(normalize?: (node: Node) => void): Node;
  };
  parseFreshNode: (
    node: FreshNode
  ) => {
    toNode(normalize?: (node: Node) => void): Node;
  };
  createNode(
    reactElement: React.ReactElement<
      any,
      | string
      | ((props: any) => React.ReactElement<any, any>)
      | (new (props: any) => React.Component<any, any, any>)
    >,
    extras?: any
  ): any;
  getState(): EditorState;
};
