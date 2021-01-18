import { CoreEventHandlers } from '../CoreEventHandlers';
import { defineEventListener } from '../defineEventListener';

let selectFn,
  selectCleanup = jest.fn(),
  selectInit = jest.fn().mockImplementation(() => () => selectCleanup());

class TestHandlers extends CoreEventHandlers {
  handlers() {
    return {
      select: {
        init: selectInit,
        events: [defineEventListener('mousedown', selectFn)],
      },
      hover: {
        init: () => {},
        events: [defineEventListener('mousedown', () => {})],
      },
      drag: {
        init: () => {},
        events: [defineEventListener('mousedown', () => {})],
      },
      drop: {
        init: () => {},
        events: [defineEventListener('mousedown', () => {})],
      },
      create: {
        init: () => {},
        events: [defineEventListener('mousedown', () => {})],
      },
      connect: {
        init: () => {},
        events: [defineEventListener('mousedown', () => {})],
      },
    };
  }
}
const createTestHandlers = () => {
  selectCleanup = jest.fn();
  selectInit = jest.fn().mockImplementation(() => () => selectCleanup());
  return new TestHandlers();
};

describe('CoreEventHandlers', () => {
  let instance, dom;

  beforeEach(() => {
    instance = createTestHandlers();
  });
  describe('connectors', () => {
    it('should have core connectors', () => {
      expect(instance.connectors).toEqual({
        select: expect.any(Function),
        hover: expect.any(Function),
        drag: expect.any(Function),
        drop: expect.any(Function),
        create: expect.any(Function),
        connect: expect.any(Function),
      });
    });
    describe('attaching a connector', () => {
      it('should be able to attach connector', () => {
        dom = document.createElement('a');

        const chainedValue = instance.connectors.select(dom);
        expect(chainedValue).toEqual(dom);
        expect(instance.registry['select'].get(dom)).not.toBeFalsy();
        expect(selectInit).toHaveBeenCalled();
      });

      describe('re-attaching on same DOM element', () => {
        dom = document.createElement('a');
        beforeEach(() => {
          instance.connectors.select(dom);
          selectInit.mockReset();
          selectCleanup.mockReset();
        });

        it('should do nothing if opts did not change', () => {
          selectInit.mockReset();
          instance.connectors.select(dom);
          expect(selectInit).not.toHaveBeenCalled();
        });
        it('should reattach connector if opts changed', () => {
          instance.connectors.select(dom, 'node-a');
          expect(selectCleanup).toHaveBeenCalled();
          expect(selectInit).toHaveBeenCalled();
        });
      });

      describe('disabling/enabling', () => {
        beforeEach(() => {
          selectInit.mockReset();
          selectCleanup.mockReset();
          instance.connectors.select(dom);
        });
        it('should disable connectors', () => {
          instance.disable();
          // expect(selectCleanup).toHaveBeenCalled();
          // expect(selectInit).toHaveBeenCalled();
        });
      });
    });
  });
});
