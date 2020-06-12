---
id: node
title: Node
sidebar_label: Node
---

import {API, Badge} from "./API";

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
    ["index", "number", "Position of current Node in its parent"],
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
  ["dom", "HTMLElement", "The DOM of the current Node's User Element. For User Components, this is defined by the `connect` connector"],
  ["related", "Record<String, React.ElementType>", "A map of React Components that shares the current Node context"],
  ["rules", "Object", [
    ["canDrag", "(currentNode: Node) => boolean", "Specifies if the current Node can be dragged. Applicable only if the current Node is a direct child of a Canvas Node"],
    ["canMoveIn", "(incomingNode: Node, currentNode: Node) => boolean", "Specifies if an incoming Node can be dropped in the current Node. Applicable only if the current Node is a Canvas Node"],
    ["canMoveOut", "(outgoingNode: Node, currentNode: Node) => boolean", "Specifies if a child Node can be dragged out of the current Node. Applicable only if the current Node is a Canvas Node"],
  ]]
]} />

## Example

### Basics
```jsx
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

```jsx
const Container = () => {}
Container.craft = {
  name: "SimpleContainer"
};

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

### Custom properties

```jsx

Container.craft = {
  custom: {
    toSaveInDatabase: false,
    style: {{
      display: "flex"
    }}
  }
};

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

### Child nodes
```jsx
<div style={{background: "#eee"}}>
  <Container bg="#fff" />
</div>

"node-a": {
  id: "node-a",
  data: {
    type: "div",
    props: {
      style: {{
        background: "#eee",
      }}
    },
    nodes: ["node-b"]
    name: "div",
    displayName: "div",
    isCanvas: false
  }
}

"node-b": {
  id: "node-b",
  data: {
    type: Container,
    props: {
      bg: "#fff"
    },
    parent: "node-a",
    name: "Container",
    displayName: "SimpleContainer",
    isCanvas: false
  }
}
```



### Canvas nodes

```jsx
<div style={{background: "#eee"}} canvas>
  <Container bg="#fff" />
</div>

"node-a": {
  id: "node-a",
  data: {
    type: "div",
    ...
    nodes: ["node-b"]
    isCanvas: true
  }
}

"node-b": {
  id: "node-b",
  data: {
    type: Container,
    ...
    parent: "node-a",
    isCanvas: false
  }
}
```


### Linked nodes
```jsx
const TextEditable = () => {};

const Container = ({children}) => {
  return (
    <div>
      <Element id="header" is={TextEditable} text="Header" />
      {children}
    </div>
  )
}

<Container bg="#fff">Hello</Container>

"node-b": {
  id: "node-b",
  data: {
    type: Container,
    props: {
      bg: "#fff",
      children: "Hello",
    },
    linkedNodes: {
      "header": "node-c"
    },
    isCanvas: false
  }
}

"node-c": {
  id: "node-c",
  data: {
    type: TextEditable,
    props: {
      text: "Header"
    },
    parent: "node-b",
    isCanvas: false
  }
}
```
