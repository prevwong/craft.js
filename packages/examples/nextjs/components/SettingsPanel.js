import { Box, Grid, Typography } from "@material-ui/core";
import { useEditor } from "craftjs";

const SettingsPanel = () => {
  const { currentSettingsPanel } = useEditor((state) => {
    const currentNodeId = state.events.active;
    let settingsPanel;
    if ( currentNodeId ) {
      settingsPanel = state.nodes[currentNodeId].related.settings;
    }
    return {
      currentSettingsPanel: settingsPanel
    }
  });

  return currentSettingsPanel ? (
    <Box my={2} mx={1} borderTop={1} borderColor="grey.500">
      <Box mt={1}>
        <Grid container direction="column" spacing={0}>
          <Grid item>
            <Typography variant="subtitle1">Edit</Typography>
          </Grid>
          { 
            React.createElement(currentSettingsPanel)
          }
        </Grid>
      </Box>
    </Box>
  ) : null
}

export default SettingsPanel;