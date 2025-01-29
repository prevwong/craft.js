---
id: user-components
title: User Components
---

import {API} from "@site/src/components";

User Components are intended to be written just like any other React Component. 

Let's start with a simple Text component:

```jsx
const Text = ({text, fontSize}) => {
  return (
    <span contenteditable="true" style={{fontSize}}>{text}</span>
  )
}
```
Now, let's actually get the component to work with the editor. The `useNode` hook provides us with several information and methods related to the corresponding `Node` that manages the component.

```jsx
const { connectors: {connect, drag}, setProp, ...collected } = useNode((node) => {});
```

Additionally we can pass configuration values via the static `craft` property:
```jsx
const Text = () => {...}
Text.craft = {
  props: {},
  rules: {
    canDrop: () => true,
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true
  },
  related: {}
}
```

We'll explore each of these values in the following sections.

## Connectors
The first thing we would want to do is to actually let Craft.js to manage the DOM for our component. 

- `connect`: specifies the DOM that represents the User Component.  If the component's corresponding Node is a Canvas, then this also defines the area that is droppable.
- `drag`: specifies the DOM element that should be made draggable. When the user drags this element, it'll be considered as dragging the entire component, therefore moving the entire component to the drop location. This connector only takes effect if the component's corresponding node is a Canvas Node.

```jsx {14,15,18}
const Container = ({children}) => {
  const { connectors: {connect, drag} } = useNode();
  return (
    <div ref={dom => connect(drag(dom))}>
      {children}
    </div>
  )
}

const App = () => {
  return (
    <Editor resolvers={{Container}}>
      <Frame>
        <Element is={Container} canvas> // (i)
          <Container> // (ii)
            <h2>Hi</h2>
          </Container>
          <Element is={Container} canvas> // (iii)
            <h2>Hi</h2>
          </Element>
        </Element>
      </Frame>
    </Editor>
  )
}
```

- i. `Element` is being rendered with a Canvas Node, thus it defines a droppable region. However, since it is not a child of a Canvas Node, it is not draggable (the `drag` handler will not do anything).
- ii. `Container` is an immediate child of a Canvas Node; it is draggable.
- iii. `Element` is an immediate child of a Canvas Node and is rendered with a Canvas Node - it is both draggable and droppable.

## Props manipulation
You've probably seen page editors where you could directly interact with the components and manipulate them. For instance, drag to resize an image or visually edit a text. This is easily achievable with Craft.js as well.

Since components are managed by their corresponding `Node` which contains information including the component's props, thus we can call the `setProp` method to update the prop values stored in the `Node`. In turn, this will re-render the component with its updated values.

```jsx {2,6-8}
const Text = ({text, fontSize}) => {
  const { connectors: {connect, drag}, actions: {setProp} } = useNode();

  return (
    <span ref={dom => connect(drag(dom))} style={{fontSize}} onKeyUp={(e) => {
        setProp(props => {
          props.text = e.target.innerText;
        })
      }}>{text}
    </span>
  )
}
```

In the above example, we have updated our `span` element to be content editable and added an event handler to update the `text` prop as the user visually enters in a new value.

## Collecting Node's state
The information stored in a corresponding `Node` could be useful in helping you build more usable components. We can retrieve information from a `Node` by passing a collector function to the `useNode` hook. Every time the values we retrieved via the collector function changes, our component will re-render. This is very much similar to Redux's `connect` pattern.


For instance, let's say we would like to enable the content editable text from the previous section only when the user has actually clicked on our component: 

```jsx
const Text = ({text, fontSize}) => {
  // highlight-next-line
  const { connectors: {connect, drag}, setProp, isClicked } = useNode((node) => ({
    // highlight-next-line
    isClicked: node.events.selected
  }));

  return (
    // highlight-next-line
    <span ref={dom => connect(drag(dom))} style={{fontSize}} contentEditable={isClicked} onKeyUp={(e) => {
        setProp(props => {
          props.text = e.target.innerText;
        })
      }}>{text}
    </span>
  )
}
```

