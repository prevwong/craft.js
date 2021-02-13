import { Editor, Frame, Element, useNode } from '@craftjs/core';
import { Typography, Paper, Grid, makeStyles } from '@material-ui/core';
import React from 'react';

import { SettingsPanel } from '../components/SettingsPanel';
import { Toolbox } from '../components/Toolbox';
import { Topbar } from '../components/Topbar';
import { Button } from '../components/user/Button';
import { Card, CardBottom, CardTop } from '../components/user/Card';
import { Container } from '../components/user/Container';
import { Text } from '../components/user/Text';
import '../styles/main.css';

const Child = ({ count }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  console.log(count);

  return (
    <div
      ref={(ref) => {
        connect(drag(ref));
      }}
      style={{
        padding: '1rem',
        margin: '0.25rem',
        border: '1px dashed blue',
        flexGrow: 1,
      }}
    >
      Count is {count}
    </div>
  );
};

const Parent = () => {
  const {
    connectors: { connect },
  } = useNode();
  const [count, setCount] = React.useState(0);

  return (
    <div
      ref={connect}
      style={{
        padding: '1rem',
        border: '1px dashed red',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Element id="column" is={Child} count={count} />
      <div>
        <button
          type="button"
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          Add One
        </button>
      </div>
    </div>
  );
};

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
      <Typography style={{ margin: '20px 0' }} variant="h5" align="center">
        Basic Page Editor
      </Typography>
      <Editor
        resolver={{
          Card,
          Button,
          Text,
          Container,
          CardTop,
          CardBottom,
        }}
      >
        <Topbar />
        <Grid container spacing={5} style={{ paddingTop: '10px' }}>
          <Grid item xs>
            <Frame>
              <Element canvas is={Container} padding={5} background="#eeeeee">
                <Parent />
                <Card />
                <Button text="Click me" size="small" />
                <Text fontSize={20} text="Hi world!" />
                <Element canvas is={Container} padding={6} background="#999999">
                  <Text size="small" text="It's me again!" />
                </Element>
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
