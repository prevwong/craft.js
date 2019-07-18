import React from "react";
import styled from "styled-components";
import ToggleLayer from "./handlers/ToggleLayer";

export default class Comp extends React.Component<any> {
  render() {
    const { depth, layer, drop,  builder, setLayerDragging, collapse} = this.props;
    const {setNodeState} = builder;
    return (
      <React.Fragment>
        <LayerNodeMovementIndicator
          style={{ paddingLeft: `${(depth) * 10}px` }}
          placeholderBefore={drop === "before"}
          placeholderAfter={drop === "after"}
        />
        <LayerNodeTitle
          style={{ paddingLeft: `${(depth) * 10}px` }}
          placeholderInside={drop === "inside"}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setNodeState("active", layer.id);
            if (!layer.parent) return;
            setLayerDragging(layer.id);
            return false;
          }}
        >
          <div className="nodename">{layer.id}</div>
          <ToggleLayer is="a">Toggle</ToggleLayer>
        </LayerNodeTitle>
      </React.Fragment>
    )
  }
}


const LayerNodeTitle = styled.div<{
  placeholderInside: Boolean
}>`
  font-weight: lighter;
  letter-spacing: 1px;
  text-align: left;
  position: relative;
  cursor: pointer;
  padding: 5px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.25);
  outline: ${props => props.placeholderInside ? "1px solid #000" : "none"};
  > .nodename {
    flex:1; 
  }
`

const LayerNodeMovementIndicator = styled.div<{
  placeholderBefore: Boolean
  placeholderAfter: Boolean
}>`
  position:absolute;
  height:100%;
  width:100%;
  &:after {
    content: " ";
    display:block; 
    left:0;
    width:100%;
    height:1px;
    display:block;
    background:#000;
    position:relative;
    margin-top: -1px;
    display: ${props => (props.placeholderBefore || props.placeholderAfter) ? "block" : "none" };
    top: ${props => (props.placeholderBefore) ? 0 : "auto" };
    bottom: ${props => (props.placeholderAfter) ? "-100%" : "auto" };
  }
`