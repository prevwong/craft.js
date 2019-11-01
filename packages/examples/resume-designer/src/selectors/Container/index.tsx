import React from "react";
import { Resizer, ResizerEditorSection } from "../../components/Resizer";
import { useNode } from "craftjs";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Divider, Typography, Chip, TextField } from '@material-ui/core'
import { ContainerSettings } from "./ContainerSettings";

export type Container = {
  background: string;
  color:string,
  flexDirection: "col" | "row";
  width: string;
  height: string;
  paddingTop: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingRight: number;
  marginTop: number;
  marginLeft: number;
  marginBottom: number;
  marginRight: number;
  margin: number[];
  shadow: number;
  children: React.ReactNode;
  radius: number
};

export const Container = ({
  children,
  height,
  width,
  paddingTop = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingBottom = 0,
  marginTop = 0,
  marginLeft = 0,
  marginRight = 0,
  marginBottom = 0,
  flexDirection = "row",
  background = 'rgba(0,0,0,1)',
  color='rgba(255,255,255,1)',
  shadow = 0,
  radius = 0
}: Partial<Container>) => {
  return (
    <Resizer
      width={width}
      height={height}
      propKey={{ width: "width", height: "height" }}
      style={{ 
        background: `rgba(${Object.values(background)})`, 
        color: `rgba(${Object.values(color)})`, 
        padding: `${paddingTop || 0}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
        margin: `${marginTop || 0}px ${marginRight}px ${marginBottom}px ${marginLeft}px`,
        boxShadow: shadow == 0 ? 'none' : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
        borderRadius: `${radius}px`
      }}
    >
        {children}
    </Resizer>
  );
};

Container.related = {
  toolbar: ContainerSettings
}