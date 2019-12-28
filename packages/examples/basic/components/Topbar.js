import React from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton } from "@material-ui/core";
import { useEditor } from "@craftjs/core";
import lz from "lzutf8";

export const Topbar = ({reset}) => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  return (
    <Box px={1} py={1} mt={3} mb={1} bgcolor="#cbe8e7">
      <Grid container alignItems="center">
        <Grid item xs>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(_, value) => actions.setOptions(options => options.enabled = value)} />}
            label="Enable"
          />
        </Grid>
        <Grid item>
        <MaterialButton 
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => {
              console.log("Please wait, getting compressed output:")
              const json = query.serialize();
              const uint8array = lz.compress(json);
              const base64 = lz.encodeBase64(uint8array);
              console.log({uint8array, base64});
            }}
          >
              Serialize JSON to console
          </MaterialButton>
          <MaterialButton 
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => reset()}
          >
              Reset
          </MaterialButton>
        </Grid>
      </Grid>
    </Box>
  )
};