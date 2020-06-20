import cloneDeep from 'lodash/cloneDeep';
import mapValues from 'lodash/mapValues';
import * as actions from '../actions';
import { produce } from 'immer';
import { QueryMethods } from '../../editor/query';
import {
  card,
  documentState,
  documentWithButtonsState,
  documentWithCardState,
  documentWithLeafState,
  emptyState,
  leafNode,
  primaryButton,
  rootNode,
  secondaryButton,
} from '../../tests/fixtures';
import { EditorState } from '@craftjs/core';

const Actions = (state) => (cb) =>
  produce<EditorState>(state, (draft) =>
    cb(actions.Actions(draft as any, QueryMethods(state)))
  );

describe('actions.add', () => {
  it('should throw if we give a parentId that doesnt exist', () => {
    expect(() =>
      Actions(emptyState)((actions) => actions.add(leafNode))
    ).toThrow();
  });
  it('should throw if we create a node that doesnt have a parent and we dont provide a parent ', () => {
    expect(() =>
      Actions(emptyState)((actions) => actions.add(rootNode, rootNode.id))
    ).toThrow();
  });
  it('should be able to add leaf to the document', () => {
    const newState = Actions(documentState)((actions) =>
      actions.add(leafNode, rootNode.id)
    );

    expect(newState).toEqual(documentWithLeafState);
  });
  it('should be able to add two nodes', () => {
    const newState = Actions(documentState)((actions) =>
      actions.add([primaryButton, secondaryButton], rootNode.id)
    );

    expect(newState).toEqual(documentWithButtonsState);
  });
});

describe('actions.addNodeAtIndex', () => {
  it('should throw if we give a parentId that doesnt exist', () => {
    expect(() =>
      Actions(emptyState)((actions) => actions.addNodeAtIndex(leafNode))
    ).toThrow();
  });
  it('should throw if we give an invalid index', () => {
    const state = Actions(documentState);
    expect(() =>
      state((actions) => actions.addNodeAtIndex(leafNode, rootNode.id, -1))
    ).toThrow();
    expect(() =>
      state((actions) => actions.addNodeAtIndex(leafNode, rootNode.id, 1))
    ).toThrow();
  });
  it('should be able to add the node at 0', () => {
    const newState = Actions(documentState)((actions) =>
      actions.add(leafNode, rootNode.id, 0)
    );
    expect(newState).toEqual(documentWithLeafState);
  });
});

describe('actions.addNodeTree', () => {
  it('should throw if we give a parentId that doesnt exist', () => {
    expect(() =>
      Actions(emptyState)((actions) => actions.addTreeAtIndex(leafNode))
    ).toThrow();
  });
  it('should throw if we give an invalid index', () => {
    const state = Actions(documentState);
    expect(() =>
      state((actions) => actions.addNodeTree(leafNode, rootNode.id, -1))
    ).toThrow();
    expect(() =>
      state((actions) => actions.addNodeTree(leafNode, rootNode.id, 1))
    ).toThrow();
  });
  it('should be able to add a single node at 0', () => {
    const tree = {
      rootNodeId: leafNode.id,
      nodes: { [leafNode.id]: leafNode },
    };
    const newState = Actions(documentState)((actions) =>
      actions.addNodeTree(tree, rootNode.id, 0)
    );
    expect(newState).toEqual(documentWithLeafState);
  });
  it('should be able to add a larger tree', () => {
    const tree = {
      rootNodeId: card.id,
      nodes: cloneDeep(documentWithCardState.nodes),
    };
    const newState = Actions(documentState)((actions) =>
      actions.addNodeTree(tree, rootNode.id, 0)
    );
    expect(newState).toEqual(documentWithCardState);
  });
});

describe('actions.delete', () => {
  it('should throw if you try to a non existing node', () => {
    expect(() => Actions(emptyState)((actions) => actions.delete(leafNode.id)));
  });
  it('should throw if you try to delete the root', () => {
    expect(() => Actions(documentState)((actions) => actions.add(rootNode.id)));
  });
  it('should be able to delete leaf from the document', () => {
    const newState = Actions(documentWithLeafState)((actions) =>
      actions.delete(leafNode.id)
    );

    expect(newState).toEqual(documentState);
  });
  it('should be able to delete a card', () => {
    const newState = Actions(documentWithCardState)((actions) =>
      actions.delete(card.id)
    );

    expect(newState).toEqual(documentState);
  });
});

describe('actions.clearEvents', () => {
  const newEvents = { ...emptyState.events };
  it('should be able to reset the events', () => {
    const newState = Actions(emptyState)((actions) => actions.clearEvents());

    expect(newState).toEqual({ ...emptyState, events: newEvents });
  });
});

describe('actions.replaceNodes', () => {
  it('should be able to replace the nodes', () => {
    const newState = Actions(emptyState)((actions) =>
      actions.replaceNodes(documentState.nodes)
    );

    expect(newState).toEqual(documentState);
  });
});

describe('actions.reset', () => {
  it('should reset the entire state', () => {
    const newState = Actions(documentState)((actions) => actions.reset());

    expect(newState).toEqual(emptyState);
  });
});

describe('actions.deserialize', () => {
  const serialized = mapValues(documentState.nodes, ({ data }) => ({
    ...data,
  }));

  it('should be able to set the state correctly', () => {
    const newState = Actions(emptyState)((actions) =>
      actions.deserialize(serialized)
    );

    const node = {
      ...rootNode,
      rules: expect.anything(),
      _hydrationTimestamp: expect.anything(),
    };

    expect(newState.nodes['ROOT']).toEqual(node);
  });
});
