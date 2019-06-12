import "reset-css";
import "./demo.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import tree from "./tree";
// import Space from "~/packages/space";
// import Compose from "~/packages/compose";
import Button from "./components/Button";
import MessageBox from "./components/MessageBox";
import Builder from "~packages/core/Builder";
import Canvas from "~packages/core/Canvas";

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
        <div style={{ padding: "20px 30px" }}>
          <Canvas id="first" style={{ background: "#eee", padding: "20px 30px", marginBottom: "20px" }}>
            <h2>hahaha</h2>
            <h2>whut</h2>
          </Canvas>
          <Canvas id="second" style={{ background: "#eee", padding: "20px 30px", marginBottom: "20px" }}>
          </Canvas>
          <Canvas id="third" style={{ background: "#eee", padding: "20px 30px" }}>
            <h2>hahaha</h2>
            <h2>whut</h2>
            <Canvas id="forth" style={{ background: "#ccc", padding: "20px 30px" }}>
              <h2>me</h2>
              <h2>inside</h2>
            </Canvas>
          </Canvas>
        </div>
      </Builder >
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
