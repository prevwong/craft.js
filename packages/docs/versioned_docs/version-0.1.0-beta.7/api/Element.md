---
id: element
title: <Element />
sidebar_label: <Element />
---

import {API, Badge} from "@site/src/components";

<Badge type="component" />

Defines the Node for a given User Element

## Reference
### Props
<API items={[
  ["is", "React.ElementType", "The User Element to render"],
  ["id", "String", "Required if the &lt;Element /&gt; is being created inside a User Component"],
  ["canvas", "boolean", "If true, a Canvas Node will be created."],
  ["custom", "Record<string, any>", "Sets the Node's custom properties"],
  ["hidden", "boolean", "Sets the Node's hidden property. If true, this will hide the Node"],
  ["...elementProps", "Object", "The props of the element specified in 'is'"],
]} /> 


## Usage

### Configure Nodes in &lt;Frame /&gt;

Since the `<Frame />` component creates a Node automatically for all of its children elements, thus the `<Element />` component can be used to simply configure the values of the Node that is being created.

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
            </Element>
          </Element>
        </Frame>
      </Craft>
    </div>
  )
}
```

### Defining Linked Nodes

When used inside a User Component, `<Element />` works identically as used inside `<Frame />` but because there isn't a Node in-place, thus it has to create a new Linked Node - which is essentially a Node that is linked to the Node of the containing User Component via an arbitary `id`:

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

> `<Element />` used inside User Component must specify an `id` prop


## Examples

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