import { LegacyNode } from './nodes';

import { DropAction, Indicator, Placement } from '../events';

export interface LegacyDropAction extends DropAction {
  /**
   * @deprecated
   */
  parent: LegacyNode;
}

export interface LegacyPlacement extends LegacyDropAction, Placement {
  /**
   * @deprecated
   */
  currentNode: LegacyNode | null;
}

export interface LegacyIndicator extends Indicator {
  placement: LegacyPlacement;
}
