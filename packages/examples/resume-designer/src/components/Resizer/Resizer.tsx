import React, { useRef, useLayoutEffect, useEffect } from "react";
import styled from "styled-components";
import { Resizable } from "re-resizable";
import { useNode, useManager } from "craftjs";
import cx from "classnames";
import {  isPercentage, pxToPercent, measurementToPx, percentToPx } from "../../utils/numToMeasurement";
import { useCallback } from "react";

export type Resizer = {
  propKey: Record<'width' | 'height', string>
  children: React.ReactNode;
};

const ResizerDiv = styled.div`
  
  width: 100%;
  height: 100%;
  position: relative;
  .resizer-indicators {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events:none;
    span {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 100%;
      display: block;
      box-shadow:0px 0px 12px -1px rgba(0, 0, 0, 0.32);
      z-index:99999;
      &:nth-child(1) {
        left: -5px;
        top: -5px;
      }
      &:nth-child(2) {
        right: -5px;
        top: -5px;
      }
      &:nth-child(3) {
        bottom: -5px;
        left: -5px;
      }
      &:nth-child(4) {
        bottom: -5px;
        right: -5px;
      }
    }
  }
`;

export const Resizer = React.forwardRef(({ propKey, children, ...props }: any, domRef: (dom: HTMLElement) => void) => {
  const resizable = useRef<Resizable>(null);
  const isResizing = useRef<boolean>(false);

  const { id, isRoot, actions, active, connectTarget, connectDragHandler, nodeWidth, nodeHeight } = useNode(node => ({
    id: node.id,
    isRoot: node.id == "ROOT",
    parent: node.data.parent,
    nodeWidth: node.data.props[propKey.width],
    nodeHeight: node.data.props[propKey.height],
    active: node.event.active
  }));


  const dom = resizable.current && resizable.current.resizable;
  const internalDimensions = useRef<any>({ width: nodeWidth, height: nodeHeight });

  useEffect(() => {
    if (isResizing.current || (!dom || !dom.parentElement)) return;
    // const width = measurementToPx(nodeWidth, dom, 'width');
    // const height = measurementToPx(nodeHeight, dom, 'height');
    // const {width, height} = updateInternalDimension(nodeWidth, nodeHeight);
    // console.log(66, width, height)
    // if ( internalDimensions.current.height == height && internalDimensions.current.width == width ) return;
    internalDimensions.current = {
      width: nodeWidth,
      height: nodeHeight
    }
    resizable.current.updateSize(internalDimensions.current);
  }, [isResizing, nodeWidth, nodeHeight]);
 



  const updateInternalDimension = useCallback((width, height) => {
    let newWidth, newHeight;

    if (!isPercentage(nodeWidth)) {
      newWidth = parseInt(internalDimensions.current.width) + parseInt(width) + "px";
    } else {
      newWidth = (parseInt(internalDimensions.current.width) + pxToPercent(width, dom.parentElement.clientWidth)).toFixed(4) + "%";
    }

    if (!isPercentage(nodeHeight)) {
      newHeight = parseInt(internalDimensions.current.height) + parseInt(height) + "px";
    } else {
      newHeight = (parseInt(internalDimensions.current.height) + pxToPercent(height, dom.parentElement.clientHeight)).toFixed(4)+ "%";
    }

    // console.log(newWidth);
    return {
      width: newWidth,
      height: newHeight
    }
  }, [internalDimensions, nodeWidth, nodeHeight, dom])


  return (
      <Resizable
        enable={['top', 'left', 'bottom', 'right', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'].reduce((acc: any, key) => {
          acc[key] = active;
          return acc;
        }, {})}
        className={cx([`bg-white`, {
          'm-auto': isRoot,
          'flex': true,
          'items-center': true
        }])}
        ref={resizable}
        defaultSize={{ width: nodeWidth, height: nodeHeight }}
        onResizeStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          isResizing.current = true;
        }}
        onResize={(e, direction, ref, d) => {
          e.preventDefault();
          e.stopPropagation();
          const n = updateInternalDimension(d.width, d.height);
          actions.setProp((prop: any) => {
            // if (isPercentage(prop[propKey.height])) {
            //   prop[propKey.height] = pxToPercent(newHeight, dom.parentElement.getBoundingClientRect().height) + "%"
            // } else {
            //   prop[propKey.height] = newHeight + "px"
            // }

            // if (isPercentage(prop[propKey.width])) {
            //   prop[propKey.width] = pxToPercent(newWidth, dom.parentElement.getBoundingClientRect().width) + "%"
            // } else {
            //   prop[propKey.width] = newWidth + "px"
            // }

           
            prop[propKey.width] = n.width;
            prop[propKey.height] = n.height;

          })
        }}
        onResizeStop={(e, __, ___, d) => {
          e.preventDefault();
          if (!active) return
          const {width, height} = updateInternalDimension(d.width, d.height);
          isResizing.current = false;
          internalDimensions.current = {
            width,
            height
          }
        }}
      onMouseDown={(e: React.MouseEvent) => {
        e.stopPropagation();
        return false;
      }}
      onMouseOver={(e: React.MouseEvent) => {
        e.stopPropagation();
        return false;
      }}
        
      >
        {
          connectTarget(
            connectDragHandler(
              <ResizerDiv
                className='w-full h-full flex items-center'
                ref={domRef}
                {...props}
              >
                {children}
                {active && (
                  <div className={cx(['resizer-indicators'])}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </ResizerDiv>
            )
          )
        }
      </Resizable>
  );
});
