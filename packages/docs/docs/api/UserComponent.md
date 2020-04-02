---
id: user-component
title: UserComponent
sidebar_label: UserComponent
---

import {API, Badge} from "./API";

<Badge type="type" />

A wrapper of `React.ComponentType<Props>`. Accepts a static `craft` property for configuring the User Component.


## Reference
### Properties
<API items={[
  ["", "React.ComponentType<T> &", [
    ["craft", "Object", [
      ["name", "String", "A user-friendly name for the User Component"],
      ["defaultProps", "T", "Specify default values for the props T"],
      ["related", "Record<string, React.ElementType>", "A map of React Components to share the same Node context. This components will be able access the useNode hook"],
      ["rules?", [
          ["canDrag", "(currentNode: Node, helpers: NodeHelpers) => boolean", "Specifies if the component can be dragged. Applicable only to components whose corresponding Node is a direct child of a Canvas"],
          ["canMoveIn", "(incomingNode: Node, currentNode: Node, helpers: NodeHelpers) => boolean", "Specifies if an incoming Node can be dropped into the current component. Applicable only to components whose corresponding Node is a Canvas"],
          ["canMoveOut", "(outgoingNode: Node, currentNode: Node, helpers: NodeHelpers) => boolean", "Specifies if a child Node can be dragged out of the current component. Applicable only to components whose corresponding Node is a Canvas"],
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
  name: "Aweomse Text",
  defaultProps: {
    color: "#000",
    text: "Hi"
  },
  rules: {
    canDrag: (self: Node, helper) => true,
    canMoveIn: (incoming: Node, self: Node, helper) => true,
    canMoveOut: (outgoing: Node, self: Node, helper) => true
  },
  related: {
    settings: TextSettings
  }
}
```
