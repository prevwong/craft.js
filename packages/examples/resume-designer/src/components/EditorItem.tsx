import React from 'react';
import styled from 'styled-components';

const Item = styled.div`
  position:relative;
  display:flex;
  align-items:center;
  .editor-item-prefix {
    position:absolute;
    pointer-events:none;
    font-size:12px;
    margin-left: 10px;
    color:rgb(75, 213, 255);
  }

  input {
    font-size:12px;
    padding: 3px 2px 3px 20px;
    text-align:center;
    width: 75px;
    border-radius:100px;
    background:rgba(0, 0, 0, 0.08);
    color:#fff;
    outline:none;
    &:focus {
      background:rgba(0, 0, 0, 0.28);
    }
  }
`


export type EditorItem = {
    prefix: string;
    full?: boolean;
    children: React.ReactNode
}
export const EditorItem = ({prefix, full=false, children}: EditorItem) => {
    return (
        <Item className={`cx inline-block`}>
           <span className="editor-item-prefix">{prefix}</span>
           {children}
        </Item>
    )
}
