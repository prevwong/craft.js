import React from "react";
import ReactDOM from "react-dom"
import { Craft, Renderer, Canvas } from "craftjs";
import { Container } from "./selectors/Container";
import { Text } from "./selectors/Text";
import { Editor } from './components/Editor';
import { Toolbar } from './components/Toolbar';
import { Toolbox } from './components/Toolbox';
import "./demo.css";

const App = () => {
  return (
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
                  <Canvas is={Container} background={{ r: 255, g: 255, b: 255, a: 1 }} height="100%" width="50%" paddingTop={2} paddingLeft={2} paddingBottom={2} paddingRight={2}>
                    <Canvas is={Container} background={{ r: 0, g: 0, b: 0, a: 1 }} height="100%" width="50%" paddingTop={2} paddingLeft={2} paddingBottom={2} paddingRight={2}></Canvas>

                  </Canvas>
                </Renderer>
              </div>
            </div>
            <div
              style={{ background: "#2a52f5", width:"240px" }}
                className="bg-gray-300 w-2 h-full"
              >
                  <Toolbar />
              </div>
          </Craft>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'))
