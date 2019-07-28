import React from "react";
import ReactDOM from "react-dom";
import { Msg } from "./components/MsgBox";
import { Craft, Renderer, Canvas } from "~packages/core";
import { Heading } from "./components/Heading";
import ReactDOMServer from "react-dom/server";
import MsgCanvas from "./components/MsgCanvas";
import TestCComponent from "./components/TestCComponent";
import {Layers} from "~packages/layers";

export default class App extends React.Component {
  render() {
    return (
      <div className='app'>
        <Craft
          nodes='{"ROOT":{"type":{"resolvedName":"Canvas"},"subtype":"div","props":{},"nodes":["node-KsjZhXnscS","node-cFm3GIgDhc","node-kqcZAcbGD9"]},"node-kqcZAcbGD9":{"type":"h2","props":{"children":"THISTHISTHIS"},"parent":"ROOT"},"node-KsjZhXnscS":{"type":{"resolvedName":"Msg"},"props":{"text":"hi"},"parent":"ROOT","_childCanvas":{"Msgca":"canvas-vyPaBV6ILS"}},"node-F53wjMN_jN":{"type":{"resolvedName":"TestCComponent"},"props":{},"parent":"canvas-vyPaBV6ILS"},"canvas-vyPaBV6ILS":{"type":{"resolvedName":"Canvas"},"subtype":{"resolvedName":"MsgCanvas"},"props":{"style":{"background":"#999","padding":"20px 0"}},"closestParent":"node-KsjZhXnscS","nodes":["node-F53wjMN_jN"]},"node-cFm3GIgDhc":{"type":"h2","props":{"children":"Hi world"},"parent":"ROOT"}}'
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
            <Canvas is={MsgCanvas}>
              <h2>THISTHISTHIS</h2>
              <TestCComponent />
              <Canvas>
                <h2>asdas</h2>
              </Canvas>
              <Msg text="lol" />
            </Canvas>
          </Renderer>
          <Layers />
        </Craft>
      </div>
    )
  }
}

