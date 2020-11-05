import React from 'react';

import { useInternalEditor } from '../../editor/useInternalEditor';
import { useEditor } from '../useEditor';

jest.mock('../../editor/useInternalEditor');
const internalEditorMock = useInternalEditor as jest.Mock<any>;

describe('useEditor', () => {
  const otherActions = { one: 'one' };
  const actions = {
    setDOM: 'setDOM',
    setNodeEvent: 'setNodeEvent',
    replaceNodes: 'replaceNodes',
    reset: 'reset',
    ...otherActions,
  };
  const otherQueries = { another: 'query' };
  const query = { deserialize: 'deserialize', ...otherQueries };
  const state = {
    aRandomValue: 'aRandomValue',
    connectors: 'one',
    actions,
    query,
    store: {},
  };
  let collect;
  let editor;

  beforeEach(() => {
    React.useMemo = (f) => f();

    internalEditorMock.mockImplementation(() => state);
    collect = jest.fn();
    editor = useEditor(collect);
  });
  it('should have called internal state with collect', () => {
    expect(useInternalEditor).toHaveBeenCalledWith(collect);
  });
  it('should return the correct editor', () => {
    expect(editor).toEqual(
      expect.objectContaining({
        actions: {
          ...otherActions,
          history: expect.any(Object),
        },
        connectors: state.connectors,
        query: otherQueries,
        aRandomValue: state.aRandomValue,
      })
    );
  });
});
