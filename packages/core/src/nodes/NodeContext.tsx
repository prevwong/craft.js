import React, { useEffect, useMemo } from 'react';

import { NodeHandlers } from './NodeHandlers';

import { useInternalEditor } from '../editor/useInternalEditor';
import { useEventHandler } from '../events';
import { NodeId } from '../interfaces';

export const NodeContext = React.createContext<any>(null);

export type NodeProvider = {
  id: NodeId;
  related?: boolean;
};

export const NodeProvider: React.FC<NodeProvider> = ({
  id,
  related = false,
  children,
}) => {
  const handlers = useEventHandler();

  const { hydrationTimestamp } = useInternalEditor((state) => ({
    hydrationTimestamp: state.nodes[id] && state.nodes[id]._hydrationTimestamp,
  }));

  const nodeHandlers = useMemo(() => handlers.derive(NodeHandlers, id), [
    handlers,
    id,
    hydrationTimestamp,
  ]);

  const connectors = useMemo(() => nodeHandlers.connectors(), [nodeHandlers]);

  useEffect(() => {
    return () => {
      if (!nodeHandlers) {
        return;
      }

      nodeHandlers.cleanup();
    };
  }, []);

  return (
    <NodeContext.Provider value={{ id, related, connectors }}>
      {children}
    </NodeContext.Provider>
  );
};
