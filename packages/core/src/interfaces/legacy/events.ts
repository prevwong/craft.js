import { LegacyNode } from './nodes';

import { DropPosition, Indicator, Placement } from '../events';

export interface LegacyDropPosition extends DropPosition {
  /**
   * @deprecated
   */
  parent: LegacyNode;
}

export interface LegacyPlacement extends LegacyDropPosition, Placement {
  /**
   * @deprecated
   */
  currentNode: LegacyNode | null;
}

export interface LegacyIndicator extends Indicator {
  placement: LegacyPlacement;
}
