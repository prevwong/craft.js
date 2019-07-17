import React from "react";
import ReactDOM from "react-dom";
import { Msg } from "./components/MsgBox";
import { Craft, Renderer, Canvas } from "~packages/core";
import { Heading } from "./components/Heading";
import ReactDOMServer from "react-dom/server";
import MsgCanvas from "./components/MsgCanvas";
import TestCComponent from "./components/TestCComponent";

export default class App extends React.Component {
  render() {
    return (
      <div className='app'>
        <Craft
          // nodes='{"rootNode":{"type":{"resolvedName":"Canvas"},"subtype":"div","props":{},"parent":null,"nodes":["node-yzMEZ9FxfN","node-iT_7_zLt2K"]},"node-sVkn2U5ljm":{"type":"h2","props":{"children":"THISTHISTHIS"},"parent":"canvas-DBey6hVO6a"},"node-yzMEZ9FxfN":{"type":{"resolvedName":"Msg"},"props":{"text":"hi"},"parent":"rootNode","_childCanvas":{"Msgca":"canvas-DBey6hVO6a"}},"canvas-DBey6hVO6a":{"type":{"resolvedName":"Canvas"},"subtype":{"resolvedName":"MsgCanvas"},"props":{"style":{"background":"#999","padding":"20px 0"}},"closestParent":"node-yzMEZ9FxfN","nodes":["node-sVkn2U5ljm"]},"node-iT_7_zLt2K":{"type":"h2","props":{"children":"Hi world"},"parent":"rootNode"}}'
          onRender={(({ render }) => {
            return (
              <React.Fragment>
                {render}
              </React.Fragment>
            )
          })}
          resolver={{ Msg, MsgCanvas, TestCComponent }}
        >
          <Heading />
          <Renderer>
            <Canvas is="div">
              <h2>THISTHISTHIS</h2>
              <Msg text="hi" />
              <TestCComponent />
            </Canvas>
          </Renderer>
        </Craft>
      </div>
    )
  }
}

