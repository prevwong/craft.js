import React from 'react';
import { Craft, Renderer, Canvas } from "craftjs";
import { Toolbar, Toolbox, EditorRenderer } from '../components/editor';
import { Container, Text } from "../components/selectors";
import { Grid, createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from '@material-ui/styles';
import "../styles/tailwind.css";

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
                  style={{ background: "rgb(224, 224, 224)", width: "100%", height: "100%" }}
                >
                  <Renderer is={EditorRenderer}>
                    <Canvas is={Container}  width="80%" height="3170px" background={{r:255,g:255,b:255,a:1}} padding={["40","40","40","40"]}>
                      <Canvas is={Container} flexDirection="row" width="100%" height="227px" padding={["40", "40", "40", "40"]} margin={["0", "0", "40", "0"]}>
                        <Canvas is={Container} width="40%" height="100%" padding={["0", "20", "0", "20"]}>
                          <Text fontSize="23" text="Craft.js is a React framework for building powerful &amp; feature-rich drag-n-drop page editors."></Text>
                        </Canvas>
                        <Canvas is={Container} width="60%" height="100%" padding={["0", "20", "0", "20"]}>
                          <Text fontSize="14" text="Everything you see here, including the editor itself are just React components. Craft.js comes only with the building blocks for a page editor - it provides a drag-n-drop system and handles the way user components should be rendered, updated and moved - among other things.<br/><br/>You control the way your editor looks and behave."></Text>
                        </Canvas>
                      </Canvas>
                      <Canvas is={Container} background={{ r: 39, g: 41, b: 41, a: 1 }} flexDirection="row" width="100%" height="auto" padding={["60", "40", "60", "40"]} margin={["0", "0", "40", "0"]}>
                        <Canvas is={Container} width="auto" height="100%" padding={["0", "20", "0", "20"]}>
                          <Canvas is={Container} justifyContent="center" alignItems="center" background={{ r: 76, g: 78, b: 78, a: 1 }} shadow={25} width="300px" height="250px" padding={["10", "20", "10", "20"]}>
                            <Canvas is={Container} justifyContent="center" alignItems="center" background={{ r: 76, g: 78, b: 78, a: 1 }} shadow={50} width="80%" height="80%" padding={["10", "20", "10", "20"]}>
                              <Canvas is={Container} justifyContent="center" alignItems="center" background={{ r: 76, g: 78, b: 78, a: 1 }} shadow={50} width="60%" height="60%" padding={["10", "20", "10", "20"]} />
                            </Canvas>
                          </Canvas>
                        </Canvas>
                        <Canvas is={Container} width="400px" height="100%" padding={["0", "50", "0", "50"]}>
                          <Canvas is={Container} width="100%" height="auto" padding={["0", "0", "20", "0"]}>
                            <Text color={{r:"255",g:"255",b:"255",a:"1"}} fontSize="20" text="Design complex components"></Text>
                          </Canvas>
                          <Text color={{ r: "255", g: "255", b: "255", a: "0.8" }} fontSize="14" text="You can define areas within your React component that allows users to drop other components into.<br/><br/>You can even design how the component should be edited - content editable, drag to resize, have inputs on toolbars — anything really. "></Text>
                        </Canvas>
                      </Canvas>
                    </Canvas>
                  </Renderer>
                </div>
              </div>
              <div
                style={{ width: "270px", background: "rgb(245, 245, 245)" }}
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
