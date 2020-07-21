import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { Editor, Frame, Element } from '@craftjs/core';
import { Container, Text } from '../components/selectors';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Custom1, OnlyButtons } from '../components/selectors/Custom1';
import { Custom2, Custom2VideoDrop } from '../components/selectors/Custom2';
import { Custom3, Custom3BtnDrop } from '../components/selectors/Custom3';
import { Button } from '../components/selectors/Button';
import { Video } from '../components/selectors/Video';
import { Viewport, RenderNode } from '../components/editor';
import lz from 'lzutf8';
import '../styles/app.css';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'acumin-pro',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const [enabled] = useState(true);
  const base64 =
    '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';
  const uint8array = lz.decodeBase64(base64);
  const json = lz.decompress(uint8array);
  return (
    <ThemeProvider theme={theme}>
      <div className="h-full h-screen">
        <NextSeo
          title="Craft.js"
          description="A React framework for building drag-n-drop page editors."
          canonical="https://craft.js.org/"
          twitter={{
            site: 'craft.js.org',
            cardType: 'summary_large_image',
          }}
        />
        <Editor
          resolver={{
            Container,
            Text,
            Custom1,
            Custom2,
            Custom2VideoDrop,
            Custom3,
            Custom3BtnDrop,
            OnlyButtons,
            Button,
            Video,
          }}
          enabled={enabled}
          onRender={RenderNode}
        >
          <Viewport>
            <Frame data={json}>
              <Element
                canvas
                is={Container}
                width="800px"
                height="auto"
                background={{ r: 255, g: 255, b: 255, a: 1 }}
                padding={['40', '40', '40', '40']}
              >
                <Element
                  canvas
                  is={Container}
                  flexDirection="row"
                  width="100%"
                  height="auto"
                  padding={['40', '40', '40', '40']}
                  margin={['0', '0', '40', '0']}
                >
                  <Element
                    canvas
                    is={Container}
                    width="40%"
                    height="100%"
                    padding={['0', '20', '0', '20']}
                  >
                    <Text
                      fontSize="23"
                      fontWeight="400"
                      text="Craft.js is a React framework for building powerful &amp; feature-rich drag-n-drop page editors."
                    ></Text>
                  </Element>
                  <Element
                    canvas
                    is={Container}
                    width="60%"
                    height="100%"
                    padding={['0', '20', '0', '20']}
                  >
                    <Text
                      fontSize="14"
                      fontWeight="400"
                      text="Everything you see here, including the editor, itself is made of React components. Craft.js comes only with the building blocks for a page editor; it provides a drag-n-drop system and handles the way user components should be rendered, updated and moved, among other things. <br /> <br /> You control the way your editor looks and behave."
                    ></Text>
                  </Element>
                </Element>

                <Element
                  canvas
                  is={Container}
                  background={{ r: 39, g: 41, b: 41, a: 1 }}
                  flexDirection="column"
                  width="100%"
                  height="auto"
                  padding={['40', '40', '40', '40']}
                  margin={['0', '0', '40', '0']}
                >
                  <Element
                    canvas
                    background={{
                      r: 76,
                      g: 78,
                      b: 78,
                      a: 0,
                    }}
                    is={Container}
                    flexDirection="row"
                    margin={['0', '0', '0', '0']}
                    width="100%"
                    height="auto"
                    alignItems="center"
                  >
                    <Element
                      canvas
                      background={{
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                      }}
                      is={Container}
                      alignItems="center"
                      padding={['0', '0', '0', '0']}
                      flexDirection="row"
                      width="350px"
                      height="250px"
                    >
                      <Element
                        canvas
                        is={Container}
                        justifyContent="center"
                        alignItems="center"
                        background={{
                          r: 76,
                          g: 78,
                          b: 78,
                          a: 1,
                        }}
                        shadow={25}
                        width="90%"
                        height="90%"
                        padding={['10', '20', '10', '20']}
                      >
                        <Element
                          canvas
                          is={Container}
                          justifyContent="center"
                          alignItems="center"
                          background={{
                            r: 76,
                            g: 78,
                            b: 78,
                            a: 1,
                          }}
                          shadow={50}
                          width="80%"
                          height="80%"
                          padding={['10', '20', '10', '20']}
                        >
                          <Element
                            canvas
                            is={Container}
                            justifyContent="center"
                            alignItems="center"
                            background={{
                              r: 76,
                              g: 78,
                              b: 78,
                              a: 1,
                            }}
                            shadow={50}
                            width="60%"
                            height="60%"
                            padding={['10', '20', '10', '20']}
                          />
                        </Element>
                      </Element>
                    </Element>
                    <Element
                      canvas
                      background={{
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                      }}
                      is={Container}
                      padding={['0', '0', '0', '20']}
                      flexDirection="column"
                      width="55%"
                      height="100%"
                      fillSpace="yes"
                    >
                      <Text
                        color={{
                          r: '255',
                          g: '255',
                          b: '255',
                          a: '1',
                        }}
                        margin={['0', '0', '18', '0']}
                        fontSize="20"
                        text="Design complex components"
                      ></Text>
                      <Text
                        color={{
                          r: '255',
                          g: '255',
                          b: '255',
                          a: '0.8',
                        }}
                        fontSize="14"
                        fontWeight="400"
                        text="You can define areas within your React component which users can drop other components into. <br/><br />You can even design how the component should be edited — content editable, drag to resize, have inputs on toolbars — anything really."
                      ></Text>
                    </Element>
                  </Element>
                </Element>
                <Element
                  canvas
                  is={Container}
                  background={{
                    r: 234,
                    g: 245,
                    b: 245,
                    a: 1,
                  }}
                  flexDirection="column"
                  width="100%"
                  height="auto"
                  padding={['40', '40', '40', '40']}
                  margin={['0', '0', '40', '0']}
                >
                  <Element
                    canvas
                    background={{
                      r: 76,
                      g: 78,
                      b: 78,
                      a: 0,
                    }}
                    is={Container}
                    flexDirection="column"
                    margin={['0,', '0', '20', '0']}
                    width="100%"
                    height="auto"
                  >
                    <Text
                      color={{
                        r: '46',
                        g: '47',
                        b: '47',
                        a: '1',
                      }}
                      fontSize="23"
                      text="Programmatic drag &amp; drop"
                    ></Text>
                    <Text
                      fontSize="14"
                      fontWeight="400"
                      text="Govern what goes in and out of your components"
                    ></Text>
                  </Element>
                  <Element
                    canvas
                    background={{
                      r: 76,
                      g: 78,
                      b: 78,
                      a: 0,
                    }}
                    is={Container}
                    flexDirection="row"
                    margin={['30', '0', '0', '0']}
                    width="100%"
                    height="auto"
                  >
                    <Element
                      canvas
                      background={{
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                      }}
                      is={Container}
                      padding={['0', '20', '0', '0']}
                      flexDirection="row"
                      width="45%"
                    >
                      <Custom1
                        background={{
                          r: 119,
                          g: 219,
                          b: 165,
                          a: 1,
                        }}
                        height="auto"
                        width="100%"
                        padding={['20', '20', '20', '20']}
                        margin={['0', '0', '0', '0']}
                        shadow={40}
                      />
                    </Element>
                    <Element
                      canvas
                      background={{
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                      }}
                      is={Container}
                      padding={['0', '0', '0', '20']}
                      flexDirection="column"
                      width="55%"
                    >
                      <Custom2
                        background={{
                          r: 108,
                          g: 126,
                          b: 131,
                          a: 1,
                        }}
                        height="125px"
                        width="100%"
                        padding={['0', '0', '0', '20']}
                        margin={['0', '0', '0', '0']}
                        shadow={40}
                        flexDirection="row"
                        alignItems="center"
                      />
                      <Custom3
                        background={{
                          r: 134,
                          g: 187,
                          b: 201,
                          a: 1,
                        }}
                        height="auto"
                        width="100%"
                        padding={['20', '20', '20', '20']}
                        margin={['20', '0', '0', '0']}
                        shadow={40}
                        flexDirection="column"
                      />
                    </Element>
                  </Element>
                </Element>
              </Element>
            </Frame>
          </Viewport>
        </Editor>
      </div>
    </ThemeProvider>
  );
}

export default App;
