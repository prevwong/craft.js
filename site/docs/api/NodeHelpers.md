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
    canMoveIn : (incoming: Node[], self: Node, helper: NodeHelpers) => {
      const isRoot = helper(self.id).isRoot();
      ...
    }
    canMoveOut: (outgoing: Node[], self: Node, helper: NodeHelpers) => {
      const isDeletable = helper(self.id).isDeletable();
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



### descendants
<Badge type="function" />

Returns an array of Node ids of all child Nodes of a given Node.

#### Parameters
<API items={[
  ["deep", "boolean", "If set to true, retrieve all descendants in nested levels. Default is false"],
  ["includeOnly?", "'childNodes' | 'linkedNodes'", "Get descendants that are either childNodes or linkedNodes. If unset, get all descendants"]
]} /> 


#### Returns
<API items={[
  ["NodeId[]"]
]} /> 

```jsx
// The descendants of `div` when deep=false
<div> 
  // highlight-next-line
  <h2>Yo</h2>
  // highlight-next-line
  <Element is={Container}>
    <h3>Child</h3>
    // highlight-next-line
  </Element>
</div>
```

```jsx
// The descendants of `div` when deep=true
<div> 
  // highlight-start
  <h2>Yo</h2>
  <Element is={Container}>
    <h3>Child</h3>
  </Element>
  // highlight-end
</div>

const Container = () => {
  return (
    <div>
      // highlight-start
      <Element id="linked-div">
        <h1>Hello</h1>
      <Element>
      // highlight-end
    </div>
  )
}
```

```jsx
// The descendants of `div` when deep=true and includeOnly="childNodes" only
<div> 
  // highlight-start
  <h2>Yo</h2>
  <Element is={Container}>
    <h3>Child</h3>
  </Element>
  // highlight-end
</div>

const Container = () => {
  return (
    <div>
      <Element id="linked-div">
        <h1>Hello</h1>
      <Element>
    </div>
  )
}
```

```jsx
// The descendants of `div` when deep=true and includeOnly="linkedNodes" only
<div> 
  <h2>Yo</h2>
  <Element is={Container}>
    <h3>Child</h3>
  </Element>
</div>

const Container = () => {
  return (
    <div>
      // highlight-start
      <Element id="linked-div">
        <h1>Hello</h1>
      <Element>
      // highlight-end
    </div>
  )
}
```

### ancestors
<Badge type="function" />

Returns an array of Node ids of all ancestors

#### Returns
<API items={[
  ["NodeId[]"]
]} /> 



### linkedNodes
<Badge type="function" />

Returns an array of linked Node ids

#### Returns
<API items={[
  ["NodeId[]"]
]} /> 


### childNodes
<Badge type="function" />

Returns an array of child Node ids

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
        <div> // true
          <div>Yo</div> // false
          <h2>It's me</h2> // false
          <Element is={Container}> // false 
            <h3>Child</h3> // false
          </Element>
        </div>
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
        <Element canvas> // true
          <div>Yo</div> // false
          <Element is={Container}>It's me</Element> // false
          <Element canvas> // true 
            <h3>Child</h3> // false
          </Element>
        </Element>
      </Frame>
    </Editor>
  )
}
```

### isLinkedNode
<Badge type="function" noMargin={true} />

Check if a given Node is linked to the parent Node via an arbitary id

#### Returns
<API items={[
  ["boolean"]
]} /> 

```jsx {17}
const App  = () => {
  return (
    <Editor>
      <Frame>
        <Element canvas> // false
          <div>Yo</div> // false
          <Element is={Hero}>It's me</Element> // false
        </Element>
      </Frame>
    </Editor>
  )
}

const Hero = ({background, title}) => {
  return (
    <div style={{ background }}>
      <Element id="title" is={Text} text={title} /> // true
      ...
    </div>
  )
}
```

### isDeletable
<Badge type="function" noMargin={true} />

A Node may be deleted as long as it is **not** one of the following:
- Root Node
- Top-level Node

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
        <div> // false
          <div>Yo</div> // true
          <h2>It's me</h2> // true
          <Element canvas> // true 
            <h3>Child</h3> // true
            <Container /> // true
          </Element>
        </div>
      </Frame>
    </Editor>
  )
}

const Container = () => {
  return (
    <div>
      <Element id="main"> // false
        <h2>Hi</h2> // true
      </Element>
    </div>
  )
}
```


### isTopLevelNode
<Badge type="function" noMargin={true} />

A Node is considered top-level if it's one of the following:

- The Root Node
- A linked Node defined inside a User Component


#### Parameters
<API items={[
  ["node", "Node", "The Node object to check"]
]} /> 

#### Returns
<API items={[
  ["boolean"]
]} /> 

```jsx {5,21,27}
const App  = () => {
  return (
    <Editor resolves={{Container}}>
      <Frame>
        <div> // true
          <div>Yo</div> // false
          <h2>It's me</h2> // false
          <div> // false 
            <h3>Child</h3> // false
            <Container /> // false
          </div>
        </div>
      </Frame>
    </Editor>
  )
}

const Container = () => {
  return (
    <div>
      <Element id="main"> // true
        <h2>Hi</h2> // false
        <Element> // false
          <h2>Hi</h2> // false
        </Element>
      </Element>
      <Element id="secondary"> // true
        <h2>Hi</h2> // false
        <Element> // false
          <h2>Hi</h2> // false
        </Element>
      </Element>
    </div>
  )
}
```


### isParentOfTopLevelNode
<Badge type="function" noMargin={true} />

This returns `true` if a Node's User Component defines a `<Element />` in its render method.


#### Returns
<API items={[
  ["boolean"]
]} /> 



```jsx {10}
const App  = () => {
  return (
    <Editor resolves={{Container}}>
      <Frame>
        <Element> // false
          <div>Yo</div> // false
          <h2>It's me</h2> // false
          <Element> // false 
            <h3>Child</h3> // false
            <Container /> // true
          </Element>
        </Element>
      </Frame>
    </Editor>
  )
}

const Container = () => {
  return (
    <div>
      <Element id="main"> // false
        <h2>Hi</h2> // false
        <Element> // false
          <h2>Hi</h2> // false
        </Element>
      </Element>
      <Element id="seconday"> // false
        <h2>Hi</h2> // false
        <Element> // false
          <h2>Hi</h2> // false
        </Element>
      </Element>
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


### toSerializedNode
<Badge type="function" noMargin={true} />


Gets the current Node in it's `SerializedNode` form

#### Returns
<API items={[
  ["SerializedNode"]
]} /> 



### toNodeTree
<Badge type="function" noMargin={true} />


Gets the current Node and its descendants in its `NodeTree` form

#### Parameters
<API items={[
  ["includeOnly?", "'childNodes' | 'linkedNodes'", "Get descendants that are either childNodes or linkedNodes. If unset, get all descendants"]
]} /> 


#### Returns
<API items={[
  ["NodeTree"]
]} /> 

