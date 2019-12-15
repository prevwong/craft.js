---
id: useEditor
title: useEditor()
sidebar_label: useEditor()
---

import {API} from "./API";

A Hook to that provides methods and state information associated with the entire editor.

```tsx
const { connectors, actions, query, ...collected } = useEditor(collector);
```

> Note: This hook can only be used within a User Component. 


## Reference
### Parameters
<API items={[
  ["collector", "(state: ManagerState, query: Query) => Collected", "A function that collects relevant state information from the editor state. The component will re-render when the values returned by this function changes."]
]} /> 

### Returns

<API items={[
  [null, "Object", [
    ["connectors", "Object", [
      ["select", "(dom: HTMLElement, nodeId: String) => HTMLElement", "Specifies the DOM that when clicked will in turn click the specified Node's user component"],
      ["hover", "(dom: HTMLElement, nodeId: String) => HTMLElement", "Specifies the DOM that when hovered will in turn hover the specified Node's user component"],
      ["drag", "(dom: HTMLElement, nodeId: String) => HTMLElement", "Specifies the DOM that when dragged will move the specified Node's user component"]
    ]],
    ["actions", "Object", [
      ["add", "(nodes: Node | Node[], parentId?: String) => void", "Add Node(s) to the given parent node ID. By default the parentId is the ROOT_ID"],
      ["delete", "(nodeID: String) => void", "Delete the specified Node"],
      ["move", "(nodeId: String, targetParentId: String, index: number) => void", "Move Node to the specified parent Node at the given index. Subject to the conditions in query.canDropInParent()"],
      ["setProp", "(nodeId: String, props: Object) => void", "Manipulate the props of the given Node"],
      ["setHidden", "(nodeId: String, bool: boolean) => void", "When set to true, the user component of the specified Node will be hidden"],
      ["setCustom", "(nodeId: String, custom: (custom: Object) => void", "Update the given Node's custom properties"]
    ]],
    ["query", "Query", [
      ["createNode", "(child: React.ReactElement) => Node", "Create a Node from a React element"],
      ["canDragNode", "(nodeId: String) => boolean", "Check if the given Node can be dragged"],
      ["canDropInParent", "(nodeId: String, parenNodeId: String) => boolean", "Check if the Node can be dropped in the specified Canvas Node"],
      ["getDropPlaceholder", 
        "(sourceNodeId: String, targetNodeId: String, pos: {x: number, y: number}, nodesToDOM?: (node: Node) => HTMLElement = node => node.dom)",
        "Given the target Node and mouse coordinates on the screen, determine the best possible location to drop the source Node. By default, the Node's dom property is taken for consideration."
      ],
      ["serialize", "() => String", "Return the current Nodes in JSON"],
      ["deserialize", "() => String", "Recreate Nodes from JSON"],
      ["getNode", "(id: NodeId) => Node", "Get a Node by its ID"],
      ["getDeepNodes", "(id: NodeId) => Nodes[]", "Return all decendant Nodes"],
      ["getAllParents", "(id: NodeId) => Nodes[]", "Return all ancestor Nodes"],
      ["getOptions", "() => Object", "Get the options specified in the <Craft /> component"]
    ]],
    ["...collected", "Collected", "The collected values returned from the collector"]
  ]
  ]
]} /> 

## Examples
`useEditor` is crucial when you are building components that interacts with the [editor](../concepts/editor-components).

### Collecting state information
```tsx
import {useEditor} from "craftjs";

const Example = () => {
  const { hoveredNodeId } = useEditor((state) => ({
    hoveredNodeId: state.events.hovered
  }));

  return (
    <div>
      The ID of the node currently being hovered is: {hoveredNodeId}
    </div>
  )
}
```

### Hide and Deleting a Node
```jsx
const Example = () => {
  const {selectedNodeId, actions} = useEditor((state) => ({
    selectedNodeId: state.events.selected
  }));
  return selectedNodeId && (
    <div>
      <h2>Node selected: {selectedNodeId}</h2>
      <a onClick={() => actions.hide(selectedNodeId)}>Hide</a>
      <a onClick={() => actions.delete(selectedNodeId)}>Delete</a>
    </div>
  )
}
```

