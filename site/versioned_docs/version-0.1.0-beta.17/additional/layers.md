---
id: layers
title: Layers
---

import {API, Image} from "@site/src/components";

A Photoshop-like layers panel for your page editor.

<Image img="layers.gif" />

## Usage

```bash
yarn add @craftjs/layers
```

```jsx
import React from "react";
import {Editor} from "@craftjs/core"
import {Layers} from "@craftjs/layers"

export default function App() {
  return (
    <div style={{margin: "0 auto", width: "800px"}}>
      <Typography variant="h5" align="center">A super simple page editor</Typography>
      <Editor resolver={...}>
        <Layers />
      </Editor>
    </div>
  );
} 
```


## Types
### Layer
#### Properties
<API items={[
  ["id", "NodeId", "A randomly generated unique id"],
  ["depth", "number", "A depth of the current Layer"],
  ["expanded", "boolean", "Returns true if the Layer is expanded"],  
  ["events", "Object", [
    ["selected", "boolean", "Is true if the layer is clicked"],
    ["hovered", "boolean", "Is true if the layer is being hovered"],
  ]],
  ["dom", "HTMLElement", "The DOM of the current layer including its header and children. This is defined by the `connectLayer` connector"],
  ["headingDom", "HTMLElement", "The DOM of the current Layer's heading. This is defined by the `connectLayerHeader` connector"]
]} /> 



## Reference
### `<Layers />`
#### Props
<API items={[
  ["expandRootOnLoad?", "boolean", "Optional. If enabled, the Root Node will be expanded by default"],
  ["renderLayer?", "React.ReactElement", "Optional. Specify the component to render each layer"],
]} /> 

### `useLayer`
#### Parameters
<API items={[
  ["collector", "(layer: Layer) => Collected", "A function that collects relevant state information from the corresponding `Layer`. The component will re-render when the values returned by this function changes."]
]} /> 



#### Returns
<API items={[
  [null, "Object", [
    ["connectors", "Object", [
      ["drag", "(dom: HTMLElement, nodeId: String) => HTMLElement", "Specifies the DOM that should be draggable"],
      ["layer", "(dom: HTMLElement, nodeId: String) => HTMLElement", "Specifies the DOM that represents the entire Layer"],
      ["layerHeading", "(dom: HTMLElement, nodeId: String) => HTMLElement", "Specifies the DOM that represents the layer's heading"]
    ]],
    ["actions", "Object", [
      ["toggleLayer", "() => void", "Toggle the corresponding Layer's expanded state"]
    ]]
  ]]
]} /> 


## Default components
The following components are available for you to extend if you wish to design your own component to render the layers (which can be specified in the `renderLayer` prop).

- `<DefaultLayer />` 
  - `<DefaultLayerHeader />` 
    - `<EditableLayerName>` This component enables the end user to edit the layer names. The values are saved into the respective Node's `custom.displayName` prop.

```jsx

const Layer = () => {
  return (
    <div>
      <DefaultLayerHeader />
    </div>
  )
}

const App = () => {
  return (
    <Editor>
      <Frame>
        ...
      </Frame>
      <Layers 
        renderLayer={Layer}
      />
    </Editor>
  )
}
```
