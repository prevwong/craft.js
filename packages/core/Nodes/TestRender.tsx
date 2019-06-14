import React from "react";
import ReactDOM from "react-dom";


class Toolbar extends React.PureComponent<any> {
 render() {
    const {handlers, node, domInfo, Component} = this.props;
    const { type } = node;
    return ReactDOM.createPortal(
      <div className={`toolbar`} style={{
        position:'absolute',
        width: `${domInfo.dom.width}px`,
        top: `${domInfo.dom.top - 20}px`,
        left: `${domInfo.dom.left}px`
      }}>
        <span>{typeof type === "string" ? type : type.name }</span>
        <a ref={(ref: any) => {
          if (ref) {
            handlers.dragHandler(ReactDOM.findDOMNode(ref));
          }
        }}>Move</a>
      </div>,
      document.getElementById("canvasTools")
    )
  }
}
export default class TestRender extends React.Component<any> {
    render() {
        const {nodeState, node, domInfo, handlers, Component} = this.props;
        const preview =  
          <Component ref={(ref: any) => {
              if ( ref ) {
                  const dom = ReactDOM.findDOMNode(ref) as HTMLElement;
                  handlers.clickHandler(dom);
              }
            }} 
          />;
          return (
            <React.Fragment>
              {
                nodeState.active ? 
                <React.Fragment>
                  <Toolbar {...this.props} />
                  {preview}
                </React.Fragment> : preview
              }
             
            </React.Fragment>
          )
    }
}