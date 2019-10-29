import React, { useEffect } from 'react';
import { useManager } from 'craftjs';
import { useState } from 'react';

export const Editor:React.FC = ({children, ...props}) => {
  const { activeDOM, activeProps, closestParent } = useManager((state) => ({
    activeDOM: state.events.active && state.events.active.ref.dom,
    activeProps: state.events.active && state.events.active.data.props,
    closestParent: state.events.active && state.events.active.data.closestParent
  }));
  const [observerStyle, setObserverStyle] = useState({
    width:0,
    height:0,
    left:0,
    top:0
  });

  useEffect(() => {
    console.log("changed", closestParent)
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

  }, [activeDOM, activeProps, closestParent ]);

  // if (active) console.log(getComputedStyle(active.ref.dom).marginLeft, active.ref.dom.getBoundingClientRect().left)
  return (
    <div style={{ borderColor: "#EEECF1" }} className="p-4 w-full h-full overflow-auto flex items-center"  {...props}>
        {
          activeDOM && (
          <div className='pointer-events-none fixed border-dashed border z-50 border-black' style={observerStyle}/>
          )
        }
        {children} 
    </div>
  )
}