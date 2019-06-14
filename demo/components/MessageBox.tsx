import React, { Component } from "react";
import PropTypes from 'prop-types';


export default class MessageBox extends Component<{ text: string }> {
  static defaultProps = {
    text: "I am a message box"
  };

  static editor = (props: any) => {
    return (
      <div>
        <input 
          type = "text" 
          value={props.text}
          onChange={({target}) => props.text = target.value } 
        />
      </div>
    )
  }

  render() {
    const { text } = this.props;

    return (
      <div className={'message-box'}>
        <h2>{text}</h2>
      </div>
    )
  }
}

