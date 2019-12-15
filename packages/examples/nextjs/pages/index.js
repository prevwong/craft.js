import React from 'react';
import {Box, Container, Typography, Paper, Grid, makeStyles} from '@material-ui/core';
import Toolbox from '../components/Toolbox';
import Button from '../components/user/Button';
import Card from '../components/user/Card';
import Text from '../components/user/Text';
import SettingsPanel from '../components/SettingsPanel';
import {Editor, Renderer, Canvas} from "craftjs";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 2),
    background: "rgb(210, 210, 210)",
    width: "260px",
  }
}))
export default function App() {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <Typography style={{margin: "20px 0"}} variant="h5" align="center">A super simple page editor</Typography>
        <Editor
          resolver={{Card, Button, "bbt" : Text}}
        > 
          <Grid container>
            <Grid item xs>
            <Box bgcolor="#eee" p={1} style={{ minHeight: "350px"}}>
              <Renderer>
                <Canvas>
                  <Card />
                  <Button size="small" variant="outlined">Click</Button>
                  <Button size="small" variant="outlined">Click</Button>
                </Canvas>
              </Renderer>
              </Box>
            </Grid>
            <Paper className={classes.root}>
              <Grid container spacing={3} direction="column">
                <Toolbox />
                <SettingsPanel />
              </Grid>
            </Paper>
          </Grid>
          
        </Editor>
    </Container>
  );
}
