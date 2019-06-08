
import React from "react";

export default class RenderNode extends React.Component<any> {
  render() {
    const { is, onReady, ...props } = this.props;
    const Comp = is ? is : 'div';

    return (
      <Comp
        {...props}
      />
    )
  }
}