---
id: useNode
title: useNode()
sidebar_label: useNode()
---

import {API} from "./API";

A Hook to that provides methods and state information related to the corresponding `Node` that manages the current component. 

```tsx
const { connectors, setProp, ...collected } = useNode(collector);
```

> Note: This hook can only be used within a User Component. 


## Reference
### Parameters
<API items={[
  ["collector", "(node: Node) => Collected", "A function that collects relevant state information from the corresponding Node. The component will re-render when the values returned by this function changes."]
]} /> 

### Returns


<API items={[
  [null, "Object", [
    ["connectors", "Object", [
      ["connect", "(dom: HTMLElement) => HTMLElement", "Specifies the DOM that represents the user component"],
      ["drag", "(dom: HTMLElement) => HTMLElement", "Specifies the DOM that should be draggable"]
    ]],
    ["setProp", "(props: Object) => void", "Manipulate the current component's props"],
    ["...collected", "Collected", "The collected values returned from the collector"]
  ]
  ]
]} /> 

## Examples
`useNode` is crucial for writing [User Components](../concepts/user-components).

### Collecting state information
```tsx
import cx from "classnames";
import {useNode} from "craftjs";

const Example = () => {
  const { isHovered, amIBeingDragged } = useNode((node) => ({
    isHovered: node.events.hover,
    amIBeingDragged: node.events.drag,

  }));

  return (
    <div className={cx({
      "hovering" : isHovered,
      "dragging" : amIBeingDragged
    })}>
      Yo
    </div>
  )
}
```

### Connectors
Connectors must receive a HTML element - which can be obtained via an element's `ref`.

Typically, you would want to chain the `connect` and `drag` connectors on the root element of your component. This way, users would be able to drag anywhere within the DOM to move the component.
```jsx
const Example = () => {
  const { connectors: {connect, drag} } = useNode();

  return (
    <div ref={ref => connect(drag(ref))}>
      <div>Hi world</div>
    </div>
  )
}
```

Alternatively, you could place the `drag` connector in a child element too.

In the following example, we specified it on the `a` element. Now, users will need to drag the `a` element if they wish to move the component.
```jsx
const Example = () => {
  const { connectors: {connect, drag} } = useNode();

  return (
    <div ref={connect}>
      <div>Hi world</div>
      <a ref={drag}>Drag me to move this component</a>
    </div>
  )
}
```

You could place the connectors on a React Component as well. However, the component must expose/forward it's DOM in it's `ref`
```jsx
const CustomDragHandler = React.forwardRef((props, ref) => {
  return(
    <a ref={ref}>Drag me to move this component</a>
  )
});

const Example = () => {
  const { connectors: {connect, drag} } = useNode();

  return (
    <div ref={connect}>
      <div>Hi world</div>
      <CustomDragHandler ref={drag}>Drag me to move this component</CustomDragHandler>
    </div>
  )
}
```

### Usage within child components
Since User Components are contextually bounded by the `Node` that they are being managed by, thus `useNode` can be used anywhere **within** the component tree.

In the previous example, we didn't actually need to forward refs from `CustomDragHandler` since it's bounded by the same `Node` as it's parent. Instead, we can just use the connectors from `useNode` directly.


```jsx
const CustomDragHandler = () => {
  const {drag} = useNode();
  return(
    <a ref={drag}>Drag me to move this component</a>
  )
};

const Example = () => {
  const { connectors: {connect} } = useNode();

  return (
    <div ref={connect}>
      <div>Hi world</div>
      <CustomDragHandler />
    </div>
  )
}
```



### Manipulating state

```jsx
const Example = ({someProp}) => {
  const { connectors: {connect, drag} } = useNode();

  return (
    <div ref={connect}>
      <div>Hi world</div>
      <a ref={drag}>Drag me to move this component</a>
      <input type="text" value={someProp} onChange={e => {
        setProp(props => {
          props.someProp = e.target.value;
        });
      }} />
    </div>
  )
}
```