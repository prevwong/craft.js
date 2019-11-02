import React from 'react';
import { useNode } from 'craftjs';
import { ToolbarSection, ToolbarItem } from "../../editor"
import { MenuItem } from '@material-ui/core'

export const TextSettings = () => {

  return (
    <React.Fragment>
      <ToolbarSection
        title="Typography"
        props={['fontSize']}
        summary={({ fontSize }: any) => {
          return `${fontSize}`;
        }}>
        <ToolbarItem propKey="fontSize" type="select" label="Font size">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </ToolbarItem>
        <ToolbarItem propKey="fontSize" type="number" label="Font sise" />
      </ToolbarSection>
     
    </React.Fragment>
  );
}