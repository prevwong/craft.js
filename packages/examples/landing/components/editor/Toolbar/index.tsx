import React from "react";
import { useEditor} from "@craftjs/core";
export * from "./ToolbarItem";
export * from "./ToolbarSection";
export * from "./ToolbarTextInput";
export * from "./ToolbarDropdown";

export const Toolbar = () => {
  const { active, related } = useEditor(state => ({
    active: state.events.selected,
    related: state.events.selected && state.nodes[state.events.selected].related
  }));

  return (
    <div className='py-1 h-full'>
      {active && related.toolbar && React.createElement(related.toolbar)}
      {!active &&
        <div className="px-2 py-2 flex items-center h-full justify-center text-center" style={{color:"rgba(0, 0, 0, 0.5607843137254902)", fontSize: "11px"}}>
          <h2>Click on a component to start editing</h2>
        </div>
      }
    </div>
  );
};
