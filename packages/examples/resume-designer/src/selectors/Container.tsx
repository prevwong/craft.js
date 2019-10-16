import React, { useRef, useLayoutEffect } from "react";
import { Resizable } from "re-resizable";
import { useNode, useManager } from "craftjs"
import { EditorItem } from "../components/EditorItem"
import { EditorSection } from "../components/EditorSection"
import cx from "classnames";

export type Container = {
  bg: string;
  flexDirection: "col" | "row";
  width: number;
  height: number;
  padding: number[];
  margin: number[];
  children: React.ReactNode;
};

export const Container = ({
  children,
  height,
  width,
  bg = "#fff",
  padding = [0, 0, 0, 0],
  margin = [0, 0, 0, 0],
  flexDirection = "row",
}: Partial<Container>) => {
  const { actions, connectTarget, parent, dom } = useNode(node => ({
    dom: node.ref.dom,
    parent: node.data.parent,
  }));
  const startDrag = useRef<Record<"width" | "height", number>>({
    width: 0,
    height: 0,
  });
  const { parentDOM } = useManager(state => ({
    parentDOM: parent && state.nodes[parent].ref.dom,
  }));

  useLayoutEffect(() => {
    if (!dom && !parentDOM) return;
    actions.setProp((prop: Container) => {
      if (parentDOM) {
        prop.width = parentDOM.getBoundingClientRect().width;
      } else {
        prop.width = dom.parentElement.getBoundingClientRect().width;
      }

      prop.height = dom.getBoundingClientRect().height;
    });
  }, [dom]);

  return connectTarget(
    <div style={{width, height}}>
      <Resizable
        className={cx(["flex", `flex-${flexDirection}`])}
        size={{ width, height }}
        onResizeStart={(e, d, refToElement) => {
          const parent = refToElement.parentElement.getBoundingClientRect();
          startDrag.current.width = width ? width : parent.width;
          startDrag.current.height = height
            ? height
            : refToElement.getBoundingClientRect().height;
        }}
        onResize={(e, direction, ref, d) => {
          const parent = ref.parentElement.getBoundingClientRect();
          const rect = ref.getBoundingClientRect();

          actions.setProp((prop: Container) => {
            prop.width = startDrag.current.width + d.width;
            prop.height = startDrag.current.height + d.height;
          });
        }}
        style={{ background: bg, padding: padding.join("px ") + "px" }}

      >
        {children}
      </Resizable>
    </div>
  );
};

Container.related = {
  toolbar: () => {
    const { actions, props: { width, height } } = useNode((state) => ({ props: state.data.props }));
    return (
      <React.Fragment>
        <EditorSection title="Size">
          <div className="flex">
            <EditorItem prefix="W">
              <input
                onChange={e => {
                  try {
                    const num: number = parseInt(e.currentTarget.value);
                    actions.setProp((prop: Container) => {
                      prop.width = num;
                    });
                  } catch (err) { }
                }}
                className="editorInput"
                type="text"
                value={width || 0}
              />
            </EditorItem>
            <EditorItem prefix="H">
              <input
                onChange={e => {
                  try {
                    const num: number = parseInt(e.currentTarget.value);
                    actions.setProp((prop: Container) => {
                      prop.height = num;
                    });
                  } catch (err) { }
                }}
                className="editorInput"
                type="text"
                value={height || 0}
              />
            </EditorItem>
          </div>
        </EditorSection>
        <EditorSection title="Padding">
          <div className="flex">
            <EditorItem prefix="T">
              <input
                onChange={e => {
                  try {
                    const num: number = parseInt(e.currentTarget.value);
                    actions.setProp((prop: Container) => {
                      prop.width = num;
                    });
                  } catch (err) { }
                }}
                className="editorInput"
                type="text"
                value={width || 0}
              />
            </EditorItem>
            <EditorItem prefix="B">
              <input
                onChange={e => {
                  try {
                    const num: number = parseInt(e.currentTarget.value);
                    actions.setProp((prop: Container) => {
                      prop.height = num;
                    });
                  } catch (err) { }
                }}
                className="editorInput"
                type="text"
                value={height || 0}
              />
            </EditorItem>
          </div>
          <div className="flex mt-1">
            <EditorItem prefix="L">
              <input
                onChange={e => {
                  try {
                    const num: number = parseInt(e.currentTarget.value);
                    actions.setProp((prop: Container) => {
                      prop.height = num;
                    });
                  } catch (err) { }
                }}
                className="editorInput"
                type="text"
                value={height || 0}
              />
            </EditorItem>
            <EditorItem prefix="R">
              <input
                onChange={e => {
                  try {
                    const num: number = parseInt(e.currentTarget.value);
                    actions.setProp((prop: Container) => {
                      prop.height = num;
                    });
                  } catch (err) { }
                }}
                className="editorInput"
                type="text"
                value={height || 0}
              />
            </EditorItem>
          </div>
        </EditorSection>
      </React.Fragment>
    );
  }
};
