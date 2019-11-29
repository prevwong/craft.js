import React from "react";
import { useManager } from "craftjs";
import styled from 'styled-components';
export * from "./ToolbarItem";
export * from "./ToolbarSection";
export * from "./ToolbarTextInput";
export * from "./ToolbarDropdown";

export const Toolbar = () => {
  const { active, related } = useManager(state => ({
    active: state.events.active,
    related: state.events.active && state.nodes[state.events.active].related
  }));

  return (
        <div className='py-1'>
          {active && related && React.createElement(related.toolbar)}
        </div>
  );
};
