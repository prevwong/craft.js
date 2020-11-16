import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { CraftBinder } from './CraftBinder';
import { useEditor, useNode } from '@craftjs/core';

const Element = ({ attributes: { ref, ...attributes }, children, element }) => {
  const { exists, connectors, query } = useEditor((state) => ({
    exists: !!state.nodes[element.id],
  }));
  const domRef = useRef();

  const connect = () => {
    if (!domRef.current) {
      return;
    }

    if (!exists) {
      return;
    }

    connectors.connect(domRef.current, element.id);
    connectors.drag(domRef.current, element.id);
  };

  useEffect(() => {
    if (!exists) {
      return;
    }

    connect();
  }, [exists]);

  const refCallback = useCallback((dom: any) => {
    // eslint-disable-next-line no-param-reassign
    ref.current = dom;
    domRef.current = dom;
    connect();
  }, []);

  switch (element.type) {
    case 'Typography': {
      return React.createElement(element.props.variant, {
        ...attributes,
        children,
        ref: refCallback,
      });
    }
    default:
      return (
        <p {...attributes} ref={refCallback}>
          {attributes.props.text}
        </p>
      );
  }
};

let i = 0;

export const SlateEditor = () => {
  const { id } = useNode();
  const { store } = useEditor();
  const [value, setValue] = useState([]);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    new CraftBinder({
      id,
      slate: editor,
      store,
      setValue,
    });
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable as={CraftWrapper} renderElement={renderElement} />
    </Slate>
  );
};

SlateEditor.craft = {
  isCanvas: true,
};

const CraftWrapper = React.forwardRef(
  ({ children, ...props }: any, ref: any) => {
    const { id } = useNode();
    const { connectors } = useEditor();

    // Important: ref must be memoized otherwise Slate goes insane
    const refCallback = useCallback((dom) => {
      ref.current = dom;
      connectors.connect(dom, id);
      connectors.drag(dom, id);
    }, []);

    return (
      <div {...props} ref={refCallback}>
        {children}
      </div>
    );
  }
);
