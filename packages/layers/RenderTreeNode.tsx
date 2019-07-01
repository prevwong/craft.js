import React, { SyntheticEvent } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { List } from ".";
import { getDOMInfo } from "./utils/dom";
import { LayerContextState } from "./types";
import LayerNodeContext from "./LayerNodeContext";
import Comp from "./Comp";
import { getDeepChildrenNodes } from "~packages/core/utils";
import LayerContext from "./LayerContext";

export default class RenderTreeNode extends React.Component<any> {
  state = {
    showChildren: false,
    collapse: false
  }
  ref = React.createRef();

  render() {
    const {showChildren} = this.state;
    const { layer } = this.props;
    let { depth } = this.props;
    const { children } = layer;

    depth = depth ? depth : 0;

    const el = <Comp />

    return (
      <LayerContext.Consumer>
        {({ layersCollapsed, setLayerCollapse, layerInfo, setDragging, placeholder, builder }: LayerContextState) => {
          const { setNodeState, active } = builder;
          const drop = (placeholder && placeholder.nodeId === layer.id) ? placeholder.where : null;
          const collapse = layersCollapsed[layer.id];
          return (
            <LayerNodeContext.Provider value={{
              collapse,
              layer,
              setCollapse: (bool: Boolean) => {
                setLayerCollapse(layer.id, bool);
              }
            }}>
              <LayerNode
                ref={(dom) => {
                  if (dom) {
                    layerInfo[layer.id].full = getDOMInfo(dom);
                  }
                }}
              >
                <div ref={
                  (ref: any) => {
                    if ( ref ) {
                      layerInfo[layer.id] = getDOMInfo(ReactDOM.findDOMNode(ref) as HTMLElement);
                    }
                }}>
                  {
                    React.cloneElement(el, {
                      depth,
                      layer,
                      collapse,
                      drop,
                      builder,
                      setLayerDragging: setDragging,
                    })
                  }
                </div>
                {
                  (children && collapse) ? (
                    <List>
                      {
                        Object.keys(children).map((childId) => {
                          return <RenderTreeNode key={childId} layer={children[childId]} depth={depth + 1} />
                        })
                      }
                    </List>
                  ) : null
                }
              </LayerNode>
            </LayerNodeContext.Provider>
          )
        }}
      </LayerContext.Consumer>
      
    )
  }
}



const LayerNode = styled.li`
  position:relative;
  height:100%;
  font-weight: lighter;
  text-align: left;
  position: relative;
  font-size: .75rem;
  float:left;
  width:100%;
  padding-bottom:1px;
`


RenderTreeNode.contextType = LayerContext;