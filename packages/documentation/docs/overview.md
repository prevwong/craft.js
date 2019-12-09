---
id: overview
title: Overview
sidebar_label: Overview
---

## Motivation

Building page editors are difficult - you got to worry about the drag and drop system, how components should be designed and how they should be rendered/updated.

Craft.js presents a solution in which it provides you the building blocks, which you can then use to iteratively add functionality to your user interface. In other words, you can build your page editor according to your own specifications.


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
import {Craft, Editor, Canvas, Selector} from "craftjs";
const App = () => {
  return (
    <div>
      <header>Some fancy header or whatever</header>
      <Craft>
        <Editor resolver={TextComponent, Container}>  
          <Canvas>
            <TextComponent text="I am already rendered here" />
          </Canvas>
        </Editor>
        <div>
          <Selector render={<TextComponent text="Some default text" />}>
            Drag me to create a new Text Component
          </Selector>
        </div>
      </Craft>
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
      isClicked: state.event.active,
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
import {useManager, useNode} from "craftjs";
const Container = () => {
  const { actions: {add}, query: { transformJSXToNode, getNode } } = useManager();
  const { id, drag, connect} = useNode();
  return (
    <div ref={connect(drag)}>
      ...
      <a onClick={() => {
        const { data: {type, props}} = getNode(id);
        add(
          transformJSXToNode(React.createElement(type, props));
        );
      }}>
        Make a copy of me
      </a>
    </div>
  )
}

```


### Serializable state
The editor state can be serialized into JSON for storage. 

