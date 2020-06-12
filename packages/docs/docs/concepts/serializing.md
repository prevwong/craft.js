---
id: serializing
title: Serializing
---

### Serializing
We can serialize the editor's current state of Nodes into JSON by calling the `serialize` method provided by the `useEditor` hook
```jsx
const Toolbar = () => {
  const { query } = useEditor();

  return (
    <a onClick={() => console.log(query.serialize())}>Serialize</a>
  )
}
```

## Resolvers
Craft.js exports the nodes in its internal state into a serialzable JSON format. For this to be possible, complex objects such as functions cannot be included - which means User Components cannot be serialised. 

To overcome this is why when setting up Craft.js with your React application, one of the first things you have to do is to specify a map of user components in the `resolver` prop of the `Manager` component.


```jsx
import {Text, Hero, Container} from ".../myproject/components";

const App = () => {
  return (
    <Manager resolvers={{
      "MyText" : Text
    }}>
      <Frame>
        <Element is="div">
          <h1>Hi</h1>
          <Text text="Hi" />
        </Element>
      </Frame>
    </Manager>
  )
}
```

Given the above example, when a `Node` that is of the type  `Text` is serialised, it will return something like this:
```json
"node-randomId": {
  "type": {
    "resolvedName": "MyText"
  },
  "props": {
    "text" : "Hi World!"
  },
  "parent": "ROOT",
  "displayName": "Card"
  ...
}
```
Notice how the `resolvedName` is `MyText` rather than the name of the component, `Text`. This is because in our `resolver`, we mapped `MyText` to our Text component. Now, when we deserialize - Craft.js is easily able to find `MyText` in our resolver, and knows the component it refers to.
