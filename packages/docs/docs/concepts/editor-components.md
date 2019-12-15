---
id: editor-components
title: Interacting with the Editor
---

Previously, we have checked out user components and how to write them; but what about all the other components that are integral to our page editor like a Toolbar for users to edit components, or maybe a layers panel. These components, while they don't deal with any specific `Node`, they need to read the internal state and be able to modify it.

The `useEditor` hook allows us to access and manipulate the entire editor internal state. Essentially, this is similar to the `useNode` hook we have seen previously, except this deals with the entire editor rather than with a particular `Node`.

```jsx
const { actions, connectors, ...collected } = useEditor((state) => {});
```

> Note: Unlike `useNode` which can be only used inside user components, `useEditor` can be used anywhere within the Craft context, including user components.


## Getting state information
Similar with the `useNode`, we can specify a collector function to the `useEditor` hook to retrieve information from the state. The difference is that now we are dealing with the entire editor state rather than just a subset of it involving a Node.

```tsx
const App = () => {
  const { hoveredNodeName } = useEditor((state: Node) => {
    const currentlyHoveredId = state.events.hover;
    return {
      hoveredNodeName: state.nodes[currentlyHoveredId].displayName
    }
  })
  return (
    <h2>The component being hovered is: {hoveredNodeName}</h2>
  )
}
```

## Changing Node state
In user components, we have seen connectors like `connect` and `drag` which are used to manage the DOM and manage a node's event state - `active`, `hover` and `dragging`. 

Now, what if we would need to modify a node's event state ?


Let's say, maybe you are creating a layers panel to display all nodes as a Photoshop-like layers and would like to change the particular Node's event state when the user clicks/hovers/drags your layers ?

```jsx
const LayerItem = (nodeId) => {
  const { connectors: { active }} = useEditor();

  return (
   <div>
      <a ref={ref => active(ref, nodeId)}>Click me to select node {nodeId}</a>
   </div>
  );
}
```

## Manipulating state
We can use the `actions` provided in order to manipulate the editor's internal state

```jsx
const DeleteButtonThingy = () => {
  const { actions, activeNodeId } = useEditor((state) => ({
    activeNodeId: state.events.active
  }));

  return (
    <div>
      <button onClick={() => actions.delete(activeNodeId) }>
        Click me to delete the selected node
      </button>
    </div>
  )
}
```

## Querying

What if you need to know if two nodes are compatible; get all parents of a Node or simply deserialize all Node ? Queries are methods that provides helpful infomation based on the editor's state.


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
Queries are also accesible via the `useEditor` collector function. Let's look at an example where we build a component that returns all the decendants of the current selected Node:

```jsx
const ShowMeMyDecendants = () => {
  const { allDecendants } = useEditor((state, query) => {
    const selectedNodeId = state.events.active;
    let allDecendants = false;

    if (selectedNodeId)  allDecendants = query.getDeepNodes(selectedNodeId, true);  

    return { allDecendants }
  }); 

  return allDecendants ? (
    <div>
      {
        allDecendants.map(node => 
          <li>{node.id}</li>
        )
      }
    </div>
  ) : null
}

```
