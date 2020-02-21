import React from "react";
import { Slider } from "@material-ui/core";
import { useNode } from "@craftjs/core";
import { FormControl, FormLabel, Grid } from "@material-ui/core";
import ColorPicker from "material-ui-color-picker";

export const ColumnLayout = ({ background, padding, spacing, children }) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  let isEmpty = false;
  if (React.Children.count(children) === 0) {
    isEmpty = true;
  } else {
    const firstChild = React.Children.toArray(children)[0];
    if (firstChild.type === React.Fragment) {
      isEmpty = React.Children.count(firstChild.props.children) === 0;
    }
  }

  return (
    <Grid
      container
      ref={ref => connect(drag(ref))}
      spacing={spacing}
      style={{
        margin: "5px 0",
        background,
        padding: `${padding}px`,
        border: isEmpty ? "1px dashed #000" : "none"
      }}
    >
      {isEmpty ? "Only columns are allowed to be dropped here" : children}
    </Grid>
  );
};

export const ColumnLayoutSettings = () => {
  const { background, padding, spacing, setProp } = useNode(node => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    spacing: node.data.props.spacing
  }));

  return (
    <div>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Background</FormLabel>
        <ColorPicker
          value={background}
          onChange={color => {
            setProp(props => (props.background = color));
          }}
        />
      </FormControl>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Padding</FormLabel>
        <Slider
          defaultValue={padding}
          onChange={(_, value) => setProp(props => (props.padding = value))}
        />
      </FormControl>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Spacing</FormLabel>
        <Slider
          min={0}
          max={10}
          defaultValue={spacing}
          onChange={(_, value) => setProp(props => (props.spacing = value))}
        />
      </FormControl>
    </div>
  );
};

export const ColumnLayoutDefaultProps = {
  background: "transparent",
  padding: 0,
  spacing: 2
};

ColumnLayout.craft = {
  defaultProps: ColumnLayoutDefaultProps,
  rules: {
    canMoveIn: draggedNode => draggedNode.data.name === "Column"
  },
  related: {
    settings: ColumnLayoutSettings
  }
};
