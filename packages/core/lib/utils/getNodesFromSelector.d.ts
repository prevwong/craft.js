import { Node, NodeSelectorWrapper } from '../interfaces';
declare type config = {
  existOnly: boolean;
  idOnly: boolean;
};
export declare const getNodesFromSelector: (
  nodes: Record<string, Node>,
  selector: string | string[] | Node | Node[],
  config?: Partial<config>
) => NodeSelectorWrapper[];
export {};
