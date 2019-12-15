import React from "react";
import { useEditor} from "craftjs";
import styled from 'styled-components';
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
        <div className='py-1'>
          {active && related && React.createElement(related.toolbar)}
        </div>
  );
};
