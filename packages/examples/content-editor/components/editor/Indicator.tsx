import React, { useRef, useCallback } from "react";
import { useEditor } from "craftjs";
import styled from "styled-components";
import { isMoveable } from "craftjs";
import Move from "../../public/icons/move.svg"
import Delete from "../../public/icons/delete.svg"
import { isDeletable } from "craftjs";

const IndicatorDiv = styled.div`
  height:30px;
  margin-top:-29px;
  font-size: 12px;
  line-height: 12px;
  
  svg {
    fill: #fff;
    width: 15px;
  height:15px;
  }

`;


const Btn = styled.a`
  padding:0 5px;
  opacity:0.9;
  cursor:pointer;
  display:flex;
  align-items:center;
  > div {
    position:relative;
    top: -50%;
    left: -50%;
  }
`


export const Indicator = ({event}) => {
  const { id, dom, displayName, moveable, deletable, handlers, actions } = useEditor((state) => {
    const id = state.events[event];
    if ( !id ) return {};

    return {
      id,
      dom: id && state.nodes[id].dom,
      moveable: id && isMoveable(state.nodes[id]),
      deletable: id && isDeletable(state.nodes[id]),
      displayName: id && state.nodes[id].data.custom.displayName ? state.nodes[id].data.custom.displayName : state.nodes[id].data.displayName
    }
  });

  const currentRef = useRef<HTMLDivElement>();
  const parentRef = useRef<HTMLElement>();

  const scroll = useCallback(() => {
    
    const { current: currentDOM } = currentRef;
    if (!currentDOM || !dom) return;
  
    const { top, left, bottom } = dom.getBoundingClientRect();
    currentDOM.style.top = `${top > 0 ? top : bottom}px`;
    currentDOM.style.left = `${left}px`;
  }, [dom])
  

  return id ? (
    <IndicatorDiv
      ref={(dom) => {
        if (dom) {
          if ( parentRef.current ) {
            parentRef.current.removeEventListener("scroll", scroll);
          }
          currentRef.current = dom;
          parentRef.current = dom.parentElement;
          parentRef.current.addEventListener("scroll", scroll);
        }
      }}
      className="px-4 py-2 text-white bg-primary fixed flex items-center"
      style={{
        left: `${dom.getBoundingClientRect().left}px`,
        top: `${dom.getBoundingClientRect().top}px`,
        zIndex: 9999
      }}
    >
      <h2 className="flex-1">{displayName}</h2>
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
            actions.delete(id);

          }}><Delete /></Btn>
        ) : null
      }
    </IndicatorDiv>
  ) : null
}