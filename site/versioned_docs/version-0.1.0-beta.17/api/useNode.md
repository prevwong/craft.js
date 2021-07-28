---
id: useNode
title: useNode()
sidebar_label: useNode()
---

import {API, Badge} from "@site/src/components";

<Badge type="hook" />


A Hook that provides methods and state information related to the corresponding `Node` that manages the current component. 

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
    ["id", "NodeId", "The corresponding Node's id"],
    ["related", "boolean", "Identifies if the component is being used as related component"],
    ["inNodeContext", "boolean", "This is useful if you are designing a User Component that you also wish to be used as an ordinary React Component; this property helps to differentiate whether the component is being used as a User Component or not"],
    ["connectors", "Object", [
      ["connect", "(dom: HTMLElement) => HTMLElement", "Specifies the DOM that represents the User Component"],
      ["drag", "(dom: HTMLElement) => HTMLElement", "Specifies the DOM that should be draggable"]
    ]],
    ["actions", "Object", [
      ["setProp", "(props: Object, throttleRate?: number) => void", "Manipulate the current component's props. Additionally, specify a throttleRate to throttle the changes recoded in history for undo/redo"],
      ["setCustom", "(custom: Object, throttleRate?: number) => void", "Manipulate the current component's custom properties. Additionally, specify a throttleRate to throttle the changes recoded in history for undo/redo"],
      ["setHidden", "(bool: boolean) => void", "Hide/unhide the current component"]
    ]],
    ["...collected", "Collected", "The collected values returned from the collector"]
  ]
  ]
]} />


## Examples

### Collecting state information
```tsx
import cx from "classnames";
import {useNode} from "@craftjs/core";

const Example = () => {
  const { isHovered, amIBeingDragged } = useNode((node) => ({
    isHovered: node.events.hovered,
    amIBeingDragged: node.events.drag,

  }));

  return (
    <div className={cx({
      "hovering" : isHovered,
      "dragged" : amIBeingDragged
    })}>
      Yo
    </div>
  )
}
```

### Connectors
Connectors must receive a HTML element which can be obtained via an element's `ref`.


Typically, you would want to chain the `connect` and `drag` connectors to the root element of your component. This way, users would be able to drag anywhere within the DOM to move the component.
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

You could place the connectors on a React Component as well. However, the component must expose/forward its DOM in its `ref`
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
Since User Components are contextually bounded by the `Node` they are being managed by, `useNode` can be used anywhere **within** the component tree.

In the previous example, we didn't actually need to forward refs from `CustomDragHandler` since it's bounded by the same `Node` as its parent. Instead, we can just use the connectors from `useNode` directly.


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
const Example = ({enabled, text}) => {
  const { connectors: {connect, drag}, actions: {setProp} } = useNode();

  return (
    <div ref={connect}>
      <div>Hi world</div>
      <a ref={drag}>Drag me to move this component</a>
      <button onClick={e => {
        setProp(props => {
          props.enabled = !props.enabled;
        });
      }}>Toggle</button>

      <input type="text" value={text} onChange={e => {
        setProp(props => {
          props.text = e.target.value;
        }, 500);
      }} />
    </div>
  )
}
```


## Legacy API
For Class Components, use `connectNode` instead.

<Badge type="hoc" title={false} />


### Parameters
<API items={[
  ["collector", "(node: Node) => Collected", "A function that collects relevant state information from the corresponding Node. The component will re-render when the values returned by this function change."]
]} /> 

### Injected Props
<API items={[
  ["...useNode(collector)", "Object", "Identical return values as the useNode() hook above"]
]} /> 


### Example
```jsx

import {connectNode} from "@craftjs/core";
class ButtonInner extends React.Component {
  render() {
    const { connectors: {connect, drag}, isHovered, ...compProps } = this.props;
    const { text, color  } = compProps;

    return (
      <button ref={ ref => connect(drag(ref))} style={{margin: "5px", backgroundColor: color}} >
        {text}
        {
          isHovered ? "I'm being hovered" : null
        }
      </button>
    );
  }
};

export const Button = connectNode((node) => ({
  isHovered: node.events.hovered
}))(ButtonInner);

```
