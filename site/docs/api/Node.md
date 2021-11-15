---
id: node
title: Node
sidebar_label: Node
---

import {API, Badge} from "@site/src/components";

<Badge type="type" />


## Reference
### Properties
<API items={[
  ["id", "NodeId", "A randomly generated unique id"],
  ["data", "Object", [
    ["props", "Record<String, any>", "The current props for the user element"],
    ["type", "React.ElementType", "The type of User Element"],
    ["name", "String", "Name of the User Element"],
    ["displayName", "String", "By default, it will be set to the same value as 'name'. But User Components have the ability to opt for a more user-friendly name by setting the craft.name property"],
    ["isCanvas", "boolean", "True if the current Node is a Canvas Node"],
    ["parent", "NodeId", "The parent Node's id"],
    ["nodes", "NodeId[]", "The id of the child Nodes"],
    ["hidden", "boolean"],
    ["custom", "Record<String, any>", "Custom properties stored in the Node"],
    ["linkedNodes", "Record<String, NodeId>", "A map of Nodes defined inside the User Component. Only applicable if the current Node's User Element is a Component which contains &lt;Element /&gt; inside its render"]
  ]],
  ["events", "Object", [
    ["selected", "boolean", "Is true if the user element is clicked"],
    ["hovered", "boolean", "Is true if the user element is being hovered"],
    ["dragged", "boolean", "Is true if the user element is being dragged"],
  ]],
  ["dom", "HTMLElement | null", "The DOM of the current Node's User Element. For User Components, this is defined by the `connect` connector"],
  ["related", "Record<String, React.ElementType>", "A map of React Components that shares the current Node context"],
  ["rules", "Object", [
    ["canDrag", "(currentNode: Node) => boolean", "Specifies if the current Node can be dragged. Applicable only if the current Node is a direct child of a Canvas Node"],
    ["canDrop", "(targetNode: Node, currentNode: Node) => boolean", "Specifies if the current Node that is being dragged can be dropped in its target. Applicable only if the current Node is a direct child of a Canvas Node"],
    ["canMoveIn", "(incomingNodes: Node[], currentNode: Node, helpers: NodeHelpers) => boolean", "Specifies if an array of incoming Nodes can be dropped into the current component. Applicable only to components whose corresponding Node is a Canvas"],
    ["canMoveOut", "(outgoingNodes: Node[], currentNode: Node, helpers: NodeHelpers) => boolean", "Specifies if an array of child Nodes can be dragged out of the current component. Applicable only to components whose corresponding Node is a Canvas"],
  ]]
]} />

## Examples

### Basics

#### Simple elements
```jsx
// Example
<div style={{background: "#eee"}}>Hello</h2>

"node-a": {
  id: "node-a",
  data: {
    type: "div",
    props: {
      style: {{
        background: "#eee",
      }}
      children: "Hello"
    },
    name: "div",
    displayName: "div",
    isCanvas: false
  }
}
```

#### User Component
```jsx
// Definition
const Container = () => {}
Container.craft = {
  name: "SimpleContainer"
};


// Example
<Container bg="#fff" />

"node-b": {
  id: "node-b",
  data: {
    type: Container,
    props: {
      bg: "#fff"
    },
    name: "Container",
    displayName: "SimpleContainer",
    isCanvas: false
  }
}
```

### Child Nodes

Nodes that are referenced in the parent Node's `data.nodes` property. These nodes are rendered in the parent User Component's `children` prop

```jsx
// Example
<Container bg="#fff">
  // highlight-next-line
  <h2>Hello</h2>
</Container>

"node-a": {
  id: "node-a",
  data: {
    ...
    type: Container,
    props: {...},
    // highlight-next-line
    nodes: ["node-b"]
  }
}

"node-b": {
  id: "node-b",
  data: {
    type: "h2,
    props: {...},
    // highlight-next-line
    parent: "node-a"
  }
}
```


### Linked nodes

Nodes that are linked to a parent Node via an arbitary `id`

```jsx
// Definition
const TextEditable = () => {};

const Container = () => {
  return (
    <div>
      // highlight-next-line
      <Element id="header" is={TextEditable} text="Header" />
    </div>
  )
}

// Example
<Container bg="#fff" />

"node-a": {
  id: "node-a",
  data: {
    type: Container,
    props: {...},
    // highlight-next-line
    linkedNodes: {
      // highlight-next-line
      "header": "node-b"
      // highlight-next-line
    }
  }
}

"node-b": {
  id: "node-b",
  data: {
    type: TextEditable,
    props: {...},
    // highlight-next-line
    parent: "node-a"
  }
}
```



### Nodes with Custom properties

```jsx
// Definition
const Container = () => {...}
Container.craft = {
  custom: { // default custom values
    toSaveInDatabase: false
  }
};

// Example
<Element is={Container} bg="#fff" custom={{ toSaveInDatabase: true}} />

"node-b": {
  id: "node-b",
  data: {
    ...
    custom: {
      toSaveInDatabase: true,
      style: {{
        display: "flex"
      }}
    }
  }
}
```