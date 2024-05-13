import { useEditor } from '@craftjs/core';
import React from 'react';

export * from './ToolbarItem';
export * from './ToolbarSection';
export * from './ToolbarTextInput';
export * from './ToolbarDropdown';

export const Toolbar = () => {
  const { active, toolbar } = useEditor((query) => {
    // TODO: handle multiple selected elements
    const currentlySelectedNode = query.event('selected').getFirst();
    return {
      active: currentlySelectedNode?.id ?? null,
      toolbar:
        currentlySelectedNode && currentlySelectedNode.getRelated('toolbar'),
    };
  });

  return (
    <div className="py-1 h-full">
      {active && toolbar && React.createElement(toolbar)}
      {!active && (
        <div
          className="px-5 py-2 flex flex-col items-center h-full justify-center text-center"
          style={{
            color: 'rgba(0, 0, 0, 0.5607843137254902)',
            fontSize: '11px',
          }}
        >
          <h2 className="pb-1">Click on a component to start editing.</h2>
          <h2>
            You could also double click on the layers below to edit their names,
            like in Photoshop
          </h2>
        </div>
      )}
    </div>
  );
};
