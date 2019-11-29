import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNode, isDeletable, useManager } from "craftjs";
import styled from "styled-components";
import { isMoveable } from "craftjs";
import Move from "../../public/icons/move.svg"
import Delete from "../../public/icons/delete.svg"
import ReactDOM from "react-dom";

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
  padding:0 0px;
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

export const RenderNode = ({ render }) => {
  const { actions, handlers } = useManager();
  const { id, isActive, isHover, dom, name, moveable, deletable, connectDragHandler } = useNode((node) => ({
    isActive: node.event.active,
    isHover: node.event.hover,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: isMoveable(node),
    deletable: isDeletable(node)
  }));

  const currentRef = useRef<HTMLDivElement>();


  useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add("component-selected");
      else dom.classList.remove("component-selected");
    }
  }, [dom, isActive, isHover]);


  const getPos = useCallback((dom: HTMLElement) => {
    const { top, left, bottom } = dom ? dom.getBoundingClientRect() : {top: 0, left:0, bottom: 0};
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`
    } 
  }, [])

  const scroll = useCallback(() => {
    const { current: currentDOM } = currentRef;

    if (!currentDOM) return;
    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom]);

  useEffect(() => {
    document.querySelector('.craftjs-renderer').addEventListener("scroll", scroll);

    return (() => {
      document.querySelector('.craftjs-renderer').removeEventListener("scroll", scroll);
    })
  }, [scroll]);


  return (
    <>
      {
        (isHover || isActive) ? ReactDOM.createPortal(
          <IndicatorDiv
            ref={currentRef}
            className="px-2 py-2 text-white bg-primary fixed flex items-center"
            style={{
              left: getPos(dom).left,
              top: getPos(dom).top,
              zIndex: "9999"
            }}
          >
            <h2 className="flex-1 mr-4">{name}</h2>
            {
              moveable ? (
                <Btn className="mr-2" ref={connectDragHandler}>
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
        , document.body) : null
      }
      {render}
    </>
  )
}