import React, { useEffect, useMemo } from "react";
import { NodeElement, Canvas, mapChildrenToNodes } from "../nodes";
import { RenderContext, RenderContextProvider } from "./RenderContext";
import { Resolver } from "../interfaces";
import { defaultPlaceholder } from "./RenderPlaceholder";
import DNDManager from "../dnd";
import { useCollector } from "../shared/useCollector";
const invariant = require("invariant");

export type Renderer = {
  nodes?: string
  resolver?: Resolver
} & Partial<RenderContext>

export const Renderer: React.FC<Renderer> = ({
  children,
  onRender = ({ render }) => render,
  resolver = {},
  renderPlaceholder = defaultPlaceholder,
  nodes = null
}) => {

  const { rootNode, add, replaceNodes, query } = useCollector('manager', (state) => ({ rootNode: state.nodes["rootNode"] }));

  useEffect(() => {
    if (!nodes) {
      const rootCanvas = React.Children.only(children) as React.ReactElement;
      invariant(rootCanvas.type && rootCanvas.type == Canvas, "The immediate child of <Renderer /> has to be a Canvas");
      let node = mapChildrenToNodes(rootCanvas, null, "rootNode");
      add(null, node);
    } else {
      // const rehydratedNodes = query.deserialize(nodes, resolver);
      // replaceNodes(rehydratedNodes);
    }
  }, []);

  return useMemo(() => (
    <RenderContextProvider onRender={onRender} renderPlaceholder={renderPlaceholder}>
      {/* <DNDManager> */}
        {
          rootNode ? (
            <NodeElement id="rootNode" />
          ) : null
        }
      {/* </DNDManager> */}
    </RenderContextProvider>
  ), [rootNode])
}

