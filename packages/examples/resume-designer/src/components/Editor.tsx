import React, { useEffect } from 'react';
import { useManager } from 'craftjs';
import ResizeObserver from '@juggle/resize-observer';
import { useState } from 'react';
import { useMemo } from 'react';

export const Editor:React.FC = ({children, ...props}) => {
  const { activeDOM, activeProps} = useManager((state) => ({
    activeDOM: state.events.active && state.events.active.ref.dom,
    activeProps: state.events.active && state.events.active.data.props
  }));
  const [observerStyle, setObserverStyle] = useState({});

 

  useEffect(() => {
    if (activeDOM && activeProps ) {
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

  }, [activeDOM, activeProps]);

  // if (active) console.log(getComputedStyle(active.ref.dom).marginLeft, active.ref.dom.getBoundingClientRect().left)
  return (
    <div style={{ borderColor: "#EEECF1" }} className="p-4 w-full h-full overflow-auto flex items-center"  {...props}>
      {
        activeProps && <div 
          className='pointer-events-none fixed border-dashed border z-50 border-black'
          style = {observerStyle}
        />
       
      }
        {children} 
    </div>
  )
}