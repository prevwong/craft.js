---
id: save-load-state
title: Save and Load
---

This guide extends upon the [Basic Tutorial](/craft.js/r/docs/basic-tutorial)

## Overview
Previously, we saw how we could serialise the entire state of `Nodes` in our editor into JSON. Of course, you probably will not want to store the JSON in your server or database, for obvious reasons. Instead, you should first employ a text compression technique of your choice to compress the serialised JSON Nodes.

In this guide, we'll be mainly modifying the previous tutorial's Topbar component. We'll add 2 new features
- Copy the compressed output of the serialised Nodes to the user's clipboard
- Load the editor state from a compressed output of serialised Nodes.

We'll be using 2 external libraries - `lzutf8` (for compression) and `copy-to-clipboard` (you know)
```bash
yarn add lzutf8 copy-to-clipboard
```

## Copy compressed output
We'll use `lzutf8` to compress our serialised JSON Nodes, and additionally transform it into base64.
```jsx
import React, { useState } from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar } from "@material-ui/core";
import { useEditor } from "@craftjs/core";
import lz from "lzutf8";
import copy from 'copy-to-clipboard';

export const Topbar = () => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

const [snackbarMessage, setSnackbarMessage] = useState();

  return (
    <Box px={1} py={1} mt={3} mb={1} bgcolor="#cbe8e7">
      <Grid container alignItems="center">
        <Grid item xs>
          <FormControlLabel className="enable-disable-toggle" ... />
        </Grid>
        <Grid item>
          <MaterialButton 
            className="copy-state-btn"
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => {
              const json = query.serialize();
              copy(lz.encodeBase64(lz.compress(json)));
              setSnackbarMessage("State copied to clipboard")
            }}
          >
              Copy current state
          </MaterialButton>
          <Snackbar
            autoHideDuration={1000}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={!!snackbarMessage}
            onClose={() => setSnackbarMessage(null)}
            message={<span>{snackbarMessage}</span>}
          />
        </Grid>
      </Grid>
    </Box>
  )
};
```

When you click on the button now, it should copy the compressed base64 string to the clipboard.

## Load state
Let's take a step back and revisit the `<Frame />` component which we encountered when we first set up Craft.js. By default, it constructs the editor state based on whats was initially rendered in its `children`. But, we could also specifiy the serialised JSON nodes to its `json` prop which would cause it to load the state from the JSON string instead. 

With that, let's go back to our `App.js` and make the the `json` prop of our `<Frame />` component stateful and pass a callback to our `Topbar` component to manipulate its state.

```jsx
import React, {useState} from 'react';
import "../styles/main.css";
import {Typography, Button as MaterialButton, Paper, Grid, makeStyles} from '@material-ui/core';
import {Toolbox} from '../components/Toolbox';
import {Container} from '../components/user/Container';
import {Button} from '../components/user/Button';
import {Card, CardBottom, CardTop} from '../components/user/Card';
import {Text} from '../components/user/Text';
import {SettingsPanel} from '../components/SettingsPanel';
import {Editor, Frame, Canvas} from "@craftjs/core";
import { Topbar } from '../components/Topbar';


export default function App() {
  const [enabled, setEnabled] = useState(true);
 
  const [json, setJson] = useState(null);

  return (
    <div style={{margin: "0 auto", width: "800px"}}>
      <Typography style={{margin: "20px 0"}} variant="h5" align="center">Basic Page Editor</Typography>
        <Editor
          resolver={{Card, Button, Text, Container, CardTop, CardBottom}}
          enabled={enabled}
        > 
          <Topbar setJson={(json) => setJson(json)} />
          <Grid container spacing={5} style={{paddingTop: "10px"}}>
            <Grid item xs>
              <Frame nodes={json}>
                <Canvas is={Container} padding={5} background="#eeeeee">
                  <Card />
                  <Button text="Click me" size="small" />
                  <Text fontSize={20} text="Hi world!" />
                  <Canvas is={Container} padding={6} background="#999999">
                    <Text size="small" text="It's me again!" />
                  </Canvas>
                </Canvas>
              </Frame>
            </Grid>
            <Grid item xs={4}>
              <Paper>
                <Toolbox />
                <SettingsPanel />
              </Paper>
            </Grid>
          </Grid>
            
        </Editor>
    </div>
  );
}
```

Now let's implement the actually Load State button in our Topbar component. We will display a Dialog box when the button is clicked, and our users would be able to paste the compressed base64 string here. 

Then, we would need to work in reverse to obtain the original JSON provided by our editor, and used the `setJson` callback to render the `<Frame />` component to rebuild the editor's Nodes from the provided JSON.

```jsx
import React, { useState } from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar } from "@material-ui/core";
import { useEditor } from "@craftjs/core";
import lz from "lzutf8";
import copy from 'copy-to-clipboard';

export const Topbar = ({setJson}) => {
  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();

  const [stateToLoad, setStateToLoad] = useState(null);

  return (
    <Box px={1} py={1} mt={3} mb={1} bgcolor="#cbe8e7">
      <Grid container alignItems="center">
        <Grid item xs>
          <FormControlLabel
            className="enable-disable-toggle"
            control={<Switch checked={enabled} onChange={(_, value) => actions.setOptions(options => options.enabled = value)} />}
            label="Enable"
          />
        </Grid>
        <Grid item>
        <MaterialButton 
            className="copy-state-btn"
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => {
              const json = query.serialize();
              copy(lz.encodeBase64(lz.compress(json)));
              setSnackbarMessage("State copied to clipboard")
            }}
          >
              Copy current state
          </MaterialButton>
          <MaterialButton 
            className="load-state-btn"
            size="small" 
            variant="outlined" 
            color="secondary"
            onClick={() => setDialogOpen(true)}
          >
              Load
          </MaterialButton>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle id="alert-dialog-title">Load state</DialogTitle>
            <DialogContent>
              <TextField 
                multiline 
                fullWidth
                placeholder='Paste the contents that was copied from the "Copy Current State" button'
                size="small"
                value={stateToLoad}
                onChange={e => setStateToLoad(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <MaterialButton onClick={() => setDialogOpen(false)} color="primary">
                Cancel
              </MaterialButton>
              <MaterialButton 
                onClick={() => {
                  setDialogOpen(false);
                  const json = lz.decompress(lz.decodeBase64(stateToLoad));
                  setJson(json);
                  setSnackbarMessage("State loaded")
                }} 
                color="primary" 
                autoFocus
              >
                Load
              </MaterialButton>
            </DialogActions>
          </Dialog>
          <Snackbar
            autoHideDuration={1000}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={!!snackbarMessage}
            onClose={() => setSnackbarMessage(null)}
            message={<span>{snackbarMessage}</span>}
          />
        </Grid>
      </Grid>
    </Box>
  )
};
```

Now, play with the editor and press the `Copy Current State` button when you are done. Refresh the page so the editor returns to its default state, then press the `Load State` button and paste the copied output - you should see the editor displaying the elements in the state from the time you copied.

