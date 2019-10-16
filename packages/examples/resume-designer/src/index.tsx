import React from "react";
import ReactDOM from "react-dom"
import { Craft, Renderer, Canvas } from "craftjs";
import { Container } from "./selectors/Container";
import {Toolbar} from './components/Toolbar';
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
            resolver={{ Container }}
          >
            <div className="w-12 border-r bg-gray-100 h-full bg-white" />
            <div className="flex-1 h-full overflow-hidden">
              <div
                className="bg-white h-full"
                style={{ background: "#e2efff", width: "100%", height: "100%" }}
              >
                <Renderer>
                  <Canvas is={Container} height="100%" width="100%" padding={[10, 10, 10, 10]}>
                    <h2>Hi world</h2>
                    <h3>what</h3>
                  </Canvas>
                </Renderer>
              </div>
            </div>
            <div
              style={{ background: "#2a52f5", width:"290px" }}
                className="bg-gray-300 w-64 h-full"
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
