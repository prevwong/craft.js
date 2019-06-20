import "reset-css";
import "./demo.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import tree from "./tree";
// import Space from "~/packages/space";
// import Compose from "~/packages/compose";
import Button from "./components/Button";
import MessageBox from "./components/MessageBox";

import Row from "./components/Row";
import {Builder, Canvas} from "~packages/core/index";
import Layers from "~packages/layers";
import Renderer from "~packages/core/render/Renderer";

const canvasTools = document.createElement("div");
canvasTools.id = `canvasTools`;
document.body.appendChild(canvasTools);

class App extends Component {
  state = {
    tree: tree,
    test: 'false',
    arr: ["hi", "bye", "what"],
    nodes: [
      <h1>Hi</h1>
    ]
  };
  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     test: 'true'
    //   })
    // }, 1000)
    // setTimeout(() => {
    //   this.setState({
    //     test: 'true'
    //   })
    //   setTimeout(() => {
    //     this.state.arr.splice(1,0, "huh");
    //     this.setState({
    //       arr: [
    //         ...this.state.arr,
    //       ]
    //     })
    //   }, 1000)
    // }, 1000)
  }
  render() {
    const { tree, test, arr } = this.state;
    return (
      <div style={{paddingTop:"30px"}}> 
      <Builder>
        <Renderer components={[
          MessageBox
        ]}>
            <Canvas></Canvas>
            <MessageBox />
            <h2>Hi</h2>
        </Renderer>
        <div style={{width: "300px", float:"left"}}>
          {/* <Layers /> */}
        </div>
      </Builder >
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
