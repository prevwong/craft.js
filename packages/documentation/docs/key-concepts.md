---
id: key-concepts
title: Key Concepts
sidebar_label: Key Concepts
---

There are some concepts that are crucial in understanding how to use Craft.js.


> User Components - components in which the user has ability to create/edit in your page editor

## Node 
Every user component created in the editor by Craft.js is represented as a `Node` in its internal state. It contains information relating to the component such as it's type, props, parent node, DOM element and so on. Craft.js will then render and manage components according to their corresponding `Node`.

### Canvas
A `Canvas` is a node that can hold other nodes as its children. A component that is a Canvas node essentially defines a droppable region in which other `Nodes` can be dropped into. 

All nodes that are a direct child of a Canvas node are also inherently draggable. 


### Creating Nodes
In order for React components to be rendered by Craft.js, they must be transformed to Nodes.  For this, we will can simply use the `<Canvas />` component which creates a droppable `Canvas` node and converts all of it's direct children into a draggable `Node`.


Let's take the following example:
```jsx
<Canvas is="div">
  <h1>Hi</h1>
  <MyCustomComponent>Hey</MyCustomComponent>
</Canvas>
```

The above will create a `Canvas` node with the type `div` and 2 more nodes, each with the type `h1` and `MyCustomComponent` respectively. 

Since `div` is now a Canvas, it is now a droppable region. Subsequently, since `h1` and `MyCustomComponent` are a child of a Canvas node, they are made draggable.

## Connectors 
Craft.js handles the events of every Node in order to manage the drag-n-drop system along with being able to identify if a Node is being selected, hovered or dragged. In order for this to be possible, user components must expose their DOM via the provided connectors.


```jsx
const MyComponent = () => {
  const { drag, connect } = useNode();


  return (
    <div ref={connect}> 
      <h1>Hey!</h1>
      <a ref={drag}>Drag me elsewhere</a>
    </div>
  )
}
```
`connect` tells Craft.js that this DOM element is what represents this component. Hence it's dimensions are taken into account when its being dragged/dropped. Additionally, clicking or hovering at this DOM element will update the component's corresponding Node's `active` and `hovered` event state.


`drag` simply attaches the drag event handlers to the DOM element. Dragging this DOM element will be considered as the entire component is being dragged; thus the component's corresponding Node's `drag` event state will be updated.s


## Collectors
It's pretty useful if we could read the internal state of Craft.js anywhere within our page editor. This is where we can use the collector functions.

We can access the entire internal state via the `useManager` hook like so:

```jsx
const Toolbar = () => {
  const { activeNode } = useManager(state => {
    const activeId = state.events.active;
    return {
      activeNode: activeId && state.nodes[activeId]
    }
  });

  return activeNode && <h2>{activeNode.id}</h2>
}
``` 

Additionally, if the component is a User Component, we can collect the internal state relevant to its corresponding `Node`:

```jsx
const MyComponent = () => {
  const {isHovered, isSelected, isDragged, drag, connect } = useNode((node) => ({
    isHovered: node.event.hover,
    isSelected: node.event.active,
    isDragged: node.event.hover,
  }));


  return (
    <div ref={connect}> 
      <h1>Hey!</h1>

      // Dragging this element will drag the entire MyComponent 
      <a ref={drag}>Drag me elsewhere</a>

      <p>
        Events:
        Clicked: {isSelected},
        Hovered: {isHovered},
        Dragged: {isDragged}
      </p>
    </div>
  )
}
```