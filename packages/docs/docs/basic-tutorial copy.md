---
id: basic-tutorial-backup
title: Basic Tutorial
---

## Overview
In this tutorial, we'll be designing a simple page editor. It's recommended that you have a basic to intermediate workings of React and it'd be even better if you first have a quick glance at the Key Concepts and come back here; but if you are feeling adventourous - that's fine too. 


## Installation

```bash
yarn add craftjs
```

or with npm:
```bash
npm install --save craftjs
```


## Designing an user interface
With Craft.js you decide how your editor should look and function. So, let's build a user interface for our page editor. We'll add the page editor functionalities later.

We'll be using the `material-ui` library for this tutorial:
```bash
yarn add material-ui
```

### User Components
Let's first create the User Components - aka the components that our end users will be able create/edit/move around. 

#### Text
```jsx
import React from "react";
import { Typography } from "@material-ui/core";

export default function Text({text, fontSize}) {
  return (
     <p style={{fontSize}}>{text}</p>
  )
}
```

#### Button
```jsx
import React  from "react";
import {Button as MaterialButton} from "@material-ui/core";

export default function Button({size, variant, primary, children}) {
  return (
    <MaterialButton size={size} variant={variant} color={primary}>
      {children}
    </MaterialButton>
  )
}
```

#### Card
Now, let's create another user component that will be more advanced. This component is intended to have 2 drop areas: 1 area for only text, and another for only buttons.

```jsx
import React  from "react";
import {Card as MaterialCard, CardContent} from "@material-ui/core";
import Text from "./Text";
import Button from "./Button";

export default function Card({bg}) {
  return (
    <MaterialCard style={{backgroundColor: bg, marginBottom: "20px"}}>
      <CardContent>
        <div>
          <Text variant="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula est quis dignissim placerat. Pellentesque aliquam ante a molestie porttitor. 
          </Text>
        </div>
        <div>
          <Button variant="contained">Click</Button>
        </div>
      </CardContent>
    </MaterialCard>
  )
}
```

### The Editor
#### Toolbox
First, let's build a toolbox for which our users would be able to drag and drop to create new instances of those user components we just defined.

```jsx
import React from "react";
import { Grid } from "@material-ui/core";

const Toolbox = () => {
  return (
    <div>
      <Grid container direction="column">
        <Button variant="contained">Button</Button>
      </Grid>
      <Grid container direction="column">
        <Button variant="contained">Text</Button>
      </Grid>
      <Grid container direction="column">
        <Button variant="contained">Card</Button>
      </Grid>
    </div>
  )
}
```

#### Settings Panel
We would also want to create a section here where we can display a bunch of settings for which our users could use them edit the props of the user components.

For now, let's just put in some dummy text fields. We'll revisit this in the later sections.

```jsx
import { Box, Grid, Typography, TextField } from "@material-ui/core";

const SettingsPanel = () => {
  return (
    <Box my={2} mx={1} borderTop={1} borderColor="grey.500">
      <Box mt={1}>
        <Grid container direction="column" spacing={0}>
          <Grid item>
            <Typography variant="subtitle1">Edit</Typography>
          </Grid>
          <Grid item container direction="column" >
            <TextField size="small" margin="dense" id="outlined-basic" label="Setting 1" variant="outlined" />
          </Grid>
          <Grid item container direction="column">
            <TextField size="small" margin="dense" id="outlined-basic" label="Setting 2" variant="outlined" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
```


#### Putting it all together
Now, let's put together our entire React application. 

```jsx
import React from 'react';
import {Box, Container, Typography, Paper, Grid} from '@material-ui/core';
import Toolbox from '../components/Toolbox';
import Button from '../components/user/Button';
import Card from '../components/user/Card';
import SettingsPanel from '../components/SettingsPanel';

export default function App() {
  return (
     <Container maxWidth="md">
      <Typography style={{margin: "20px 0"}} variant="h5" align="center">A super simple page editor</Typography>
      <Grid container>
        <Grid item xs>
        <Box bgcolor="#eee" p={1} style={{ minHeight: "350px"}}>
          <div>
            <Card />
            <Button size="small" variant="outlined">Click</Button>
            <Button size="small" variant="outlined">Click</Button>
          </div>
        </Box>
        </Grid>
        <Paper>
          <Grid container spacing={3} direction="column">
            <Toolbox />
            <SettingsPanel />
          </Grid>
        </Paper>
      </Grid>
    </Container>
  );
}

```

