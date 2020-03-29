import React from "react";
import "../styles/main.css";
import { Typography, Paper, Grid, makeStyles } from "@material-ui/core";
import { Toolbox } from "../components/Toolbox";
import { Container } from "../components/user/Container";
import { Button } from "../components/user/Button";
import { Card, CardBottom, CardTop } from "../components/user/Card";
import { Text } from "../components/user/Text";
import { SettingsPanel } from "../components/SettingsPanel";
import { Editor, Frame, Canvas } from "@craftjs/core";
import { Topbar } from "../components/Topbar";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    background: "rgb(252, 253, 253)",
  },
}));
export default function App() {
  const classes = useStyles();

  return (
    <div style={{ margin: "0 auto", width: "800px" }}>
      <Typography style={{ margin: "20px 0" }} variant="h5" align="center">
        Basic Page Editor
      </Typography>
      <Editor resolver={{ Card, Button, Text, Container, CardTop, CardBottom }}>
        <Topbar />
        <Grid container spacing={5} style={{ paddingTop: "10px" }}>
          <Grid item xs>
            <Frame>
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
