import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Craft, Renderer, Canvas} from "craftjs";
import { Toolbar } from './components/Toolbar';
import { Toolbox } from './components/Toolbox';
import { Editor } from './components/Editor';
import { Container } from "./selectors/Container";
import { Text } from "./selectors/Text";
import {Grid, createMuiTheme } from "@material-ui/core"
import { ThemeProvider} from '@material-ui/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Whitney',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div
        className="h-full h-screen"
        style={{ background: "#e2efff" }}
      >
        <div className='fixed w-full h-full'>
          <div className="flex w-full h-full">
            <Craft
              resolver={{ Container, Text }}
            >
            
              <div className="w-12 border-r bg-gray-100 h-full bg-white">
                <Toolbox />
              </div>
              <div className="flex-1 h-full overflow-hidden">
                <div
                  className="bg-white h-full w-full"
                  style={{ background: "#EEECF1", width: "100%", height: "100%" }}
                >
                  <Renderer is={Editor}>
                    <Canvas is={Container} background={{ r: 255, g: 255, b: 255, a: 1 }} color={{r:0, g:0, b:0, a: 1}} height="100%" width="50%" paddingTop={2} paddingLeft={2} paddingBottom={2} paddingRight={2}>
                     
                    </Canvas>
                  </Renderer>
                </div>
              </div>
              <div
                style={{ width:"270px" }}
                  className="bg-white w-2 h-full"
                >
                    <Toolbar />
                </div>
            </Craft>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
