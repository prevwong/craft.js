import React, { useEffect } from "react";
import { Canvas } from "../nodes/Canvas";
import { Editor } from "../editor";
import { render } from "@testing-library/react";
import { Frame } from "../render/Frame";
import { ERROR_ROOT_CANVAS_NO_ID } from "@craftjs/utils";
import { useEditor } from "../hooks";

describe("Canvas", () => {
  const TestComponent = () => {
    return (
      <div>
        <Canvas>
          <h3>Hi</h3>
        </Canvas>
      </div>
    );
  };

  it("Converts nodes", async () => {
    const nodes = await new Promise(resolve => {
      const Collector = () => {
        const { nodes } = useEditor(state => ({ nodes: state.nodes }));
        useEffect(() => {
          resolve(nodes);
        }, [nodes]);
        return null;
      };
      render(
        <Editor>
          <Collector />
          <Frame>
            <Canvas>
              <div>
                <h2>Hi</h2>
              </div>
              <h3>Lol</h3>
            </Canvas>
          </Frame>
        </Editor>
      );
    });

    expect(nodes).not.toBeNull();
  });

  it("Throw error when id is ommited in Top-level Canvas", async () => {
    expect(() =>
      render(
        <Editor resolver={{ TestComponent }}>
          <Frame>
            <Canvas is="div">
              <TestComponent />
            </Canvas>
          </Frame>
        </Editor>
      )
    ).toThrowError(ERROR_ROOT_CANVAS_NO_ID);
  });
});
