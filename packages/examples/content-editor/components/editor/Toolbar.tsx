import React from "react";
import { useManager } from "craftjs";
import styled from 'styled-components';


export const Toolbar = () => {
  const { active, related } = useManager(state => ({
    active: state.events.active,
    related: state.events.active && state.events.active.related
  }));

  return (
    <div className='py-5'>
        <div>
          <div className='w-full'>
            <div className='px-6'>
              <h2 className='text-black text-xl my-2 text-light-gray-1 font-medium'>
                Edit
              </h2>
            </div>
            </div>
            <div className='py-5'>
              {active && related && React.createElement(related.toolbar) }
            </div>
        </div>
    </div>
  );
};
