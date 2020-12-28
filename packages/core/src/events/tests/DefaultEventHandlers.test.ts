import { DefaultEventHandlers } from '../DefaultEventHandlers';

let shadow;
let createShadow = jest.fn().mockImplementation(() => shadow);

jest.mock('debounce', () => ({
  debounce: (f) => (...args) => f(...args),
}));
jest.mock('../createShadow', () => ({
  createShadow: () => createShadow(),
}));

describe('EventHandlers', () => {
  const nodeId = '3901';
  const getHandler = (events, name) =>
    events.find(([eventName]) => name === eventName);
  const callHandler = (events, name) => getHandler(events, name)[1];

  let e = {
    preventDefault: jest.fn(),
    stopImmediatePropagation: jest.fn(),
    craft: {
      stopPropagation: jest.fn(),
    },
    clientX: 0,
    clientY: 0,
  };
  let eventHandlers;
  let store;
  let actions;
  let query;

  let isDraggable;
  let parsedNodeTree;
  let parseReactElement = jest.fn().mockImplementation(() => ({
    toNodeTree: jest.fn().mockImplementation(() => parsedNodeTree),
  }));

  beforeEach(() => {
    DefaultEventHandlers.draggedElement = undefined;
    DefaultEventHandlers.draggedElementShadow = undefined;

    actions = {
      addNodeTree: jest.fn(),
      move: jest.fn(),
      setIndicator: jest.fn(),
      setNodeEvent: jest.fn(),
    };
    query = {
      parseReactElement,
      getDropPlaceholder: jest.fn(),
      node: jest.fn().mockImplementation(() => ({
        get: () => ({
          dom: null,
        }),
        isDraggable: jest.fn().mockImplementation(() => isDraggable),
      })),
    };
    store = { actions, query };
    eventHandlers = new DefaultEventHandlers(store);
  });

  describe('handlers.select', () => {
    let select;

    beforeEach(() => {
      select = eventHandlers.handlers().select;
    });
    it('should call setNodeEvent on init', () => {
      select.init()();
      expect(actions.setNodeEvent).toHaveBeenCalledWith('selected', null);
    });
    it('should contain one event with click', () => {
      expect(select.events).toHaveLength(1);
      expect(getHandler(select.events, 'mousedown')).toBeDefined();
    });
    it('should call setNodeEvent on mousedown', () => {
      callHandler(select.events, 'mousedown')(e, nodeId);
      expect(actions.setNodeEvent).toHaveBeenCalledWith('selected', nodeId);
    });
  });

  describe('handlers.hover', () => {
    let hover;

    beforeEach(() => {
      hover = eventHandlers.handlers().hover;
    });
    it('should call setNodeEvent on init', () => {
      hover.init()();
      expect(actions.setNodeEvent).toHaveBeenCalledWith('hovered', null);
    });
    it('should contain one event with mousedown', () => {
      expect(hover.events).toHaveLength(1);
      expect(getHandler(hover.events, 'mouseover')).toBeDefined();
    });
    it('should call setNodeEvent on mouseover', () => {
      callHandler(hover.events, 'mouseover')(e, nodeId);
      expect(actions.setNodeEvent).toHaveBeenCalledWith('hovered', nodeId);
    });
  });

  describe('handlers.drop', () => {
    let drop;

    beforeEach(() => {
      drop = eventHandlers.handlers().drop;
    });
    it('should contain four events, dragover, touchdragover, dragenter and touchdragenter ', () => {
      expect(drop.events).toHaveLength(4);
      expect(getHandler(drop.events, 'dragover')).toBeDefined();
      expect(getHandler(drop.events, 'touchdragover')).toBeDefined();
      expect(getHandler(drop.events, 'dragenter')).toBeDefined();
      expect(getHandler(drop.events, 'touchdragenter')).toBeDefined();
    });
    it('should have prevented default on dragover', () => {
      callHandler(drop.events, 'dragover')(e);
      expect(e.preventDefault).toHaveBeenCalled();
      expect(actions.setIndicator).not.toHaveBeenCalled();
    });

    describe('dragenter with no dragged element', () => {
      beforeEach(() => {
        callHandler(drop.events, 'dragenter')(e);
      });
      it('should have prevented default', () => {
        expect(e.preventDefault).toHaveBeenCalled();
      });
      it('should have not called set indicator or getDropPlacehalder', () => {
        expect(actions.setIndicator).not.toHaveBeenCalled();
        expect(query.getDropPlaceholder).not.toHaveBeenCalled();
      });
      it('should not have set the indicator', () => {
        expect(actions.setIndicator).not.toHaveBeenCalled();
      });
    });

    describe('dragenter with a dragged element and a placeholder', () => {
      const coordinates = { x: 130, y: 310 };
      const draggedElement = 'an element';
      const indicator = 'an indicator';

      beforeEach(() => {
        DefaultEventHandlers.draggedElement = draggedElement;
        query.getDropPlaceholder.mockImplementationOnce(() => indicator);
        e.clientY = coordinates.y;
        e.clientX = coordinates.x;
        callHandler(drop.events, 'dragenter')(e, nodeId);
      });
      it('should have prevented default', () => {
        expect(e.preventDefault).toHaveBeenCalled();
      });
      it('should have called getdropPlaceholder with the right arguments', () => {
        expect(query.getDropPlaceholder).toHaveBeenCalledWith(
          draggedElement,
          nodeId,
          coordinates
        );
      });
      it('should have called set indicator or getDropPlacehalder', () => {
        expect(actions.setIndicator).toHaveBeenCalledWith(indicator);
      });
      it('should have set EventHandlers.evenst', () => {
        expect(DefaultEventHandlers.indicator).toEqual(indicator);
      });
    });
  });

  describe('handlers.drag', () => {
    shadow = 'a shadow';
    let drag;
    let el;

    beforeEach(() => {
      drag = eventHandlers.handlers().drag;
      el = { setAttribute: jest.fn() };
    });
    it('should contain four events, dragstart, touchdragstart, dragend and touchend', () => {
      expect(drag.events).toHaveLength(4);
      expect(getHandler(drag.events, 'dragstart')).toBeDefined();
      expect(getHandler(drag.events, 'touchdragstart')).toBeDefined();
      expect(getHandler(drag.events, 'dragend')).toBeDefined();
      expect(getHandler(drag.events, 'touchend')).toBeDefined();
    });

    describe('init', () => {
      describe('when node can be dragged', () => {
        beforeEach(() => {
          isDraggable = true;
          drag.init(el)();
        });
        it('should call setAttribute twice on init', () => {
          expect(el.setAttribute).toHaveBeenCalledTimes(2);
        });
        it('should call setAttribute with the right arguments', () => {
          expect(el.setAttribute).toHaveBeenNthCalledWith(
            1,
            'draggable',
            'true'
          );
          expect(el.setAttribute).toHaveBeenNthCalledWith(
            2,
            'draggable',
            'false'
          );
        });
      });
      describe('when node cannot be dragged', () => {
        beforeEach(() => {
          isDraggable = false;
          drag.init(el)();
        });
        it('should not have called setAttribute', () => {
          expect(el.setAttribute).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('dragstart', () => {
      beforeEach(() => {
        callHandler(drag.events, 'dragstart')(e, nodeId);
      });
      it('should call setNodeEvent on mousedown', () => {
        expect(actions.setNodeEvent).toHaveBeenCalledWith('dragged', nodeId);
      });
      it('should have called createShadow', () => {
        expect(createShadow).toHaveBeenCalled();
      });
      it('should have set the correct dragged elements', () => {
        expect(DefaultEventHandlers.draggedElement).toEqual(nodeId);
        expect(DefaultEventHandlers.draggedElementShadow).toEqual(shadow);
      });
    });

    describe('dragend', () => {
      const indicator = {
        placement: { parent: { id: 1 }, where: 'after', index: 1 },
        error: null,
      };

      describe('if there are no elements or events', () => {
        beforeEach(() => {
          callHandler(drag.events, 'dragend')(e, nodeId);
        });
        it('should have not call move', () => {
          expect(actions.move).not.toHaveBeenCalled();
        });
      });

      describe('if there are all the events', () => {
        beforeEach(() => {
          DefaultEventHandlers.indicator = indicator as any;
          DefaultEventHandlers.draggedElement = nodeId;
          callHandler(drag.events, 'dragend')(e, nodeId);
        });
        it('should have called the right actions', () => {
          expect(actions.setIndicator).toHaveBeenCalledWith(null);
          expect(actions.setNodeEvent).toHaveBeenCalledWith('dragged', null);
        });
        it('should have reset all the variables', () => {
          expect(DefaultEventHandlers.draggedElement).toBe(null);
          expect(DefaultEventHandlers.draggedElementShadow).toBe(undefined);
        });
        it('should have call move', () => {
          expect(actions.move).toHaveBeenCalledWith(
            nodeId,
            indicator.placement.parent.id,
            2
          );
        });
      });
    });
  });

  describe('handlers.create', () => {
    let create;
    let el;

    beforeEach(() => {
      createShadow = jest.fn().mockImplementation(() => shadow);
      create = eventHandlers.handlers().create;
      el = { setAttribute: jest.fn(), removeAttribute: jest.fn() };
    });
    it('should contain four events, dragstart, touchdragstart, dragend and touchend', () => {
      expect(create.events).toHaveLength(4);
      expect(getHandler(create.events, 'dragstart')).toBeDefined();
      expect(getHandler(create.events, 'touchdragstart')).toBeDefined();
      expect(getHandler(create.events, 'dragend')).toBeDefined();
      expect(getHandler(create.events, 'touchend')).toBeDefined();
    });

    describe('init', () => {
      beforeEach(() => {
        create.init(el)();
      });
      it('should call setAttribute twice on init', () => {
        expect(el.setAttribute).toHaveBeenCalledTimes(1);
        expect(el.removeAttribute).toHaveBeenCalledTimes(1);
      });
      it('should call setAttribute with the right arguments', () => {
        expect(el.setAttribute).toHaveBeenNthCalledWith(1, 'draggable', 'true');
        expect(el.removeAttribute).toHaveBeenNthCalledWith(1, 'draggable');
      });
    });

    describe('dragstart', () => {
      const node = 'a node';
      beforeEach(() => {
        parsedNodeTree = node;
        callHandler(create.events, 'dragstart')(e, nodeId);
      });
      it('should call parseReactElement.toNodeTree on mousedown', () => {
        expect(query.parseReactElement).toHaveBeenCalled();
      });
      it('should have called createShadow', () => {
        expect(createShadow).toHaveBeenCalled();
      });
      it('should have set the correct dragged elements', () => {
        expect(DefaultEventHandlers.draggedElement).toEqual(node);
        expect(DefaultEventHandlers.draggedElementShadow).toEqual(shadow);
      });
    });

    describe('dragend', () => {
      const indicator = {
        placement: { parent: { id: 1 }, where: 'before', index: 1 },
      };

      describe('if there are no elements or events', () => {
        beforeEach(() => {
          callHandler(create.events, 'dragend')(e, nodeId);
        });
        it('should have not call addNodeTree', () => {
          expect(actions.addNodeTree).not.toHaveBeenCalled();
        });
      });

      describe('if there are all the events', () => {
        beforeEach(() => {
          DefaultEventHandlers.indicator = indicator as any;
          DefaultEventHandlers.draggedElement = nodeId;
          callHandler(create.events, 'dragend')(e, nodeId);
        });
        it('should have called the right actions', () => {
          expect(actions.setIndicator).toHaveBeenCalledWith(null);
          expect(actions.setNodeEvent).toHaveBeenCalledWith('dragged', null);
        });
        it('should have reset all the variables', () => {
          expect(DefaultEventHandlers.draggedElement).toBe(null);
          expect(DefaultEventHandlers.draggedElementShadow).toBe(undefined);
        });
        it('should have call addNodeTree', () => {
          expect(actions.addNodeTree).toHaveBeenCalledWith(
            nodeId,
            indicator.placement.parent.id,
            indicator.placement.index
          );
        });
      });
    });
  });
});
