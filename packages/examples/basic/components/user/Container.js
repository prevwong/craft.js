import { useNode, useEditor } from '@craftjs/core';
import { Slider } from '@material-ui/core';
import { Paper, FormControl, FormLabel } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import React from 'react';

export const Container = ({ background, padding, children, outline }) => {
  const {
    connectors: { connect, drag },
    id: containerNodeId,
  } = useNode();

  const { isDraggedOver } = useEditor((state, query) => {
    // we have to look through all the ancestors of the element that the user currently drags over
    const { draggedOver: draggedOverNodes } = state.events;
    let isDraggedOver = false;

    for (const nodeId of draggedOverNodes) {
      // we are looking for the first canvas element
      if (query.node(nodeId).isCanvas()) {
        // if the id of first canvas element is the same as this Container's id we know that the user is dragging over this Container
        if (nodeId === containerNodeId) {
          isDraggedOver = true;
        }
        // Since we are only interested in the first ancestor, we break out of the loop
        break;
      }
    }

    return {
      isDraggedOver,
    };
  });

  return (
    <Paper
      ref={(ref) => connect(drag(ref))}
      style={{
        margin: '5px 0',
        background,
        padding: `${padding}px`,
        outline: outline || isDraggedOver ? '2px blue dashed' : undefined,
      }}
    >
      {children}
    </Paper>
  );
};

export const ContainerSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Background</FormLabel>
        <ColorPicker
          value={background}
          onChange={(color) => {
            setProp((props) => (props.background = color), 500);
          }}
        />
      </FormControl>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Padding</FormLabel>
        <Slider
          defaultValue={padding}
          onChange={(_, value) =>
            setProp((props) => (props.padding = value), 500)
          }
        />
      </FormControl>
    </div>
  );
};

export const ContainerDefaultProps = {
  background: '#ffffff',
  padding: 3,
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
