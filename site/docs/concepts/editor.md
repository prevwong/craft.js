---
id: editor
title: Interacting with the Editor
---


Previously, we have looked at User Components and how to write them, but what about all the other components that are integral to our page editor like a Toolbar for users to edit components, or maybe a layers panel?

The `useEditor` hook allows us to read and manipulate the entire editor's internal state. Essentially, this is similar to the `useNode` hook we have seen previously, except this deals with the entire editor rather than with a particular `Node`.

```jsx
const { actions, connectors, ...collected } = useEditor((state) => {});
```

> Note: Unlike `useNode` which can be only used inside User Components, `useEditor` can be used anywhere within the Craft context, including User Components.


## Getting state information
Similar with the `useNode`, we can specify a collector function to the `useEditor` hook to retrieve information from the internal state. 

```tsx
const App = () => {
  const { hoveredNodeName } = useEditor((state: Node) => {
    const currentlyHoveredId = state.events.hovered;
    return {
      hoveredNodeName: state.nodes[currentlyHoveredId].displayName
    }
  })
  return (
    <h2>The component being hovered is: {hoveredNodeName}</h2>
  )
}
```


## Connectors
With`useEditor`, you can add connectors to DOM elements anywhere in the editor to make use of the editor's internal events. 

Let's say, maybe you are creating a layers panel to display all nodes as Photoshop-like layers (wink wink, `craftjs-layers`) and would like to change the particular Node's event state when the user clicks/hovers/drags your layers.

```jsx
const LayerItem = (nodeId) => {
  const { connectors: { select }} = useEditor();

  return (
   <div>
      <a ref={ref => select(ref, nodeId)}>Click me to select node {nodeId}</a>
   </div>
  );
}
```
Or, maybe drag a button to create a new instance of a User Component
```jsx
const DragToCreate = (nodeId) => {
  const { connectors: { drag }} = useEditor();

  return (
   <div>
      <a ref={ref => create(ref, <Text />)}>Drag me to create a new Text</a>
   </div>
  );
}
```




## Manipulating state
We can use the `actions` provided to manipulate the editor's internal state

```jsx
const DeleteButtonThingy = () => {
  const { actions, selectedNodeId } = useEditor((state) => ({
    selectedNodeId: state.events.selected
  }));

  return (
    <div>
      <button onClick={() => actions.delete(selectedNodeId) }>
        Click me to delete the selected node
      </button>
    </div>
  )
}
```

## Querying

What if you need to know if two nodes are compatible, how to get all parents of a Node or simply deserialize all Nodes? Queries are methods that provide helpful information based on the editor's state.


```jsx
const Sidebar = () => {
  const {query} = useEditor();
  return (
    <div>
      <a onClick={() => {
        console.log(query.deserialize());
      }}>Click me</a>
    </div>
  )
}

```
Queries are also accessible via the `useEditor` collector function. Let's look at an example where we build a component that returns all the descendants of the current selected Node:

```jsx
const ShowMeMyDescendants = () => {
  const { allDescendants } = useEditor((state, query) => {
    const selectedNodeId = state.events.selected;
    let allDescendants = false;

    if (selectedNodeId)  allDescendants = query.node(selectedNodeId).decendants();  

    return { allDescendants }
  }); 

  return allDescendants ? (
    <div>
      {
        allDescendants.map(node => 
          <li>{node.id}</li>
        )
      }
    </div>
  ) : null
}

```

