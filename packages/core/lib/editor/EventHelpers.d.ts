import { EditorState, NodeEventTypes } from '../interfaces';
export declare function EventHelpers(
  state: EditorState,
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
