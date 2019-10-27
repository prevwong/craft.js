import React from "react";
import { useManager } from "craftjs";

export const Toolbar = () => {
  const { active, related } = useManager(state => ({
    active: state.events.active,
    related: state.events.active && state.events.active.related
  }));

  return (
    <div className='px-2 py-5'>
        <div>
          <div className='cx'><h2 className='text-white text-lg font-medium'>Edit</h2></div>
            <div className='py-5'>
              {active && related && React.createElement(related.toolbar) }
            </div>
        </div>
    </div>
  );
};