## Implementing Craft.js
Up to this point, we have made an user interface for our page editor. Now, let's get it to work!

### Setup
- First wrap our application with `<Editor />` which sets up the required contexts. We'll also need to specify the list of user components in the `resolver` prop in order for Craft.js to be able to (de)serialize our User Components.

- Then wrap the editable area with `<Frame />` and `<Canvas />` which passess off the rendering process to Craft.js and creates a droppable region respectively.

```jsx {8,15,19,20,24,25,35-36}
import React from 'react';
import {Box, Container, Typography, Paper, Grid} from '@material-ui/core';
import Toolbox from '../components/Toolbox';
import Button from '../components/user/Button';
import Card from '../components/user/Card';
import Text from '../components/user/Text';
import SettingsPanel from '../components/SettingsPanel';
import {Editor, Frame, Canvas} from "craftjs";

export default function App() {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center">A super simple page editor</Typography>
        <Editor resolver={{Card, Button, Text}}> 
          <Grid container>
            <Grid item xs>
              <Box p={1}>
                <Frame>
                  <Canvas>
                    <Card />
                    <Button size="small" variant="outlined">Click</Button>
                    <Button size="small" variant="outlined">Click</Button>
                  </Canvas>
                </Frame>
              </Box>
            </Grid>
            <Paper>
              <Grid container spacing={3} direction="column">
                <Toolbox />
                <SettingsPanel />
              </Grid>
            </Paper>
          </Grid>
        </Editor>
    </Container>
  );
}

```

### Integrating the user components
Now, let's set up our User Components. Every User Component that is rendered to the page will be managed by an object in the editor's internal state called a `Node` .

The `useNode` hook provides us several information and methods related to the corresponding `Node`. Let's first add the `connectors` which acts a bridge between our DOM elements and Craft.js' event handlers.

```jsx {3,5,6,8}
import React from "react";
import { Typography } from "@material-ui/core";
import { useNode } from "craftjs";

export default function Text({text}) {
  const { connectors: {connect, drag} } = useNode();
  return (
    <p ref={ref => connect(drag(ref))}>
      {text}
    </p>
  )
}
```
Let's break this down a little:
- We passed the `connect` connector to the root element of our component, this tells Craft.js that this is DOM that represents the Text component. 
- Then, we also passed `drag` connector to the same root element, this adds the drag handlers to the DOM. Now, when users drag this element, it will move the entire Text component. You could of course add this connector to another part of the component's DOM.

#### Additional Configuration
Let's add some additional configuration to our component via the static `craft` property.

First, let's specify the default props to our component. While this is not strictly necessary, it helps to fill in the initial values into the corresponding Node. 

```jsx {2-7}
const Text = () => {...}
Text.craft = {
  defaultProp: {
      text: "Text",
      fontSize: 14
  }
}
```

We could also define some drag and drop rules.
```jsx {4-6}
const Text = () => {...}
Text.craft = {
  ...
  rules: {
    canDrag: (node) => node.data.props.text != "Drag"
  }
}
```
Our Text component can now only be dragged as long as the `text` prop is not set to "Drag" 🤪

Cool, now let's repeat the same steps for the other 2 components
```jsx
import React  from "react";
import {Button as MaterialButton} from "@material-ui/core";
import {useNode} from "craftjs";

export default function Button({size, variant, color, children}) {
  const {connect, drag} = useNode();
  return (
    <MaterialButton ref={ ref => connect(drag(ref))} style={{margin: "5px"}} size={size} variant={variant} color={color}>
      ...
    </MaterialButton>
  )
}

Button.craft = {
  defaultProps = {
      children: "My Button",
      variant: "contained",
      color: "primary",
      size: "medium"
  }
}

```


```jsx
export default function Card(({bg})) {
  const { connectors: {connect, drag}} = useNode();
  return (
    <MaterialCard ref={connect(drag)} style={{backgroundColor: bg, marginBottom: "20px"}}>
      ...
    </MaterialCard>
  )
}
Card.defaultProps = {
  bg: "#000"
}
```

