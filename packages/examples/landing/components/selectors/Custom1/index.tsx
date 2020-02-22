import React from "react";
import { Container } from "../Container";
import { Canvas, useNode, useEditor } from "@craftjs/core";
import { Button } from "../Button";

export const OnlyButtons = ({ children, ...props }) => {
  const { draggedNodeId, query } = useEditor(state => ({
    draggedNodeId: state.events.dragged
  }));
  const {
    connectors: { connect },
    isDraggedOver
  } = useNode(state => ({
    isDraggedOver: state.events.draggedOver
  }));

  let style: React.CSSProperties = {};
  if (
    draggedNodeId &&
    isDraggedOver &&
    query.node(draggedNodeId).get().data.type === Button
  ) {
    style = {
      outline: "2px dashed green"
    };
  }

  return (
    <div
      title="only-buttons"
      ref={connect}
      className="w-full mt-5"
      {...props}
      style={{ ...style, ...props.style }}
    >
      {children}
    </div>
  );
};

OnlyButtons.craft = {
  rules: {
    canMoveIn: node => node.data.type == Button
  }
};

export const Custom1 = (props: any) => {
  return (
    <Container {...props}>
      <h2 className="text-lg px-10 py-5 text-white">
        I'm a component that only accepts
        <br /> buttons.
      </h2>
      <Canvas id="wow" is={OnlyButtons}>
        <Button />
        <Button
          buttonStyle="outline"
          color={{ r: 255, g: 255, b: 255, a: 1 }}
        />
      </Canvas>
    </Container>
  );
};

Custom1.craft = {
  ...Container.craft,
  name: "Custom 1"
};
