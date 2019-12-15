---
id: nodes
title: Nodes
---

## User Elements
User Elements are React Elements in which the end user will have the ability to manipulate. In other words, these are the elements you will want your users to edit, drag and/or drop in your editor.  

Just like React Elements, these can be either simple HTML tags or React Components. We'll refer to User Elements that are React Components simply as *User Components*.


## Node
Craft.js maintains an internal state comprised of objects called Nodes, which represents and manages user components that are rendered in the editor. These Nodes contains information about their corresponding components, such as it's type, current props, DOM element, parent Node and so on. Hence, every user component is rendered and managed by their corresponding Node.

## Canvas
A Canvas is a special type of Node that is able to store child Nodes. The child Node's components will be made draggable.

Essentially, if a user component is managed by a Canvas node, that would effectively turn that component into a droppable region where users can drag and drop components into and out.


In a nutshell:
- A Canvas node defines a droppable region
- A Node that is a child of a Canvas is draggable
  - A Canvas node itself is not draggable unless if it itself is a child Node of parent Canvas. 


## How Nodes are created
We know what Nodes are and that every user component must be represented by a `Node`; but how do we actually represent our components as a Node ? 

`<Canvas />` is a React component provided by Craft.js which automatically creates a Canvas node and a Node for each of its immediate child. 

Let's say we want to create a droppable region, `div` with it's immediate children being made draggable:
```jsx
<Canvas is="div"> // A Canvas node with the type div;
  <h1>Hi</h1> // Node of the type h1; draggable! 
  <MyComp>Hey</MyComp> //  Node of the type MyComp; draggable! 
</Canvas>
```
> The `is` prop specifies the type of User Element to create, it can be either a HTML tag or a User Component

In the above example, using the `<Canvas />` component, we've created a Canvas node of the type `div` and additionally created subsequent child Nodes of the type `h1` and `MyComp`. 

Since our `div` element is now handled by a Canvas node; therefore it is now a droppable region. On the other hand, since `h1` and `MyComp` are child Nodes of a Canvas, they are now draggable. 

> The `<Canvas />` component only represents its immediate children as Nodes. Hence any subsequent grandchild components are not a `Node` and hence will not be draggable.

```jsx
<Canvas is="div"> // A Canvas node with the type div, I am not draggable btw.
  <div> // Node of the type div; draggable
    <h3>Hi</h3> // NOT A NODE, so I am not draggable :(
  </div>
  <Canvas is="p"> // Canvas Node of the type p; droppable and draggable!
    <h2>Hi</h2> // Node of the type h2; draggable! 
  </Canvas>
</Canvas>
```

Let's look at another example:
```jsx {2,7}
<Canvas is={Container}>
  <h1>Hi</h2>
</Canvas>

const Container = ({children}) => 
  <section>
    {children}
  </section>
```
Here, we have created a Canvas node of the type `Container` which is a User Component. Our `Container` element is now managed by a Canvas node, thus is now a droppable region; all items dropped in its location will be rendered in it's `children` prop.
