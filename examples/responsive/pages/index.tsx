import { Editor, Frame, Element } from '@craftjs/core';
import { Button, ButtonGroup, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React, { useState } from 'react';

import { Container, Text } from '../components/selectors';
import IFrame from 'react-frame-component';

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
  const breakpoints = {
    sm: '640px', // small devices i.e phones
    md: '1280px', // medium devices i.e tablets
    lg: '1536px', // large devices i.e computers,laptops...
  };

  const [breakpoint, setBreakpoint] = useState('lg');

  return (
    <ThemeProvider theme={theme}>
      <div className="h-full h-screen">
        <Editor
          resolver={{
            Container,
            Text,
          }}
          enabled={false}
        >
          <div className="flex items-center justify-center h-12">
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button onClick={() => setBreakpoint('sm')}>Mobile</Button>
              <Button onClick={() => setBreakpoint('md')}>Tablet</Button>
              <Button onClick={() => setBreakpoint('lg')}>Desktop</Button>
            </ButtonGroup>
          </div>

          <div
            className=""
            style={{ width: breakpoints[breakpoint], margin: '0 auto' }}
          >
            <IFrame className="block h-full w-full">
              <AddStyles>
                <Frame>
                  <Element canvas is={Container}>
                    <div className="sm:text-red md:text-white 2xl:text-black">
                      This text is red on mobile, white on tablets & black on
                      desktops
                    </div>
                  </Element>
                </Frame>
              </AddStyles>
            </IFrame>
          </div>
        </Editor>
      </div>
    </ThemeProvider>
  );
}

import type { ReactNode } from 'react';
import { useFrame } from 'react-frame-component';
import { useLayoutEffect } from 'react';
function AddStyles({ children }: { children: ReactNode }) {
  const { document: doc } = useFrame(); // <iframe ref="iframe" /> then this.$refs.iframe....
  useLayoutEffect(() => {
    // this covers development case as well as part of production
    document.head.querySelectorAll('style').forEach((style) => {
      if (style.id === 'colors') return;
      const frameStyles = style.cloneNode(true);
      doc?.head.append(frameStyles);
    });
    if (process && process.env.NODE_ENV === 'production') {
      document.head.querySelectorAll('link[as="style"]').forEach((ele) => {
        if (ele.id === 'colors') return;
        doc?.head.append(ele.cloneNode(true));
      });
      document.head
        .querySelectorAll('link[rel="stylesheet"]')
        .forEach((ele) => {
          if (ele.id === 'colors') return;
          doc?.head.append(ele.cloneNode(true));
        });
    }
  }, [doc]);

  return <>{children}</>;
}

import dynamic from 'next/dynamic';

export default dynamic(() => Promise.resolve(App), { ssr: false });
