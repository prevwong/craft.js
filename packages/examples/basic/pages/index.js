import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { CraftSlateProvider } from '@craftjs/slate';
import { Paper, Grid, makeStyles } from '@material-ui/core';
import throttle from 'lodash/throttle';

import hotkey from 'is-hotkey';
import React, { useCallback } from 'react';
import EventListener from 'react-event-listener';

import { SettingsPanel } from '../components/SettingsPanel';
import { Toolbox } from '../components/Toolbox';
import { Topbar } from '../components/Topbar';
import { Button } from '../components/user/Button';
import { Card, CardBottom, CardTop } from '../components/user/Card';
import { Container } from '../components/user/Container';
import {
  RichTextEditor,
  Typography,
  List,
  ListItem,
  Text,
} from '../components/user/RichTextEditor';
import '../styles/main.css';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    background: 'rgb(252, 253, 253)',
  },
}));

const EventManager = () => {
  const { actions } = useEditor();

  const onKeyDown = useCallback(
    (e) => {
      if (hotkey('mod+z', e)) {
        // slateEditor.selection = null;
        actions.history.undo();
      } else if (hotkey('shift+mod+z', e)) {
        // slateEditor.selection = null;
        actions.history.redo();
      }
    },
    [actions.history]
  );

  return <EventListener target="window" onKeyDown={onKeyDown} />;
};

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
        }}
      >
        <CraftSlateProvider
          editor={{ RichTextEditor }}
          elements={{
            Typography,
            List,
            ListItem,
          }}
          leaf={{ Text }}
        >
          <EventManager />
          <Topbar />
          <Grid container spacing={5} style={{ paddingTop: '10px' }}>
            <Grid item xs>
              <Frame>
                <Element canvas is={Container}>
                  <Button>Hello</Button>
                  <RichTextEditor>
                    <Typography variant="p">
                      <Text text="Lmao"></Text>
                    </Typography>
                    <Typography variant="p">
                      <Text text="haha"></Text>
                    </Typography>
                  </RichTextEditor>
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
        </CraftSlateProvider>
      </Editor>
    </div>
  );
}
