import { LegacyNode } from '..';
import { DropAction, Indicator, Placement } from '../events';

export interface LegacyDropAction extends DropAction {
  parent: LegacyNode;
}

export interface LegacyPlacement extends LegacyDropAction, Placement {
  currentNode: LegacyNode | null;
}

export interface LegacyIndicator extends Indicator {
  placement: LegacyPlacement;
}
