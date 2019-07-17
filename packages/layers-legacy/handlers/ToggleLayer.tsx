import React from "react";
import LayerNodeContext from "../LayerNodeContext";

export default class ToggleLayer extends React.Component<any> {
  render() {
    const {is: Comp, ...props} = this.props
    return (
      <LayerNodeContext.Consumer>
        {({collapse, layer, setCollapse}) => {
          return (
            (layer.children && Object.keys(layer.children).length) ? <Comp 
              {...props}
              onMouseDown={(e: React.MouseEvent) => {
                e.stopPropagation();
                setCollapse(!collapse);
              }}
            /> : null
          )
        }}
      </LayerNodeContext.Consumer>
    )
  }
}