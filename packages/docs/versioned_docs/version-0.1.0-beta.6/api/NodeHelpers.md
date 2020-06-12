---
id: helpers
title: NodeHelpers
sidebar_label: NodeHelpers
---

import {API, Badge} from "@site/src/components";

Methods that helps describe a specified `Node`.

## Usage
### useEditor hook

You can access the NodeHelpers via the `node` query method in the `useEditor` hook.

```jsx
import {useEditor} from "@craftjs/core";

const TextComponent = () => {
  const { id } = useNode();
  const { query: {node} } = useEditor();
  const isRoot = node(id).Root(),
        isDraggable = node(id).Draggable();
  ...
}
```
### User Component rules

NodeHelpers can also be accessed via the last parameter of each User Component rules.

```jsx
const MyComp = () => {

}
MyComp.craft = { 
  rules: {
    canDrag: (node: Node, helper: NodeHelpers) => {
      const ancestors = helper(node.id).ancestors();
      ...
    },
    canMoveIn : (incoming: Node, self: Node, helper: NodeHelpers) => {
      const isRoot = helper(node.id).isRoot();
      ...
    }
    canMoveOut: (outgoing: Node, self: Node, helper: NodeHelpers) => {
      const isDeletable = helper(node.id).isDeletable();
      ...
    }
  }
}
```

## Methods

### get
<Badge type="function" />

Get `Node` object from id

#### Returns
<API items={[
  ["Node"]
]} /> 



### decendants
<Badge type="function" />

Returns an array of Node ids of all decendants

#### Returns
<API items={[
  ["NodeId[]"]
]} /> 



### ancestors
<Badge type="function" />

Returns an array of Node ids of all ancestors

#### Returns
<API items={[
  ["NodeId[]"]
]} /> 


### isRoot
<Badge type="function" />

Returns `true` if a given Node is the Root Node

#### Returns
<API items={[
  ["boolean"]
]} /> 

```jsx {5}
const App  = () => {
  return (
    <Editor>
      <Frame>
        <Canvas> // true
          <div>Yo</div> // false
          <h2>It's me</h2> // false
          <Canvas> // false 
            <h3>Child</h3> // false
          </Canvas>
        </Canvas>
      </Frame>
    </Editor>
  )
}
```

### isCanvas
<Badge type="function" noMargin={true} />

Check if a given Node is a Canvas

#### Returns
<API items={[
  ["boolean"]
]} /> 

```jsx {5,8}
const App  = () => {
  return (
    <Editor>
      <Frame>
        <Canvas> // true
          <div>Yo</div> // false
          <h2>It's me</h2> // false
          <Canvas> // true 
            <h3>Child</h3> // false
          </Canvas>
        </Canvas>
      </Frame>
    </Editor>
  )
}
```

### isDeletable
<Badge type="function" noMargin={true} />

A Node may be deleted as long as it is **not** one of the following:
- Root Node
- Top-level Canvas Nodes

#### Parameters
<API items={[
  ["node", "Node", "The Node object to check"]
]} /> 

#### Returns
<API items={[
  ["boolean"]
]} /> 

```jsx {5,21}
const App  = () => {
  return (
    <Editor resolves={{Container}}>
      <Frame>
        <Canvas> // false
          <div>Yo</div> // true
          <h2>It's me</h2> // true
          <Canvas> // true 
            <h3>Child</h3> // true
            <Container /> // true
          </Canvas>
        </Canvas>
      </Frame>
    </Editor>
  )
}

const Container = () => {
  return (
    <div>
      <Canvas id="main"> // false
        <h2>Hi</h2> // true
      </Canvas>
    </div>
  )
}
```


### isTopLevelCanvas
<Badge type="function" noMargin={true} />

A Canvas Node is considered top-level if it is defined inside a User Component and it is not rendered as an immediate child of another Node.

#### Parameters
<API items={[
  ["node", "Node", "The Node object to check"]
]} /> 

#### Returns
<API items={[
  ["boolean"]
]} /> 

```jsx {21,27}
const App  = () => {
  return (
    <Editor resolves={{Container}}>
      <Frame>
        <Canvas> // false
          <div>Yo</div> // false
          <h2>It's me</h2> // false
          <Canvas> // false 
            <h3>Child</h3> // false
            <Container /> // false
          </Canvas>
        </Canvas>
      </Frame>
    </Editor>
  )
}

const Container = () => {
  return (
    <div>
      <Canvas id="main"> // true
        <h2>Hi</h2> // false
        <Canvas> // false
          <h2>Hi</h2> // false
        </Canvas>
      </Canvas>
      <Canvas id="secondary"> // true
        <h2>Hi</h2> // false
        <Canvas> // false
          <h2>Hi</h2> // false
        </Canvas>
      </Canvas>
    </div>
  )
}
```


### isParentOfTopLevelCanvas
<Badge type="function" noMargin={true} />

This returns `true` if a Node's User Component defines a `<Canvas />` in its render method.


#### Returns
<API items={[
  ["boolean"]
]} /> 



```jsx {10}
const App  = () => {
  return (
    <Editor resolves={{Container}}>
      <Frame>
        <Canvas> // false
          <div>Yo</div> // false
          <h2>It's me</h2> // false
          <Canvas> // false 
            <h3>Child</h3> // false
            <Container /> // true
          </Canvas>
        </Canvas>
      </Frame>
    </Editor>
  )
}

const Container = () => {
  return (
    <div>
      <Canvas id="main"> // false
        <h2>Hi</h2> // false
        <Canvas> // false
          <h2>Hi</h2> // false
        </Canvas>
      </Canvas>
      <Canvas id="seconday"> // false
        <h2>Hi</h2> // false
        <Canvas> // false
          <h2>Hi</h2> // false
        </Canvas>
      </Canvas>
    </div>
  )
}
```



### isDraggable
<Badge type="function" noMargin={true} />

A Node may be dragged and moved if it satisfies both of the following conditions:
- The Node is an immediate child of a Canvas Node, hence it's draggable
- The Node's `canDrag` rule allows it to be moved 


#### Parameters
<API items={[
  ["onError", "(err: string) => void", "Error callback"]
]} /> 



#### Returns
<API items={[
  ["boolean"]
]} /> 



### isDroppable
<Badge type="function" noMargin={true} />


Check if a Node is Droppable relative to the target Node.

#### Parameters
<API items={[
  ["targetId", "NodeId", "The target Node"],
  ["onError", "(err: string) => void", "Error callback"]
]} /> 

#### Returns
<API items={[
  ["boolean"]
]} /> 


#### Example
In the following example, we're checking if our `MyCanvas` component would be able to accept the current selected Node in the editor.
```jsx
const MyCanvas = () => {
  const { id } = useNode();
  const { canWeAcceptTheSelectedNode } = useEditor((state, query) => ({
    canWeAcceptTheSelectedNode: state.events.selected && query.node(id).Droppable(state.events.selected)
  }));
}
```

