import React, { useEffect } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { useState } from 'react';
import { useNode } from 'craftjs';
import { ChromePicker } from 'react-color'

const Item = styled.div`
  position:relative;
  display:inline-block;
  align-items:center;
  .editor-item-prefix {
    position:absolute;
    pointer-events:none;
    font-size:12px;
    margin-left: 10px;
    color:rgb(75, 213, 255);
    &.prefix-color {
      width:10px;
      height:10px;
      background-color:transparent;
      border-radius:100%;
      box-shadow:0px 3px 14px -1px rgba(0, 0, 0, 0.34901960784313724);
    }
  }

  input.editorInput {
    font-size:12px;
    padding: 3px 2px 3px 30px;
    text-align:center;
    width: 100%;
    border-radius:100px;
    background:rgba(0, 0, 0, 0.08);
    color:#fff;
    outline:none;
    text-align:left;
    &:focus {
      background:rgba(0, 0, 0, 0.28);
    }
  }
`


export type EditorItem = {
    prefix?: string;
    full?: boolean;
    propKey?: string;
    onEnter?: (value: any) => void;
    type: string
}
export const EditorItem = ({ prefix, full = false, propKey, onEnter, type, ...props }: EditorItem) => {
  const [internalValue, setInternalValue] = useState(propKey);
  const [active, setActive] = useState(false);

  const { actions, value } = useNode((node) => ({ value: node.data.props[propKey] }));

  useEffect(() => {
    if (value !== internalValue) {
      let val = value;
      if ( type == 'color') val = `rgba(${Object.values(value)})`
      setInternalValue(val);
    }
  }, [value]);

  

    return (
        <Item className={cx(['cx', 'inline-block', 'mb-1'], {
          'w-3/6': !full,
          'w-full': full,
        })}>
           <div className='flex items-center relative' onClick={() => {
             setActive(true);
           }}>
            {
              (type == 'color' && active) ? (
              <div className="absolute" style={{ top: "calc(100% + 10px)", left:"-7px"}}>
                  <div className="fixed top-0 left-0 w-full h-full cursor-pointer" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActive(false)
                  }}></div>
                  <ChromePicker color={value} onChange={(color: any) => {
                    actions.setProp((prop: any) => {
                      prop[propKey] = color.rgb;
                    })
                  }} />
                </div>
              ) : null
            }
            <span className={cx(['editor-item-prefix', {
              'prefix-color' : type == 'color'
            }])} style={{ background: type == 'color' ? `rgba(${Object.values(value)})` : 'transparent'}}>{type !== 'color' && prefix ? prefix : null}</span>
            <input
              onKeyDown={e => {
                if (e.keyCode == 13) {
                  if (onEnter) {
                    onEnter(e.currentTarget.value);
                  } else if (propKey) {
                    actions.setProp((prop: any) => {
                      prop[propKey] = e.currentTarget.value;
                    })
                  }
                }
              }}
              onChange={e => {
                setInternalValue(e.currentTarget.value)
              }}
              value={internalValue || ''}
              className='editorInput'
              type = {type == 'color' ? 'text' : type}
              {...props}
            />
           </div>
        </Item>
    )
}
