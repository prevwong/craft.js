import { Editor, Frame, Element } from '@craftjs/core';
import { SlateEditor, Text, Typography } from '@craftjs/slate';
import { Paper, Grid, makeStyles } from '@material-ui/core';
import React from 'react';

import { SettingsPanel } from '../components/SettingsPanel';
import { Toolbox } from '../components/Toolbox';
import { Topbar } from '../components/Topbar';
import { Button } from '../components/user/Button';
import { Card, CardBottom, CardTop } from '../components/user/Card';
import { Container } from '../components/user/Container';
import '../styles/main.css';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    background: 'rgb(252, 253, 253)',
  },
}));
export default function App() {
  const classes = useStyles();

  return (
    <div style={{ margin: '0 auto', width: '800px' }}>
      <Editor
        resolver={{
          Card,
          Button,
          Container,
          CardTop,
          CardBottom,
          SlateEditor,
          Text,
          Typography,
        }}
      >
        <Topbar />
        <Grid container spacing={5} style={{ paddingTop: '10px' }}>
          <Grid item xs>
            <Frame>
              <Element canvas is={Container} padding={5} background="#eeeeee">
                <SlateEditor>
                  <Typography variant="h1">
                    <Text text="Lol" />
                  </Typography>
                </SlateEditor>
              </Element>
            </Frame>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.root}>
              <Toolbox />
              <SettingsPanel />
            </Paper>
          </Grid>
        </Grid>
      </Editor>
    </div>
  );
}
