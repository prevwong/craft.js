import { Patch, applyPatches } from 'immer';
import isEqualWith from 'lodash.isequalwith';

type Event = {
  id: string;
  payload: any;
};

type Timeline = Array<{
  patches: Patch[];
  inversePatches: Patch[];
  event?: Event;
  timestamp: number;
}>;

export const HISTORY_ACTIONS = {
  UNDO: 'HISTORY_UNDO',
  REDO: 'HISTORY_REDO',
  WITH_EVENT: 'WITH_EVENT',
  THROTTLE: 'HISTORY_THROTTLE',
  IGNORE: 'HISTORY_IGNORE',
};

export class History {
  timeline: Timeline = [];
  operations: any = [];
  pointer = -1;

  isUndo: boolean = false;
  isRedo: boolean = false;

  add(patches: Patch[], inversePatches: Patch[], event?: Event) {
    if (patches.length === 0 && inversePatches.length === 0) {
      return;
    }

    this.pointer = this.pointer + 1;
    this.isUndo = false;
    this.isRedo = false;
    this.timeline.length = this.pointer;
    this.timeline[this.pointer] = {
      patches,
      inversePatches,
      event,
      timestamp: Date.now(),
    };

    this.operations = this.timeline[this.pointer].patches;
  }

  throttleAdd(
    patches: Patch[],
    inversePatches: Patch[],
    throttleRate: number = 500
  ) {
    if (patches.length === 0 && inversePatches.length === 0) {
      return;
    }

    if (this.timeline.length && this.pointer >= 0) {
      const {
        patches: currPatches,
        inversePatches: currInversePatches,
        timestamp,
      } = this.timeline[this.pointer];

      const now = new Date();
      const diff = now.getTime() - timestamp;

      if (diff < throttleRate) {
        this.timeline[this.pointer] = {
          timestamp,
          patches: [...currPatches, ...patches],
          inversePatches: [...inversePatches, ...currInversePatches],
        };
        return;
      }
    }

    this.add(patches, inversePatches);
  }

  canUndo() {
    return this.pointer >= 0;
  }

  canRedo() {
    return this.pointer < this.timeline.length - 1;
  }

  undo(state) {
    if (!this.canUndo()) {
      return;
    }

    const { inversePatches } = this.timeline[this.pointer];
    this.operations = inversePatches;
    this.pointer = this.pointer - 1;
    this.isUndo = true;
    this.isRedo = false;

    return applyPatches(state, inversePatches);
  }

  redo(state) {
    if (!this.canRedo()) {
      return;
    }

    this.pointer = this.pointer + 1;
    this.isUndo = false;
    this.isRedo = true;

    const { patches } = this.timeline[this.pointer];
    this.operations = patches;

    return applyPatches(state, patches);
  }

  // Get current history record that has just been performed
  // TODO: Find a better name
  getTimeline() {
    let isUndo = this.isUndo;
    let isRedo = this.isRedo;
    let isCurrent = !isUndo && !isRedo;
    let pointer = this.pointer;

    return {
      ...this.timeline[pointer + (isUndo ? 1 : 0)],
      isCurrent,
      isUndo,
      isRedo,
    };
  }
}
