---
id: dev
title: Craft.js - Build any page editor with React
---



You know a web application is fancy when it has a page editor. Without a doubt, they help boost user experience significantly. If you're a frontend developer though, and have been tasked to be build one before, then you know precisely the difficulty and challenges of building one.

Existing libraries such as Grape.js or react-page are great for a working out-of-the-box page editor solution. However, as soon as you need to customize the look and feel of the page editor itself, you will find yourself hacking in the library's code.


## Introducing Craft.js
Craft.js is a React framework to build any type of page editor. Rather than providing a working page editor implementation with an user interface, Craft.js instead provides an abstraction for you to implement your own page editor upon. It comes backed-in with a extensible drag-n-drop system; handles the way React elements should be rendered/updated; and a cohesive API to interact with the editor which you can additionally implement your own features on top of.

### TL;DR
- Design your own user interface for your page editor
- Write React components that end-user could edit
- Govern drag-and-drop conditions for your components
- Control how your components should be edited. From simple text fields to content editables and drag to resize - if you can do it in React, then it's you can do it with Craft.js.


## Editable React Components
Let's start with a simple Card component like so:

```jsx
const Card = ({title}) => {
  return (
    <div>
      <h2>{title}</h2>
      <div id="p-only">
        <p>Hi</p>
      </div>
    </div>
  )
}
```

First, to integrate it with with Craft.js' drag-and-drop system, we just need to do the following modifications:

```jsx
import {useNode} from "@craftjs/core";

const Card = ({title}) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={dom => connect(drag(dom))}>
      <h2>{title}</h2>
      <div id="p-only">
        <p>Hi</p>
      </div>
    </div>
  )
}
```

What's happening here ? 
- We passed the `connect` connector to the root element of our component; this tells Craft.js that this element represents the `Card` component. Hence, the dimensions of the specified element will be taken into considerations during drag and drop events.
- Then, we also passed `drag` connector to the same root element; this adds the drag handlers to the DOM. If the component is rendered as child of a `<Canvas />`, then the user will be able to drag this element and it will move the entire Text component.


Next, we might want to be able to control the drag-n-drop rules of our Card component. For example purposes, let's say we only want our Card component to be draggable as long as it's `title` prop is not "No Drag". We can achieve this easily like so:
```jsx
const Card = () => {...}

Card.craft = {
  rules: {
    canDrag: (node) => node.data.props.title != "No Drag"
  }
}
```

#### Droppable regions
Next, let's take a look at the `#p-only` element we specified in our Card component. What if we want this area to be droppable, where only `p` could be dropped ? 

This is where the`<Canvas />` component provided by Craft.js becomes useful. It defines a droppable region, where each of it's immediate child is draggable.


