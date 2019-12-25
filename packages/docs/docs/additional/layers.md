---
id: layers
title: Layers
---

import {API} from "../api/API";

Display Photoshop-like layer representation of the editor's Nodes.



## Usage

```bash
yarn add @craftjs/layers
```

```jsx
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

## Reference
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
  ["dom", "HTMLElement", "The DOM of the current layer including it's header and children. This is defined by the `connectLayer` connector"],
  ["headingDom", "HTMLElement", "The DOM of the current Layer's heading. This is defined by the `connectLayerHeader` connector"]
]} /> 


### `<Layers />`
#### Props
<API items={[
  ["expandRootOnLoad", "boolean", "If enabled, the Root Node will be expanded by default"],
  ["renderLayer", "React.ReactElement", "Specify how to render each layer"],
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


### Default components
These following components are available for you to extend upon if you wish to design your own component to render the layers (which can be specified in the `renderLayer` prop).

- `<DefaultLayer />` 
  - `<DefaultLayerHeader />` 
  - `<EditableLayerName>`
    - This component enables the end users to edit the layer names. The values are saved into the respective Node's `custom.displayName` prop.
