import React, { useState } from 'react';
import { Craft, Renderer, Canvas, useManager } from "craftjs";
import { Toolbar, Toolbox, EditorRenderer } from '../components/editor';
import { Container, Text } from "../components/selectors";
import { Grid, createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from '@material-ui/styles';
import "../styles/tailwind.css";
import { Custom1 } from '../components/selectors/Custom1';
import { Custom2 } from '../components/selectors/Custom2';
import { Custom3 } from '../components/selectors/Custom3';
import { Button } from '../components/selectors/Button';
import { Video } from '../components/selectors/Video';
import { EventManager } from 'craftjs/dist/events';
import { Header } from '../components/editor/Header';
import { Layers } from "craftjs-layers";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'acumin-pro',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});

function App() {
  const [enabled, setEnabled] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <div
        className="h-full h-screen"
        style={{ background: "#e2efff" }}
      >
        <div className='fixed w-full h-full'>
          <div className="flex w-full h-full">
            <Craft
              resolver={{ Container, Text, Custom1, Custom2, Custom3, Button, Video }}
              enabled={enabled}
            >

              <div className="w-12 border-r bg-gray-100 h-full bg-white">
                <Toolbox />
              </div>
              <div className="flex-1 h-full overflow-hidden">
                <Header setEnabled={val => setEnabled(val)} />
                <div
                  className="bg-white h-full w-full"
                  style={{ background: "rgb(224, 224, 224)", width: "100%", height: "100%" }}
                >
                  <Renderer is={EditorRenderer} >
                    
                    <Canvas is={Container} width="80%" height="auto" background={{ r: 255, g: 255, b: 255, a: 1 }} padding={["40", "40", "40", "40"]}>
                      <Canvas is={Container} flexDirection="row" width="100%" height="auto" padding={["40", "40", "40", "40"]} margin={["0", "0", "40", "0"]}>
                        <Canvas is={Container} width="40%" height="100%" padding={["0", "20", "0", "20"]}>
                          <Text fontSize="23" text="Craft.js is a React framework for building powerful &amp; feature-rich drag-n-drop page editors."></Text>
                        </Canvas>
                        <Canvas is={Container} width="60%" height="100%" padding={["0", "20", "0", "20"]}>
                          <Text fontSize="14" text="Everything you see here, including the editor itself are just React components. Craft.js comes only with the building blocks for a page editor - it provides a drag-n-drop system and handles the way user components should be rendered, updated and moved - among other things.<br/><br/>You control the way your editor looks and behave."></Text>
                        </Canvas>
                      </Canvas>
                      
                      <Canvas is={Container} background={{ r: 39, g: 41, b: 41, a: 1 }} flexDirection="column" width="100%" height="auto" padding={["40", "40", "40", "40"]} margin={["0", "0", "40", "0"]}>
                        <Canvas background={{ r: 76, g: 78, b: 78, a: 0 }} is={Container} flexDirection="row" margin={["0", "0", "0", "0"]} width="100%" height="auto" alignItems="center">
                          <Canvas background={{ r: 0, g: 0, b: 0, a: 0 }} is={Container} alignItems="center" padding={["0", "0", "0", "0"]} flexDirection="row" width="350px" height="250px">
                            <Canvas is={Container} justifyContent="center" alignItems="center" background={{ r: 76, g: 78, b: 78, a: 1 }} shadow={25} width="90%" height="90%" padding={["10", "20", "10", "20"]}>
                              <Canvas is={Container} justifyContent="center" alignItems="center" background={{ r: 76, g: 78, b: 78, a: 1 }} shadow={50} width="80%" height="80%" padding={["10", "20", "10", "20"]}>
                                <Canvas is={Container} justifyContent="center" alignItems="center" background={{ r: 76, g: 78, b: 78, a: 1 }} shadow={50} width="60%" height="60%" padding={["10", "20", "10", "20"]} />
                              </Canvas>
                            </Canvas>
                          </Canvas>
                          <Canvas background={{ r: 0, g: 0, b: 0, a: 0 }} is={Container} padding={["0", "0", "0", "20"]} flexDirection="column" width="55%" height="100%" fillSpace="yes">
                            <Text color={{ r: "255", g: "255", b: "255", a: "1" }} margin={["0", "0", "18", "0"]} fontSize="20" text="Design complex components"></Text>
                            <Text color={{ r: "255", g: "255", b: "255", a: "0.8" }} fontSize="14" text="You can define areas within your React component that allows users to drop other components into.<br/><br/>You can even design how the component should be edited - content editable, drag to resize, have inputs on toolbars — anything really. "></Text>
                          </Canvas>

                        </Canvas>

                      </Canvas>
                      <Canvas is={Container} background={{ r: 234, g: 245, b: 245, a: 1 }} flexDirection="column" width="100%" height="auto" padding={["40", "40", "40", "40"]} margin={["0", "0", "40", "0"]}>
                        <Canvas background={{ r: 76, g: 78, b: 78, a: 0 }} is={Container} flexDirection="column" margin={["0,", "0", "20", "0"]} width="100%" height="auto">
                          <Text color={{ r: "46", g: "47", b: "47", a: "1" }} fontSize="23" text="Programmatic drag &amp; drop"></Text>
                          <Text fontSize="14" text="Govern what goes in and out of your components"></Text>
                        </Canvas>
                        <Canvas background={{ r: 76, g: 78, b: 78, a: 0 }} is={Container} flexDirection="row" margin={["30", "0", "0", "0"]} width="100%" height="auto">
                          <Canvas background={{ r: 0, g: 0, b: 0, a: 0 }} is={Container} padding={["0", "20", "0", "0"]} flexDirection="row" width="45%">
                            <Custom1
                              background={{ r: 119, g: 219, b: 165, a: 1 }}
                              height="auto"
                              width="100%"
                              padding={["20", "20", "20", "20"]}
                              margin={["0", "0", "0", "0"]}
                              shadow={40}
                            />
                          </Canvas>
                          <Canvas background={{ r: 0, g: 0, b: 0, a: 0 }} is={Container} padding={["0", "0", "0", "20"]} flexDirection="column" width="55%">
                            <Custom2
                              background={{ r: 108, g: 126, b: 131, a: 1 }}
                              height="125px"
                              width="100%"
                              padding={["0", "0", "0", "20"]}
                              margin={["0", "0", "0", "0"]}
                              shadow={40}
                              flexDirection="row"
                              alignItems="center"
                            />
                            <Custom3
                              background={{ r: 134, g: 187, b: 201, a: 1 }}
                              height="auto"
                              width="100%"
                              padding={["20", "20", "20", "20"]}
                              margin={["20", "0", "0", "0"]}
                              shadow={40}
                              flexDirection="column"
                            />
                          </Canvas>

                        </Canvas>

                      </Canvas>
                    </Canvas>
                  </Renderer>
                </div>
              </div>
              <div
                style={{ width: "270px", background: "rgb(245, 245, 245)" }}
                className="bg-white w-2 h-full overflow-auto"
              >
                <Toolbar />
                <Layers />
              </div>
            </Craft>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
