import React from 'react';
import { transformJSXToNode } from '~packages/core/utils/transformJSX';
import { ROOT_NODE, ERRROR_NOT_IN_RESOLVER, ERROR_MOVE_TO_NONCANVAS_PARENT, ERROR_MOVE_INCOMING_PARENT, ERROR_MOVE_NONCANVAS_CHILD, ERROR_MOVE_TO_DESCENDANT, ERROR_MOVE_OUTGOING_PARENT, ERROR_DUPLICATE_NODEID, ERROR_NOPARENT } from '~packages/shared/constants';
import { createRootContext } from '~packages/core/root/RootContext';
import { Canvas } from '~packages/core/nodes';

describe('ManagerQuery', () => {
  describe('getNode', () => {
    it('can get node', () => {
      const {query, actions} = createRootContext();
      const node = transformJSXToNode(<h2 />, {id: 't1'});
      actions.add(node, ROOT_NODE);
      expect(query.getNode('t1')).toMatchObject(node);
    })
  });
  describe('transformJSXToNode', () => {
    it('can transform simple JSX', () => {
      const {query} = createRootContext();
      expect(() => query.transformJSXToNode(<h2 />)).not.toThrowError(ERRROR_NOT_IN_RESOLVER);
    })
    it('can transform component JSX', () => {
      const TestComponent = () => {
        return (
          <h2>Hi</h2>
        )
      }
      const {query} = createRootContext({
        options: {
          resolver: {
            TestComponent
          }
        }
      });
      expect(() => query.transformJSXToNode(<TestComponent />)).not.toThrowError(ERRROR_NOT_IN_RESOLVER);
    });
  });

  const TestComponent = () => (<div></div>)

  const {actions, query} = createRootContext();
  actions.add(transformJSXToNode(<Canvas />, { id: 't1', ref: {incoming: (node) => node.id !== 'toReject' } }), ROOT_NODE);
  actions.add(transformJSXToNode(<h2 />, { id: 't1c1' }), 't1');
  actions.add(transformJSXToNode(<h2 />, { id: 't1c2' }), 't1');
  actions.add(transformJSXToNode(<Canvas />, { id: 't2' }), 't1');
  actions.add(transformJSXToNode(<h2 />, { id: 't2c1' }), 't2');
  actions.add(transformJSXToNode(<TestComponent />, { id: 't3' }), 't2');
  actions.add(transformJSXToNode(<Canvas id="Canvas" />, { id: 't3_canvas', ref: { outgoing: (node) => node.id !== 't3_canvas_c1'} }), 't3');
  actions.add(transformJSXToNode(<h2 />, { id: 't3_canvas_c1' }), 't3_canvas');
  actions.add(transformJSXToNode(<Canvas />, { id: 't3_canvas_c2' }), 't3_canvas');
  actions.add(transformJSXToNode(<h2 />, { id: 't3_canvas_c2_c1' }), 't3_canvas_c2');

  describe('getDeepNodes', () => {
    it('returns node ids for all descendants', () => {
      expect(query.getDeepNodes(ROOT_NODE)).toMatchObject(['t1', 't1c1', 't1c2', 't2', 't2c1', 't3', 't3_canvas', 't3_canvas_c1', 't3_canvas_c2', 't3_canvas_c2_c1'])
    });
  });

  describe('getAllParents', () => {
    it('returns node ids for all ancestors', () => {
      expect(query.getAllParents('t3_canvas_c2_c1')).toMatchObject(['t3_canvas_c2', 't3_canvas', 't3', 't2', 't1', ROOT_NODE])
    });
  });

  describe('getAllCanvas', () => {
    it('returns node ids for all descendants that are canvas nodes', () => {
      expect(query.getAllCanvas('t3')).toMatchObject(['t3_canvas', 't3_canvas_c2'])
    });
  });

  describe('canDropInParent', () => {
    it('reject adding node with duplicated id', () => {
      const newNode = transformJSXToNode(<h2 />, {
        id: 't1c1'
      });
      expect(() => query.canDropInParent(newNode, 't1')).toThrowError(ERROR_DUPLICATE_NODEID);
    });
    it('reject adding non root-node without parent', () => {
      const newNode = transformJSXToNode(<h2 />, {
        id: 'newnode'
      });
      expect(() => query.canDropInParent(newNode)).toThrowError(ERROR_NOPARENT);
    });
    it('reject add/move to non-canvas parent', () => {
      const newNode = transformJSXToNode(<h2 />, {
        id: 'test'
      });
      expect(() => query.canDropInParent(newNode, 't1c1')).toThrowError(ERROR_MOVE_TO_NONCANVAS_PARENT);
    });
    it('reject add/move to rejecting parent', () => {
      const newNode = transformJSXToNode(<h2 />, {
        id: 'toReject'
      });
      expect(() => query.canDropInParent(newNode, 't1')).toThrowError(ERROR_MOVE_INCOMING_PARENT);
    });
    it('reject move node out of disallowing-parent', () => {
      expect(() => query.canDropInParent('t3_canvas_c1', 't1')).toThrowError(ERROR_MOVE_OUTGOING_PARENT);
    });
    it('reject move non-canvas node', () => {
      expect(() => query.canDropInParent('t3_canvas', 't1')).toThrowError(ERROR_MOVE_NONCANVAS_CHILD);
    });
    it('reject move to a descendant node', () => {
      expect(() => query.canDropInParent('t2', 't3_canvas')).toThrowError(ERROR_MOVE_TO_DESCENDANT);
    });
  });
  describe('serialize', () => {
    it('shouldnt throw error', () => {
      expect(() => query.serialize()).not.toThrowError();
    })
  });
  describe('deserialize', () => {
    it('shouldnt throw error', () => {
      expect(() => query.deserialize(JSON.stringify(query.serialize()))).not.toThrowError()
    });
  });
  describe('getDropPlaceholder', () => {

  });
});
