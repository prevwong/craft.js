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
  ["onNodesChange?", "(query: QueryMethods) => void", "Optional. A callback method when the values of any of the nodes in the state changes"],
  ["handlers?", "(store: EditorStore) => CoreEventHandlers", "Optional. Override the default event handlers with your own logic."]
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

### Customising the drag-and-drop indicator

You could also change the colours/style of the drag-and-drop indicator like so:

```jsx {6-9}
import {Editor} from "@craftjs/core";

const App = () => {
  return (
    <Editor
      indicator={{
        'success': '#2d9d78', // green
        'error': '#e34850', // red
        'style': { // custom CSS properties
          boxShadow: '...
        },
        'className': 'your-css-class' // custom CSS class
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


### Override default event handlers
Customize how the default event handlers are handled

```tsx {9-35,41-43}
import {
  DefaultEventHandlers,
  DefaultEventHandlersOptions,
  Editor,
  EditorStore,
  NodeId
} from '@craftjs/core'

class CustomEventHandlers extends DefaultEventHandlers {
  handlers() {
    const defaultHandlers = super.handlers()

    return {
      ...defaultHandlers,
      // Customize the hover event handler
      hover: (el: HTMLElement, id: NodeId) => {
        const unbindDefaultHoverHandler = defaultHandlers.hover(el, id)

        // Track when the mouse leaves a node and remove the hovered state
        const unbindMouseleave = this.addCraftEventListener(el, 'mouseleave', (e) => {
          e.craft.stopPropagation()
          this.options.store.actions.setNodeEvent('hovered', '')
          console.log(`mouseleave node ${id}`)
        })

        return () => {
          unbindDefaultHoverHandler();
          unbindMouseleave();
        }
      }
    }
  }
}

const App = () => {
  return (
    <Editor
      // Use your own event handlers
      handlers={(store) =>
        new CustomEventHandlers({ store, isMultiSelectEnabled: () => false })
      }
    >
      ...
    </Editor>
  )
}
```
