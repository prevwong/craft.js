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
import lz from "lzutf8";

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    background: "rgb(252, 253, 253)"
  }
}))
export default function App() {
  const classes = useStyles();
  const [enabled, setEnabled] = useState(true);
  const base64 = "eyJjYW52YXMtUk9PVCI6eyJ0eXBlxAhyZXNvbHZlZE5hbWUiOiJDb250YWluZXIifSwiaXNDxTUiOnRydWUsInByb3BzxDViYWNrZ3JvdW5kIjoiI2XFASIsInBhZGRpbmciOjV9xA1yZW50IjpudWxsLCJub2RlcyI6W8UJLW95SlpTaHFTWSLGGi04Um0zZWx6OUzIEXpDaldpaG1FRMgRV2VJcEs1N3giLOgAylExVGhvQnRCZyJdLCJjdXN0b20iOnt9LCJkaXNwbGF59ADSzkv7AQdhcmTEMPcA8mbFAewA8jPrAPLtAWssIl9jaGlsZOgBSnsidGV4yyVzN2h6dUlXLW4iLCJidXR0b25zyh1ZaXN3aWVzM3DkAIz7AOPnAK7vAVz6AN9CxWntAOFzaXrEGnNtYWxsIiwidmFyaWHmAM3nAUBk5AF6b2xvciI6InByaW1hcnkiLOgAzUNsaWNrIG1lxVP2AQf6AL/qAI7vAfv6AMFUxHfsAL/nAIhIaSB3b3JsZCEiLCJmb250U+UA1jIw/wCX9QCXxWQsImluZGV4Ijoy5AGC8AJ5/wNI/wNI8AJWOcUB7AJWNvoAuO4DUVdpdzFRdUZUTf8DDOwAlvECgf4DD1Rv5QKG+ADM7ACq8AOx7gCsTFJRUzB5b2JOxxotTXhPT3lnZV9C/wC96gCF8QMf/gC7Qm90xFT/AL7/AL5b/wCdzGfvAZT/AsjzAshJdCdzIG1lIGFnYWlu8ALNLO4DrfMCJOoCov8C4cV97wGW/wCu8wCuVGl0bOQGAP8DcuwE6/8AlugAluoCG/8AlvMAllN1YnTxAJkx7Aab/wCZ/ACZ6gax/wVm/wVm/wVm7gVmTGVhcm4gbW9y/wVo/gVo6QTTMX19";
  const decoded = lz.decodeBase64(base64);
  // const json = lz.decompress(decoded);

  const [json, setJson] = useState(lz.decompress(decoded));
  const [test, setTest] = useState("me");

  return (
    <div style={{margin: "0 auto", width: "800px"}}>
      <Typography style={{margin: "20px 0"}} variant="h5" align="center">Basic Page Editor</Typography>
        <Editor
          resolver={{Card, Button, Text, Container, CardTop, CardBottom}}
          enabled={enabled}
        > 
          <Topbar reset={() => {
            const b = "eyJjYW52YXMtUk9PVCI6eyJ0eXBlxAhyZXNvbHZlZE5hbWUiOiJDb250YWluZXIifSwiaXNDxTUiOnRydWUsInByb3BzxDViYWNrZ3JvdW5kIjoiI2XFASIsInBhZGRpbmciOjV9xA1yZW50IjpudWxsLCJkaXNwbGF50WYsImN1c3RvbSI6e30sIm5vZGVzIjpbxQkteDBOQkFHY3d1IsYaLTktcXlZNGVZMcgReVd2M2NYZ0bIEG53Zy03cURMWsRY5gDwMWtiUU1zd1N3Il3HYco2+wEHYXJk5AEC9wDyZsUB7ADyM+sA8u0Ba/EA+8Ra7gD2X2NoaWxk6AFreyJ0ZXjLRkVJbUtxQ2phUiIsImJ1dHRvbnPKHVBMbmdpbzVKYSJ96ADe6gEE+gDfQsVI7QDhc2l6xBpzbWFsbCIsInZhcmlh5gDN5wGs5QC2b2xvciI6InByaW1hcnkiLOgArENsaWNrIG1lxVP/AQfsAILsAQnoAMHqAeb6AMFUxHfsAL/nAIhIaSB3b3JsZCEiLCJmb250U+UA1jIw/wCX6QCXxVjuAZ5pbmRleCI6MX3zAlP/A0j/A0jwAlY5xQHsAlY2/wC4/wNR8ANRWFVjSVd3N3Vp5QMM8QJg/gMPVG9w/ADM7ACq8AOc8gMCxE38AKpJQmNrUEVjODjoA9pBY1RHcGlBanHsALvqAv7+ALtCb3TEaP8Avv8AvtJQ9gDB6QRn6gFu/wLI8wLISXQncyBtZSBhZ2FpbvACzSzuA63zAiTqAqL/AuHqA3bqAXL/AK7zAK5UaXRs5AYA/wNy7ATK/wCW6ACW6gH3/wCW8wCWU3VidPEAmTHsBpv/AJn8AJnqBpz/BWb/BWb/BWbuBWZMZWFybiBtb3L/BWj+BWjpBNMwfX0=";
            const decoded = lz.decodeBase64(b);
            const json = lz.decompress(decoded);

            setJson(json);
          }} />
          <a onClick={() => setTest("here")}>Click {test}</a>
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