```jsx
import {useNode, Canvas} from "@craftjs/core";

const Card = ({title}) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={dom => connect(drag(dom))}>
      <h2>{title}</h2>
      <Canvas id="p-only">
        <p>Hi</p>
      </Canvas>
    </div>
  )
}
```
Your next question might be how do we control the our newly created droppable region. The `<Canvas />` component accepts an `is` prop which can be either a HTML element or a React component (by default, it's a `div`). So, if we supplied a React component, we could essentially achieve the same design flexibility as we've with our Card component:

```jsx
import {useNode, Canvas} from "@craftjs/core";

const Container = ({children}) => {
  const { connectors: {connect} } = useNode();
  return (
    <div ref={dom => connect(dom)}>
      {children}
    </div>
  )
}

Container.craft = {
  rules: {
    canMoveIn: (incomingNode) => incomingNode.data.type == "p"
  }
}

const Card = ({title}) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={dom => connect(drag(dom))}>
      <h2>{title}</h2>
      <Canvas id="p-only" is={Container}>
        <p>Hi</p>
      </Canvas>
    </div>
  )
}
```

Let's break this down a bit. Our `<Container />` component is being rendered as a droppable region - this means, all dropped elements will be rendered in the component's `children` prop. Next, we also specified the `connectors` just as we did previously. This time, we specified a `canMoveIn` rule where only elements with the `p` tag will be accepted into the component.

## Control editing behaviours
Of course, any page editor must allow the end-user to edit the elements that are rendered. With Craft.js, you are in control of this as well. 

Let's implement make our `h2` element content editable so our users could visually edit the `title` prop:

```jsx
const Card = ({title}) => {
  const { connectors: { connect, drag }, setProp } = useNode();
  return (
    <div ref={dom => connect(drag(dom))}>
      <h2 contentEditable onKeyUp={e => setProp(e.target.innerText)}>{title}</h2>
      ...
    </div>
  )
}
```
> In a real application, you may want to consider using react-contenteditable

Obviously, we do not want the element to be content editable all the time; perhaps only when our Card component is actually clicked:

```jsx
const Card = ({title}) => {
  const { connectors: { connect, drag }, setProp, isSelected } = useNode((node) => ({
    isSelected: node.events.selected
  }));

  return (
    <div ref={dom => connect(drag(dom))}>
      <h2 contentEditable={isSelected} onKeyUp={e => setProp(e.target.innerText)}>{title}</h2>
      ...
    </div>
  )
}
```
What we are doing is essentially accessing Craft's internal state and retrieving information about the current instance of our Card component. In this case, we are retrieving the `selected` event state which returns `true` when the user clicks on the DOM specified by the `connect` connector of the Component.

## Your page editor, your user interface

Essentially, Craft.js exposes these few React components:
- `Editor` creates the Editor context and sets everything up
- `Frame` defines the editable area

As you may have notice, none of these are UI components, instead they are intended to be plugged into any user interface that you would like to implement for your page editor.

Let's take a look at a super simple interface that we could design:

```jsx
// pages/index.js
import React from 'react';

export default function App() {
  return (
    <>
      <h2>My page editor</h2>
      <Editor> {/* sets everything up */ }
        <div>
          <Frame> {/* This part is now editable */ }
            <Canvas is="div" style={{background: "#eee"}}> { /* Creates a gray droppable div */ }
              <h2>Drag me around</h2> 
              <p>I'm draggable too</h2>
              <Canvas is="div"> {/* a div that is both droppable and draggable */}
                <h2>Hi</h2> {/* a draggable h2 */}
              </Canvas>
            </Canvas>
          </Frame>
        </div>
      </Editor>
    </>
  );
}
```

### Interacting with the editor
Your user interface will most likely need to display some information or perform certain editor-related actions.

Let's say we want to design a Toolbar component that does the following things:
 - Tells us the the type of the currently selected element
 - A button to save the current editor state
 - Another button to load the last saved editor state

```jsx
import React, {useState} from 'react';

export default function App() {
  return (
    <>
      <h2>My page editor</h2>
      <Editor> 
        <Toolbar /> {/* Add this */}
        <div>
          <Frame>
            ...
          </Frame>
        </div>
      </Editor>
    </>
  );
}

const Toolbar = () => {
  const [savedState, setSavedState] = useState();
  const { selectedType, actions, query } = useEditor(state => {
    const selectedId = state.events.selected;
    return {
      selectedType: selectedId && state.nodes[selectedId].data.type
    }
  });

  return (
    <div>
      <h2>Currently selected: {selectedType} </h2>
      <a onClick={() => {
        const editorState = query.serialize();
        setSavedState(editorState);
      }}>Save checkpoint</a>
     {
       savedState ? (
         <a onClick={() => 
          actions.deserialize(editorState)
         }>Load from checkpoint</a>
       ) : null
     }
    </div>
  )
}
```

Let's break this down:
- First, we access the editor's state to retrieve the type of the currently selected element
- Then, when our "Save Checkpoint" button is clicked, we use the `serialize` query which tells the editor to return its state in a serialised JSON form. We then save the JSON output in our component's state
- Once we have the JSON, we display the "Load from checkpoint" button. When this button is clicked, we simply call the `deserialize` editor action which essentially returns the editor to the state stored in the JSON output.


## Closing words
These has been a high-level overview of Craft.js and we've only covered some very basic examples. We've seen how we could easily control almost every aspect of the page editor experience. Hopefully, this article has given you an idea on the possibilities of what you can do with Craft.js.
