import React from "react";
import { Slider } from "@material-ui/core";
import { useNode } from "@craftjs/core";
import { Paper, FormControl, FormLabel, Grid } from "@material-ui/core";
import ColorPicker from "material-ui-color-picker";
import { ColumnLayout } from "./ColumnLayout";

export const Column = ({ background, padding, children }) => {
  const {
    connectors: { connect, drag }
  } = useNode();
  return (
    <Grid item xs ref={ref => connect(drag(ref))}>
      <Paper style={{ margin: "5px 0", background, padding: `${padding}px` }}>
        {children}
      </Paper>
    </Grid>
  );
};

export const ColumnSettings = () => {
  const { background, padding, setProp } = useNode(node => ({
    background: node.data.props.background,
    padding: node.data.props.padding
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
    </div>
  );
};

export const ColumnDefaultProps = {
  background: "#ffffff",
  padding: 3
};

Column.craft = {
  defaultProps: ColumnDefaultProps,
  rules: {
    canDrop: dropTarget => dropTarget.data.type === ColumnLayout
  },
  related: {
    settings: ColumnSettings
  }
};
