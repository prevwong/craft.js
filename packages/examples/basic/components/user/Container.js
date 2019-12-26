import React  from "react";
import {Card as MaterialCard, CardContent, Slider} from "@material-ui/core";
import Text from "./Text";
import Button from "./Button";
import { Canvas, useNode } from "@craftjs/core";
import {Paper, FormControl, FormLabel, RadioGroup,Radio, FormControlLabel} from "@material-ui/core";
import ColorPicker from 'material-ui-color-picker'

export const Container = ({background, padding, children}) => {
  const { connectors: {connect, drag} } = useNode();
  return (
    <Paper ref={ref=> connect(drag(ref))} style={{margin: "5px 0", background, padding: `${padding}px`}}>
      {children}
    </Paper>
  )
}

export const ContainerSettings = () => {
  const { background, padding, setProp } = useNode(node => ({
    background: node.data.props.background,
    padding: node.data.props.padding
  }));
  console.log("background", background)
  return (
    <div>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Background</FormLabel>
        <ColorPicker value={background} onChange={color => {
          setProp(props => props.background = color)
        }} />
      </FormControl>
      <FormControl fullWidth={true} margin="normal" component="fieldset">
        <FormLabel component="legend">Padding</FormLabel>
        <Slider defaultValue={padding} onChange={(_, value) => setProp(props => props.padding = value)} />
      </FormControl>
    </div>
  )
}

export const ContainerDefaultProps = {
  background : "#ffffff",
  padding: 3
};

Container.craft = {
  defaultProps: ContainerDefaultProps,
  related: {
    settings: ContainerSettings
  }
}