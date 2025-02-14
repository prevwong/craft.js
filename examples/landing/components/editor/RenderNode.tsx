import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { styled } from 'styled-components';

import ArrowUp from '../../public/icons/arrow-up.svg';
import Delete from '../../public/icons/delete.svg';
import Duplicate from '../../public/icons/duplicate.svg';
import Move from '../../public/icons/move.svg';

const IndicatorDiv = styled.div`
  height: 30px;
  margin-top: -29px;
  font-size: 12px;
  line-height: 12px;
`;

const Btn = styled.a`
  padding: 0 0px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    top: -50%;
    left: -50%;
  }

  svg {
    fill: #fff;
    width: 15px;
    height: 15px;
  }
`;

const DuplicateBtn = styled.a`
  padding: 0 0px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    top: -50%;
    left: -50%;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const RenderNode = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
    isCanvas,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
    isCanvas: query.node(node.id).isCanvas(),
  }));

  const currentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add('component-selected');
      else dom.classList.remove('component-selected');
    }
  }, [dom, isActive, isHover]);

  const getPos = React.useCallback((dom: HTMLElement) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const scroll = React.useCallback(() => {
    const { current: currentDOM } = currentRef;

    if (!currentDOM) {
      return;
    }

    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  React.useEffect(() => {
    document
      .querySelector('.craftjs-renderer')
      .addEventListener('scroll', scroll);

    return () => {
      document
        .querySelector('.craftjs-renderer')
        .removeEventListener('scroll', scroll);
    };
  }, [scroll]);

  return (
    <>
      {isHover || isActive
        ? ReactDOM.createPortal(
            <IndicatorDiv
              ref={currentRef}
              className="px-2 py-2 text-white bg-primary fixed flex items-center"
              style={{
                left: getPos(dom).left,
                top: getPos(dom).top,
                zIndex: 9999,
              }}
            >
              <h2 className="flex-1 mr-4">{name}</h2>
              {moveable ? (
                <Btn
                  className="mr-2 cursor-move"
                  ref={(dom) => {
                    drag(dom);
                  }}
                >
                  <Move viewBox="-4 -3 24 24" />
                </Btn>
              ) : null}
              {id !== ROOT_NODE && (
                <Btn
                  className="mr-2 cursor-pointer"
                  onClick={() => {
                    actions.selectNode(parent);
                  }}
                >
                  <ArrowUp viewBox="-4 -1 24 24" />
                </Btn>
              )}
              {deletable ? (
                <Btn
                  className="mr-2 cursor-pointer"
                  onMouseDown={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                >
                  <Delete viewBox="-4 -3 24 24" />
                </Btn>
              ) : null}
              {!isCanvas ? (
                <DuplicateBtn
                  className="cursor-pointer"
                  onMouseDown={() => {
                    const {
                      data: { type, props },
                    } = query.node(id).get();
                    actions.add(
                      query.createNode(React.createElement(type, props)),
                      parent
                    );
                  }}
                >
                  <Duplicate />
                </DuplicateBtn>
              ) : null}
            </IndicatorDiv>,
            document.querySelector('.page-container')
          )
        : null}
      {render}
    </>
  );
};
