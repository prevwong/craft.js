import React, { Component } from "react";
import styled from "styled-components";
import { PlaceholderInfo } from "~types";

const StyledPlaceholder = styled.div`
  position: absolute;
  display: block;
  border-color: ${(props: any) =>
    props.h
      ? `rgb(98, 196, 98) rgba(0, 0, 0, 0)`
      : "rgba(0, 0, 0, 0)rgb(98, 196, 98)"};
  border-width: ${(props: any) => (props.h ? `5px 3px` : "3px 5px")};
  margin: ${({ margin }: any) =>
    margin
      ? `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
      : ""};
  left: ${(props: any) => (props.l ? `${props.l}px` : "")};
  top: ${(props: any) => (props.t ? `${props.t}px` : "")};
  width: ${(props: any) => (props.w ? `${props.w}px` : "auto")};
  height: ${(props: any) => (props.h ? `${props.h}px` : "auto")};
  opacity: ${({ opacity }: any) => (opacity ? opacity : 0)};
  border-style: solid;
  transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s;
`;

const PlaceholderInner = styled.div`
  background-color: rgb(98, 196, 98);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  height: 100%;
  width: 100%;
  pointer-events: none;
  padding: 1.5px;
  outline: none;
`;

export default class Placeholder extends Component<any> {
  render() {
    const {  placeholder } = this.props;
    const { position } = placeholder as PlaceholderInfo;
    let { width, height, top, left, margin } = position;
    let opacity = 1;
    
    return (
      <StyledPlaceholder
        opacity={opacity}
        w={width}
        h={height}
        t={top}
        l={left}
        margin={margin}
      >
        <PlaceholderInner />
      </StyledPlaceholder>
    );
  }
}
