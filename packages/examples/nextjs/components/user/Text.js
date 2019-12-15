import React, {useCallback} from "react";
import { Grid, TextField } from "@material-ui/core";
import { useNode } from "craftjs";
import ContentEditable from 'react-contenteditable'

export default function Text({text}) {
  const { connectors: {connect, drag}, active, setProp } = useNode((state) => ({
    active: state.event.active
  }));

  const refConnector = useCallback(ref => connect(drag(ref)), []);

  return (
      <ContentEditable
        innerRef={refConnector}
        html={text} 
        onChange={e => 
          setProp(props => 
            props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")  
          )
        } 
        tagName="p" 
      />
  )
}


const TextSettings = () => {
  const { setProp, text } = useNode((node) => ({
    text: node.data.props.text
  }));

  return (
    <>
      <Grid item container direction="column" >
        <TextField 
          size="small" 
          margin="dense" 
          label="Text" 
          variant="outlined" 
          value={text}
          onChange={e => 
            {
              setProp(props => {
                props.text = e.target.value
              })
            }
          }
        />
      </Grid>
    </>
  )
}

Text.craft = {
  related: {
    settings: TextSettings
  }
}
