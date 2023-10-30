import { Node, NodeSelectorWrapper } from '../interfaces';
declare type config = {
  existOnly: boolean;
  idOnly: boolean;
};
export declare const getNodesFromSelector: (
  nodes: Record<string, Node>,
  selector: string | Node | string[] | Node[],
  config?: Partial<config>,
  source?: string
) => NodeSelectorWrapper[];
export {};
