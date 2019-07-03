import React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "./nodes/Canvas";
import MessageBox from "~demo/components/MessageBox";
import { MsgBox } from "./MsgBox";
import { Heading } from "./Heading";
import { Renderer } from "./render/Renderer";
import { Craft } from "./Craft";
import AnotherCanvas from "./AnotherCanvas";

class App extends React.Component {
  render() {
    return (
      <div className='app'>
        <Craft>
          <Renderer onRender={(({render, node}) => {
            return (
              <React.Fragment>
                {/* {node.data.event.active ? <p>is active</p>: null} */}
                {render}
              </React.Fragment>
            )
          })}>
            <h1>Lol</h1>
            <MsgBox text="hi" />
            <h2>Hi world</h2>
          </Renderer>
        </Craft>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))