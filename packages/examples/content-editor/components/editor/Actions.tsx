import React, {useMemo} from 'react';
import Move from "../../public/icons/move.svg"
import Delete from "../../public/icons/delete.svg"
import styled from 'styled-components';
import { useManager, isDeletable, isMoveable } from "craftjs";

const ActionDiv = styled.div`
  z-index: 9999;
`;

const Btn = styled.a`
  width: 25px;
  height:25px;
  padding:0 5px;
  opacity:0.9;
  cursor:pointer;
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
  const { id, activeDOM, deletable, moveable, actions, activeId, handlers } = useManager((state) => ({ 
    id: state.events.active && state.events.active.id,
    activeId: state.events.active && state.events.active.id, 
    activeDOM: state.events.active && state.events.active.ref.dom,
    deletable: state.events.active && isDeletable(state.events.active),
    moveable: state.events.active && isMoveable(state.events.active)
  }))

  const info = useMemo(() => {
    const { width, right, left, top} = activeDOM.getBoundingClientRect();
    return {
      left: right,
      top: top
    }
  }, [activeDOM]);

  // console.log("root", isRoot)
  return (!deletable && !moveable) ? null : (
    <ActionDiv 
      className='fixed'
      style={info}
    >
      <div className='px-2 py-2 rounded bg-white shadow-md flex'>
        {
          moveable ? (
            <Btn 
              draggable={true}
              onMouseDown={(e: React.MouseEvent) => {
                e.stopPropagation();
              }}
              onDragStart={(e: React.MouseEvent) => {
                e.stopPropagation();
                handlers.onDragStart(e, id);
              }}
              onDragEnd={(e: React.MouseEvent) => {
                e.stopPropagation();
                handlers.onDragEnd(e);
              }}
            >
              <Move />
            </Btn>
          ) : null
        }
        {
          deletable ? (
            <Btn onMouseDown={(e: React.MouseEvent) => {
              e.stopPropagation();
              actions.delete(activeId);

            }}><Delete /></Btn>
          ) : null
        }
    </div>
    </ActionDiv>
  )
}