import React from "react";
import ReactDOM from "react-dom";
import cx from "classnames";
import ActiveHandler from "./handlers/ActiveHandler";
import DragHandler from "./handlers/DragHandler";

class Toolbar extends React.PureComponent<any> {
 render() {
    const {node, domInfo, editor, Component} = this.props;
   
    const { type } = node;
    return ReactDOM.createPortal(
      <div onMouseDown={(e: React.MouseEvent) => {
        e.stopPropagation();
        return false;

      }} className={`toolbar`} style={{
        position:'fixed',
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

  render() {
      const {nodeState, onMouseOver, domInfo, handlers, Editor, Component} = this.props;
      const { hover, active } = nodeState;
        return (
          <React.Fragment>
            {(hover || active) && <Toolbar {...this.props} /> }
              <ActiveHandler is={Component}
                className={
                  cx(['node-el'], {
                    hover,
                    active
                  })
                }
                onMouseOver={onMouseOver}
              />
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