import React from "react";
import ReactDOM from "react-dom"
import { Craft, Renderer, Canvas } from "craftjs";
import { Container } from "./selectors/Container";
import {Toolbar} from './components/Toolbar';
import "./demo.css";

const App = () => {
  return (
    <div
      style={{ background: "#eebe8e" }}
      className="bg-gray-200 h-full h-screen"
    >
      <div className="flex flex-col h-full items-center">
        <div
          className="flex m-auto shadow-md rounded overflow-hidden"
          style={{ height: "842px" }}
        >
          <div className="flex">
            <Craft
              resolver={{ Container }}
            >
              <div className="w-12 border-r bg-gray-100 h-full bg-white" />
              <div style={{ width: "595px" }} className="overflow-hidden">
                <div
                  className="bg-white"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Renderer>
                    <Canvas is={Container}>
                        <h2>Hi world</h2>
                        <h3>what</h3>
                    </Canvas>
                  </Renderer>
                </div>
              </div>
              <div
                style={{ background: "#eef4f5" }}
                className="bg-gray-300 w-64 h-full"
              >
                  <Toolbar />
              </div>
            </Craft>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'))
