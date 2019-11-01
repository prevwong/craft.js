import React from 'react';
import {useNode} from 'craftjs';
import { SettingsPanel } from "../../components/Editor/SettingsPanel"
import { EditorItem } from "../../components/EditorItem"
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Divider, Typography, Chip, TextField } from '@material-ui/core'

export const ContainerSettings = () => {
  const { width, height, actions: { setProp } } = useNode((node) => ({ width: node.data.props.width || 0, height: node.data.props.height || 0 }));

  return (
    <React.Fragment>
      <SettingsPanel
        title="Dimensions"
        props={['width', 'height']}
        summary={({ width, height }: any) => {
          return `${width || 0} x ${height || 0}`;
        }}>
        <EditorItem propKey="width" type="text" label="Width" />
        <EditorItem propKey="height" type="text" label="Height" />
      </SettingsPanel>
      <SettingsPanel
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
        <EditorItem full={true} propKey="background" type="bg" label="Background" />
        <EditorItem full={true} propKey="color" type="color" label="Text" />
      </SettingsPanel>
      <SettingsPanel
        title="Margin"
        props={['marginTop', 'marginBottom', 'marginLeft', 'marginRight']}
        summary={({ marginTop, marginRight, marginBottom, marginLeft }: any) => {
          return `${marginTop || 0}px ${marginRight || 0}px ${marginBottom || 0}px ${marginLeft || 0}px`;
        }}>
        <EditorItem propKey="marginTop" type="number" label="Top" />
        <EditorItem propKey="marginBottom" type="number" label="Bottom" />
        <EditorItem propKey="marginLeft" type="number" label="Left" />
        <EditorItem propKey="marginRight" type="number" label="Right" />
      </SettingsPanel>
      <SettingsPanel
        title="Padding"
        props={['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']}
        summary={({ paddingTop, paddingRight, paddingBottom, paddingLeft }: any) => {
          return `${paddingTop || 0}px ${paddingRight || 0}px ${paddingBottom || 0}px ${paddingLeft || 0}px`;
        }}>
        <EditorItem propKey="paddingTop" type="number" label="Top" />
        <EditorItem propKey="paddingBottom" type="number" label="Bottom" />
        <EditorItem propKey="paddingLeft" type="number" label="Left" />
        <EditorItem propKey="paddingRight" type="number" label="Right" />
      </SettingsPanel>
       <SettingsPanel
        title="Rounded"
        props={['radius']}
        summary={({ radius }: any) => {
          return `${radius || 0}px`;
        }}>
        <EditorItem full={true} propKey="radius" type="slider" label="Radius" />
      </SettingsPanel>
       <SettingsPanel
        title="Shadow"
        props={['shadow']}
        summary={({ shadow }: any) => {
          return `${shadow || 0}px`;
        }}>
        <EditorItem full={true} propKey="shadow" type="slider" label="Shadow" />
      </SettingsPanel>

    </React.Fragment>
  );
}