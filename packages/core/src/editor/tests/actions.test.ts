import mapValues from 'lodash/mapValues';

import { QueryMethods } from '../../editor/query';
import { EditorState } from '../../interfaces';
import { createNode } from '../../utils/createNode';
import {
  createTestState,
  createTestNodes,
  expectEditorState,
} from '../../utils/testHelpers';
import { ActionMethods } from '../actions';

// TODO: create a cleaner way to test Action methods
const Actions = (state: EditorState) => (cb) => {
  const methods = ActionMethods(state, QueryMethods(state) as any);
  cb(methods);
  return state;
};

describe('actions.add', () => {
  let state, rootNode;
  beforeEach(() => {
    rootNode = {
      id: 'node-root',
      data: {
        type: 'div',
      },
    };

    state = createTestState({
      nodes: rootNode,
    });
  });
  it('should throw if we give a parentId that doesnt exist', () => {
    expect(() =>
      Actions(createTestState())((actions) =>
        actions.add(
          createNode({
            id: 'node-test',
            data: {
              type: 'span',
            },
          })
        )
      )
    ).toThrow();
  });
  it('should throw if we create a node that doesnt have a parent and we dont provide a parent ', () => {
    expect(() =>
      Actions(createTestState())((actions) =>
        actions.add(rootNode, rootNode.id)
      )
    ).toThrow();
  });
  it('should be able to add leaf to the document', () => {
    const node = createNode({
      id: 'node-btn',
      data: {
        type: 'button',
      },
    });

    const newState = Actions(state)((actions) =>
      actions.add(node, rootNode.id)
    );

    rootNode.data.nodes = [node];

    expectEditorState(
      newState,
      createTestState({
        nodes: rootNode,
      })
    );
  });
  it('should be able to add two nodes', () => {
    const primaryButton = createNode({
      id: 'primary-button',
      data: {
        type: 'button',
      },
    });

    const secondaryButton = createNode({
      id: 'secondary-button',
      data: {
        type: 'button',
      },
    });

    const newState = Actions(state)((actions) =>
      actions.add([primaryButton, secondaryButton], rootNode.id)
    );

    rootNode.data.nodes = [primaryButton, secondaryButton];

    expectEditorState(
      newState,
      createTestState({
        nodes: rootNode,
      })
    );
  });
});

describe('actions.addNodeTree', () => {
  let state, rootNode;

  beforeEach(() => {
    rootNode = {
      id: 'node-root',
      data: {
        type: 'div',
      },
    };

    state = createTestState({
      nodes: rootNode,
    });
  });

  it('should be able to add a single node at 0', () => {
    const node = createNode({
      data: {
        type: 'button',
      },
    });

    const newState = Actions(state)((actions) =>
      actions.addNodeTree(
        {
          rootNodeId: node.id,
          nodes: { [node.id]: node },
        },
        rootNode.id
      )
    );

    rootNode.data.nodes = [node];

    expectEditorState(
      newState,
      createTestState({
        nodes: rootNode,
      })
    );
  });
  it('should be able to add a larger tree', () => {
    const card = {
      id: 'card',
      data: {
        type: 'section',
        nodes: [
          {
            id: 'card-child',
            data: {
              type: 'h1',
            },
          },
        ],
      },
    };

    const newState = Actions(state)((actions) =>
      actions.addNodeTree(
        {
          rootNodeId: 'card',
          nodes: createTestNodes(card),
        },
        rootNode.id
      )
    );

    rootNode.data.nodes = [card];

    expectEditorState(
      newState,
      createTestState({
        nodes: rootNode,
      })
    );
  });
});

describe('actions.delete', () => {
  let state, rootNode;

  beforeEach(() => {
    rootNode = {
      id: 'node-root',
      data: {
        type: 'div',
      },
    };

    state = createTestState({
      nodes: rootNode,
    });
  });

  it('should throw if you try to a non existing node', () => {
    expect(() =>
      Actions(createTestState())((actions) => actions.delete(rootNode.id))
    ).toThrow();
  });
  it('should throw if you try to delete the root', () => {
    expect(() =>
      Actions(state)((actions) => actions.add(rootNode.id))
    ).toThrow();
  });
  it('should be able to delete node', () => {
    const node = {
      id: 'node-test',
      data: {
        type: 'button',
      },
    };
    const state = createTestState({
      nodes: {
        ...rootNode,
        data: {
          ...rootNode.data,
          nodes: [node],
        },
      },
    });

    const newState = Actions(state)((actions) => actions.delete(node.id));

    expectEditorState(
      newState,
      createTestState({
        nodes: rootNode,
      })
    );
  });
  it('should be able to delete nodes with children', () => {
    const card = {
      id: 'card',
      data: {
        type: 'div',
        nodes: [
          {
            id: 'card-child',
            data: {
              type: 'h1',
            },
          },
        ],
      },
    };

    const state = createTestState({
      nodes: {
        ...rootNode,
        data: {
          ...rootNode.data,
          nodes: [card],
        },
      },
    });

    const newState = Actions(state)((actions) => actions.delete(card.id));

    expectEditorState(
      newState,
      createTestState({
        nodes: rootNode,
      })
    );
  });
});

