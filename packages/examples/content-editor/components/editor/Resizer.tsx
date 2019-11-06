import React, { useRef, useLayoutEffect, useEffect } from "react";
import styled from "styled-components";
import { Resizable } from "re-resizable";
import { isRoot, useNode, useManager } from "craftjs";
import cx from "classnames";
import {  isPercentage, pxToPercent, measurementToPx, percentToPx } from "../../utils/numToMeasurement";
import {debounce} from "lodash";
export type Resizer = {
  propKey: Record<'width' | 'height', string>
  children: React.ReactNode;
};

const ResizerDiv = styled.div`
  
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
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
      pointer-events:none;
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

export const Resizer = ({ 
  propKey, 
  children, 
  ...props 
}: any,) => {
  const resizable = useRef<Resizable>(null);
  const isResizing = useRef<boolean>(false);

  const { nodeWidth, nodeHeight, id, isRootNode, actions, active, _inNodeContext, connectTarget, connectDragHandler } = useNode(node => ({
    id: node.id,
    isRootNode: isRoot(node),
    parent: node.data.parent,
    active: node.event.active,
    nodeWidth: node.data.props[propKey.width],
    nodeHeight: node.data.props[propKey.height]
  }));

  const internalDimensions = useRef<any>({ width: nodeWidth, height: nodeHeight });

  // useEffect(() => {
  //   const dom = resizable.current.resizable;
  //   if (isResizing.current || (!dom || !dom.parentElement)) return;
  //   internalDimensions.current = {
  //     width: nodeWidth,
  //     height: nodeHeight
  //   }
  //   resizable.current.updateSize(internalDimensions.current);
  // }, [nodeWidth, nodeHeight]);

  const updateInternalDimension = (width, height) => {
    const dom = resizable.current.resizable;
    if (!dom) return;
    let newWidth, newHeight;

    if (!isPercentage(nodeWidth)) {
      newWidth = parseInt(internalDimensions.current.width) + parseInt(width) + "px";
    } else {
      newWidth = (parseInt(internalDimensions.current.width) + pxToPercent(width, dom.parentElement.clientWidth)).toFixed(2) + "%";
    }

    if (!isPercentage(nodeHeight)) {
      newHeight = parseInt(internalDimensions.current.height) + parseInt(height) + "px";
    } else {
      newHeight = (parseInt(internalDimensions.current.height) + pxToPercent(height, dom.parentElement.clientHeight)).toFixed(2)+ "%";
    }
    
    return {
      width: newWidth,
      height: newHeight
    }
  }

  return (
      <Resizable
      enable={['top', 'left', 'bottom', 'right', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'].reduce((acc: any, key) => {
        acc[key] = active && _inNodeContext;
        return acc;
      }, {})}

        className={cx([{
          'm-auto': isRootNode,
          'flex': true,
          'items-center': true
        }])}
        ref={(ref) => {
          if ( ref ) {
            resizable.current = ref;
            connectTarget(resizable.current.resizable);
          }
        }}
        size={{width: nodeWidth, height: nodeHeight}}
        onResizeStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          isResizing.current = true;
        }}
        onResize={debounce((e, direction, ref, d) => {
          e.preventDefault();
          e.stopPropagation();
          const n = updateInternalDimension(d.width, d.height);
          if (!n) return;

      

          actions.setProp((prop: any) => {
            prop[propKey.width] = n.width;
            prop[propKey.height] = n.height;
          })
        })}
        onResizeStop={(e, __, ___, d) => {
          e.preventDefault();
          setTimeout(() => {
            if (!active) return
            const n = updateInternalDimension(d.width, d.height);
            // if ( !n ) return;
            actions.setProp((prop: any) => {
              prop[propKey.width] = n.width;
              prop[propKey.height] = n.height;
            })
            isResizing.current = false;
            internalDimensions.current = {
              width: n.width,
              height: n.height
            }
          })
        }}
      >
        <ResizerDiv
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
      </Resizable>
  );
};
