import React from "react";
import { Resizer } from "../../editor/Resizer";
import { ContainerSettings } from "./ContainerSettings";

export type Container = {
  background: Record<'r'|'g'|'b'|'a', number>;
  color:string,
  flexDirection: "column" | "row";
  alignItems: string;
  justifyContent: string;
  width: string;
  height: string;
  padding: [string, string, string, string];
  margin: [string, string, string, string];
  marginTop: number;
  marginLeft: number;
  marginBottom: number;
  marginRight: number;
  shadow: number;
  children: React.ReactNode;
  radius: number
};

export const Container = ({
  children,
  alignItems,
  padding,
  margin,
  flexDirection,
  justifyContent,
  background,
  color,
  shadow,
  radius
}: Partial<Container>) => {
  return (
    <Resizer
      propKey={{ width: "width", height: "height" }}
      style={{ 
        flexDirection,
        alignItems,
        justifyContent,
        background: `rgba(${Object.values(background)})`, 
        color: `rgba(${Object.values(color)})`, 
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        boxShadow: shadow == 0 ? 'none' : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
        borderRadius: `${radius}px`
      }}
    >
        {children}
    </Resizer>
  );
};


Container.craft = {
  defaultProps: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: ["0", "0", "0", "0"],
    margin: ["0", "0", "0", "0"],
    background : {r:255,g:255,b:255,a:0},
    color: { r: 0, g: 0, b: 0, a: 1 },
    shadow: 0,
    radius: 0,
    width: "50%",
    height: "50%"
  },
  rules: {
    canDrag: () => true
  },
  related: {
    toolbar: ContainerSettings
  }
}