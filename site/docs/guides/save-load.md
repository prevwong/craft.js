---
id: save-load-state
title: Save and Load
---

import {Image} from "@site/src/components";

This guide extends upon the [Basic Tutorial](/docs/guides/basic-tutorial)

## Overview
Previously, we saw how we could serialize the entire state of `Nodes` in our editor into JSON. Of course, you probably will not want to store the JSON in your server or database, for obvious reasons. Instead, you should first employ a text compression technique of your choice to compress the serialized JSON Nodes.

In this guide, we'll be mainly modifying the previous tutorial's Topbar component. We'll add 2 new features
- Copy the compressed output of the serialized Nodes to the user's clipboard
- Load the editor state from a compressed output of serialized Nodes.

We'll be using 2 external libraries - `lzutf8` (for compression) and `copy-to-clipboard` (you know)
```bash
yarn add lzutf8 copy-to-clipboard
```

## Copy compressed output 
We'll use `lzutf8` to compress our serialised JSON Nodes, and additionally transform it into base64.
```jsx {24-36}
import React, { useState } from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar } from "@mui/core";
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
Now let's implement the Load State button in our Topbar component. We will display a Dialog box when the button is clicked, and our users will be able to paste the compressed base64 string there. 

Then, we will need to work in reverse to obtain the original JSON provided by our editor. Finally, we'll call the `deserialize` action which will result in the editor replacing all the current Nodes in the editor with the deserialized output.

```jsx {12-14,40-83}
import React, { useState } from "react";
import { Box, FormControlLabel, Switch, Grid, Button as MaterialButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar } from "@mui/core";
import { useEditor } from "@craftjs/core";
import lz from "lzutf8";
import copy from 'copy-to-clipboard';

export const Topbar = () => {
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
                  actions.deserialize(json);
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


### Load JSON on page load
Of course, what if we wanted our editor to load a serialized output on page load? For this, we will need to take a step back and revisit the `<Frame />` component which we encountered when we first set up Craft.js. 

By default, it constructs the editor state based on what was initially rendered in its `children`. But, we could also specifiy the serialized JSON nodes to its `json` prop which would cause it to load the state from the JSON string instead. 

```jsx
import React, {useState, useEffect} from 'react';
import "../styles/main.css";
import {Typography, Button as MaterialButton, Paper, Grid, makeStyles} from '@mui/core';
import {Toolbox} from '../components/Toolbox';
import {Container} from '../components/user/Container';
import {Button} from '../components/user/Button';
import {Card, CardBottom, CardTop} from '../components/user/Card';
import {Text} from '../components/user/Text';
import {SettingsPanel} from '../components/SettingsPanel';
import {Editor, Frame, Element} from "@craftjs/core";
import { Topbar } from '../components/Topbar';


export default function App() {
  const [enabled, setEnabled] = useState(true);
  const [json, setJson] = useState(null);

  // Load save state from server on page load
  useEffect(() => {
    const stateToLoad = await fetch("your api to get the compressed data");
    const json = lz.decompress(lz.decodeBase64(stateToLoad));
    setJson(json);
  }, []);

  return (
    <div style={{margin: "0 auto", width: "800px"}}>
      <Typography style={{margin: "20px 0"}} variant="h5" align="center">Basic Page Editor</Typography>
        <Editor
          resolver={{Card, Button, Text, Container, CardTop, CardBottom}}
          enabled={enabled}
        > 
          <Topbar />
          <Grid container spacing={5} style={{paddingTop: "10px"}}>
            <Grid item xs>
              <Frame json={json}>
                <Element is={Container} padding={5} background="#eeeeee">
                  ...
                </Element>
              </Frame>
            </Grid>
            <Grid item xs={4}>
              ...
            </Grid>
          </Grid>
        </Editor>
    </div>
  );
}
```

## All set! 💖
Now, play with the editor and press the `Copy Current State` button when you are done. Refresh the page so the editor returns to its default state, then press the `Load State` button and paste the copied output - you should see the editor displaying the elements in the state from the time you copied.

<Image img="tutorial/save-and-load.gif" />