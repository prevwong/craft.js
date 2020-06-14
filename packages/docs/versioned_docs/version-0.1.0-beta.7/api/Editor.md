---
id: editor
title: <Editor />
sidebar_label: <Editor />
---

import {API, Badge} from "@site/src/components";

<Badge type="component" />

Creates the context that stores the editor state.

## Reference
### Props
<API items={[
  ["resolver", "Map<String, React.ComponentType>", "A map of User Components that will be used in the editor"],
  ["enabled?", "boolean", "Optional. If set to false, all editing capabilities will be disabled"],
  ["indicator?", 'Record<"success" | "error", String>', "Optional. The colour to use for the drop indicator. The colour set in 'success' will be used when the indicator shows a droppable location; otherwise the colour set in 'error' will be used."],
  ["onRender?", "React.ComponentType<{element: React.ReactElement}>", "Optional. Specify a custom component to render every User Element in the editor."],
  ["onNodesChange?", "(query: QueryMethods) => void", "Optional. A callback method when the values of any of the nodes in the state changes"]
]} />


## Examples

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
        <Element>
          <h1>Hi</h1>
          <Hero />
        </Element>
      </Frame>
    </Editor>
  )
}
```
In the above example, every user element will now be wrapped in a black `div`.

### Specifying the Drop Indicator colour

You could change the colours of the drag and drop indicators like so:

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
        <Element>
          <h1>Hi</h1>
          <Hero />
        </Element>
      </Frame>
    </Editor>
  )
}
```


### Callback when Nodes change

Perform a callback whenever the Nodes in the editor is updated/changed

```jsx {6-11}
import {Editor} from "@craftjs/core";

const App = () => {
  return (
    <Editor
      // Save the updated JSON whenever the Nodes has been changed
      onNodesChange={query => {
        const json = query.serialize();
        // save to server
        axios.post('/saveJSON', { json });
      }}
    >
      ..
    </Editor>
  )
}
```