#### Defining droppable regions
Our Card component will need to have 2 droppable areas, we can do this by wrapping these areas with the `<Canvas />` component. Since we are defining `Canvas` inside a user-component, hence we must specify the `id`.

```jsx {6,10,11,13}
export default function Card(({bg})) {
  const { connectors: {connect, drag}} = useNode();
  return (
    <MaterialCard ref={connect(drag)} style={{backgroundColor: bg, marginBottom: "20px"}}>
      <CardContent>
        <Canvas id="top" is="div">
          <Text variant="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula est quis dignissim placerat. Pellentesque aliquam ante a molestie porttitor. 
          </Text>
        </Canvas>
        <Canvas id="bottom" is="div">
          <Button variant="contained">Click</Button>
        </Canvas>
      </CardContent>
    </MaterialCard>
  )
}
```

You might be wondering how do we set drag/drop rules for those new droppable regions we made. Currently, we have set the `is` prop in our `<Canvas />` to a div, but we can actually point it to a User Component. Hence, we can specify and create a new User Component and define rules via the `craft` prop just like what we have done previously.

```jsx {7-33,40,44}
import React  from "react";
import {Card as MaterialCard, CardContent} from "@material-ui/core";
import Text from "./Text";
import Button from "./Button";
import { Canvas, useNode } from "craftjs";

const TopCanvas = ({children}) => {
  return (
    <div>
      {children}
    </div>
  )
};

TopCanvas.craft = {
  rules: {
    canDrop: (incomingNode, topCanvasNode) => incomingNode.data.type == Text
  }
}

const BottomCanvas = ({children}) => {
  return (
    <div>
      {children}
    </div>
  )
};

BottomCanvas.craft = {
  rules: {
    canDrop: (incomingNode, bottomCanvasNode) => incomingNode.data.type == Button
  }
}

export default function Card() {
  const {connect, drag} = useNode();
  return (
    <MaterialCard ref={ref=> connect(drag(ref))} style={{marginBottom: "20px"}}>
      <CardContent>
        <Canvas id="top" is={TopCanvas}>
          <Text variant="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula est quis dignissim placerat. Pellentesque aliquam ante a molestie porttitor. 
          </Text>
        </Canvas>
        <Canvas id="bottom" is={BottomCanvas}>
          <Button variant="contained">Click</Button>
        </Canvas>
      </CardContent>
    </MaterialCard>
  )
}
```

Remember that every user component must be added to our resolver, so let's add TopCanvas and BottomCanvas:
```jsx
export default function App() {
  return (
    ...
        <Editor
          resolver={{Card, Button, Text, TopCanvas, BottomCanvas}}
        > 
         ...
        </Editor>
     ...
  );
}
```


### Making the components editable
Up till this point, we have a page editor where ours users can drag and drop new components, and move these components around. But, we are missing one more thing - lettings our users to edit these components' props.

The `useNode` hook provides us with the method `setProp` which can be used to manipulate a component's props:

```jsx
const Test = ({text}) => {
  const { setProp } = useNode();

  return (
    <input type="text" value={text} onChange={ e => 
      setProp(props => {
        props.text = e.target.value
      })
    } />
  )
}
```

#### Visual Editing
Let's make it so that our users can directly interact with the components and "visually" edit them - like what you'd see in most modern page editors where you could drag to resize a component for example.

For now though, let's just make our `<Text />` component content editable so that our users can type directly on the DOM itself. For simplicity sake, we wil be using `react-contenteditable` 

```jsx
import React, {useCallback} from "react";
import ContentEditable from 'react-contenteditable'

const Text = ({text}) => {
  const { connectors: {connect, drag}, selected, setProp } = useNode();

  const refConnector = useCallback(ref => connect(drag(ref)), []);

  return (
    <ContentEditable
      innerRef={refConnector}
      html={text} 
      onChange={e => 
        setProp(props => 
          props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")  
        )
      } 
      tagName="p" 
    />
  )
}
```
> `react-contenteditable` depends on `innerRef` to be memoized to maintain the cursor's caret when typing. Hence, we memoized our connectors in the above example using React's `useCallback` hook.

But let's only enable content editable only when the component is being selected. Similar to what we did previously with `useEditor` - to know if our component is being selected, we can specify a collector function to the `useNode` hook:

