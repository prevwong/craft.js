import { useNode, useEditor } from '@craftjs/core';
import { Slate, Editable } from '@craftjs/slate';
import React, { useMemo, useCallback } from 'react';
import { compose } from 'redux';
import { createEditor } from 'slate';

import plugins from './plugins';

// export const CraftWrapper = React.forwardRef(({ children, ...props }, ref) => {
//   const { id } = useNode();
//   const { connectors } = useEditor();

//   // Important: ref must be memoized otherwise Slate goes insane
//   const refCallback = useCallback(
//     (dom) => {
//       ref.current = dom;
//       connectors.connect(dom, id);
//       connectors.drag(dom, id);
//     },
//     [connectors, id, ref]
//   );

//   return (
//     <div {...props} ref={refCallback}>
//       {children}
//     </div>
//   );
// });

export const RichTextEditor = () => {
  const editor = useMemo(() => compose(...plugins)(createEditor()), []);

  return (
    <Slate editor={editor}>
      <Editable />
    </Slate>
  );
};

RichTextEditor.craft = {
  isCanvas: true,
};
