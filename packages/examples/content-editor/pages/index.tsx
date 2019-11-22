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
                  <Renderer is={EditorRenderer} nodes='{"canvas-ROOT":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["40","40","40","40"],"margin":["0","0","0","0"],"background":{"r":255,"g":255,"b":255,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"80%","height":"auto","children":[{"type":{"resolvedName":"Canvas"},"props":{"flexDirection":"row","width":"100%","height":"auto","padding":["40","40","40","40"],"margin":["0","0","40","0"]}},{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":39,"g":41,"b":41,"a":1},"flexDirection":"column","width":"100%","height":"auto","padding":["40","40","40","40"],"margin":["0","0","40","0"]}},{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":234,"g":245,"b":245,"a":1},"flexDirection":"column","width":"100%","height":"auto","padding":["40","40","40","40"],"margin":["0","0","40","0"]}}]},"parent":null,"isCanvas":true,"nodes":["canvas-CGab__w1","canvas-wPUAdgRA7","canvas-3eO4BoCuo"]},"canvas-CGab__w1":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"row","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["40","40","40","40"],"margin":["0","0","40","0"],"background":{"r":255,"g":255,"b":255,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"100%","height":"auto","children":[{"type":{"resolvedName":"Canvas"},"props":{"width":"40%","height":"100%","padding":["0","20","0","20"]}},{"type":{"resolvedName":"Canvas"},"props":{"width":"60%","height":"100%","padding":["0","20","0","20"]}}]},"parent":"canvas-ROOT","isCanvas":true,"nodes":["canvas-rBC_FLNv3","canvas-vXpKQpMIX"]},"canvas-wPUAdgRA7":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["40","40","40","40"],"margin":["0","0","40","0"],"background":{"r":39,"g":41,"b":41,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"100%","height":"auto","children":[{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":76,"g":78,"b":78,"a":0},"flexDirection":"row","margin":["0","0","0","0"],"width":"100%","height":"auto","alignItems":"center"}}]},"parent":"canvas-ROOT","isCanvas":true,"nodes":["canvas-T3ViMdxnq"]},"canvas-3eO4BoCuo":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["40","40","40","40"],"margin":["0","0","40","0"],"background":{"r":234,"g":245,"b":245,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"100%","height":"auto","children":[{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":76,"g":78,"b":78,"a":0},"flexDirection":"column","margin":["0,","0","20","0"],"width":"100%","height":"auto"}},{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":76,"g":78,"b":78,"a":0},"flexDirection":"row","margin":["30","0","0","0"],"width":"100%","height":"auto"}}]},"parent":"canvas-ROOT","isCanvas":true,"nodes":["canvas-HRKI-T1QV","canvas-LYw5EZSjf"]},"canvas-rBC_FLNv3":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["0","20","0","20"],"margin":["0","0","0","0"],"background":{"r":255,"g":255,"b":255,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"40%","height":"100%","children":[{"type":{"resolvedName":"Text"},"props":{"fontSize":"23","text":"Craft.js is a React framework for building powerful & feature-rich drag-n-drop page editors."}}]},"parent":"canvas-CGab__w1","isCanvas":true,"nodes":["node-nsfSJkHjR"]},"canvas-vXpKQpMIX":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["0","20","0","20"],"margin":["0","0","0","0"],"background":{"r":255,"g":255,"b":255,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"60%","height":"100%","children":[{"type":{"resolvedName":"Text"},"props":{"fontSize":"14","text":"Everything you see here, including the editor itself are just React components. Craft.js comes only with the building blocks for a page editor - it provides a drag-n-drop system and handles the way user components should be rendered, updated and moved - among other things.<br/><br/>You control the way your editor looks and behave."}}]},"parent":"canvas-CGab__w1","isCanvas":true,"nodes":["node-p0yeiZ9gT"]},"canvas-T3ViMdxnq":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"row","alignItems":"center","justifyContent":"flex-start","fillSpace":"no","padding":["0","0","0","0"],"margin":["0","0","0","0"],"background":{"r":76,"g":78,"b":78,"a":0},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"100%","height":"auto","children":[{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":0,"g":0,"b":0,"a":0},"alignItems":"center","padding":["0","0","0","0"],"flexDirection":"row","width":"350px","height":"250px"}},{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":0,"g":0,"b":0,"a":0},"padding":["0","0","0","20"],"flexDirection":"column","width":"55%","height":"100%","fillSpace":"yes"}}]},"parent":"canvas-wPUAdgRA7","isCanvas":true,"nodes":["canvas-_BV-IpY99","canvas-HJnAff-J7"]},"canvas-HRKI-T1QV":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["0","0","0","0"],"margin":["0,","0","20","0"],"background":{"r":76,"g":78,"b":78,"a":0},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"100%","height":"auto","children":[{"type":{"resolvedName":"Text"},"props":{"color":{"r":"46","g":"47","b":"47","a":"1"},"fontSize":"23","text":"Programmatic drag & drop"}},{"type":{"resolvedName":"Text"},"props":{"fontSize":"14","text":"Govern what goes in and out of your components"}}]},"parent":"canvas-3eO4BoCuo","isCanvas":true,"nodes":["node-rcMPQSRyD","node-YY_VcunOx"]},"canvas-LYw5EZSjf":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"row","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["0","0","0","0"],"margin":["30","0","0","0"],"background":{"r":76,"g":78,"b":78,"a":0},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"100%","height":"auto","children":[{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":0,"g":0,"b":0,"a":0},"padding":["0","20","0","0"],"flexDirection":"row","width":"45%"}},{"type":{"resolvedName":"Canvas"},"props":{"background":{"r":0,"g":0,"b":0,"a":0},"padding":["0","0","0","20"],"flexDirection":"column","width":"55%"}}]},"parent":"canvas-3eO4BoCuo","isCanvas":true,"nodes":["canvas-UqPPCFff5","canvas-RjGGRoa1S"]},"node-nsfSJkHjR":{"type":{"resolvedName":"Text"},"props":{"fontSize":"23","textAlign":"left","fontWeight":"500","color":{"r":92,"g":90,"b":90,"a":1},"margin":[0,0,0,0],"shadow":0,"text":"Craft.js is a React framework for building powerful & feature-rich drag-n-drop page editors."},"parent":"canvas-rBC_FLNv3"},"node-p0yeiZ9gT":{"type":{"resolvedName":"Text"},"props":{"fontSize":"14","textAlign":"left","fontWeight":"500","color":{"r":92,"g":90,"b":90,"a":1},"margin":[0,0,0,0],"shadow":0,"text":"Everything you see here, including the editor itself are just React components. Craft.js comes only with the building blocks for a page editor - it provides a drag-n-drop system and handles the way user components should be rendered, updated and moved - among other things.<br/><br/>You control the way your editor looks and behave."},"parent":"canvas-vXpKQpMIX"},"canvas-_BV-IpY99":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"row","alignItems":"center","justifyContent":"flex-start","fillSpace":"no","padding":["0","0","0","0"],"margin":["0","0","0","0"],"background":{"r":0,"g":0,"b":0,"a":0},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"350px","height":"250px","children":[{"type":{"resolvedName":"Canvas"},"props":{"justifyContent":"center","alignItems":"center","background":{"r":76,"g":78,"b":78,"a":1},"shadow":25,"width":"90%","height":"90%","padding":["10","20","10","20"]}}]},"parent":"canvas-T3ViMdxnq","isCanvas":true,"nodes":["canvas-YESncb0oqm"]},"canvas-HJnAff-J7":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"yes","padding":["0","0","0","20"],"margin":["0","0","0","0"],"background":{"r":0,"g":0,"b":0,"a":0},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"55%","height":"100%","children":[{"type":{"resolvedName":"Text"},"props":{"color":{"r":"255","g":"255","b":"255","a":"1"},"margin":["0","0","18","0"],"fontSize":"20","text":"Design complex components"}},{"type":{"resolvedName":"Text"},"props":{"color":{"r":"255","g":"255","b":"255","a":"0.8"},"fontSize":"14","text":"You can define areas within your React component that allows users to drop other components into.<br/><br/>You can even design how the component should be edited - content editable, drag to resize, have inputs on toolbars — anything really. "}}]},"parent":"canvas-T3ViMdxnq","isCanvas":true,"nodes":["node-w7nW8_3JOF","node-DhGXOChyKF"]},"node-rcMPQSRyD":{"type":{"resolvedName":"Text"},"props":{"fontSize":"23","textAlign":"left","fontWeight":"500","color":{"r":"46","g":"47","b":"47","a":"1"},"margin":[0,0,0,0],"shadow":0,"text":"Programmatic drag & drop"},"parent":"canvas-HRKI-T1QV"},"node-YY_VcunOx":{"type":{"resolvedName":"Text"},"props":{"fontSize":"14","textAlign":"left","fontWeight":"500","color":{"r":92,"g":90,"b":90,"a":1},"margin":[0,0,0,0],"shadow":0,"text":"Govern what goes in and out of your components"},"parent":"canvas-HRKI-T1QV"},"canvas-UqPPCFff5":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"row","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["0","20","0","0"],"margin":["0","0","0","0"],"background":{"r":0,"g":0,"b":0,"a":0},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"45%","height":"auto","children":[{"type":{"resolvedName":"Custom1"},"props":{"background":{"r":119,"g":219,"b":165,"a":1},"height":"auto","width":"100%","padding":["20","20","20","20"],"margin":["0","0","0","0"],"shadow":40}}]},"parent":"canvas-LYw5EZSjf","isCanvas":true,"nodes":["node-wUviZwCriu"]},"canvas-RjGGRoa1S":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["0","0","0","20"],"margin":["0","0","0","0"],"background":{"r":0,"g":0,"b":0,"a":0},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"55%","height":"auto","children":[{"type":{"resolvedName":"Custom2"},"props":{"background":{"r":108,"g":126,"b":131,"a":1},"height":"125px","width":"100%","padding":["0","0","0","20"],"margin":["0","0","0","0"],"shadow":40,"flexDirection":"row","alignItems":"center"}},{"type":{"resolvedName":"Custom3"},"props":{"background":{"r":134,"g":187,"b":201,"a":1},"height":"auto","width":"100%","padding":["20","20","20","20"],"margin":["20","0","0","0"],"shadow":40,"flexDirection":"column"}}]},"parent":"canvas-LYw5EZSjf","isCanvas":true,"nodes":["node-cqZYb2q32u","node-9LmpbKQPcI"]},"canvas-YESncb0oqm":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"center","justifyContent":"center","fillSpace":"no","padding":["10","20","10","20"],"margin":["0","0","0","0"],"background":{"r":76,"g":78,"b":78,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":25,"radius":0,"width":"90%","height":"90%","children":[{"type":{"resolvedName":"Canvas"},"props":{"justifyContent":"center","alignItems":"center","background":{"r":76,"g":78,"b":78,"a":1},"shadow":50,"width":"80%","height":"80%","padding":["10","20","10","20"]}}]},"parent":"canvas-_BV-IpY99","isCanvas":true,"nodes":["canvas-AQR1C7h_30"]},"node-w7nW8_3JOF":{"type":{"resolvedName":"Text"},"props":{"fontSize":"20","textAlign":"left","fontWeight":"500","color":{"r":"255","g":"255","b":"255","a":"1"},"margin":["0","0","18","0"],"shadow":0,"text":"Design complex components"},"parent":"canvas-HJnAff-J7"},"node-DhGXOChyKF":{"type":{"resolvedName":"Text"},"props":{"fontSize":"14","textAlign":"left","fontWeight":"500","color":{"r":"255","g":"255","b":"255","a":"0.8"},"margin":[0,0,0,0],"shadow":0,"text":"You can define areas within your React component that allows users to drop other components into.<br/><br/>You can even design how the component should be edited - content editable, drag to resize, have inputs on toolbars — anything really. "},"parent":"canvas-HJnAff-J7"},"node-wUviZwCriu":{"type":{"resolvedName":"Custom1"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["20","20","20","20"],"margin":["0","0","0","0"],"background":{"r":119,"g":219,"b":165,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":40,"radius":0,"width":"100%","height":"auto"},"parent":"canvas-UqPPCFff5","_childCanvas":{"wow":"canvas-BEbEPm7w8M"}},"node-cqZYb2q32u":{"type":{"resolvedName":"Custom2"},"props":{"flexDirection":"row","alignItems":"center","justifyContent":"flex-start","fillSpace":"no","padding":["0","0","0","20"],"margin":["0","0","0","0"],"background":{"r":108,"g":126,"b":131,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":40,"radius":0,"width":"100%","height":"125px"},"parent":"canvas-RjGGRoa1S","_childCanvas":{"wow":"canvas-Zi8Kziap3W"}},"node-9LmpbKQPcI":{"type":{"resolvedName":"Custom3"},"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["20","20","20","20"],"margin":["20","0","0","0"],"background":{"r":134,"g":187,"b":201,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":40,"radius":0,"width":"100%","height":"auto"},"parent":"canvas-RjGGRoa1S","_childCanvas":{"wow":"canvas-Rf2cz8SDBu"}},"canvas-AQR1C7h_30":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"center","justifyContent":"center","fillSpace":"no","padding":["10","20","10","20"],"margin":["0","0","0","0"],"background":{"r":76,"g":78,"b":78,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":50,"radius":0,"width":"80%","height":"80%","children":[{"type":{"resolvedName":"Canvas"},"props":{"justifyContent":"center","alignItems":"center","background":{"r":76,"g":78,"b":78,"a":1},"shadow":50,"width":"60%","height":"60%","padding":["10","20","10","20"]}}]},"parent":"canvas-YESncb0oqm","isCanvas":true,"nodes":["canvas-tZxtC8Mh4p"]},"canvas-BEbEPm7w8M":{"type":"div","props":{"is":"div","className":"w-full mt-5","children":[{"type":{"resolvedName":"Button"},"props":{}},{"type":{"resolvedName":"Button"},"props":{"buttonStyle":"outline","color":{"r":255,"g":255,"b":255,"a":1}}}]},"parent":"node-wUviZwCriu","isCanvas":true,"nodes":["node-ikaU7HuERM","node-MU5dpaycqO"]},"canvas-Zi8Kziap3W":{"type":"div","props":{"is":"div","className":"flex-1 ml-5 h-full","children":[{"type":{"resolvedName":"Video"},"props":{}}]},"parent":"node-cqZYb2q32u","isCanvas":true,"nodes":["node-3YhKEMTV6-"]},"canvas-Rf2cz8SDBu":{"type":"div","props":{"is":"div","className":"w-full h-full","children":[{"type":{"resolvedName":"Button"},"props":{"background":{"r":184,"g":247,"b":247,"a":1}}}]},"parent":"node-9LmpbKQPcI","isCanvas":true,"nodes":["node-XwYyjCssvg"]},"canvas-tZxtC8Mh4p":{"type":{"resolvedName":"Container"},"props":{"flexDirection":"column","alignItems":"center","justifyContent":"center","fillSpace":"no","padding":["10","20","10","20"],"margin":["0","0","0","0"],"background":{"r":76,"g":78,"b":78,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":50,"radius":0,"width":"60%","height":"60%"},"parent":"canvas-AQR1C7h_30","isCanvas":true,"nodes":[]},"node-ikaU7HuERM":{"type":{"resolvedName":"Button"},"props":{"background":{"r":255,"g":255,"b":255,"a":0.5},"color":{"r":92,"g":90,"b":90,"a":1},"buttonStyle":"full","text":"Button","margin":["5","0","5","0"],"textComponent":{"fontSize":"15","textAlign":"center","fontWeight":"500","color":{"r":92,"g":90,"b":90,"a":1},"margin":[0,0,0,0],"shadow":0,"text":"Text"}},"parent":"canvas-BEbEPm7w8M"},"node-MU5dpaycqO":{"type":{"resolvedName":"Button"},"props":{"background":{"r":255,"g":255,"b":255,"a":0.5},"color":{"r":255,"g":255,"b":255,"a":1},"buttonStyle":"outline","text":"Button","margin":["5","0","5","0"],"textComponent":{"fontSize":"15","textAlign":"center","fontWeight":"500","color":{"r":92,"g":90,"b":90,"a":1},"margin":[0,0,0,0],"shadow":0,"text":"Text"}},"parent":"canvas-BEbEPm7w8M"},"node-3YhKEMTV6-":{"type":{"resolvedName":"Video"},"props":{"videoId":"2g811Eo7K8U"},"parent":"canvas-Zi8Kziap3W"},"node-XwYyjCssvg":{"type":{"resolvedName":"Button"},"props":{"background":{"r":184,"g":247,"b":247,"a":1},"color":{"r":92,"g":90,"b":90,"a":1},"buttonStyle":"full","text":"Button","margin":["5","0","5","0"],"textComponent":{"fontSize":"15","textAlign":"center","fontWeight":"500","color":{"r":92,"g":90,"b":90,"a":1},"margin":[0,0,0,0],"shadow":0,"text":"Text"}},"parent":"canvas-Rf2cz8SDBu"}}'>
                    
                    {/* <Canvas is={Container} width="80%" height="auto" background={{ r: 255, g: 255, b: 255, a: 1 }} padding={["40", "40", "40", "40"]}>
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
                    </Canvas> */}
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
