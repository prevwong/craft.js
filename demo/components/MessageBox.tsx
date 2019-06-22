import React, { Component } from "react";
import PropTypes, { string } from 'prop-types';
import ContentEditable from 'react-contenteditable'
import { NodeContext } from "~packages/core/nodes/NodeContext";
import Canvas from "~packages/core/nodes/Canvas";

interface MessageBoxProps {
  text: string
  bg: string
}
class Editor extends React.Component<any> {
  render() {
    let {props} = this.props;
    return (
      <div>
        <input 
          type = "text" 
          value={props.text}
          onChange={(e) => props.text = e.target.value}
        />

        <input 
          type = "text" 
          value={props.bg}
          onChange={(e) => props.bg = e.target.value}
        />
      </div>
    )
  }
}

export default class MessageBox extends Component<MessageBoxProps> {
  static defaultProps = {
    text: "I am a message box",
    bg: "#333"
  };

  static editor = Editor

  render() {
    const { text, bg, ...props} = this.props;
    // console.log("t", text)
    return (
      <div className={'message-box'} style={{backgroundColor: bg}} >
      <Canvas id="MessageCanvas" style={{"padding" : "20px 0"}}>
        <h2>66</h2>
        <h2>Whut</h2>
      </Canvas>
       
      </div>
    )
  }
}

