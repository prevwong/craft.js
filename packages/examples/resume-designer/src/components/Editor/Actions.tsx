import React, {useMemo} from 'react';
import {ReactComponent as Move} from "../../icons/move.svg"
import {ReactComponent as Delete} from "../../icons/delete.svg"
import styled from 'styled-components';
import {useManager} from "craftjs";

const ActionDiv = styled.div`
  z-index: 9999;
`;

const Btn = styled.a`
  width: 25px;
  height:25px;
  padding:0 5px;
  opacity:0.9;
  > div {
    position:relative;
    top: -50%;
    left: -50%;
  }
  svg {
    width: 100%;
    height: 100%;
    fill: rgb(75,75,75)
  }
`

export const Actions = () => {
  const {activeDOM } = useManager((state) => ({ activeDOM: state.events.active && state.events.active.ref.dom }))

  const info = useMemo(() => {
    const { width, right, left, top} = activeDOM.getBoundingClientRect();
    return {
      left: right,
      top: top
    }
  }, [activeDOM]);

  return (
    <ActionDiv 
      className='fixed'
      style={info}
    >
      <div className=' px-2 py-2 rounded bg-white shadow-md flex'>
        <Btn><Move /></Btn>
        <Btn><Delete /></Btn>
    </div>
    </ActionDiv>
  )
}