describe('actions.clearEvents', () => {
  it('should be able to reset the events', () => {
    const nodes = {
      id: 'node-a',
      data: {
        type: 'div',
        nodes: [
          {
            id: 'node-b',
            data: {
              type: 'span',
            },
          },
        ],
      },
    };

    const state = createTestState({
      nodes,
      events: {
        selected: 'node-a',
        hovered: 'node-b',
      },
    });

    const newState = Actions(state)((actions) => actions.clearEvents());

    expectEditorState(
      newState,
      createTestState({
        nodes,
      })
    );
  });
});

describe('actions.replaceNodes', () => {
  it('should be able to replace the nodes', () => {
    const newNodes = {
      id: 'Test',
      data: {
        type: 'div',
        nodes: [
          {
            id: 'node-btn',
            data: {
              type: 'button',
            },
          },
        ],
      },
    };

    const newState = Actions(createTestState())((actions) =>
      actions.replaceNodes(createTestNodes(newNodes))
    );

    expectEditorState(newState, createTestState({ nodes: newNodes }));
  });
});

describe('actions.reset', () => {
  it('should reset the entire state', () => {
    const state = createTestState({
      nodes: {
        id: 'node',
        data: {
          type: 'div',
          linkedNodes: {
            header: {
              id: 'node-header',
              data: {
                type: 'section',
              },
            },
          },
        },
      },
      events: {
        selected: 'node-header',
      },
    });

    const newState = Actions(state)((actions) => actions.reset());

    expectEditorState(newState, createTestState());
  });
});

describe('actions.deserialize', () => {
  it('should be able to set the state correctly', () => {
    const nodes = {
      id: 'node-root',
      data: {
        type: 'h1',
        nodes: [
          {
            id: 'btn',
            data: {
              type: 'button',
            },
          },
          {
            id: 'container',
            data: {
              type: 'div',
              linkedNodes: {
                header: {
                  id: 'header',
                  data: {
                    type: 'div',
                  },
                },
              },
            },
          },
        ],
      },
    };

    const serialized = mapValues(createTestNodes(nodes), ({ data }) => ({
      ...data,
    }));

    const newState = Actions(createTestState())((actions) =>
      actions.deserialize(serialized)
    );

    expectEditorState(
      newState,
      createTestState({
        nodes,
      })
    );
  });
});