## Default Props
While it's not necessary as we could simply define default parameters (e.g.: ES6 defaults) directly within our components, these default values will not actually be recorded into the component's corresponding `Node`, which could leave us with a lot of empty prop values when we wish to retrieve the `Node` for a component when building other parts of our editor (eg: a Toolbar for editing a component's values).

To prevent that, we can explicitly specify default prop values via the `craft.props` like the following:

```jsx
const Text = ({text, fontSize}) => { /** same as previous example **/ }
Text.craft = {
  props: {
    text: "Hi there!",
    fontSize: 12
  }
}
```

## Specify drag/drop rules
You may want to restrict how your components are dragged or what goes in and out of your component. These rules can be specified in the static `craft.rules`.

Let us write a (pretty strange) rule for our Text component which users can only drag if they change the `text` prop to "Drag": 
```jsx
const Text = ({text, fontSize}) => { /** same as the previous example **/ }
Text.craft = {
  props: { /** same as the previous example **/ },
  rules: {
    canDrag: (node) => !!node.data.props.text == "Drag"
  }
}
```


## Related Components
What happens if you need to design some component to complement our  user component? For instance, if we were planning on building a Toolbar somewhere in our page editor, we would like the Toolbar to display a bunch of text inputs to allow the user to edit the currently selected component. It would be great if we could retrieve a specific component that has all the relevant inputs for the user to edit the currently selected component.


This is where related components become useful. These components share the same corresponding `Node` as the actual user component, hence the `useNode` hook that we have been using all this while will be made available to these components as well. 

```jsx
const Text = ({text, fontSize}) => { /** same as the previous example **/ }
Text.craft = {
  related: {
    toolbar: TextToolbarSettings
  }
}

const TextToolbarSettings = () => {
  const { setProp, fontSize } = useNode((node) => ({
    fontSize: node.data.props.fontSize
  }));

  return (
    <div>
      <h2>Text settings</h2>
      <input 
        type = "number" 
        value={fontSize} 
        placeholder="Font size"
        onChange={e => 
          setProp(prop => prop.fontSize = e.target.value) 
        }
       />
    </div>
  )
}
```
Now, let's say we have a Toolbar component somewhere in our editor. We can easily retrieve the related component as such:

```jsx
const Toolbar = () => {
  const { selectededNodeId, toolbarSettings } = useEditor((state) => ({
    selectededNodeId : state.event.selected,
    toolbarSettings:  state.nodes[state.events.selected].related.toolbar
  }));
  return (
    <div>
      <h2>My Awesome Toolbar</h2>
      {
        selectededNodeId && toolbarSettings ? 
          React.createElement(toolbarSettings)
        : null
      }
    </div>
  )
}

```

## Defining editable elements

Now, let's say we are creating a new User Component like so:
```jsx
const Hero = ({background}) => {
  return (
    <div style={{ background }}>
      <span>Hero Title</span>
    </div>
  )
}
```

Then, we decide that we want to have the `span` element to be editable independent of the Text user component we made earlier.

Your first instinct might be to just use the Text component directly:

```jsx {4}
const Hero = ({background}) => {
  return (
    <div style={{ background }}>
      <Text text="Hero Title" />
    </div>
  )
}
```

But this won't really work the way we want it to - the Text Component will not have its own Node. Instead, it will still be a part of Hero's Node. So, inside the Text Component, when we call `setProps(props => props.text = "...")`, it will actually be editing the props of `Hero`. In this case, it will be adding a new prop `text` to Hero, which is not consumed by Hero and therefore makes no sense.

So how do we even define new Nodes inside a User Component? Previously, we discussed how `<Element />` is used to define Nodes; that concept is applied universally in Craft.js. Hence, we just have to wrap our `<Text />` element in the example above with `<Element />`. 


```jsx {4}
const Hero = ({background}) => {
  return (
    <div style={{ background }}>
      <Element is={Text} text="Hero Title" id="title_text" />
    </div>
  )
}
```

> You must specify the `id` prop of `<Element />` when used inside a User Component

In the above example, we used `<Element />` to create and configure a new Node inside our User Component. We call these Linked Nodes since they are linked to a parent Node via an arbitary `id`. In this case, the `Text` node is linked to the `Hero` node via its "title_text" id.

Similarly, we could also create a droppable region inside a User Component via a Canvas Node:

```jsx {5-7}
const Hero = ({background}) => {
  return (
    <div style={{ background }}>
      <Element is={Text} text="Hero Title" id="title_text" />
      <Element canvas is="section" id="droppable_container">
        <h2>I'm dropped here for now</h2>
      </Elemnet>
    </div>
  )
}
```

<!--
### Linked nodes vs Child nodes

It's important to know that Linked Nodes are not child Nodes. A child Node is passed and rendered in its parent's `children` prop whereas this is directly part of its parent's render method. 

#### Linked Node
```jsx {4}
const Hero = ({background}) => {
  return (
    <div style={{ background }}>
      <Element is={Text} text="Hero Title" id="title_text" /> // Linked node
      ...
    </div>
  )
}

// Node representation
{
  "node-a": {
    data: {
      type: Hero,
      props: {
        background: "...",
        title: "..."
      },
      linkedNodes: {
        "title_text": "node-b"
      }
    }
  },
  "node-b": {
    data: {
      type: Text,
      props: {
        text: "...",
      },
    }
  }
}
```

#### Child Node

```jsx {5,11}
const Container = ({background, title, children}) => {
  return (
    <div style={{ background }}>
      ...
      {children}
    </div>
  )
}

<Container>
  <h2>Text</h2> // Child Node
</Container>

// Node representation
{
  "node-a": {
    data: {
      type: Container,
      props: {
        background: "...",
        title: "..."
      },
      nodes: {
        "node-b"
      }
    }
  },
  "node-b": {
    data: {
      type: "h2",
      children: "Text"
    }
  }
}
```
-->
