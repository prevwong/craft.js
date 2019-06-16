import React from "react";
import ReactDOM from "react-dom";
import cx from "classnames";

class Toolbar extends React.PureComponent<any> {
 render() {
    const {DragHandler, node, domInfo, editor, Component} = this.props;
   
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
          <DragHandler is="a">
           Move
          </DragHandler>
        {/* {connectDragStart(<a>Move</a>)} */}
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
      const {nodeState, ActiveHandler, DragHandler, domInfo, handlers, Editor, Component} = this.props;
      const { hover, active } = nodeState;
        return (
          <React.Fragment>
            {active && <Toolbar {...this.props} /> }
            <ActiveHandler>
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
                      // handlers.clickHandler(dom);
                  }
                }} 
              />
            </ActiveHandler>
            {/* {active && Editor && (
              <div style={{float:"left", width:"100%", padding: "20px 30px"}} onMouseDown={(e: React.MouseEvent) => {
                e.stopPropagation();
                return false;
              }} >
                <Editor />
              </div>
            )} */}
          </React.Fragment>
        )
  }
}