describe('actions.move', () => {
  let state;
  beforeEach(() => {
    state = createTestState({
      nodes: {
        id: 'root',
        data: {
          type: 'div',
          isCanvas: true,
          nodes: [
            {
              id: 'node-a',
              data: {
                type: 'button',
              },
            },
            {
              id: 'node-b',
              data: {
                type: 'div',
                isCanvas: true,
                nodes: [
                  {
                    id: 'node-c',
                    data: {
                      type: 'button',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });
  });
  it('should be able to move node', () => {
    const newState = Actions(state)((actions) =>
      actions.move('node-c', 'root', 2)
    );

    expectEditorState(
      newState,
      createTestState({
        nodes: {
          id: 'root',
          data: {
            type: 'div',
            isCanvas: true,
            nodes: [
              {
                id: 'node-a',
                data: {
                  type: 'button',
                },
              },
              {
                id: 'node-b',
                data: {
                  type: 'div',
                  isCanvas: true,
                },
              },
              {
                id: 'node-c',
                data: {
                  type: 'button',
                },
              },
            ],
          },
        },
      })
    );
  });
});

describe('actions.setOptions', () => {
  it('should be able to change options state', () => {
    const state = createTestState();
    const newState = Actions(state)((actions) =>
      actions.setOptions((options) => {
        options.enabled = false;
      })
    );

    expectEditorState(
      newState,
      createTestState({
        options: {
          ...state.options,
          enabled: false,
        },
      })
    );
  });
});

describe('actions.setNodeEvent', () => {
  let state, nodeA;
  beforeEach(() => {
    nodeA = {
      id: 'node-a',
      data: {
        type: 'button',
      },
    };

    state = createTestState({
      nodes: {
        id: 'root',
        data: {
          type: 'div',
          nodes: [nodeA],
        },
      },
    });
  });

  it('should be able to change events state', () => {
    const newState = Actions(state)((actions) =>
      actions.setNodeEvent('selected', 'node-a')
    );

    nodeA.events = {
      selected: true,
    };

    expectEditorState(
      newState,
      createTestState({
        nodes: {
          id: 'root',
          data: {
            type: 'div',
            nodes: [nodeA],
          },
        },
        events: {
          selected: 'node-a',
        },
      })
    );
  });
});

describe('actions.setProp', () => {
  let state, nodeA;
  beforeEach(() => {
    nodeA = {
      id: 'node-a',
      data: {
        type: 'button',
        props: {
          color: '#fff',
        },
      },
    };

    state = createTestState({
      nodes: {
        id: 'root',
        data: {
          type: 'div',
          nodes: [nodeA],
        },
      },
    });
  });

  it('should update props', () => {
    const newState = Actions(state)((actions) =>
      actions.setProp('node-a', (props) => (props.color = '#000'))
    );

    nodeA.data.props.color = '#000';

    expectEditorState(
      newState,
      createTestState({
        nodes: {
          id: 'root',
          data: {
            type: 'div',
            nodes: [nodeA],
          },
        },
      })
    );
  });
});

describe('actions.setCustom', () => {
  let state, nodeA;
  beforeEach(() => {
    nodeA = {
      id: 'node-a',
      data: {
        type: 'button',
        custom: {
          css: {
            color: '#fff',
          },
        },
      },
    };

    state = createTestState({
      nodes: {
        id: 'root',
        data: {
          type: 'div',
          nodes: [nodeA],
        },
      },
    });
  });

  it('should update custom properties', () => {
    const newState = Actions(state)((actions) =>
      actions.setCustom('node-a', (custom) => (custom.css.color = '#000'))
    );

    nodeA.data.custom.css.color = '#000';

    expectEditorState(
      newState,
      createTestState({
        nodes: {
          id: 'root',
          data: {
            type: 'div',
            nodes: [nodeA],
          },
        },
      })
    );
  });
});

describe('actions.setHidden', () => {
  let state, nodeA;
  beforeEach(() => {
    nodeA = {
      id: 'node-a',
      data: {
        type: 'button',
      },
    };

    state = createTestState({
      nodes: {
        id: 'root',
        data: {
          type: 'div',
          nodes: [nodeA],
        },
      },
    });
  });

  it('should hide node', () => {
    const newState = Actions(state)((actions) =>
      actions.setHidden('node-a', true)
    );

    nodeA.data.hidden = true;

    expectEditorState(
      newState,
      createTestState({
        nodes: {
          id: 'root',
          data: {
            type: 'div',
            nodes: [nodeA],
          },
        },
      })
    );
  });
});

describe('actions.setDOM', () => {
  let state, nodeA;
  beforeEach(() => {
    nodeA = {
      id: 'node-a',
      data: {
        type: 'button',
      },
    };

    state = createTestState({
      nodes: {
        id: 'root',
        data: {
          type: 'div',
          nodes: [nodeA],
        },
      },
    });
  });

  it('should set DOM', () => {
    const dom = document.createElement('button');

    const newState = Actions(state)((actions) => actions.setDOM('node-a', dom));

    nodeA.dom = dom;

    expectEditorState(
      newState,
      createTestState({
        nodes: {
          id: 'root',
          data: {
            type: 'div',
            nodes: [nodeA],
          },
        },
      })
    );
  });
});

describe('actions.setIndicator', () => {
  let state, root, nodeA;
  beforeEach(() => {
    nodeA = {
      id: 'node-a',
      data: {
        type: 'button',
      },
      dom: document.createElement('button'),
    };

    root = {
      id: 'root',
      dom: document.createElement('div'),
      data: {
        type: 'div',
        nodes: [nodeA],
      },
    };

    state = createTestState({
      nodes: root,
    });
  });

  it('should set indicator', () => {
    const indicator = {
      placement: {
        currentNode: nodeA,
        parent: root,
        index: 0,
        where: 'after',
      },
    };

    const newState = Actions(state)((actions) =>
      actions.setIndicator(indicator)
    );

    expectEditorState(
      newState,
      createTestState({
        nodes: root,
        events: {
          indicator,
        },
      })
    );
  });
});

describe('actions.setState', () => {
  let state, root;
  beforeEach(() => {
    root = {
      id: 'root',
      dom: document.createElement('div'),
      data: {
        type: 'div',
        nodes: [],
      },
    };

    state = createTestState({
      nodes: root,
    });
  });
  it('should be able to manipulate state', () => {
    const newDOM = document.createElement('h1');

    const newState = Actions(state)((actions) =>
      actions.setState((state) => {
        state.nodes['root'].dom = newDOM;
      })
    );

    expectEditorState(
      newState,
      createTestState({
        nodes: {
          ...root,
          dom: newDOM,
        },
      })
    );
  });
  it('should be able to chain action', () => {
    const newDOM = document.createElement('h1');

    const newState = Actions(state)((actions) =>
      actions.setState((_, methods) => {
        methods.setDOM('root', newDOM);
      })
    );

    expectEditorState(
      newState,
      createTestState({
        nodes: {
          ...root,
          dom: newDOM,
        },
      })
    );
  });
});
