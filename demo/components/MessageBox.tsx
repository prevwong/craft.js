import React, { Component } from "react";
import styled from "styled-components";
import Button from "./Button";
import Canvas from "~packages/core/Canvas";

const Msg = styled.div`
  display: inline-block;
  display: inline-block;
  height: 120px;
  background-image: initial;
  background-position-x: initial;
  background-position-y: initial;
  background-size: initial;
  background-repeat-x: initial;
  background-repeat-y: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: rgb(34, 34, 34);
  color: rgb(255, 255, 255);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  width: ${(props: any) => (props.width ? props.width : "50")}%;
  float: left;
`;

export default class MessageBox extends Component<{ text: string }> {
  static defaultProps = {
    text: "I am a message box"
  };
  state = {
    test: false,
    test2: false,
    test3: false,
    test4: false
  }

  componentDidMount() {
    setTimeout(() => {
      console.log("CAHNGED")
      this.setState({
        test: 'Wow'
      })
    }, 2000)
    setTimeout(() => {
      console.log("CAHNGED")
      this.setState({
        test2: 'Wow'
      })
    }, 4000)
    setTimeout(() => {
      console.log("CAHNGED")
      this.setState({
        test3: 'Wow'
      })
    }, 6000)
    setTimeout(() => {
      console.log("CAHNGED")
      this.setState({
        test4: 'Wow'
      })
    }, 8000)
  }
  render() {
    const { text } = this.props;
    const { test, test2, test3, test4 } = this.state;

    return (
      <hgroup>
        {test4 && <Canvas>
          <button>Im really kind the first</button>
        </Canvas>}
        <Canvas>
          <button>Bye</button>
        </Canvas>
        {test3 && <Canvas>
          <button>Im really kind the second</button>
        </Canvas>}
        <p> Another one</p>
        {test && <Canvas>
          <button>Im center</button>
        </Canvas>}
        <Canvas>
          <button>Im back</button>
        </Canvas>
        {test2 && <Canvas>
          <button>Im really kind the last</button>
        </Canvas>}
      </hgroup>
    )
  }
}
