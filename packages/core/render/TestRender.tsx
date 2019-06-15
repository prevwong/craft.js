import React from "react";
import ReactDOM from "react-dom";
import cx from "classnames";

class Toolbar extends React.PureComponent<any> {
 render() {
    const {handlers, node, domInfo, editor, Component} = this.props;
   
    const { type } = node;
    return ReactDOM.createPortal(
      <div onMouseDown={(e: React.MouseEvent) => {
        e.stopPropagation();
        return false;

      }} className={`toolbar`} style={{
        position:'absolute',
        minWidth: `${domInfo.width}px`,
        top: `${domInfo.top - 41}px`,
        left: `${domInfo.left}px`
      }}>
        <span className={'tag'}>{typeof type === "string" ? type : type.name }</span>
        <div className={'actions'}>
        <a ref={(ref: any) => {
          if (ref) {
            handlers.dragHandler(ReactDOM.findDOMNode(ref));
          }
        }}>Move</a>
        </div>
      </div>,
      document.getElementById("canvasTools")
    )
  }
}
export default class TestRender extends React.PureComponent<any> {
  dom:HTMLElement = null
  state = {
    hover: false
  }
  componentDidMount() {
    document.addEventListener("mouseenter", (e) => {
      // console.log("h", e.target)
    });
  }

  render() {
      const {state, handlers, Editor, Component} = this.props;
      const { hover, active } = state;

        return (
          <React.Fragment>
            {state.active && <Toolbar {...this.props} />}
            <Component 
              className={
                cx(['node-el'], {
                  hover,
                  active
                })
              }
              ref={(ref: any) => {
                if ( ref ) {
                    const dom = this.dom = ReactDOM.findDOMNode(ref) as HTMLElement;
                    handlers.clickHandler(dom);
                }
              }} 
            />
            {active && Editor && (
              <div style={{float:"left", width:"100%", padding: "20px 30px"}} onMouseDown={(e: React.MouseEvent) => {
                e.stopPropagation();
                return false;
              }} >
                <Editor />
              </div>
            )}
          </React.Fragment>
        )
  }
}