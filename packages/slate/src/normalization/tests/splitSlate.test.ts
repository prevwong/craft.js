import { createTestNodes } from '@craftjs/core/src/utils/testHelpers';
import { splitSlate } from '../splitSlate';
import { createBaseSlateState } from './fixtures';

let state;

describe('splitSlate', () => {
  beforeEach(() => {});

  it('splitTest', () => {
    splitSlate(
      createBaseSlateState([
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
              {
                id: 'TT2',
                data: {
                  type: 'Text',
                  props: {
                    text: 'World',
                  },
                },
              },
            ],
          },
        },
      ]),
      'SlateEditor',
      ['Typography', 'Text']
    );
  });
});
