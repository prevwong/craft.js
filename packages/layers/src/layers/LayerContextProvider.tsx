import React, { useMemo, useContext } from "react";
import { LayerContext } from "./LayerContext";
import { LayerNode } from "./LayerNode";
import { LayerHandlers } from "../events/LayerHandlers";
import { useEventHandler } from "@craftjs/core";
import { LayerManagerContext } from "../manager";

export const LayerContextProvider: React.FC<Omit<
  LayerContext,
  "connectors"
>> = ({ id, depth }) => {
  const handler = useEventHandler();

  const { store } = useContext(LayerManagerContext);
  const connectors = useMemo(
    () => handler.derive(LayerHandlers, store, id).connectors(),
    [handler, id, store]
  );

  return (
    <LayerContext.Provider value={{ id, depth, connectors }}>
      <LayerNode />
    </LayerContext.Provider>
  );
};
