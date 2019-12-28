---
id: utilities
title: Helpers
sidebar_label: Helpers
---

import {API, Badge} from "./API";


### isRoot
<Badge type="function" />

Returns `true` if a given Node is the Root Node
#### Parameters
<API items={[
  ["node", "Node | NodeId", "The Node object or Node id to check"]
]} /> 

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
#### Parameters
<API items={[
  ["node", "Node | NodeId", "The Node object or Node id to check"]
]} /> 

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

### isMoveable
<Badge type="function" noMargin={true} />

A Node may be moved if it satisfies both of the following conditions:
- The Node is an immediate child of a Canvas Node, hence it's draggable
- The Node's `canDrag` rule allows it to be moved 

#### Parameters
<API items={[
  ["node", "Node", "The Node object to check"]
]} /> 

#### Returns
<API items={[
  ["boolean"]
]} /> 


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


### hasTopLevelCanvases
<Badge type="function" noMargin={true} />

This returns `true` if a Node's User Component defines a `<Canvas />` in its render method.

#### Parameters
<API items={[
  ["node", "Node", "The Node object to check"]
]} /> 

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
