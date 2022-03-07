
<div align="center" style={{d}}>
<h1>craft.js</h1>
<a href="https://www.npmjs.com/package/@craftjs/core">
  <img src="https://img.shields.io/npm/v/@craftjs/core?color=%232680eb&label=NPM&logo=npm&logoColor=%232680eb&style=for-the-badge">
</a>
<img src="https://img.shields.io/npm/l/@craftjs/core?color=%23000&style=for-the-badge">
</div>

<div align="center" style={{d}}>
  <img src="https://user-images.githubusercontent.com/16416929/72202590-4d05f500-349c-11ea-9e43-1da1cb0c30e9.gif"/>
</div>

<p align="center">
  <strong>
    <a href="https://craft.js.org/">Live Demo</a>
  </strong>
</p>

Page editors are a great way to provide an excellent user experience. However, to build one is often a pretty dreadful task.

There're existing libraries that come with a fully working page editor out of the box with a user interface and editable components. However, if you wish to make customisations such as modifying the user interface and its behavior, it will most definitely involve modifying the library itself.

Craft.js solves this problem by modularising the building blocks of a page editor. It ships with a drag-n-drop system and handles the way user components should be rendered, updated and moved - among other things. With this, you'll be able to build your own page editor exactly how you want it to look and behave.

## Docs
- [Core concepts](https://craft.js.org/docs/concepts/nodes)
- [Tutorial](https://craft.js.org/docs/guides/basic-tutorial)
- [API Reference](https://craft.js.org/docs/api/editor-state)

## Examples
These examples should give you an idea on the flexibility of Craft.js.

Both these examples look very different from each other, with very different UI. But they are both built with Craft.js! 🤯

- [Landing](https://craft.js.org)
- [Basic](https://craft.js.org/examples/basic)


## Features :fire:
### It's just React
No need for complicated plugin systems. Design your editor from top to bottom the same way as you would design any other frontend application in React.

A simple user component can easily be defined as such:
```jsx
import {useNode} from "@craftjs/core";

const TextComponent = ({text}) => {
  const { connectors: {drag} } = useNode();

  return (
    <div ref={drag}>
      <h2>{text}</h2>
    </div>
  )
}
```

Heck, the entire UI of your page editor is built using just React.
```jsx
import React from "react";
import {Editor, Frame, Canvas, Selector} from "@craftjs/core";
const App = () => {
  return (
    <div>
      <header>Some fancy header or whatever</header>
      <Editor>
        // Editable area starts here
        <Frame resolver={{TextComponent, Container}}>
          <Canvas>
            <TextComponent text="I'm already rendered here" />
          </Canvas>
        </Frame>
      </Editor>
    </div>
  )
}
```

### Control how your components are edited
An obvious requirement for page editors is that they need to allow users to edit components. With Craft.js, you control the process of which these components should be edited.

In the following example, when the user clicks on a component, we'll display a modal that requires the user to input a value for the `text` prop. As the input value changes, the component will be re-rendered with updated prop.

```jsx
import {useNode} from "@craftjs/core";

const TextComponent = ({text}) => {
  const { connectors: { connect, drag }, isClicked, actions: {setProp} } = useNode(
    (state) => ({
      isClicked: state.event.selected,
    })
  );

  return (
    <div ref={dom => connect(drag(dom))}>
      <h2>{text}</h2>
      {
        isClicked ? (
          <Modal>
            <input
              type="text"
              value={text}
              onChange={e => setProp(e.target.value)}
            />
          </Modal>
        )
      }
    </div>
  )
}
```
With this, you could easily implement content editable text or drag-to-resize components, just as any modern page editor would have.

### User components with droppable regions
Let's say we need a "Container" component which users can drop into the editor. Additionally, we would also like them to be able to drag and drop other components into the Container.

In Craft.js, it's as simple as calling the `<Canvas />`

```jsx
import {useNode} from "@craftjs/core";
const Container = () => {
  const { connectors: {drag} } = useNode();

  return (
    <div ref={drag}>
      <Canvas id="drop_section">
         // Now users will be able to drag/drop components into this section
        <TextComponent />
      </Canvas>
    </div>
  )
}
```

### Extensible
Craft.js provides an expressive API which allows you to easily read and manipulate the editor state. Let's say you would like to implement a copy function for a component:
```jsx
import {useEditor, useNode} from "@craftjs/core";
const Container = () => {
  const { actions: {add}, query: { createNode, node } } = useEditor();
  const { id, connectors: {drag, connect} } = useNode();
  return (
    <div ref={dom => connect(drag(dom))}>
      ...
      <a onClick={() => {
        const { data: {type, props}} = node(id).get();
        add(
          createNode(React.createElement(type, props));
        );
      }}>
        Make a copy of me
      </a>
    </div>
  )
}

```

### Serializable state
The editor's state can be serialized into JSON which you can then apply a compression technique of your choice for storage.

```jsx
const SaveButton = () => {
  const { query } = useEditor();
  return <a onClick={() => console.log(query.serialize()) }>Get JSON</a>
}
```

Of course, Craft.js will also able to recreate the entire state from the JSON string.
```jsx
const App = () => {
  const jsonString = /* retrieve JSON from server */
  return (
    <Editor>
      <Frame json={jsonString}>
        ...
      </Frame>
    </Editor>
  )
}
```

## Who is this for? 🤔
You should use this if:
- ✅ You want to design your page editor according to your own UI specifications. With Craft.js, you control almost every aspect of the look and feel of your page editor.
- ✅ You like the React ecosystem. Being a React framework, not only do you get to build your user interface declaratively, but you will also be able to extend upon thousands of existing React components for your page editor.
- ✅ You're the coolest kid in class 😎

You should not use this if:
- ❌ You need a page editor that works out of the box. Craft.js is an abstraction where you implement your own page editor upon. For example, it does not come with a ready-made user interface.
  - However, you could still consider using the [examples](https://github.com/prevwong/craft.js/tree/develop/examples) as a starting point.


## Additional Packages :tada:
- **[@craftjs/layers](https://github.com/prevwong/craft.js/tree/develop/packages/layers)** A Photoshop-like layers panel

## Acknowledgements :raised_hands:

- **[react-dnd](https://github.com/react-dnd/react-dnd)** The React drag-n-drop library.
Although it is not actually used here, many aspects of Craft.js are written with react-dnd as a reference along with some utilities and functions being borrowed.
- **[Grape.js](https://github.com/artf/grapesjs)** The HTML web builder framework. This has served as an inspiration for Craft.js. The element positioning logic used in Craft.js is borrowed from Grape.js
- **[use-methods](https://github.com/pelotom/use-methods)** A super handy hook when dealing with reducers. Craft.js uses a slightly modified version of `use-methods` to better fit our API.


## Getting Help :wave:

If you have questions or there's something you'd like to discuss (eg: contributing), please head over to our [Discord](https://discord.gg/sPpF7fX) server.

## Contributors ✨

Craft.js is made with :heart: by these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/prevwong"><img src="https://avatars3.githubusercontent.com/u/16416929?v=4" width="100px;" alt=""/><br /><sub><b>Prev Wong</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=prevwong" title="Code">💻</a> <a href="#design-prevwong" title="Design">🎨</a> <a href="https://github.com/prevwong/craft.js/commits?author=prevwong" title="Documentation">📖</a> <a href="#ideas-prevwong" title="Ideas, Planning, & Feedback">🤔</a> <a href="#example-prevwong" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/azreenashah"><img src="https://avatars0.githubusercontent.com/u/26489181?v=4" width="100px;" alt=""/><br /><sub><b>azreenashah</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=azreenashah" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/fengzilong"><img src="https://avatars0.githubusercontent.com/u/9125255?v=4" width="100px;" alt=""/><br /><sub><b>MO</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=fengzilong" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/ankri"><img src="https://avatars3.githubusercontent.com/u/2842920?v=4" width="100px;" alt=""/><br /><sub><b>Andy Krings-Stern</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=ankri" title="Code">💻</a> <a href="https://github.com/prevwong/craft.js/commits?author=ankri" title="Documentation">📖</a> <a href="#ideas-ankri" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://dackdive.hateblo.jp/"><img src="https://avatars0.githubusercontent.com/u/1001444?v=4" width="100px;" alt=""/><br /><sub><b>Shingo Yamazaki</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=zaki-yama" title="Documentation">📖</a></td>
    <td align="center"><a href="http://joelschneider.com"><img src="https://avatars0.githubusercontent.com/u/3977552?v=4" width="100px;" alt=""/><br /><sub><b>Joel Schneider</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/issues?q=author%3Ajmschneider" title="Bug reports">🐛</a> <a href="https://github.com/prevwong/craft.js/commits?author=jmschneider" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Enva2712"><img src="https://avatars0.githubusercontent.com/u/18131608?v=4" width="100px;" alt=""/><br /><sub><b>Evan Rusmisel</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=Enva2712" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.candu.ai"><img src="https://avatars0.githubusercontent.com/u/1311832?v=4" width="100px;" alt=""/><br /><sub><b>Michele Riccardo Esposito</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=mresposito" title="Code">💻</a> <a href="#ideas-mresposito" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/matdru"><img src="https://avatars1.githubusercontent.com/u/4158076?v=4" width="100px;" alt=""/><br /><sub><b>Mateusz Drulis</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=matdru" title="Code">💻</a> <a href="#ideas-matdru" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/sprabowo"><img src="https://avatars2.githubusercontent.com/u/11748183?v=4" width="100px;" alt=""/><br /><sub><b>Sigit Prabowo</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/issues?q=author%3Asprabowo" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://vjsrinath.com"><img src="https://avatars0.githubusercontent.com/u/5001683?v=4" width="100px;" alt=""/><br /><sub><b>Srinath Janakiraman</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/commits?author=vjsrinath" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/boqiaok"><img src="https://avatars1.githubusercontent.com/u/15731814?v=4" width="100px;" alt=""/><br /><sub><b>Kim</b></sub></a><br /><a href="https://github.com/prevwong/craft.js/issues?q=author%3Aboqiaok" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!


## Support :heart_decoration:

Craft.js is released under the [MIT license](https://github.com/prevwong/craft.js/blob/master/LICENSE) and is built with 100% love. If you found it useful and would like to ensure its continued development, please consider becoming a backer/sponsor or making a one-time donation via <a href="https://opencollective.com/craftjs/contribute" target="_blank">Open Collective</a> or <a href="https://paypal.me/prevwong" target="_blank">Paypal</a>.


<a href="https://opencollective.com/craftjs/contribute" target="_blank">
  <img src="https://opencollective.com/craftjs/donate/button@2x.png?color=blue" width="260" />
</a>
