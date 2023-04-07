---
id: user-component
title: UserComponent
sidebar_label: UserComponent
---

import {API, Badge} from "@site/src/components";

<Badge type="type" />

A wrapper of `React.ComponentType<Props>`. Accepts a static `craft` property for configuring the User Component.


## Reference
### Properties
<API items={[
  ["", "React.ComponentType<T> &", [
    ["craft", "Object", [
      ["displayName", "String", "A user-friendly name for the User Component. The value here will be used to set the node.data.displayName property."],
      ["props", "T", "Specify default values for the props T"],
      ["custom", "Record<string, any>", "Specify default custom values for the User Component"],
      ["related", "Record<string, React.ElementType>", "A map of React Components to share the same Node context. This components will be able access the useNode hook"],
      ["rules?", [
          ["canDrag", "(currentNode: Node, helpers: NodeHelpers) => boolean", "Specifies if the component can be dragged. Applicable only to components whose corresponding Node is a direct child of a Canvas"],
          ["canDrop", "(targetNode: Node, currentNode, helpers: NodeHelpers) => boolean", "Specifies if the current Node that is being dragged can be dropped in its target. Applicable only if the current Node is a direct child of a Canvas Node"],
          ["canMoveIn", "(incomingNodes: Node[], currentNode: Node, helpers: NodeHelpers) => boolean", "Specifies if an array of incoming Nodes can be dropped into the current component. Applicable only to components whose corresponding Node is a Canvas"],
          ["canMoveOut", "(outgoingNodes: Node[], currentNode: Node, helpers: NodeHelpers) => boolean", "Specifies if an array of child Nodes can be dragged out of the current component. Applicable only to components whose corresponding Node is a Canvas"],
      ]],
    ]]
  ]]
]} />


## Example
```jsx
type TextProps = {
  color: string;
  text: string;
};

const TextComponent: UserComponent<TextProps> = ({color, text}) => {
  return (
    <h2 style={{color}}>{text}</h2>
  )
}

const TextSettings = () => {
  const {props, setProp} = useNode();
  return (
    <div>
      Text: <input type="text" value={props.text} onChange={e => setProp(props => props.text = e.target.value) }/>
      Color: <input type="text" value={props.color} onChange={e => setProp(props => props.color = e.target.value) }/>
    </div>
  )
}
TextComponent.craft = {
  displayName: "My Text Component",
  props: {
    color: "#000",
    text: "Hi"
  },
  rules: {
    canDrag: (self: Node, helper) => true,
    canMoveIn: (incoming: Node[], self: Node, helper) => true,
    canMoveOut: (outgoing: Node[], self: Node, helper) => true
  },
  related: {
    settings: TextSettings
  }
}
```
