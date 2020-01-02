import React, { useEffect } from 'react';
import { Editor } from '../editor';
import { render } from '@testing-library/react';
import { useEditor } from '../hooks';

describe('useEditor', () => {
  it("returns actions, query and collectors", () => {
    expect(async () => { 
      await new Promise((resolve, reject) => {
        const Collector = () => {
          const { actions, query, connectors } = useEditor();
          useEffect(() => {
            if ( actions && query && connectors ) {
              resolve();
            } else {
              reject();
            }
          }, []);
          return null;
        }
  
        render(
          <Editor>
            <Collector />
          </Editor>
        )
      });
    }).not.toThrowError();
  });

  // TODO
  it("Collects editor state", () => {

  });
})