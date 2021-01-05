import { createBaseSlateState } from './fixtures';

import { removeInvalidNodes } from '../removeInvalidNodes';

let state;

const testSplitState = (state) => {
  return removeInvalidNodes(
    createBaseSlateState(state),
    'SLATE',
    ['Typography', 'List', 'ListItem'],
    'Text'
  );
};

describe('removeInvalidNodes', () => {
  it('should remove any element node without a Text node', () => {
    state = testSplitState([
      {
        id: 'T1',
        data: {
          type: 'Typography',
          nodes: [
            {
              id: 'TT1',
              data: {
                type: 'Text',
                props: {
                  text: 'Hello',
                },
              },
            },
          ],
        },
      },
      {
        id: 'T2',
        data: {
          type: 'Typography',
          nodes: [],
        },
      },
    ]);
    expect(state.nodes['SLATE'].data.nodes).toEqual(['T1']);
  });
  describe('nested', () => {
    beforeEach(() => {
      state = testSplitState([
        {
          id: 'L1',
          data: {
            type: 'List',
            nodes: [
              {
                id: 'LL1',
                data: {
                  type: 'ListItem',
                  nodes: [],
                },
              },
            ],
          },
        },
      ]);
    });
    it('should remove the entire Slate node', () => {
      expect(state.nodes['ROOT'].data.nodes).toEqual([]);
      expect(state.nodes['SLATE']).toEqual(undefined);
      expect(state.nodes['L1']).toEqual(undefined);
      expect(state.nodes['LL1']).toEqual(undefined);
    });
  });
});
