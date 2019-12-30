
<div align="center" style={{d}}>
<h1>craft.js</h1>

<img alt="npm" src="https://img.shields.io/npm/v/drooltip.js?color=%23000&style=for-the-badge">
<img alt="NPM" src="https://img.shields.io/npm/l/drooltip.js?color=%23000&style=for-the-badge">

</div>

<div align="center" style={{d}}>
  <img alt="styled-components" src="assets/readme-demo.gif"/>
</div>

<p align="center">
  <strong>
    <a aria-label="next.js learn" href="https://prevwong.github.io/craft.js/">Live Demo</a>
  </strong>
</p>

Building page editors are difficult - you have to worry about the drag and drop system, how components should be designed and how they should be rendered/updated.

Craft.js provides you the building blocks, which you can then use to iteratively add page editor functionality to your user interface. In other words, you can build your page editor according to your own UI/UX specifications.


## Docs
- [Core concepts](https://craft.js.org/r/docs/concepts/nodes)
- [Tutorial](https://craft.js.org/r/docs/basic-tutorial)
- [API Reference](https://craft.js.org/r/docs/api/editor-state)

## Examples
- [Basic](https://craft.js.org/examples/basic)


## Features
### It's just React
No need for complicated plugin systems. Design your editor from top to bottom the same way as you would design any other frontend application in React.

A simple user component can easily be defined as such:
```jsx
import {useNode} from "@craftjs/core";

const TextComponent = ({text}) => {
  const { connectors:{drag} } = useNode();

  return (
    <div ref={drag}>
      <h2>{text}</h2>
    </div>
  )
}
```

Heck, the entire UI of your page editor is built using just React. 
```jsx
import React from "react";
import {Craft, Frame, Canvas, Selector} from "@craftjs/core";
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
An obvious requirement for page editors is that they need to allow users to edit components. With Craft.js, you control the process of which these components should be edited. 

In the following example, when the user clicks on a component, we'll display a modal that requires the user to input a value for the `text` prop. As the input value changes, the component will be re-rendered with updated prop. 

```jsx
import {useNode} from "@craftjs/core";

const TextComponent = ({text}) => {
  const { connectors:{ connect, drag }, isClicked, setProp } = useNode(
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
With this, you could easily implement content editable text or drag-to-resize components, just as any modern page editor would have.

### User components with droppable regions
Let's say we need a "Container" component which users can drop into the editor. Additionally, we would also like them to be able to drag and drop other components into the Container. 

In Craft.js, it's as simple as calling the `<Canvas />`

```jsx
import {useNode} from "@craftjs/core";
const Container = () => {
  const { connectors: {drag} } = useNode();

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
Craft.js provides an expressive API which allows you to easily read and manipulate the editor state. Let's say you would like to implement a copy function for a component:
```jsx
import {useEditor, useNode} from "@craftjs/core";
const Container = () => {
  const { actions: {add}, query: { createNode, getNode } } = useEditor();
  const { id, connectors: {drag, connect}} = useNode();
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
      <Frame json={jsonString}>
        ...
      </Frame>
    </Editor>
  )
}
```

## Additional Packages
- **[@craftjs/layers](https://github.com/prevwong/craft.js/tree/master/packages/layers)** Display Photoshop-like layers editor

## Acknowledgements

- **[react-dnd](https://github.com/react-dnd/react-dnd)** The React drag-n-drop library. 
Although it is not actually used here, many aspects of Craft.js are written with react-dnd as a reference along with some utilities and functions being borrowed. 
- **[Grape.js](https://github.com/artf/grapesjs)** The HTML web builder framework. This has served as an inspiration for Craft.js. The element positioning logic used in Craft.js is borrowed from Grape.js
- **[use-methods](https://github.com/pelotom/use-methods)** A super handy hook when dealing with reducers. Craft.js uses a modified version of use-methods that works with Redux instead of `useReducer`

