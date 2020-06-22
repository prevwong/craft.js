---
id: nodetree
title: NodeTree
sidebar_label: NodeTree
---

import {API, Badge} from "@site/src/components";

<Badge type="type" />


A useful data structure to represent the tree of a React Element as Nodes.

## Reference
### Properties
<API items={[
  ["rootNodeId", "NodeId", "The id of the root Node in the tree"],
  ["nodes", "Record<NodeId, Node>"]
]} />


## Example

```jsx
<div>
  <h2>Hello</h2>
  <h2>World</h2>
</div>

// The NodeTree of the div is:
{
  rootNodeId: "node-a",
  nodes: {
    "node-a" : {
      data: {
        type: "div",
        nodes: ["node-b", "node-c"]
      }
    },
    "node-b" : {
      data: {
        type: "h2",
        props: { children: "Hello" }
      }
    },
    "node-c" : {
      data: {
        type: "h2",
        props: { children: "World" }
      }
    }
  }
}
```