import React from 'react';
import { useNode } from 'craftjs';
import { ToolbarSection, ToolbarItem } from "../../editor"
import { MenuItem, FormControlLabel, Radio } from '@material-ui/core'
import { ToolbarRadio } from '../../editor/Toolbar/ToolbarRadio';
import { capitalize, weightDescription } from '../../../utils/text';

export const TextSettings = () => {

  return (
    <React.Fragment>
      <ToolbarSection
        title="Typography"
        props={['fontSize', 'fontWeight', 'textAlign']}
        summary={({ fontSize, fontWeight, textAlign }: any) => {
          return `${fontSize || ''}, ${weightDescription(fontWeight)}, ${capitalize(textAlign)}`;
        }}>
        <ToolbarItem full={true} propKey="fontSize" type="slider" label="Font Size" />
        <ToolbarItem propKey="textAlign" type="radio" label="Align">
          <ToolbarRadio value="left" label="Left" />
          <ToolbarRadio value="center" label="Center" />
          <ToolbarRadio value="right" label="Right" />
        </ToolbarItem>
        <ToolbarItem  propKey="fontWeight" type="radio" label="Weight">
          <ToolbarRadio value="400" label="Regular" />
          <ToolbarRadio value="500" label="Medium" />
          <ToolbarRadio value="700" label="Bold" />
        </ToolbarItem>
      </ToolbarSection>
      <ToolbarSection
        title="Appearence"
        props={['color', 'shadow']}
        summary={({ color, shadow}: any) => {
          return (
            <div className='fletext-right'>
              <p style={{color: color &&`rgba(${Object.values(color)})`, textShadow: `0px 0px 2px rgba(0, 0, 0, ${shadow/100})`}} className='text-white text-right'>T</p>
            </div>
          )
        }}>
         <ToolbarItem full={true} propKey="color" type="color" label="Text" />
         <ToolbarItem full={true} propKey="shadow" type="slider" label="Shadow" />
      </ToolbarSection>
    </React.Fragment>
  );
}