import React, { useRef, useLayoutEffect } from "react";
import { Resizable } from "re-resizable";
import { useNode, useManager } from "@craftjs/core/connectors"
import {EditorItem} from "../components/EditorItem"
import cx from "classnames";

export type Container = {
  bg: string;
  flexDirection: "col" | "row";
  width: number;
  height: number;
  children: React.ReactNode;
};

export const Container = ({
  children,
  height,
  width,
  bg,
  flexDirection = "row"
}: Partial<Container>) => {
  const { actions, connectTarget, parent, dom } = useNode((node) => ({dom: node.ref.dom, parent: node.data.parent }));
  const startDrag = useRef<Record<'width' | 'height', number>>({
      width: 0,
      height: 0
  });
  const {parentDOM} = useManager((state) => ({parentDOM: parent && state.nodes[parent].ref.dom }))

  useLayoutEffect(() => {
    console.log(33, dom, parentDOM)
    if ( !dom && !parentDOM ) return;
    actions.setProp((prop: Container) => {
        if ( parentDOM ) {
          prop.width = parentDOM.getBoundingClientRect().width;
        } else {
          prop.width = dom.parentElement.getBoundingClientRect().width;
        }

        prop.height = dom.getBoundingClientRect().height;
    })
  }, [dom]);

  return connectTarget(
      <div>
        <Resizable
          style={{ background: bg }}
          className={cx(["flex", `flex-${flexDirection}`])}
          size={{ width, height }}
          onResizeStart={(e, d, refToElement) => {
            const parent = refToElement.parentElement.getBoundingClientRect();
            startDrag.current.width = width ? width : parent.width;
            startDrag.current.height = height ? height : refToElement.getBoundingClientRect().height;
          }}
          onResize={(e, direction, ref, d) => {
            const parent = ref.parentElement.getBoundingClientRect();
            const rect = ref.getBoundingClientRect();

            actions.setProp((prop: Container) => {
              prop.width = startDrag.current.width + d.width;
              prop.height = startDrag.current.height + d.height;
            });
          }}
        >
          {children}
        </Resizable>
      </div>
  );
};

Container.related = {
  toolbar: () => {
    const { connectTarget, actions, props: {width, height}} = useNode((state) => ({props: state.data.props}));
    return connectTarget(
      <div className="flex w-full">
        <EditorItem title="Width">
            <input
              onChange={e => {
                try {
                  const num: number = parseInt(e.currentTarget.value);
                  actions.setProp((prop: Container) => {
                    prop.width = num;
                  });
                } catch (err) {}
              }}
              style={{ fontSize: "14px" }}
              className="editorInput"
              type="text"
              value={width || 0}
            />
        </EditorItem>
        <EditorItem title="Height">
            <input
              onChange={e => {
                try {
                  const num: number = parseInt(e.currentTarget.value);
                  actions.setProp((prop: Container) => {
                    prop.height = num;
                  });
                } catch (err) {}
              }}
              className="editorInput"
              type="text"
              value={height || 0}
            />
        </EditorItem>

      </div>
    );
  }
};
