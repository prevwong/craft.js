import React, { useEffect, Ref } from 'react';
import { useManager } from 'craftjs';
import { useState } from 'react';
import {Actions} from "./Actions"
import {debounce} from "lodash";

export const EditorRenderer = ({children, ...props}) => {
  const { active } = useManager((state) => {
    const nodeId = state.events.active;
    return {
      active: nodeId && state.nodes[nodeId]
    }
  });



  const [observerStyle, setObserverStyle] = useState({
    width:0,
    height:0,
    left:0,
    top:0
  });

  useEffect(debounce(() => {
    if (active ) {
    //  setTimeout(() => {
        const { width, height, top, left } = active.dom.getBoundingClientRect();
        setObserverStyle({
          width,
          height,
          left,
          top
        });
    //  })
    }

  }), [active]);

  // console.log('re2');
  return (
    <div style={{ borderColor: "#EEECF1" }} className="p-4 w-full h-full overflow-auto items-center"  {...props}>
        {
          active && (
           <React.Fragment>
              <div className='pointer-events-none fixed border-dashed border z-50 border-black' style={observerStyle}/>
              <Actions />
           </React.Fragment>
          )
        }
       <div className="flex-col flex items-center">
        {children} 
       </div>
    </div>
  )
}