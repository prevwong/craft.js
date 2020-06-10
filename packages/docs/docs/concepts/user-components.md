---
id: user-components
title: User Components
---

import {API} from "../api/API";

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

```jsx {17,18,21}
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

- i. `Hero` is being rendered with a Canvas Node, thus it defines a droppable region. However, since it is not a child of a Canvas Node, it is not draggable (the `drag` handler will not do anything).
- ii. `Hero` is an immediate child of a Canvas Node; it is draggable.
- iii. `Hero` is an immediate child of a Canvas Node and is rendered with a Canvas Node - it is both draggable and droppable.

## Props manipulation
You've probably seen page editors where you could directly interact with the components and manipulate them. For instance, drag to resize an image or visually edit a text. This is easily achievable with Craft.js as well.

Since components are managed by their corresponding `Node` which contains information including the component's props, thus we can call the `setProp` method to update the prop values stored in the `Node`. In turn, this will re-render the component with its updated values.

```jsx
const Text = ({text, fontSize}) => {
  const { connectors: {connect, drag}, setProp } = useNode();

  return (
    <span ref={dom => connect(drag(dom))} style={{fontSize}} contentEditable={isClicked} onKeyUp={(e) => {
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
  const { connectors: {connect, drag}, setProp, isClicked } = useNode((node) => ({
    isClicked: node.events.selected
  }));

  return (
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
const Text = ({text}) => { /** same as previous example **/ }
Hero.craft = {
  props: {
    text: "Hi there!"
  }
}
```

## Specify drag/drop rules
You may want to restrict how your components are dragged or what goes in and out of your component. These rules can be specified in the static `craft.rules`.

Let us write a (pretty strange) rule for our Text component which users can only drag if they change the `text` prop to "Drag": 
```jsx
const Text = ({text}) => { /** same as the previous example **/ }
Text.craft = {
  props: { /** same as the previous example **/ },
  rules: {
    canDrag: (node) => !!node.data.props.text == "Drag"
  }
}
```


## Related Components
What happens if you need to design some component to complement our  user component? For instance, if we were planning on building a Toolbar somewhere in our page editor, we would like the Toolbar to display a bunch of text inputs to allow the user the edit the currently selected component. It would be great if we could retrieve a specific component that has all the relevant inputs for the user to edit the currently selected component.


This is where related components become useful. These components share the same corresponding `Node` as the actual user component, hence the `useNode` hook that we have been using all this while will be made available to these components as well. 

```jsx
const Hero = ({text}) => { /** same as the previous example **/ }
Hero.craft = {
  related: {
    toolbar: HeroToolbarSettings
  }
}

const HeroToolbarSettings = () => {
  const { setProp, text } = useNode((node) => ({
    text: node.data.props.text
  }));

  return (
    <div>
      <h2>Hero settings</h2>
      <input 
        type = "text" 
        value={text} 
        onChange={e => 
          setProp(prop => prop.text = e.target.value) 
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
Let's say we're building a Hero user component like so:

```jsx
const Hero = ({background, title}) => {
  return (
    <div style={{ background }}>
      <span>{title}</span>
      <section>
        <h3>I need some coffee to continue writing this</h3>
      </section>
    </div>
  )
}
```

Your first instinct is to simply just use the Text component directly like so:

```jsx
const Hero = ({background, title}) => {
  return (
    <div style={{ background }}>
      <Text text={title} />
      <section>... </section>
    </div>
  )
}
```

But this won't really work - the Text Component will not have its own Node. Instead, it will still be a part of the Hero's Node. So for example, inside the Text Component, if we call `setProps(props => props.text = "...")`, it will actually be editing the props of `Hero` (in this case it will be adding a new prop `text` to Hero, which is not consumed by Hero anyway). Essentially, this means you can't have your users to click on the Text component and have them edit the text independently. 


Remember how the `<Element / >` component was used to define/configure Nodes? Well, we can use that here to define a new Node for our Text component:


```jsx
const Hero = ({background, title}) => {
  return (
    <div style={{ background }}>
      <Element id="title_text" is={Text} text={title} />
      <section>
        <h3>I need some coffee to continue writing this</h3>
      </section>
    </div>
  )
}
```

> You must specify the `id` prop when defining new Nodes with `<Element />` inside a User Component

We call these linked nodes since they are linked to another Node via an arbitary `id`. In this case, the `Text` node is linked to `Hero`'s node via its "title_text" id.

### Linked nodes vs Child nodes

It's important to know that this is not a child Node like what we have seen all the while before this. A child Node is passed and rendered in it's parent's `children` prop whereas this directly part of its parent's render method. 

```jsx {4}
const Hero = ({background, title}) => {
  return (
    <div style={{ background }}>
      <Element id="title" is={Text} text={title} /> // Linked node
      ...
    </div>
  )
}
```


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
```