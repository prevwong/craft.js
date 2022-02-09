import { useNode, useEditor } from '@craftjs/core';
import { Slider } from '@material-ui/core';
import { Paper, FormControl, FormLabel } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import React from 'react';

export const Container = ({
  background,
  padding,
  children,
  outline,
  ...props
}) => {
  const {
    connectors: { connect, drag },
    id: containerNodeId,
  } = useNode();

  // we want to render an outline around this Container when the user drags over it
  // if we have several nested containers we only want to render an outline around the Container the user is able to drop into.
  //
  // Since we know that the nodes are ordered descending by their depth in the node tree we know that we can use a "for ... of" loop to go through
  // the nodes by their depth. So we need to find the first Canvas and only highlight it when it has the same id as our current Container
  const { isBeingDraggedOver } = useEditor((state, query) => {
    // we have to look through all the ancestors (and the element itself) the user currently drags over
    let isBeingDraggedOver = false;

    for (const nodeId of query.getDraggedOverNodes()) {
      // we are looking for the first canvas element
      if (query.node(nodeId).isCanvas()) {
        // if the id of first canvas element is the same as this Container's id we know that the user is dragging over this Container
        if (nodeId === containerNodeId) {
          isBeingDraggedOver = true;
        }
        // Since we are only interested in the first Canvas, we break out of the loop
        break;
      }
    }

    return {
      isBeingDraggedOver,
    };
  });

  return (
    <Paper
      {...props}
      ref={(ref) => connect(drag(ref))}
      style={{
        margin: '5px 0',
        background,
        padding: `${padding}px`,
        outline: outline || isBeingDraggedOver ? '2px blue dashed' : undefined,
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
          name="background-color"
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
