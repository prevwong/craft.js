---
id: frame
title: <Frame />
sidebar_label: <Frame />
---

import {API} from "./API";

Frame defines the editable area in your page editor. It is rendered based on the editor's internal state (i.e. Nodes).

```tsx
const { connectors, setProp, ...collected } = useNode(collector);
```



## Reference
### Props
<API items={[
  ["nodes?", "String", "The serialised Nodes"],
  ["children", "React.ReactElement<Canvas>", "This would define how the editor state would look like by default when there is no serialised nodes passed. Must begin with a <Canvas /> which creates the Root Node."]
]} /> 


## Examples

### The default screen
```tsx {9,10,16,17}
import {Editor, Frame, Canvas} from "cradt";

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
import {Editor, Frame, Canvas} from "cradt";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Editor>
        <h2>My Page Editor</h2>
        <Frame
          nodes='{"canvas-ROOT":{"type":"div","isCanvas":true,"props":{},"parent":null,"displayName":"div","custom":{},"nodes":["node-sdiwzXkvQ","node-rGFDi0G6m","node-yNBLMy5Oj"]},"node-sdiwzXkvQ":{"type":{"resolvedName":"Card"},"props":{},"parent":"canvas-ROOT","displayName":"Card","custom":{},"_childCanvas":{"main":"canvas-_EEw_eBD_","second":"canvas-lE4Ni9oIn"}}'
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