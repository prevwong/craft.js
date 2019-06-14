import React from "react";
import NodeElement from "./NodeElement";
import { NodeInfo, Node, BuilderContextState, NodeElementState, NodeContextState } from "~types";
import RenderNode from "./RenderNode";
import BuilderContext from "../Builder/BuilderContext";
import NodeContext from "./NodeContext";
import cx from "classnames";
import RenderNodeWithContext from "./RenderNodeWithContext";

export default class ProxyRenderNode extends React.Component<any> {
  render() {  
    const props = this.props;
    return (
      <RenderNodeWithContext proxy={{...props}} />
    )
  }
}


