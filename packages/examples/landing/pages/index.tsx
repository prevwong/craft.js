import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { Editor, Frame, Canvas} from "@craftjs/core";
import { Container, Text } from "../components/selectors";
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from '@material-ui/styles';
import { Custom1, OnlyButtons} from '../components/selectors/Custom1';
import { Custom2, Custom2VideoDrop } from '../components/selectors/Custom2';
import { Custom3, Custom3BtnDrop } from '../components/selectors/Custom3';
import { Button } from '../components/selectors/Button';
import { Video } from '../components/selectors/Video';
import { Viewport, RenderNode } from '../components/editor';
import lz from "lzutf8";
import "../styles/app.css";

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
  const [enabled] = useState(true);
  const base64 = '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';
  const uint8array = lz.decodeBase64(base64);
  const json = lz.decompress(uint8array);

  return (
    <ThemeProvider theme={theme}>
      <div
        className="h-full h-screen"
      >
        <NextSeo
          title="Craft.js"
          description="A React framework the build drag-n-drop page editors."
          canonical="https://www.canonical.ie/"
          twitter={{
            handle: '@handle',
            site: '@site',
            cardType: 'summary_large_image',
          }}
        />
        <Editor
          resolver={{ Container, Text, Custom1, Custom2, Custom2VideoDrop, Custom3, Custom3BtnDrop, OnlyButtons, Button, Video }}
          enabled={enabled}
          onRender={RenderNode}
        >
          <Viewport>
              <Frame json={json}>
                <Canvas is={Container} width="800px" height="auto" background={{ r: 255, g: 255, b: 255, a: 1 }} padding={["40", "40", "40", "40"]}>
                  <Canvas is={Container} flexDirection="row" width="100%" height="auto" padding={["40", "40", "40", "40"]} margin={["0", "0", "40", "0"]}>
                    <Canvas is={Container} width="40%" height="100%" padding={["0", "20", "0", "20"]}>
                      <Text fontSize="23" text="Craft.js is a React framework for building powerful &amp; feature-rich drag-n-drop page editors."></Text>
                    </Canvas>
                    <Canvas is={Container} width="60%" height="100%" padding={["0", "20", "0", "20"]}>
                      <Text fontSize="14" text="Everything you see here, including the editor, itself is made of React components. Craft.js comes only with the building blocks for a page editor; it provides a drag-n-drop system and handles the way user components should be rendered, updated and moved, among other things. <br /> <br /> You control the way your editor looks and behave."></Text>
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
                        <Text color={{ r: "255", g: "255", b: "255", a: "0.8" }} fontSize="14" text="You can define areas within your React component which users can drop other components into. <br/><br />You can even design how the component should be edited — content editable, drag to resize, have inputs on toolbars — anything really."></Text>
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
                </Canvas>
              </Frame>
          </Viewport>
        </Editor>
      </div>
    </ThemeProvider>
  );
}

export default App;
