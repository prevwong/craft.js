import { ChainableConnectors, wrapConnectorHooks } from '@craftjs/utils';
import React, { useMemo } from 'react';

import { useEventHandler } from '../events';
import { NodeId } from '../interfaces';

export type NodeContextType = {
  id: NodeId;
  related?: boolean;
  connectors: ChainableConnectors<
    {
      connect: (element: HTMLElement) => void;
      drag: (element: HTMLElement) => void;
    },
    React.ReactElement
  >;
};

export const NodeContext = React.createContext<NodeContextType>(null);

export type NodeProviderProps = Omit<NodeContextType, 'connectors'>;

export const NodeProvider: React.FC<NodeProviderProps> = ({
  id,
  related = false,
  children,
}) => {
  const handlers = useEventHandler();

  const connectors = useMemo(
    () =>
      wrapConnectorHooks({
        connect: (dom: HTMLElement) => handlers.connectors.connect(dom, id),
        drag: (dom: HTMLElement) => handlers.connectors.drag(dom, id),
      }),
    [handlers, id]
  );

  return (
    <NodeContext.Provider value={{ id, related, connectors }}>
      {children}
    </NodeContext.Provider>
  );
};
