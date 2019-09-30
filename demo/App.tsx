import React from "react";
import ReactDOM from "react-dom";
import { Msg } from "./components/MsgBox";
import { Craft, Renderer, Canvas } from "~packages/core";
import { Heading } from "./components/Heading";
import ReactDOMServer from "react-dom/server";
import MsgCanvas from "./components/MsgCanvas";
import TestCComponent from "./components/TestCComponent";
import { Layers } from "~packages/layers";
import { deserializeNode } from "~packages/core/utils/deserializeNode";
import "./demo.css";

export default class App extends React.Component {
  render() {
    return (
      <div className="app h-full">
        <div className="flex h-full">
          <div className="h-full w-5/6">
            <div id="app-demo">
              <div style={{height: "500px", background:"#eef0f3"}} className="hero h-64 bg-gray-400 p-4 flex items-center">
                <div className="m-auto max-w-5xl">
                  <div className="flex flex-row items-center">
                      <div>
                          <h3 className="w-full text-center text-5xl" style={{color:"#3a4a50"}}>
                            Build powerful &amp; versatile <br /> page builders.
                          </h3>
                          <div className="mt-4 flex items-center w-full flex-col">
                              <a className="px-10 text-gray-800 py-2 bg-gray-400">Documentation</a>
                          </div>
                      </div>
                    {/* <p>
                        Craft.js is a React framework that makes building page
                        builders super simple and straightforward.
                        Just design your page builder like any other React app, define the components you want to make editable
                        and bam you have a functioning page builder
                        </p> */}
                  </div>
                </div>
              </div>
              <div className="m-auto max-w-3xl mt-10 flex items-center">
                  <div className="w-2/6 pr-3">
                    <h4 className="text-4xl">Transform any React app into a page builder</h4>
                  </div>
                  <div className="w-4/6 pl-3">
                      <p className="text-lg leading-relaxed">Craft.js is a React framework that provides developers low-level abstractions to write page builders. It comes with no fancy plugin system nor a pre-built page builder template. Instead, developers are provided with functions that allows them to build any sort of page builder with any functionality </p>
                  </div>
              </div>
            </div>
            <div style={{background:'#fcf0ea'}} className='mt-20 bg-gray-300'>
                <div className='m-auto max-w-3xl py-10'>
                    <h2 className='text-4xl font-medium'>React components</h2>
                    <h3 className='text-xl'>with some superpowers</h3>


                </div>
            </div>
          </div>
          <div className="w-1/6 h-full">Toolbar</div>
        </div>
        {/* <Craft
            onRender={({ render }) => {
            return <React.Fragment>{render}</React.Fragment>;
            }}
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
        </Craft> */}
      </div>
    );
  }
}
