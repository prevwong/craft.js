---
id: useEditor
title: useEditor()
sidebar_label: useEditor()
---

import {API, Badge} from "@site/src/components";

<Badge type="hook" />


A Hook that provides methods and state information associated with the entire editor.

```tsx
const { connectors, actions, query, ...collected } = useEditor(collector);
```

## Reference
### Parameters
<API items={[
  ["collector", "(state: EditorState, query: Query) => Collected", "A function that collects relevant state information from the editor state. The component will re-render when the values returned by this function changes."]
]} /> 

### Returns

<API items={[
  [null, "Object", [
    ["connectors", "Object", [
      ["select", "(dom: HTMLElement, nodeId: NodeId) => HTMLElement", "Specifies the DOM that when clicked will in turn click the specified Node's user component"],
      ["hover", "(dom: HTMLElement, nodeId: NodeId) => HTMLElement", "Specifies the DOM that when hovered will in turn hover the specified Node's user component"],
      ["drag", "(dom: HTMLElement, nodeId: NodeId) => HTMLElement", "Specifies the DOM that when dragged will move the specified Node's user component. Only applicable if the component is rendered as an immediate child of a &lt;Canvas /&gt; component."],
      ["create", "(dom: HTMLElement, userElement: React.ReactElement) => HTMLElement", "Specifies the DOM that when dragged will create a new instance of the specified User Element at the drop location."]
    ]],
    ["actions", "ActionMethods", [
      ["add", "(nodes: Node, parentId?: NodeId, index?: number) => void", "Add a Node to the given parent node ID at the specified index. By default the parentId is the id of the Root Node"],
      ["addNodeTree", "(tree: NodeTree, parentId?: NodeId) => void", "Add a NodeTree to the given parent node ID at the specified index. By default the parentId is the id of the Root Node"],
      ["clearEvents", "() => void", "Resets the editors events state"],
      ["delete", "(nodeID: NodeId) => void", "Delete the specified Node"],
      ["deserialize", "(data: SerializedNodes | string) => void", "Recreate Nodes from a SerializedNodes object/json. This will clear all the current Nodes in the editor state with the recreated Nodes"],
      ["move", "(nodeId: NodeId, targetParentId: NodeId, index: number) => void", "Move a Node to the specified parent Node at the given index."],
      ["setProp", "(nodeId: NodeId, update: (props: Object) => void) => void", "Manipulate the props of the given Node"],
      ["setCustom", "(nodeId: NodeId, update: (custom: Object) => void) => void", "Manipulate the custom values of the given Node"],
      ["setHidden", "(nodeId: NodeId, bool: boolean) => void", "When set to true, the User Component of the specified Node will be hidden, but not removed"],
      ["setOptions", "(options: Object) => void", "Update the editor's options. The options object passed is the same as the &lt;Editor /&gt; props."],
      ["selectNode", "(nodeId: NodeId | null) => void", "Select the specified node. You can clear the selection by passing `null`"],
      ["history", [
        ["undo", "() => void", "Undo the last recorded action"],
        ["redo", "() => void", "Redo the last undone action"],
        ["ignore", "() => ActionMethods", "Run an action without recording its changes in the history"],
        ["throttle", "(throttleRate: number = 500) => ActionMethods", "Run an action while throttling its changes recorded to the history. This is useful if you need to group the changes made by a certain action as a single history record within a specified time window (throttleRate)."],
        ["merge", "() => ActionMethods", "Run an action and merge its changes into the latest recorded history entry. This is useful for combining multiple related changes into a single history record."],
      ]]
    ]],
    ["query", "QueryMethods", [
      ["getSerializedNodes", "() => SerializedNodes", "Return the current Nodes into a simpler form safe for storage"],
      ["serialize", "() => String", "Return getSerializedNodes() in JSON"],
      ["getOptions", "() => Object", "Get the options specified in the &lt;Editor /&gt; component"],
      ["getDropPlaceholder", 
        "(sourceNodeId: NodeId, targetNodeId: NodeId, pos: {x: number, y: number}, nodesToDOM?: (node: Node) => HTMLElement = node => node.dom)",
        "Given the target Node and mouse coordinates on the screen, determine the best possible location to drop the source Node. By default, the Node's DOM property is taken into consideration."
      ],
      ["node", "(id: NodeId) => NodeHelpers", "Returns an object containing helper methods to describe the specified Node. Click <a href='/docs/api/helpers'>here</a> for more information."],
      ["parseReactElement", "(element: React.ReactElement) => Object", [
        ["toNodeTree", "(normalize?: (node: Node, jsx: React.ReactElement) => void) => NodeTree", "Parse a given React element into a NodeTree"]
      ]],
      ["parseSerializedNode", "(node: SerializedNode) => Object", [
        ["toNode", "(normalize?: (node: Node) => void) => Node", "Parse a serialized Node back into it's full Node form"]
      ]],
      ["parseFreshNode", "(node: FreshNode) => Object", [
        ["toNode", "(normalize?: (node: Node) => void) => Node", "Parse a fresh/new Node object into it's full Node form, ensuring all properties of a Node is correctly initia lised. This is useful when you need to create a new Node."]
      ]],
      ["history", [
        ["canUndo", "() => boolean", "Returns true if undo is possible"],
        ["canRedo", "() => boolean", "Returns true if redo is possible"]
      ]]
    ]],
    ["inContext", "boolean", "Returns false if the component is rendered outside of the &lt;Editor /&gt;. This is useful if you are designing a general component that you also wish to use outside of Craft.js."],
    ["...collected", "Collected", "The collected values returned from the collector"]
  ]
  ]
]} /> 

