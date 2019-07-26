import React from 'react';
import { transformJSXToNode } from '~packages/core/utils/transformJSX';
import { ROOT_NODE } from '~packages/core/utils/constants';
import { cleanup } from '@testing-library/react';
import { QueryMethods } from '../query';
import { RootContext } from '~packages/core/root/RootContext';
import { testActions } from '~packages/core/utils/testing/testActions';


export const dummyQueries = (store: RootContext) => {
  cleanup();
  return QueryMethods(store.manager.getState().current, store.options)
}

describe('ManagerQuery', () => {
  describe('getNode', () => {
    it('can get node', () => {
      const [store, actions] = testActions();
      const node = transformJSXToNode(<h2 />, 't1');
      actions.add(node, ROOT_NODE);
      expect(dummyQueries(store).getNode('t1')).toMatchObject(node);
    })
  })
});