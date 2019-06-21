import React from "react";
import ReactDOM from "react-dom";
import cx from "classnames";
import ActiveHandler from "./handlers/ActiveHandler";
import DragHandler from "./handlers/DragHandler";

class Toolbar extends React.PureComponent<any> {
 render() {
    const {node, nodeState, editor, Component} = this.props;
    const { type } = node;
    const {hover} = nodeState;
    return ReactDOM.createPortal(
      <div onMouseDown={(e: React.MouseEvent) => {
        e.stopPropagation();
        return false;

      }} className={`toolbar`} style={{
        position:'fixed',
        minWidth: `${hover.info.width}px`,
        top: `${hover.info.top - 41}px`,
        left: `${hover.info.left}px`
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
      const {nodeState, handlers, Editor, Component} = this.props;
      const { hover } = nodeState;

      return (
          <React.Fragment>
            {(hover) && <Toolbar  {...this.props} /> }
              <Component 
                className={
                  cx(['node-el'], {
                    hover,
                  })
                }
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