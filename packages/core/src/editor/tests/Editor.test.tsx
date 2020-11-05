import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { EditorContext } from '../EditorContext';
import { Editor } from '../Editor';
import { Events } from '../../events';
import { useEditorStore } from '../store';
import { ERROR_RESOLVER_NOT_AN_OBJECT } from '@craftjs/utils';

jest.mock('../store');
const mockStore = useEditorStore as jest.Mock<any>;

describe('<Editor />', () => {
  const children = <h1>a children</h1>;
  let actions;
  let component;
  let query;
  let onStateChange;

  beforeEach(() => {
    React.useEffect = (f) => f();

    query = { serialize: jest.fn().mockImplementation(() => '{}') };
    onStateChange = jest.fn();
    mockStore.mockImplementation((value) => ({ ...value, query, actions }));
    act(() => {
      component = shallow(
        <Editor onStateChange={onStateChange}>{children}</Editor>
      );
    });
  });
  it('should render the children with events', () => {
    expect(component.contains(<Events>{children}</Events>)).toBe(true);
  });
  it('should render the EditorContext.Provider', () => {
    expect(component.find(EditorContext.Provider)).toHaveLength(1);
  });

  it('should throw an error when resolver is not an object', () => {
    expect(() => {
      // @ts-ignore
      shallow(<Editor resolver={[]} />);
    }).toThrowError(ERROR_RESOLVER_NOT_AN_OBJECT);
  });
  // TODO: use react-testing-library to test hook-related code
});
