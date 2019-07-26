import React from 'react';
import { RootContext, createRootContext } from "~packages/core/root/RootContext";
import { CallbacksFor } from "~packages/shared/createReduxMethods";
import { cleanup } from "@testing-library/react";
import { ROOT_NODE } from "~packages/core/utils/constants";
import { Canvas } from "~packages/core/nodes";
import { transformJSXToNode } from "~packages/core/utils/transformJSX";
import Actions from '~packages/core/manager/actions';

/**
 * Returns ManagerActions with an basic initialised RootContext
 */
export const testActions = (): [RootContext, CallbacksFor<typeof Actions>] => {
  cleanup();
  const nodes = {
    [ROOT_NODE]: transformJSXToNode(<Canvas />, ROOT_NODE)
  };

  const context = createRootContext({ nodes });
  const actions = Actions(context.manager.getState().current);

  return [context, actions];
}
