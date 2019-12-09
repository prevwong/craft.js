import React from 'react';
import {Box, Container, Typography} from '@material-ui/core';
import Toolbox from '../components/Toolbox';
import Button from '../components/user/Button';
import Card from '../components/user/Card';
import Text from '../components/user/Text';
import {Craft, Renderer, Canvas} from "craftjs";

export default function App() {
  return (
    <Container maxWidth="sm">
      <Typography style={{marginTop: "20px"}} variant="h5" align="center">A super simple page editor</Typography>
      <Box my={4}>
        { /** The page editor starts here **/ }
        <Craft
          resolver={{Card, Button, Text}}
        > 
          <Container maxWidth="xs">
            <Toolbox />
          </Container>

          <Box bgcolor="#eee" p={1} style={{marginTop: "20px", minHeight: "350px"}}>
          { /** The editable area starts here, this is where users will be able to move things around **/ }
            <Renderer>
              <Canvas>
                <Card />
                <Button size="small" variant="outlined">Click</Button>
                <Button size="small" variant="outlined">Click</Button>
              </Canvas>
            </Renderer>
          </Box>
        </Craft>
      </Box>
    </Container>
  );
}
