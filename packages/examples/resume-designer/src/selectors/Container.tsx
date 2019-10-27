import React, { useRef, useLayoutEffect } from "react";
import { Resizer, ResizerEditorSection, connectResize } from "../components/Resizer";
import { EditorItem } from "../components/EditorItem"
import { EditorSection } from "../components/EditorSection"
import { Input } from "../components/Input"
import cx from 'classnames';

import { useNode, useManager, Canvas } from "craftjs"
import { Text } from "./Text";

export type Container = {
  background: string;
  flexDirection: "col" | "row";
  width: string;
  height: string;
  paddingTop: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingRight: number;
  padding: number[];
  margin: number[];
  children: React.ReactNode;
};

export const Container = ({
  children,
  height,
  width,
  paddingTop = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingBottom = 0,
  flexDirection = "row",
  background = 'rgba(0,0,0,0)'
}: Partial<Container>) => {

  return (
    <Resizer
      propKey={{ width: "width", height: "height" }}
      style={{ background: `rgba(${Object.values(background)})`, paddingLeft: `${paddingLeft}px`, paddingRight: `${paddingRight}px`, paddingBottom: `${paddingBottom}px`, paddingTop: `${paddingTop}px` }}
    >
        {children}
    </Resizer>
  );
};

Container.related = {
  toolbar: () => {
    return (
      <React.Fragment>
        <ResizerEditorSection />
        <EditorSection title="Padding">
          <EditorItem prefix="T" propKey='paddingTop'
              type="number"
            />
          <EditorItem prefix="L" propKey='paddingLeft'
              type="number"
            />

          <EditorItem prefix="R"
            propKey='paddingRight'
            type="number"/>
            
          <EditorItem prefix="B" propKey='paddingBottom' type="number" />
         
        </EditorSection>
        <EditorSection title="Background">
          <EditorItem full={true} propKey='background' type="color" />
        </EditorSection>
      </React.Fragment>
    );
  }
};
