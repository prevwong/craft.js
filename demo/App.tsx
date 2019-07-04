import React from "react";
import ReactDOM from "react-dom";
import { MsgBox } from "./components/MsgBox";
import { Craft, Renderer, Canvas } from "~packages/core";
import { Heading } from "./components/Heading";
import ReactDOMServer from "react-dom/server";

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
            resolvers={(componentName: string) => {
              const map: Record<string, Function> = {
                Canvas,
                Msg: MsgBox
              }
              return map[componentName];
            }}
            // nodes={JSON.parse('{"rootNode":{"type":{"resolvedName":"Canvas"},"props":{},"parent":null,"nodes":["node-6_I0YS-W_G","node-zzbZgw-AMd","node-NmR1eCW1vP"]},"node-zzbZgw-AMd":{"type":"h1","props":{"children":["Lol",{"type":"span","props":{"children":"Hi"}}]},"parent":"rootNode","closestParent":"rootNode"},"node-6_I0YS-W_G":{"type":{"resolvedName":"Msg"},"props":{"text":"whut"},"parent":"rootNode","closestParent":"rootNode"},"node-NmR1eCW1vP":{"type":"h2","props":{"children":"Hi world"},"parent":"rootNode","closestParent":"rootNode"}}')}
          >
            <Canvas style={{padding:'30px 0', background:'#ccc'}}>
              <h1>Lol<span>Hi</span></h1>
              <MsgBox text="hi" />
              <h2>Hi world</h2>
            </Canvas>
          </Renderer>
        </Craft>
      </div>
    )
  }
}

