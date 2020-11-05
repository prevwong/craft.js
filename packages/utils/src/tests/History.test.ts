import { applyPatches } from 'immer';

import { History } from '../History';

jest.mock('immer');

describe('History Manager', () => {
  let history,
    dummyTimeline = [
      {
        patches: [{ op: 'add', path: '/node1', value: 32 }],
        inversePatches: [],
        state: { node1: 32 },
      },
      {
        patches: [{ op: 'add', path: '/node2', value: 55 }],
        inversePatches: [{ op: 'add', path: '/node1', value: 32 }],
        state: { node1: 32, node2: 55 },
      },
    ];

  describe('Adding patches to timeline', () => {
    beforeEach(() => {
      history = new History();
    });

    const { patches, inversePatches } = dummyTimeline[0];

    it('should add history to timeline', () => {
      history.add(patches, inversePatches);
      expect(history.timeline).toMatchObject([{ patches, inversePatches }]);
    });

    it('should ignore adding empty history to timeline', () => {
      history.add([], []);
      expect(history.timeline).toMatchObject([]);
    });
  });

  describe('Undo/Redo actions', () => {
    beforeAll(() => {
      history = new History();
      history.add(dummyTimeline[0].patches, dummyTimeline[0].inversePatches);
      history.add(dummyTimeline[1].patches, dummyTimeline[1].inversePatches);
    });

    it('should be able to undo', () => {
      const { state, inversePatches } = dummyTimeline[1];
      history.undo(state);
      expect(applyPatches).toHaveBeenCalledWith(state, inversePatches);
    });

    it('should be able to redo', () => {
      const { state } = dummyTimeline[0];
      const { patches } = dummyTimeline[1];
      history.redo(state);
      expect(applyPatches).toHaveBeenCalledWith(state, patches);
    });

    it('should prevent redo if a change occured after undo', () => {
      history.undo(dummyTimeline[1].state);
      history.add(
        [{ op: 'add', path: '/node1', value: 1000 }],
        dummyTimeline[0].patches
      );
      expect(history.canRedo()).toEqual(false);
    });
  });
});
