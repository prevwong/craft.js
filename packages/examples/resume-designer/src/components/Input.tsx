import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNode } from 'craftjs';

export const Input = ({onEnter, propKey, ...props} : any) => {
  const [internalValue, setInternalValue] = useState(propKey);
  const { actions, value } = useNode((node) => ({ value: node.data.props[propKey]}));

  useEffect(() => {
    if ( value !== internalValue ) {
      setInternalValue(value);
    }
  }, [value]);
  return (
    <input
      onKeyDown={e => {
        if (e.keyCode == 13) {
          if ( onEnter ) {
            onEnter(e.currentTarget.value);
          } else if ( propKey ) {
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
      {...props}
    />
  )
}