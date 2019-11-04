import React, { useEffect, Ref } from 'react';
import { useManager } from 'craftjs';
import { useState } from 'react';
import {Actions} from "./Actions"

export const EditorRenderer = React.forwardRef(({children, ...props}, ref: (dom: HTMLElement) => void) => {
  const { activeDOM, activeProps, closestParent, index} = useManager((state) => ({
    activeDOM: state.events.active && state.events.active.ref.dom,
    activeProps: state.events.active && state.events.active.data.props,
    closestParent: state.events.active && state.events.active.data.parent,
    index: state.events.active && state.events.active.data.index

  }));
  const [observerStyle, setObserverStyle] = useState({
    width:0,
    height:0,
    left:0,
    top:0
  });

  useEffect(() => {
    if (activeDOM ) {
     setTimeout(() => {
        const { width, height, top, left } = activeDOM.getBoundingClientRect();
        setObserverStyle({
          width,
          height,
          left,
          top
        });
     })
    }

  }, [activeDOM, activeProps, closestParent, index ]);

  // console.log('re2');
  return (
    <div ref={(dom) => ref(dom) } style={{ borderColor: "#EEECF1" }} className="p-4 w-full h-full overflow-auto flex items-center"  {...props}>
        {
          activeDOM && (
           <React.Fragment>
              <div className='pointer-events-none fixed border-dashed border z-50 border-black' style={observerStyle}/>
              <Actions />
           </React.Fragment>
          )
        }
        {children} 
    </div>
  )
})