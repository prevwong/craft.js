import React from "react";
import { useManager } from "craftjs-core";

export const Toolbar = () => {
  const { active } = useManager(state => ({
    active: state.events.active
  }));

  return (
    <div className='px-6 py-5'>
        <div>
            <h2 className='text-lg font-medium'>Edit</h2>
            <div className='py-5'>
                {active && active.related && (active.related.toolbar) }
            </div>
        </div>
    </div>
  );
};
