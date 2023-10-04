import { ERROR_RESOLVER_NOT_AN_OBJECT } from '@craftjs/utils';
import { render } from '@testing-library/react';
import * as React from 'react';

import { Resolver } from '../../interfaces';
import { Editor } from '../Editor';

describe('Editor Component', () => {
  it('should throw an error when we use <Editor /> with resolvers that are not valid objects', () => {
    expect(() => {
      const resolver = (null as unknown) as Resolver;
      render(<Editor resolver={resolver} />);
    }).toThrowError(ERROR_RESOLVER_NOT_AN_OBJECT);
  });
});
