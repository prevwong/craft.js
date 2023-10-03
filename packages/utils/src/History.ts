import { Patch, applyPatches } from 'immer';

type Timeline = Array<{
  patches: Patch[];
  inversePatches: Patch[];
  timestamp: number;
}>;

export enum HISTORY_OPERATION {
  UNDO = 'HISTORY_UNDO',
  REDO = 'HISTORY_REDO',
  CLEAR = 'HISTORY_CLEAR',
  ADD = 'HISTORY_ADD',
}

export type HistoryListener = (op: HISTORY_OPERATION) => void;

export type HistoryMergeOpts = {
  ignoreIfNoPreviousRecords: boolean;
};

export class History {
  timeline: Timeline = [];
  pointer = -1;

  listeners: Set<HistoryListener> = new Set();

  add(patches: Patch[], inversePatches: Patch[]) {
    if (patches.length === 0 && inversePatches.length === 0) {
      return;
    }

    this.pointer = this.pointer + 1;
    this.timeline.length = this.pointer;
    this.timeline[this.pointer] = {
      patches,
      inversePatches,
      timestamp: Date.now(),
    };

    this.notify(HISTORY_OPERATION.ADD);
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

  merge(
    patches: Patch[],
    inversePatches: Patch[],
    opts?: Partial<HistoryMergeOpts>
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

      this.timeline[this.pointer] = {
        timestamp,
        patches: [...currPatches, ...patches],
        inversePatches: [...inversePatches, ...currInversePatches],
      };
      return;
    }

    // There's no previous history records in the timeline, and therefore nothing to merge with
    // If ignoreIfNoPreviousRecords=true, then we will simply discard the current changes from the timeline
    if (opts && opts.ignoreIfNoPreviousRecords) {
      return;
    }

    this.add(patches, inversePatches);
  }

  clear() {
    this.timeline = [];
    this.pointer = -1;

    this.notify(HISTORY_OPERATION.CLEAR);
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
    this.pointer = this.pointer - 1;

    this.notify(HISTORY_OPERATION.UNDO);

    return applyPatches(state, inversePatches);
  }

  redo(state) {
    if (!this.canRedo()) {
      return;
    }

    this.pointer = this.pointer + 1;
    const { patches } = this.timeline[this.pointer];

    this.notify(HISTORY_OPERATION.REDO);

    return applyPatches(state, patches);
  }

  listen(listener: HistoryListener) {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  private notify(op: HISTORY_OPERATION) {
    this.listeners.forEach((listener) => listener(op));
  }
}
