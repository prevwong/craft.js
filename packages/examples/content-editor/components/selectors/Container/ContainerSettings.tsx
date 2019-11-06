import React from 'react';
import {useNode} from 'craftjs';
import { ToolbarSection, ToolbarItem } from "../../editor"
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Divider, Typography, Chip, TextField } from '@material-ui/core'

export const ContainerSettings = () => {
  const { width, height, actions: { setProp } } = useNode((node) => ({ width: node.data.props.width || 0, height: node.data.props.height || 0 }));

  return (
    <React.Fragment>
      <ToolbarSection
        title="Dimensions"
        props={['width', 'height']}
        summary={({ width, height }: any) => {
          return `${width || 0} x ${height || 0}`;
        }}>
        <ToolbarItem propKey="width" type="text" label="Width" />
        <ToolbarItem propKey="height" type="text" label="Height" />
      </ToolbarSection>
      <ToolbarSection
        title="Colors"
        props={['background', 'color']}
        summary={({ background, color }: any) => {
          return (
            <div className='flex flex-row-reverse'>
              <div style={{background: background &&`rgba(${Object.values(background)})`}} className='shadow-md flex-end w-6 h-6 text-center flex items-center rounded-full bg-black'>
                <p style={{color: color &&`rgba(${Object.values(color)})`}} className='text-white w-full text-center'>T</p>
              </div> 
            </div>
          );
        }}>
        <ToolbarItem full={true} propKey="background" type="bg" label="Background" />
        <ToolbarItem full={true} propKey="color" type="color" label="Text" />
      </ToolbarSection>
      <ToolbarSection
        title="Margin"
        props={['marginTop', 'marginBottom', 'marginLeft', 'marginRight']}
        summary={({ marginTop, marginRight, marginBottom, marginLeft }: any) => {
          return `${marginTop || 0}px ${marginRight || 0}px ${marginBottom || 0}px ${marginLeft || 0}px`;
        }}>
        <ToolbarItem propKey="marginTop" type="number" label="Top" />
        <ToolbarItem propKey="marginBottom" type="number" label="Bottom" />
        <ToolbarItem propKey="marginLeft" type="number" label="Left" />
        <ToolbarItem propKey="marginRight" type="number" label="Right" />
      </ToolbarSection>
      <ToolbarSection
        title="Padding"
        props={['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']}
        summary={({ paddingTop, paddingRight, paddingBottom, paddingLeft }: any) => {
          return `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`;
        }}>
        <ToolbarItem propKey="paddingTop" type="number" label="Top" />
        <ToolbarItem propKey="paddingBottom" type="number" label="Bottom" />
        <ToolbarItem propKey="paddingLeft" type="number" label="Left" />
        <ToolbarItem propKey="paddingRight" type="number" label="Right" />
      </ToolbarSection>
      <ToolbarSection
        title="Decoration"
        props={['radius', 'shadow']}
        >
        <ToolbarItem full={true} propKey="radius" type="slider" label="Radius" />
        <ToolbarItem full={true} propKey="shadow" type="slider" label="Shadow" />
      </ToolbarSection>
     

    </React.Fragment>
  );
}