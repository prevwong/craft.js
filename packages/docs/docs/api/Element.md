---
id: element
title: <Element />
sidebar_label: <Element />
---

import {API, Badge} from "./API";

<Badge type="component" />

Defines a Node to create for a given User Element

## Reference
### Props
<API items={[
  ["is", "React.ElementType", "The User Element to render"],
  ["id", "String", "Required if the &lt;Node /&gt; is being created inside a User Component"],
  ["canvas", "boolean", "If true, a Canvas Node will be created."],
  ["custom", "Record<string, any>", "Sets the Node's custom properties"],
  ["hidden", "boolean", "Sets the Node's hidden property. If true, this will hide the Node"],
  ["...elementProps", "Object", "The props of the element specified in 'is'"],
]} /> 


## When to specify `id`
You only need to specify the `id` prop when you are defining Nodes **inside** a User Component's render method.
```jsx {6,7,9,12,24-25}
const App = () => {
  return (
      <Craft resolver={{MyComp, Container}}>
        <h2>My Page Editor</h2>
        <Frame> 
          <Element is="div"> // not required
            <Element is={MyComp} /> // not required
            <div>
              <Element is="div" /> // not required
            </div>
            <Container>
              <Element is="div" /> // not required
            </Container>
          </Element>
        </Frame>
      </Craft>
  )
}

const Container = () => {
  return (
    <div>
      <h2>Container</h2>
      <Element id="Top" is="div" /> // required
      <Element id="Bottom" is={MyComp} /> // required
    </div>
  )
}
```

## Examples

### Basics
```jsx 
import {Craft, Frame, Element} from "@craftjs/core";

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Craft resolver={{MyComp}}>
        <h2>My Page Editor</h2>
        <Frame> 
          <Element is="div" canvas> // defines the Root Node, droppable
            <h2>Drag me around</h2> // Node of type h2, draggable
            <MyComp text="You can drag me around too" /> // Node of type MyComp, draggable
            <Element is="div" style={{background: "#333" }} canvas> // Canvas Node of type div, draggable and droppable
              <p>Same here</p> // Not a Node; not draggable
            </Canvas>
          </Canvas>
        </Frame>
      </Craft>
    </div>
  )
}
```

### User Component
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
    // This is only applied when the Container is being managed by a Node that is a child of a Canvas Node
    canDrag: (node) => node.data.props.children.length >= 2,

    // Only allow the incoming Node to be dropped in the Container if its a "h1" or a "Container" user element
    // This is only applied when the Container is being managed by a Canvas Node
    canMoveIn: (incomingChildNode, node) => ["h1", Container].includes(incomingChildNode.data.type),

    // Don't allow child Nodes that are "h1" to be dragged out of the Container
    // This is only applied when the Container is being managed by a Canvas Node
    canMoveOut: (incomingChildNode, node) => incomingChildNode.data.type != "h1"
  }
}

const App = () => {
  return (
    <div>
      <h2>My App!</h2>
      <Craft resolver={{Container}}>
        <h2>My Page Editor</h2>
        <Frame> 
          <Element is={Container}>
            <h2>Text</h2>
          </Canvas>
        </Frame>
      </Craft>
    </div>
  )
}
```

### Defining nodes in User Components

```jsx {5}
const Hero = () => {
  return (
    <div>
      <h3>I'm a Hero</h3>
      <Element id="drop" is={Container} canvas>
        <h3>Hi</h3>
      </Element>
    </div>
  )
}
```


### Setting `custom` properties

User Components may consume `custom` properties from their corresponding Node. These properties essentially act like additional props.

Let's say we have a Hero component that has a `css` custom property and as usual, we set its default values via the `craft` property.

```jsx {2-4}
const Hero = () => {
  const { css } = useNode(node => ({
    css: node.data.custom.css
  }));

  return (
    <div style={css}>
      <h3>I'm a Hero</h3>
      <Element id="drop" is={Container} canvas>
        <h3>Hi</h3>
      </Element>
    </div>
  )
}

Hero.craft = {
  custom: {
    css: {
      background: "#eee"
    }
  }
}
```

Now, if you'd like to actually set these values when you call the component, you can do it like so:

```jsx
<Frame>
  <Element is={Hero} custom={{
    css: {
      background: "#ddd"
    }
  }} />
</Frame>
```