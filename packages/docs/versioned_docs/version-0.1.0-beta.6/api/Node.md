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
    ["displayName", "String", "By default, it will be set to the same value as 'name'. But User Components have the ability to opt for a more user-friendly name"],
    ["isCanvas", "boolean", "True if the current Node is a Canvas Node"],
    ["parent", "NodeId", "The parent Node's id"],
    ["index", "number", "Position of current Node in its parent"],
    ["nodes", "NodeId[]", "The id of the child Nodes; only applicable if the current Node is a Canvas"],
    ["hidden", "boolean"],
    ["custom", "Record<String, any>", "Custom properties stored in the Node"],
    ["childCanvas", "Record<String, NodeId>", "A map of Canvas Nodes defined inside the User Component. Only applicable if the current Node's User Element is a Component which contains &lt;Canvas /&gt; inside its render"]
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