### Move a Node
```jsx
const Example = () => {
  const [sourceId, setSourceId] = useState();
  const [targetId, setTargetId] = useState();
  
  const {selectedNodeId, actions, query} = useEditor((state) => ({
    selectedNodeId: state.events.selected
  }));

  return selectedNodeId && (
    <div>
      <h2>Node selected: {selectedNodeId}</h2>
      <div>
        <input type="text" value={sourceId} placeholder="Source" disabled />
        <button onClick={() => selectedNodeId && setSourceId(selectedNodeId)}>Set selected Node as source</button>
      </div>
      <div>
        <input type="text" value={targetId} placeholder="Target" disabled />
        <button onClick={() => selectedNodeId && setTargetId(selectedNodeId)}>Set selected Node as target</button>
      </div>
      {
        sourceId && targeId ? (
          <button onClick={() => {
            try {
              // .canDropInParent will throw an error message if the conditions failed
              query.canDropInParent(sourceId, targetId); 
              actions.move(sourceId, targetId);
            } catch (e) {
              console.error(e.message);
            } 
          }}>Move Node</button>
        )
      }
    </div>
  )
}
```

### Creating and adding a new Node
```tsx
import {useEditor} from "craftjs";

const Example = () => {
  const { query, actions } = useEditor((state, query) => ({
    hoveredNodeId: state.events.hovered
  }));

  return (
    <div>
      <a onClick={() => {
        const node = query.createNode(<h2>Hi</h2>);
        actions.add(node);
      }}>Click me to add a new Node</a>
    </div>
  )
}
```


### Get the currently selected Node's descendants
> Query methods are also accessible from within the collector function.

```tsx
import {useEditor} from "craftjs";

const Example = () => {
  const { selectedDescendants } = useEditor((state, query) => ({
    selectedDescendants: state.events && query.getDeepNodes(state.events.selected).map(node => node.id)
  }));

  return (
    <ul>
      {
        selectedDescendants && selectedDescendants.map(id => <li>{id}</li> )
      }
    </ul>
  )
}
```

### Display Drop Indicator for best possible drop location
```jsx
const Example = () => {
  const [screenClick, setScreenClick] = useState(false);
  const [sourceId, setSourceId] = useState();
  const [targetId, setTargetId] = useState();
  
  const {selectedNodeId, actions, query} = useEditor((state) => ({
    selectedNodeId: state.events.selected
  }));

  const disableScreenClick = useEffect((e) => {
     if(e.key === "Escape") {
       setScreenClick(false);
    }
  }, [screenClick]);

  const clickOnScreen = useEffect((e) => {
    const {clientX: x, clientY: y} = e;
    const dropIndicator = query.getDropIndicator(sourceId, targetId, {x, y});
    actions.setDropIndicator(dropIndicator);
  }, [screenClick]);
  

  useEffect(() => {
    window.addEventListener("click", clickOnScreen);
    window.addEventListener("keyup", disableScreenClick);
    return (() => {
      window.removeEventListener("click", clickOnScreen);
      window.removeEventListener("keyup", disableScreenClick);
    })
  }, [clickOnScreen, disableScreenClick]);

  return selectedNodeId && (
    <div>
      <h2>Node selected: {selectedNodeId}</h2>
      <div>
        <input type="text" value={sourceId} placeholder="Source" disabled />
        <button onClick={() => selectedNodeId && setSourceId(selectedNodeId)}>Set selected Node as source</button>
      </div>
      <div>
        <input type="text" value={targetId} placeholder="Target" disabled />
        <button onClick={() => selectedNodeId && setTargetId(selectedNodeId)}>Set selected Node as target</button>
      </div>
      {
        sourceId && targeId ? (
          <button onClick={() => {
            setScreenClick(true);
          }}>
            {screenClick ? "Click anywhere on the screen to display indicator" : "Start"}
          </button>
        )
      }
    </div>
  )
}
```