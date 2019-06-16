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
      <Builder components={[
        MessageBox
      ]}>
        <div style={{ float:"left", width:"100%", padding: "100px 30px" }}>
          <Canvas id = "main" style={{ background:"#999", float:"left", width:"100%", padding:"10px 20px"}}> 
            <Canvas id="inner" style={{ background: "#eee",float:"left", width:"100%", padding: "20px 30px", marginBottom: "20px" }}>
                <MessageBox />
            </Canvas>
          </Canvas>
          {/* <Layers /> */}
        </div>
      </Builder >
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