```jsx
const Text = ({text}) => {
  const { connectors: {connect, drag}, isActive, setProp } = useNode((node) => ({
    isActive: node.events.selected
  }));

  ...
  return (
    <ContentEditable
      ...
      disabled={!isActive}
    />
  )
}
```

#### Settings Panel
What if we wanted to build a sidebar where users could get a bunch of settings for the currently selected component; something that is also very common in most page editors. 

First, we need to get the currently selected component, which can be obtained from the editor's internal state. To do this, we will need to specify a collector function to `useEditor`:

```jsx
const { currentlySelectedId } = useEditor((state) => ({
  currentlySelectedId: state.events.selected
}))
```

But how do we know what inputs to create and what props to edit ? One way is to just get the currently selected Node's props, and conditionally create inputs for each prop. However, as you can imagine that it won't be very pretty.

A better way is if each of our user components could explicitly define what should be displayed in the Settings Panel. This is where Related Components becomes useful.

Let's take our Text component as an example:

```jsx
const Text = () => {...};


const TextSettings = () => {
  const { setProp, children } = useNode((node) => ({
    children: node.data.props.children
  }));

  return (
    <>
      <Grid item container direction="column" >
        <TextField 
          size="small" 
          margin="dense" 
          label="Text" 
          variant="outlined" 
          value={children}
          onChange={e => 
            {
              setProp(props => {
                props.children = e.target.value
              })
            }
          }
        />
      </Grid>
    </>
  )
}

Text.craft = {
  related: {
    settings: TextSettings
  }
}
```

Essentially, a Related component shares the same `Node` context as our actual User component; thus it can make use of the `useNode` hook. 

Additionally, a Related component is registered to a component's `Node` - which means we can access and render this component anywhere within the editor. 

Let's build our Settings Panel now:



```jsx
import { Box, Grid, Typography } from "@material-ui/core";
import { useEditor } from "craftjs";

const SettingsPanel = () => {
  const { currentSettingsPanel } = useEditor((state) => {
    const currentNodeId = state.events.selected;
    let settingsPanel;
    if ( currentNodeId ) {
      settingsPanel = state.nodes[currentNodeId].related.settings;
    }
    return {
      currentSettingsPanel: settingsPanel
    }
  });

  return currentSettingsPanel ? (
    <Box my={2} mx={1} borderTop={1} borderColor="grey.500">
      <Box mt={1}>
        <Grid container direction="column" spacing={0}>
          <Grid item>
            <Typography variant="subtitle1">Edit</Typography>
          </Grid>
          { 
            React.createElement(currentSettingsPanel)
          }
        </Grid>
      </Box>
    </Box>
  ) : null
}
```


### Implementing the Toolbox
Let's go back to our Toolbox component and make it so that dragging those buttons into the editor would create new instances of the user components they represent. 
To do this, we can use a connector supplied by `useEditor` which accepts a user component as its second arguement.
```jsx
import React from "react";
import { Paper, Grid, makeStyles, TextField, Box, Typography } from "@material-ui/core";
import { useEditor } from "craftjs";
import Card from "./user/Card";
import Button from "./user/Button";
import Text from "./user/Text";

const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <Paper>
      <Grid container spacing={3} direction="column">
        <Grid container direction="column" ref={ref=> connectors.create(ref, <Button>New</Button>)}>
          <Button variant="contained">Button</Button>
        </Grid>
        <Grid container direction="column" ref={ref=> connectors.create(ref, <Text />)}>
          <Button variant="contained">Text</Button>
        </Grid>
        <Grid container direction="column" ref={ref=> connectors.create(ref, <Card />)}>
          <Button variant="contained">Card</Button>
        </Grid>
        <Box my={2} mx={1} borderTop={1} borderColor="grey.500">
          <Box mt={1}>
            <Grid container direction="column" spacing={0}>
              <Grid item>
                <Typography variant="subtitle">Edit</Typography>
              </Grid>
              <Grid item container direction="column" >
                <TextField size="small" margin="dense" id="outlined-basic" label="Setting 1" variant="outlined" />
              </Grid>
              <Grid item container direction="column">
                <TextField size="small" margin="dense" id="outlined-basic" label="Setting 2" variant="outlined" />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Paper>
  )
}

export default Toolbox;
```

## Finale