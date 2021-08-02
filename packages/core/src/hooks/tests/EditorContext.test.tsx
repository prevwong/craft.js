import {
  ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT,
  ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT,
} from '@craftjs/utils';
import { render } from '@testing-library/react';
import * as React from 'react';

import { useEditor } from '../useEditor';
import { useNode } from '../useNode';

/**
 * since we are mocking useInternalEditor in useEditor.test.tsx we are using a dedicated test suite here
 */
describe('Using useEditor outside of EditorContext', () => {
  it('should throw an error when we use useEditor outside of <Editor />', () => {
    const TestComponent = () => {
      useEditor();
      return null;
    };

    expect(() => {
      render(<TestComponent />);
    }).toThrowError(ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT);
  });
});

describe('Using useNode outside of EditorContext', () => {
  it('should throw an error when we use useNode outside of <Editor />', () => {
    const TestComponent = () => {
      useNode();
      return null;
    };

    expect(() => {
      render(<TestComponent />);
    }).toThrowError(ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT);
  });
});
