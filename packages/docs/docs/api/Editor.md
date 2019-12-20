---
id: editor
title: <Editor />
sidebar_label: <Editor />
---

import {API} from "./API";

Creates the context that stores the editor state.

## Reference
### Props
<API items={[
  ["resolver", "Map<String, React.ComponentType>", "A map of the user components that will be used in the editor"],
  ["enabled?", "boolaen", "Optional. If set to false, all editing capabilities will be disabled"],
  ["indicator?", 'Record<"success" | "error", String>', "Optional. The color to use for the drop indicator. The color set in 'success' will be used when the indicator shows a droppable location; otherwise the color set in 'error' will be used."],
  ["onRender?", "React.ComponentType<{element: React.ReactElement}>", "Optional. Specify a custom component to render every User Element in the editor."]
]} /> 


## Examples

### The default screen
```tsx {9,10,16,17}
import {Craft, Frame, Canvas} from "craft";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Craft>
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
      </Craft>
    </div>
  )
}
```

### Loading from serialised Nodes
```tsx {10}
import {Craft, Frame, Canvas} from "cradt";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Craft>
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
      </Craft>
    </div>
  )
}
```

### Custom render user elements
By default every user element is rendered just as is. However, if you'd like to for example - wrap every user element inside a `div`, you can do so through the `onRender` prop:

```jsx {3-9,13}
import {Editor} from "craftjs";

const RenderNode = ({element}) => {
  return (
    <div style={{background: "#000", padding: "5px" }}>
      {element}
    </div>
  )
}

const App = () => {
  return (
    <Editor onRender={RenderNode}>
      <Frame resolver={{Hero}}>
        <Canvas>
          <h1>Hi</h1>
          <Hero />
        </Canvas>
      </Frame>
    </Editor>
  )
}
```
In the above example, every user element will now be wrapped in a black `div`. 
