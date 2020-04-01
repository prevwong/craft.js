---
id: editor
title: <Editor />
sidebar_label: <Editor />
---

import {API, Badge} from "./API";

<Badge type="component" />

Creates the context that stores the editor state.

## Reference
### Props
<API items={[
  ["resolver", "Map<String, React.ComponentType>", "A map of User Components that will be used in the editor"],
  ["enabled?", "boolean", "Optional. If set to false, all editing capabilities will be disabled"],
  ["indicator?", 'Record<"success" | "error", String>', "Optional. The colour to use for the drop indicator. The colour set in 'success' will be used when the indicator shows a droppable location; otherwise the colour set in 'error' will be used."],
  ["onRender?", "React.ComponentType<{element: React.ReactElement}>", "Optional. Specify a custom component to render every User Element in the editor."]
]} />


## Examples

### The default screen
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

### Custom render user elements
By default, every user element is rendered just as it is. However, if you'd like to, for example, wrap every user element inside a `div`, you can do so through the `onRender` prop:

```jsx {3-9,13}
import {Editor} from "@craftjs/core";

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

### Specifying the Drop Indicator colour

```jsx {6-9}
import {Editor} from "@craftjs/core";

const App = () => {
  return (
    <Editor
      indicator={{
        'success': '#2d9d78', // green
        'error': '#e34850' // red
      }}
    >
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
