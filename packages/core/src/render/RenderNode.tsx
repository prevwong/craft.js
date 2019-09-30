import React, { useMemo, useContext } from "react";
import { useInternalNode } from "../nodes/useInternalNode";
import { useNode } from "../connectors";
import { RootContext } from "../root/RootContext";

export const SimpleElement = ({render}: any) => {
  const {connectTarget} = useNode();

  return typeof render.type === "string" ? connectTarget(render) : render;
}

export const RenderNodeToElement: React.FC<any> =React.memo(({ ...injectedProps}) => {
  const { type, props } = useInternalNode((node) => ({type: node.data.type, props: node.data.props}));
  const { query: { getOptions }} = useContext(RootContext);
  const {onRender} = getOptions();

  return useMemo(() => {
    let Comp = type;
    let render = React.cloneElement(<Comp {...props} {...injectedProps} />);
    if (typeof Comp === 'string') render = <SimpleElement render={render} />

    return React.createElement(onRender, {render}, null);
  }, [type, props]);
});

