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
          <Renderer>
            <Canvas is={AnotherCanvas}>
              <p>Alright</p>
            </Canvas>
            <MsgBox text="hi" />
          </Renderer>
        </Craft>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))