---
id: overview
title: Overview
---

## Motivation

Building page editors are difficult - you have to worry about the drag and drop system, how components should be designed and how they should be rendered/updated.

Craft.js provides you the building blocks, which you can then use to iteratively add page editor functionality to your user interface. In other words, you can build your page editor according to your own UI/UX specifications.


## Features
### It's just React
No need for any complicated plugin systems. Design your editor from top to bottom the same way as you would design any ordinary component in React.

A simple user component can easily be defined as such
```jsx
import {useNode} from "craftjs";

const TextComponent = ({text}) => {
  const {drag} = useNode();

  return (
    <div ref={drag}>
      <h2>{text}</h2>
    </div>
  )
}
```


Heck, the entire UI of our page editor can just built using React as well
```jsx
import React from "react";
import {Craft, Frame, Canvas, Selector} from "craftjs";
const App = () => {
  return (
    <div>
      <header>Some fancy header or whatever</header>
      <Editor>
        <Frame resolver={TextComponent, Container}>  
          <Canvas>
            <TextComponent text="I am already rendered here" />
          </Canvas>
        </Frame>
      </Editor>
    </div>
  )
}
```

### Control how your components are edited
An obvious requirement for page editors is that they need to allow users to edit components. With Craft.js, you control how the user components should be edited. 

In the following example, we are simply showing a modal that requests the user to input a value for `text` whenever the component is clicked by the user - as the input value changes, the component will be updated. 

```jsx
import {useNode} from "craftjs";

const TextComponent = ({text}) => {
  const {connect, drag, isClicked, setProp } = useNode(
    (state) => ({ 
      isClicked: state.event.selected,
    })
  );

  return (
    <div ref={connect(drag)}>
      <h2>{text}</h2>
      {
        isClicked ? (
          <Modal>
            <input 
              type="text" 
              value={text} 
              onChange={e => setProp(e.target.value)} 
            />
          </Modal>
        )
      }
    </div>
  )
}
```
With this, you could easily implement content editable text or drag-to-resize components - just as any modern page editor would have.

### User components with droppable regions
Let's say we need a "Container" component which users can drop into the editor. Additionally, we would also like them to be able to drag and drop other components into the Container. 

In Craft.js, it's as simple as calling the `<Canvas />`

```jsx
import {useNode} from "craftjs";
const Container = () => {
  const {drag} = useNode();

  return (
    <div ref={drag}>
      <Canvas id="drop_section">
         // Now users will be able to drag/drop components into this section
        <TextComponent />
      </Canvas>
    </div>
  )
}
```

### Extensible
Craft.js provides and expressive API which allows you to easily manipulate the editor state. Let's say you would like to implement a copy function for a component:
```jsx
import {useEditor, useNode} from "craftjs";
const Container = () => {
  const { actions: {add}, query: { createNode, getNode } } = useEditor();
  const { id, drag, connect} = useNode();
  return (
    <div ref={connect(drag)}>
      ...
      <a onClick={() => {
        const { data: {type, props}} = getNode(id);
        add(
          createNode(React.createElement(type, props));
        );
      }}>
        Make a copy of me
      </a>
    </div>
  )
}

```


### Serializable state
The editor's state can be serialized into a simple JSON format for storage. 

```jsx
const SaveButton = () => {
  const { query } = useManager();
  return <a onClick={() => console.log(query.serialize()) }>Save</a>
}
```

Of course, Craft.js will also able to recreate the entire state from the JSON string.
```jsx
const App = () => {
  const jsonString = /* get JSON from server */
  return (
    <Editor>
      <Frame nodes={jsonString}>
        ...
      </Frame>
    </Editor>
  )
}
```
