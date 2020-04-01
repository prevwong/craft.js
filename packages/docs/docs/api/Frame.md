---
id: frame
title: <Frame />
sidebar_label: <Frame />
---

import {API, Badge} from "./API";

<Badge type="component" />

Frame defines the editable area in your page editor. It is rendered based on the editor's internal state (i.e. Nodes).

```tsx
const { connectors, setProp, ...collected } = useNode(collector);
```



## Reference
### Props
Both props specifies the initial screen to render. You must specify at least one of them (`json` takes precendence over `children`).

<API items={[
  ["children?", "React.ReactElement<Canvas>", "Creates the initial screen using React Elements. Must begin with a &lt;Canvas /&gt; which creates the Root Node."],
  ["json?", "String", "Loads the initial screen from the serialised JSON Nodes"]
]} />

> These props are memoized - after the initial render, changes to these props will have no effect. If for example, you wish to load a different set of serialised JSON nodes after the initial render, you may use the `deserialize` method via the [`useEditor`](/r/docs/api/useEditor) hook.

## Examples

### Designing the default screen
```tsx {9,10,16,17}
import {Editor, Frame, Canvas} from "@craftjs/core";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Editor>
        <h2>My Page Editor</h2>
        <Frame> 
          <Canvas is={Container}> // defines the Root Node
            <h2>Drag me around</h2>
            <MyComp text="You can drag me around too" />
            <Canvas is="div" style={{background: "#333" }}>
              <p>Same here</p>
            </Canvas>
          </Canvas>
        </Frame>
      </Editor>
    </div>
  )
}
```

### Loading from serialised Nodes
```tsx {10}
import {Editor, Frame, Canvas} from "@craftjs/core";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Editor>
        <h2>My Page Editor</h2>
        <Frame
          json='{"canvas-ROOT":{"type":"div","isCanvas":true,"props":{},"parent":null,"displayName":"div","custom":{},"nodes":["node-sdiwzXkvQ","node-rGFDi0G6m","node-yNBLMy5Oj"]},"node-sdiwzXkvQ":{"type":{"resolvedName":"Card"},"props":{},"parent":"canvas-ROOT","displayName":"Card","custom":{},"_childCanvas":{"main":"canvas-_EEw_eBD_","second":"canvas-lE4Ni9oIn"}}'
        > 
          <Canvas is={Container}> // defines the Root Node
            <h2>Drag me around</h2>
            <MyComp text="You can drag me around too" />
            <Canvas is="div" style={{background: "#333" }}>
              <p>Same here</p>
            </Canvas>
          </Canvas>
        </Frame>
      </Editor>
    </div>
  )
}
```