## Examples

### Collecting state information
```tsx
import {useEditor} from "@craftjs/core";

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

### Updating props
```tsx
import {useEditor} from "@craftjs/core";

const Example = () => {
  const { selectedNodeId, actions: {setProp} } = useEditor((state) => ({
    selectedNodeId: state.events.selected
  }));

  return (
    <a
      onClick={_ => {
        setProp(selectedNodeId, props => {
          props.text = "new value";
        });
      }}
    >
      Update
    </a>
  )
}
```

### Creating new Nodes
```tsx
import {useEditor} from "@craftjs/core";

const Example = () => {
  const { query, actions } = useEditor((state, query) => ({
    hoveredNodeId: state.events.hovered
  }));

  return (
    <div>
      <a onClick={() => {
        const nodeTree = query.parseReactElement(<h2>Hi</h2>).toNodeTree();
        actions.addNodeTree(nodeTree);
      }}>
        Add a new Node from a React Element
      </a>
        
      <a onClick={() => {
        // A fresh Node is a partial Node object
        // where only the data.type property is required
        const freshNode = {
            data: {
                type: 'h1'
            }
        };
        
        // Create a new valid Node object from the fresh Node
        const node = query.parseFreshNode(freshNode).toNode();
        actions.add(node, 'ROOT');
      }}>
        Add a new Node from a Node object
      </a>
    </div>
  )
}
```

### Hiding and Deleting a Node
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

### Moving a Node
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

### Getting the currently selected Node's descendants
> Query methods are also accessible from within the collector function.

```tsx
import {useEditor} from "@craftjs/core";

const Example = () => {
  const { selectedDescendants } = useEditor((state, query) => ({
    selectedDescendants: state.events && query.node(state.events.selected).descendants().map(node => node.id)
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

### Displaying Drop Indicator for the best possible drop location
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

### History

```tsx
import {useEditor} from "@craftjs/core";

const Example = () => {
  const { canUndo, canRedo, actions } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo()
  }));

  return (
    <div>
      {
        canUndo && <button onClick={() => actions.history.undo()}>Undo</button>
      }
      {
        canRedo && <button onClick={() => actions.history.redo()}>Redo</button>
      }

      <button onClick={() => {
        // The following action will be ignored by the history
        // Hence, it will not be possible to undo/redo the following changes
        actions.history.ignore().setProp("ROOT", props => prop.darkMode = !prop.darkMode);
      }}>
        Toggle
      </button>

      <input type="text" onChange={e => {
        // In cases where you need to perform an action in rapid successions
        // It might be a good idea to throttle the changes
        actions.history.throttle().setProp("ROOT", props => props.text = e.target.value);
      }} placeholder="Type some text" />
    </div>
  )
}
```


## Legacy API
For Class Components, use `connectEditor` instead.

<Badge type="hoc" title={false} />


### Parameters
<API items={[
  ["collector", "(node: Node) => Collected", "A function that collects relevant state information from the corresponding Node. The component will re-render when the values returned by this function changes."]
]} /> 

### Injected Props
<API items={[
  ["...useEditor(collector)", "Object", "Identical return values as the useEditor() hook above"]
]} /> 


### Example
```jsx
import { connectEditor } from "@craftjs/core";

class SidebarInner extends React.Component {
  render() {
    const { actions, query, enabled, currentSelectedNodeId } = this.props;
    return (
      <div>
        <input type="checkbox" value={enabled} onChange={
          e => actions.setOptions(options => options.enabled = !enabled)
        } />
        <button 
          onClick={() => {
            console.log(query.serialize())
          }}
        >
            Serialize JSON to console
        </button>
      </div>
    )
  }
}

export const Sidebar = connectEditor((state) => ({
  currentSelectedNodeId: state.events.selected
}))(SidebarInner);
```
