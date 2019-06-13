import React from "react";
import ReactDOM from "react-dom";

export default class TestRender extends React.Component<any> {
    render() {
        const {nodeState, handlers, Component} = this.props;
        const preview =  <Component ref={(ref: any) => {
            if ( ref ) {
                handlers.clickHandler(ReactDOM.findDOMNode(ref));
            }
          }} />;
          return (
            <React.Fragment>
              {
                nodeState.active ? 
                <span>
                  <div className={'toolbar'}>
                    <a ref={(ref: any) => {
                      if (ref) {
                        handlers.dragHandler(ReactDOM.findDOMNode(ref));
                      }
                    }}>Move</a>
                    
                  </div>
                  {preview}
                </span> : preview
              }
             
            </React.Fragment>
          )
    }
}