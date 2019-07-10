import React from "react";
import ReactDOM from "react-dom";
import { MsgBox, Msg } from "./components/MsgBox";
import { Craft, Renderer, Canvas } from "~packages/core";
import { Heading } from "./components/Heading";
import ReactDOMServer from "react-dom/server";
import MsgCanvas from "./components/MsgCanvas";

export default class App extends React.Component {
  render() {
    return (
      <div className='app'>
        <Craft>
          <Heading />
          <Renderer 
            onRender={(({render, node}) => {
              return (
                <React.Fragment>
                  {node.data.event.active ? <p>is active</p>: null}
                  {render}
                </React.Fragment>
              )
            })}
            resolver={(componentName: string) => {
              // console.log("Resolve", componentName)
              const map: Record<string, React.ElementType> = {
                // Msg,
                MsgCanvas: MsgCanvas
              }
              return map[componentName];
            }}
            // nodes='{"rootNode":{"type":{"resolvedName":"Canvas"},"subtype":"div","props":{},"parent":null,"nodes":["node-xnx8qrlc8g","node-wdsGN6jigL"]},"node-8YQ6HpyFo_":{"type":"h2","props":{"children":"THISTHISTHIS"},"parent":"canvas-19l292CSUj","closestParent":"canvas-19l292CSUj"},"node-xnx8qrlc8g":{"type":{"resolvedName":"Msg"},"props":{"text":"hi"},"parent":"rootNode","closestParent":"rootNode","_childCanvas":{"Msgca":"canvas-19l292CSUj"}},"canvas-19l292CSUj":{"type":{"resolvedName":"Canvas"},"subtype":{"resolvedName":"MsgCanvas"},"props":{"style":{"background":"#999","padding":"20px 0"}},"closestParent":"node-xnx8qrlc8g","nodes":["node-8YQ6HpyFo_"]},"node-wdsGN6jigL":{"type":"h2","props":{"children":"Hi world"},"parent":"rootNode","closestParent":"rootNode"}}'
          >
            <Canvas is="div">
              <h2>THISTHISTHIS</h2>
              <Msg text="hi" />
            </Canvas>
          </Renderer>
        </Craft>
      </div>
    )
  }
}

