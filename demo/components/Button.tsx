import React, { Component } from "react";
import styled from "styled-components";

const Btn = styled.button``;

export default class Button extends Component<{ text: string }> {
  static defaultProps = {
    text: "Button"
  };
  render() {
    const { text } = this.props;
    return <Btn>{text}</Btn>;
  }
}
