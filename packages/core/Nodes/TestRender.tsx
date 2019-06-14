import React from "react";
import ReactDOM from "react-dom";
import cx from "classnames";


//Detect if otherNode is contained by refNode
function isParent(refNode, otherNode) {
	var parent = otherNode.parentNode;
	do {
		if (refNode == parent) {
			return true;
		} else {
			parent = parent.parentNode;
		}
	} while (parent);
	return false;
}


class Toolbar extends React.PureComponent<any> {
 render() {
    const {handlers, node, domInfo, Component} = this.props;
    const { type } = node;
    return ReactDOM.createPortal(
      <div onMouseDown={(e: MouseEvent) => {
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
export default class TestRender extends React.Component<any> {
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
      const {nodeState, node, domInfo, handlers, Component} = this.props;
      const preview =  
        <Component 
          className={
            cx(['node-el'], {
              hover: nodeState.hover,
              active: nodeState.active
            })
          }
         
          ref={(ref: any) => {
            if ( ref ) {
                const dom = this.dom = ReactDOM.findDOMNode(ref) as HTMLElement;
                handlers.clickHandler(dom);
            }
          }} 
        />;
        return (
          <React.Fragment>
            {nodeState.active && <Toolbar {...this.props} />}
            {preview}
          </React.Fragment>
        )
  }
}