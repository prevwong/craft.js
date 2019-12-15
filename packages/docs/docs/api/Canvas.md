---
id: canvas
title: <Canvas />
sidebar_label: <Canvas />
---

import {API} from "./API";

Creates a Canvas Node and converts all immediate children into Nodes.


## Reference
### Props
<API items={[
  ["is", "React.ElementType", "A map of the user components that will be used in the editor"],
  ["id", "String", "Required if the <Canvas /> is being used inside of a User Component"],
  ["...elementProps", "Object", "The props of the element specified in 'is'"],
]} /> 


## When to specify `id`
You only need to specify the `id` prop when you are defining droppable regions inside a User Component.
```jsx {6,7,9,12,24-25}
const App = () => {
  return (
      <Craft resolver={{MyComp, Container}}>
        <h2>My Page Editor</h2>
        <Renderer> 
          <Canvas is="div"> 
            <Canvas is={MyComp} /> 
            <div>
              <Canvas is="div" /> 
            </div>
            <Container>
              <Canvas is="div" /> 
            </Container>
          </Canvas>
        </Renderer>
      </Craft>
  )
}

const Container = () => {
  return (
    <div>
      <h2>Container</h2>
      <Canvas id="Top" is="div" />
      <Canvas id="Bottom" is={MyComp} />
    </div>
  )
}
```

## Examples

### Basics
```jsx 
import {Craft, Renderer, Canvas} from "cradt";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Craft resolver={{MyComp}}>
        <h2>My Page Editor</h2>
        <Renderer> 
          <Canvas is="div"> // defines the Root Node, droppable
            <h2>Drag me around</h2> // Node of type h2, draggable
            <MyComp text="You can drag me around too" /> // Node of type MyComp, draggable
            <Canvas is="div" style={{background: "#333" }}> // Canvas Node of type div, draggable and droppable
              <p>Same here</p> // Not a Node; not draggable
            </Canvas>
          </Canvas>
        </Renderer>
      </Craft>
    </div>
  )
}
```

### User Component as Canvas
```jsx

const Container = ({children}) => {
  return (
    <div>
      <h2>I am a container user component, drop stuff in here</h2>
      {children}
    </div>
  )
}

Container.craft = {
  rules: {
    // Only allow the Container to be dragged when it has at least 2 children
    // This only applies when the Container is being managed by a Node that is a child of a Canvas Node
    canDrag: (node) => node.data.props.children.length >= 2,

    // Only allow the incoming Node to be dropped in the Container if its a "h1" or a "Container" user element
    // This only applies when the Container is being managed by a Canvas Node
    canMoveIn: (incomingChildNode, node) => ["h1", Container].includes(incomingChildNode.data.type),

    // Don't allow child Nodes that are "h1" to be dragged out of the Container
    // This only applies when the Container is being managed by a Canvas Node
    canMoveOut: (incomingChildNode, node) => incomingChildNode.data.type != "h1"
  }
}

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Craft resolver={{Container}}>
        <h2>My Page Editor</h2>
        <Renderer> 
          <Canvas is={Container}> // defines the Root Node, droppable
            <Canvas is={Container} />
          </Canvas>
        </Renderer>
      </Craft>
    </div>
  )
}
```

### Canvas in User Components

```jsx {5}
const Hero = () => {
  return (
    <div>
      <h3>I'm a Hero</h3>
      <Canvas id="drop" is={Container}>
        <h3>Hi</h3>
      </Canvas>
    </div>
  )
}
```