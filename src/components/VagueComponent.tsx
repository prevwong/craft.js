import React from "react";
import ReactDOM from "react-dom";

export default class VagueComponent extends React.Component<any> {
  render() {
    const { is, onReady, ...props } = this.props;
    const Comp = is ? is : 'div';
    return (
      <Comp
        ref={
          (ref) => {
            if (ref) {
              const dom = ReactDOM.findDOMNode(ref);
              onReady(dom);
            }
          }
        }
        {...props}
      />
    )
  }
}