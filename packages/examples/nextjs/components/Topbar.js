import React from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton } from "@material-ui/core";
import { useEditor } from "craftjs";

export const Topbar = () => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  console.log(enabled)
  return (
    <Box px={1} py={1} mt={3} mb={1} bgcolor="#cbe8e7">
      <Grid container alignItems="center">
        <Grid item xs>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(_, value) => actions.setOptions({enabled: value})} />}
            label="Enable"
          />
        </Grid>
        <Grid item>
          <MaterialButton 
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => {
              console.log(query.serialize())
            }}
          >
              Serialize JSON to console
          </MaterialButton>
        </Grid>
      </Grid>
    </Box>
  )
};