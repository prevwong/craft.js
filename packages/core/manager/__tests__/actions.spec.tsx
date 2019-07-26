import React from 'react';
import { transformJSXToNode } from "~packages/core/utils/transformJSX";
import { ROOT_NODE, ERROR_MOVE_NONCANVAS_CHILD, ERROR_MOVE_TO_DESCENDANT, ERROR_MOVE_INCOMING_PARENT, ERROR_MOVE_OUTGOING_PARENT, ERROR_MOVE_TO_NONCANVAS_PARENT, ERROR_INVALID_NODEID } from '~packages/core/utils/constants';
import { Canvas } from '~packages/core/nodes';
import { PlaceholderInfo } from '~packages/core/dnd/interfaces';
import { testActions } from '~packages/core/utils/testing/testActions';

describe('ManagerActions', () => {
  
  describe('add', () => {
    it('insert node(s)', () => {
      const [context, actions] = testActions();
      const node = transformJSXToNode(<h3>What</h3>, 'tn1');
      actions.add(node, ROOT_NODE);
      
      const nodes = [transformJSXToNode(<h3>What</h3>, 'tn2'), transformJSXToNode(<h3>Haha</h3>, 'tn3')];
      actions.add(nodes, ROOT_NODE);

      expect(Object.keys(context.manager.getState().current.nodes)).toEqual(expect.arrayContaining(['tn1', 'tn2', 'tn3']));
      expect(context.manager.getState().current.nodes[ROOT_NODE].data.nodes).toEqual(expect.arrayContaining(['tn1', 'tn2', 'tn3']));

    });
    it('insert at index', () => {
      const [context, actions] = testActions();
      const node1 = transformJSXToNode(<h3>What</h3>);
      const node2 = transformJSXToNode(<h3>What</h3>);
      const node3 = transformJSXToNode(<h3>What</h3>, 'tn3');
      actions.add([node1, node2], ROOT_NODE);

      actions.add({
        ...node3,
        index: 1
      }, ROOT_NODE);

      expect(context.manager.getState().current.nodes[ROOT_NODE].data.nodes[1]).toBe('tn3');
    });
    it('reject adding node to a non-Canvas node', () => {
      const [context, actions] = testActions();

      actions.add(transformJSXToNode(<div></div>, 'parent', {
       ref : {
          outgoing: (node) => node.id == 'child' ? false : true
       }
      }), ROOT_NODE);

      expect(() => actions.add(transformJSXToNode(<div></div>, 'child'), 'parent')).toThrowError();
    });
    it('reject orphaned non-root node', () => {
      const [_, actions] = testActions();
      const node = transformJSXToNode(<h3>What</h3>);
      expect(() => actions.add(node)).toThrowError();
    });
    it('rejects incompatible node', () => {
      const [_, actions] = testActions();
      
      actions.add(transformJSXToNode(<div></div>, 'rejectingContainer', {
        ref: {
          incoming: () => false
        }
      }), ROOT_NODE);

      const node = transformJSXToNode(<div></div>, 'tn4');
      expect(() => actions.add(node, 'rejectingContainer')).toThrow()
    });
  });

  describe('move', () => {
    it('successfully move node', () => {
      const [context, actions] = testActions();
      actions.add(transformJSXToNode(<Canvas />, 'parent'), ROOT_NODE);
      actions.add(transformJSXToNode(<h2 />, 'child1'), 'parent');
      actions.add(transformJSXToNode(<h2 />, 'child2'), 'parent');
      actions.add(transformJSXToNode(<h3 />, 'newChild'), ROOT_NODE);
      
      expect(() => actions.move('newChild', 'parent', 1)).not.toThrowError();
      expect(context.manager.getState().current.nodes['parent'].data.nodes).toEqual(expect.arrayContaining(['child1', 'newChild', 'child2']));
    })
    it('reject moving node that is not a direct child of a Canvas', () => {
      const [context, actions] = testActions();
      actions.add(transformJSXToNode(<Canvas />, 'parent'), ROOT_NODE);
      actions.add(transformJSXToNode(<div />, 'descandant'), 'parent');
      actions.add(transformJSXToNode(<Canvas />, 'child'), 'descandant');
      expect(() => actions.move('child', ROOT_NODE, 0)).toThrowError(ERROR_MOVE_NONCANVAS_CHILD);
    });
    it('reject moving node to a non-Canvas parent', () => {
      const [context, actions] = testActions();
      actions.add(transformJSXToNode(<div />, 'parent'), ROOT_NODE);
      actions.add(transformJSXToNode(<h3 />, 'child'), ROOT_NODE);
      expect(() => actions.move('child', 'parent', 0)).toThrowError(ERROR_MOVE_TO_NONCANVAS_PARENT);
    });
    it('reject moving node to it`s own descendant', () => {
      const [context, actions] = testActions();
      actions.add(transformJSXToNode(<Canvas />, 'parent'), ROOT_NODE);
      actions.add(transformJSXToNode(<div></div>, 'child'), 'parent');
      actions.add(transformJSXToNode(<Canvas />, 'childCanvas'), 'child');
      expect(() => actions.move('parent', 'childCanvas', 0)).toThrowError(ERROR_MOVE_TO_DESCENDANT);
    });
    it('reject moving node into incompatible parent', () => {
      const [context, actions] = testActions();
      actions.add(transformJSXToNode(<Canvas />, 'parent', {
        ref: {
          incoming: (node) => node.id == 'child' ? false : true
        }
      }), ROOT_NODE);

      actions.add(transformJSXToNode(<div></div>, 'child'), ROOT_NODE);
      expect(() => actions.move('child', 'parent', 0)).toThrowError(ERROR_MOVE_INCOMING_PARENT)
    });
    it('reject moving node out of disallowing-parent', () => {
      const [context, actions] = testActions();
      actions.add(transformJSXToNode(<Canvas />, 'parent', {
        ref: {
          outgoing: (node) => node.id == 'child' ? false : true
        }
      }), ROOT_NODE);
      
      actions.add(transformJSXToNode(<div></div>, 'child'), 'parent');
      expect(() => actions.move('child', ROOT_NODE, 0)).toThrowError(ERROR_MOVE_OUTGOING_PARENT)
    })
  });
  
  describe('setProp', () => {
    it('invalid node id', () => {
      const [context, actions] = testActions();
      expect(() => actions.setProp('child', (props: { text: string }) => { })).toThrowError(ERROR_INVALID_NODEID);
    });
    it('can update node prop', () => {
      const [context, actions] = testActions();
      const TestComponent: React.FC<{ text: string }> = ({ text }) => {
        return (
          <h3>{text}</h3>
        )
      }
      actions.add(transformJSXToNode(<TestComponent text="Text1" />, 'child'), ROOT_NODE);
      actions.setProp('child', (props: { text: string }) => {
        props.text = "hi"
      });

      expect(context.manager.getState().current.nodes['child'].data.props.text).toBe('hi');
    })
  });
  describe('setRef', () => {
    it('invalid node id', () => {
      const [context, actions] = testActions();
      expect(() => actions.setRef('child', (ref) => ref.dom = document.body)).toThrowError(ERROR_INVALID_NODEID);
    });
    it('can update node ref', () => {
      const [context, actions] = testActions();
      actions.add(transformJSXToNode(<h2 />, 'child'), ROOT_NODE);
      const refValues = {
        incoming: jest.fn(),
        outgoing: jest.fn(),
        canDrag: jest.fn(),
        dom: document.body
      }

      actions.setRef('child', (ref) => {
        ref.dom = refValues.dom
        ref.outgoing = refValues.outgoing;
        ref.incoming = refValues.incoming;
        ref.canDrag = refValues.canDrag
      });

      expect(context.manager.getState().current.nodes['child'].ref).toMatchObject(refValues);
    })
  });
  describe('setNodeEvent', () => {
    it('can update node event', () =>{
      const [context, actions] = testActions();
      actions.add(transformJSXToNode(<h2 />, 'child'), ROOT_NODE);
      actions.add(transformJSXToNode(<h2 />, 'child2'), ROOT_NODE);
      actions.setNodeEvent('active', 'child');
      expect(context.manager.getState().current.nodes['child'].event.active).toBeTruthy();

      actions.setNodeEvent('active', 'child2');
      expect(context.manager.getState().current.nodes['child'].event.active).toBeFalsy();
      expect(context.manager.getState().current.nodes['child2'].event.active).toBeTruthy();
    });
  });

  describe('setPlaceholder', () => {
    it('can set placeholder', () => {
      const [context, actions] = testActions();
      const {current} = context.manager.getState();
      actions.add(transformJSXToNode(<h2 />, 'child'), ROOT_NODE);
      actions.add(transformJSXToNode(<h2 />, 'child1'), ROOT_NODE);
      actions.setRef(ROOT_NODE, (ref) => {
        ref.dom = document.body;
      });
      actions.setRef('child', (ref) => {
        ref.dom = document.createElement('h1');
      });
      actions.setRef('child', (ref) => {
        ref.dom = document.createElement('h1');
      });
      const info: PlaceholderInfo = {
        placement: {
          index: 0,
          where: "before",
          parent: current.nodes[ROOT_NODE],
          currentNode: current.nodes['child']
        },
        error: null
      };
      actions.setPlaceholder(info);
      expect(context.manager.getState().current['events'].placeholder).toMatchObject(info);
    });
  });
});