---
id: nodes
title: Nodes
---

## User Elements
User Elements are React Elements which the end user will have the ability to manipulate. In other words, these are the elements which you will want your users to edit, drag and/or drop in your editor.  

Just like React Elements, these can be either simple HTML tags or React Components. We'll refer to User Elements which are React Components simply as *User Components*.


## Node
Craft.js maintains an internal state comprised of objects called Nodes which represent and manage User Elements that are rendered in the editor. These Nodes contain information such as the element type, current props, DOM element, parent Node and so on. Hence, every User Element is rendered and managed by their corresponding Node.

## Canvas Node

A Canvas is a special type of Node which enables it's corresponding user element to be a droppable region, where its child Node's user element will be made draggable.

In a nutshell:
- A Canvas node defines a droppable region
- A Node that is a child of a Canvas is draggable
- A Canvas node itself is not draggable unless it is a child Node of another Canvas. 


## Representing User Elements as Nodes

Let's take a look at how User Elements are actually represented as Nodes:

```jsx
<div style={{ background: "#333" }}> // A Node with the type div;
  <h1>Hi</h1> // Node of the type h1; not draggable
  <MyComp>Hey</MyComp> //  Node of the type MyComp; not draggable
  <MyContainerComponent> // A Node with the type MyContainerComponent; not draggable
    <h2>Second level</h2> // A Node with the type h2; not draggable! 
  </MyContainerComponent>
</div>
```

In the above example, a Node is created for each React element. The top-level `div` has 3 child nodes and the `MyContainerComponent` Node has a `h2` child Node.

By default, a non-Canvas Node is created. So, how do we actually create a Canvas node? For example, how do we make the top-level `div` into a Canvas Node so we could drag/drop it's children around? This is where the `<Element />` component becomes handy in manually defining Nodes.

```jsx {1}
<Element is="div" style={{ background: "#333" }} canvas> // A Canvas Node with the type div;
  <h1>Hi</h1> // Node of the type h1; draggable
  <MyComp>Hey</MyComp> //  Node of the type MyComp; draggable
  <MyContainerComponent> // A Node with the type MyContainerComponent; draggable
    <h2>Second level</h2> // A Node with the type h2; not draggable! 
  </MyContainerComponent>
</Element>
```

> The `is` prop specifies the type of User Element to create; it can be either a HTML tag or a User Component

In the above example, using the `<Element />` component with the `canvas` prop, we've created a Canvas node of the type `div`. Since our `div` element is now handled by a Canvas node, therefore it is now a droppable region. On the other hand, since `h1`, `MyComp` and `MyContainerComp` are child Nodes of a Canvas, they are now draggable. 

The `<Element />` component can also be used to configure other values of a Node, which is further detailed [here](../api/element)

<!-- We could also specify other things with the `<Element />` component, such as we could tell Craft to prevent parsing the children of an element as Nodes:

```jsx
<Element is="div" style={{ background: "#333" }} canvas> // A Canvas Node with the type div;
  <h1>Hi</h1> // Node of the type h1; draggable
  <MyComp>Hey</MyComp> //  Node of the type MyComp; draggable
  <Element is={MyContainerComponent} parseChildren={false}> // A Node with the type MyContainerComponent; draggable
    <h2>Second level</h2> // NOT A NODE! 
  </Element>
</Element>
``` -->
