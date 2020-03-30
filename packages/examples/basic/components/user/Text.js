import React, { useState, useEffect } from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from "react-contenteditable";
import { Slider, FormControl, FormLabel } from "@material-ui/core";

export const Text = ({ text, fontSize, textAlign }) => {
  const {
    connectors: { connect, drag },
    selected,
    setProp,
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    !selected && setEditable(false);
  }, [selected]);

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      onClick={(e) => selected && setEditable(true)}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) =>
          setProp(
            (props) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, ""))
          )
        }
        tagName="p"
        style={{ fontSize: `${fontSize}px`, textAlign }}
      />
    </div>
  );
};

const TextSettings = () => {
  const { setProp, fontSize } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
  }));

  return (
    <>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Font size</FormLabel>
        <Slider
          value={fontSize || 7}
          step={7}
          min={1}
          max={50}
          onChange={(_, value) => {
            setProp((props) => (props.fontSize = value));
          }}
        />
      </FormControl>
    </>
  );
};

export const TextDefaultProps = {
  text: "Hi",
  fontSize: 20,
};

Text.craft = {
  defaultProps: TextDefaultProps,
  related: {
    settings: TextSettings,
  },
};
