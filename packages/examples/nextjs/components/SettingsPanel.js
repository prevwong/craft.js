import { Box, Chip, Grid, Typography, Button as MaterialButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { useEditor } from "craftjs";

export const SettingsPanel = () => {
  const { selected } = useEditor((state) => {
    const currentNodeId = state.events.selected;
    let selected;

    if ( currentNodeId ) {
      selected = {
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings
      };
    }

    return {
      selected
    }
  });

  return selected ? (    
    <Box bgcolor="rgba(0, 0, 0, 0.058823529411764705)" mt={2} px={2} py={2}>
      <Grid container direction="column" spacing={0}>
        <Grid item>
          <Box pb={2}>
            <Grid container alignItems="center">
              <Grid item xs><Typography variant="subtitle1">Selected</Typography></Grid>
              <Grid item><Chip size="small" label={selected.name} color="primary" /></Grid>
            </Grid>
          </Box>
        </Grid>
        { 
          selected.settings && React.createElement(selected.settings)
        }
        <MaterialButton
          variant="contained"
          color="default"
        >
          Delete
        </MaterialButton>
      </Grid>
    </Box>
  ) : null
}

