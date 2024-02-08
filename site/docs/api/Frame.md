---
id: frame
title: <Frame />
sidebar_label: <Frame />
---

import {API, Badge} from "@site/src/components";

<Badge type="component" />

Frame defines the editable area in your page editor. It is rendered based on the editor's internal state (i.e. Nodes).

```tsx
const { connectors, setProp, ...collected } = useNode(collector);
```



## Reference
### Props
Both props specifies the initial screen to render. You must specify at least one of them (`data` takes precendence over `children`).

<API items={[
  ["children?", "React.ReactElement", "Creates the initial screen using React Elements. The element defined here will be the Root Node"],
  ["data?", "SerializedNodes | string", "Loads the initial nodes from SerializedNodes (can be supplied in JSON)"]
]} />

> These props are memoized - after the initial render, changes to these props will have no effect. If for example, you wish to load a different set of serialised JSON nodes after the initial render, you may use the `deserialize` method via the [`useEditor`](/docs/api/useEditor) hook.

## Examples

### With JSX
```tsx {9,10,16,17}
import {Editor, Frame, Element} from "@craftjs/core";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Editor>
        <h2>My Page Editor</h2>
        <Frame> 
          <Element is={Container} canvas> // defines the Root Node
            <h2>Drag me around</h2>
            <MyComp text="You can drag me around too" />
            <Element is="div" style={{background: "#333" }}>
              <p>Same here</p>
            </Element>
          </Element>
        </Frame>
      </Editor>
    </div>
  )
}
```

### Loading from serialized Nodes
```tsx {10}
import {Editor, Frame, Element} from "@craftjs/core";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Editor>
        <h2>My Page Editor</h2>
        <Frame
          data='{"ROOT":{"type":"div","isCanvas":true,"props":{},"parent":null,"displayName":"div","custom":{},"nodes":["node-sdiwzXkvQ","node-rGFDi0G6m","node-yNBLMy5Oj"]},"node-sdiwzXkvQ":{"type":{"resolvedName":"Card"},"props":{},"parent":"ROOT","displayName":"Card","custom":{},"_childCanvas":{"main":"canvas-_EEw_eBD_","second":"canvas-lE4Ni9oIn"}}}'
        > 
          <Element is={Container} canvas> // defines the Root Node
            <h2>Drag me around</h2>
            <MyComp text="You can drag me around too" />
            <Element is="div" style={{background: "#333" }}>
              <p>Same here</p>
            </Element>
          </Element>
        </Frame>
      </Editor>
    </div>
  )
}
```
