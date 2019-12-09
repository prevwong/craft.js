---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

In this tutorial, we'll be designing a pretty simple editor. The editor should have a toolbar for which users can drag and drop new components. Each component will be editable via a popover.

For sanity sake, we'll use `material-ui` to build this example.

## Installation

```bash
yarn add craftjs
```

or with npm:
```bash
npm install --save craftjs
```


## Designing an user interface
Wait, what ? You might be wondering why are we doing this first. Well, Craft.js places you in charge of your own user interface and it's behaviors; and is intended to only supplement the page editor capabilities.

Lets start with writing some user components first.

### User Components
#### Text
```jsx
import React from "react";
import { Typography } from "@material-ui/core";

export default function Text({children, variant}) {
  return (
     <Typography variant={variant} align="left">
      {children}
    </Typography>   
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

export default function Card() {
  return (
    <MaterialCard style={{marginBottom: "20px"}}>
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
First, let's build a toolbox for which our users would be able to drag and drop to create new instances of those user components we just defined

```jsx
import React from "react";
import { Paper, Chip, Grid, makeStyles, colors } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2),
    background: "rgb(22, 44, 154)"
  }
}))

const useChipStyles = makeStyles(theme => ({
  root: {
    borderColor: "rgb(255, 255, 255, 0.5)",
    color: "rgb(255, 255, 255)"
  }
}))


export default function Toolbox() {
  const classes = useStyles();
  const chipClasses = useChipStyles();

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
          <Grid item>
            <Chip label='Card' variant="outlined" className={chipClasses.root} />
          </Grid>
          <Grid item>
            <Chip label='Button' variant="outlined" className={chipClasses.root} />
          </Grid>
          <Grid item>
            <Chip label='Text' variant="outlined" className={chipClasses.root} />
          </Grid>
      </Grid>
    </Paper>
  )
}
```

#### Putting it all together

```jsx
import React from 'react';
import {Box, Container, Typography} from '@material-ui/core';
import Toolbox from '../components/Toolbox';
import Button from '../components/user/Button';
import Card from '../components/user/Card';

export default function App() {
  return (
    <Container maxWidth="sm">
      <Typography style={{marginTop: "20px"}} variant="h5" align="center">A super simple page editor</Typography>
      {// Our page builder starts here }
      <Box my={4}>
        <Container maxWidth="xs">
          <Toolbox />
        </Container>
        {// The editable area starts here, this is where users will be able to move things around }
        <Box bgcolor="#eee" p={1} style={{marginTop: "20px", minHeight: "350px"}}>
          <Card />
          <Button size="small" variant="outlined">Click</Button>
          <Button size="small" variant="outlined">Click</Button>
        </Box>
      </Box>
    </Container>
  );
}

```

## Implementing Craft.js
Up to this point, we have made an user interface for our page editor. Now, let's get it to work!

### Setup
- First wrap our application with `<Craft />` which sets up the required contexts. We'll also need to specify the list of user components in the `resolver` prop in order for Craft.js to be able to (de)serialize our user components.

- Then wrap the editable area with the `<Renderer />` which passess off the rendering process to Craft.js. 

- Since Craft.js renders based on the `Nodes` in its internal state, we will need to first convert the components below the Renderer into a `Node`. Additionally, since this is our editable area, hence it must also be made into a droppable region. The `<Canvas />` component creates a `Canvas` node and converts all of it's direct child into a `Node`.

```jsx
import React from 'react';
import {Box, Container, Typography} from '@material-ui/core';
import Toolbox from '../components/Toolbox';
import Button from '../components/user/Button';
import Card from '../components/user/Card';
import Text from '../components/user/Text';
import {Craft, Renderer, Canvas} from "craftjs";

export default function App() {
  return (
    <Container maxWidth="sm">
      <Typography style={{marginTop: "20px"}} variant="h5" align="center">A super simple page editor</Typography>
      <Box my={4}>
        { /** The page editor starts here **/ }
        <Craft
          resolver={{Card, Button, Text}}
        > 
          <Container maxWidth="xs">
            <Toolbox />
          </Container>

          <Box bgcolor="#eee" p={1} style={{marginTop: "20px", minHeight: "350px"}}>
          { /** The editable area starts here, this is where users will be able to move things around **/ }
            <Renderer>
              <Canvas>
                <Card />
                <Button size="small" variant="outlined">Click</Button>
                <Button size="small" variant="outlined">Click</Button>
              </Canvas>
            </Renderer>
          </Box>
        </Craft>
      </Box>
    </Container>
  );
}
```

### Integrating the user components
Now, we need to get our user components to work. The `useNode` hook provides us several information and methods related to the corresponding `Node` that manages the component. For now, we are only concerned with only the `connectors` supplied:

```jsx
const {connectors: {connect, drag}} = useNode();
```
- `connect`: specifies the DOM that represents the user component. The dimensions of the DOM specified will taken into account during drag/drop.
- `drag`: specifies the DOM element that should be made draggable. When the user drags this element will be considered as dragging the entire component, thus moving the entire component to the drop location.


#### Configuration
Additionally, we can specify additional configuration for our components via the static `craft` property

```jsx
const Component = () => {...}
Component.craft = {
  defaultProps: {},
  rules: {
    canDrag: () => true,
    outgoing: () => true,
    incoming: () => true
  },
  related: {}
}
```

- `defaultProps` :  While it's not necessary as we could simply define default parameters directly within our components, however these default values will not actually be recorded into the component's corresponding `Node` when Craft.js renders it, which could leave us with a lots of empty prop values when we wish to retrieve the `Node` for a component when building other parts of our editor.

- `rules`:  
  - `canDrag(currentNode)` : Specifies if a component can be dragged. Applicable only to components whose corresponding `Node` are direct children of a `Canvas`.
  - `canMoveIn(incomingNode, currentNode)`: Decide if an incoming Node can be dropped into the current component. Applicable only to components whose corresponding `Node` is a `Canvas`.
  - `canMoveOut(outgoingNode, currentNode)` : Decide if a child Node can be dragged out of the current component. Applicable only to components whose corresponding `Node` is a `Canvas`.

- `related`: A map of React components to place under the same `Node` context. In other words, these components will have access to the same corresponding `Node`.

```jsx
import React from "react";
import { Typography } from "@material-ui/core";
import { useNode } from "craftjs";

export default function Text({children, variant}) {
  const { connect, drag } = useNode();
  return (
    <div ref={ref=> connect(drag(ref))} style={{padding: "5px"}}>
     ...
    </div>
  )
}


Text.craft = {
  defaultProps = {
      children: "Text",
      variant: "h1"
  }
}
```

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
  // We are defining some weird rule where Buttons cannot be dragged if they are outlined
  canDrag: (node) => node.data.props.variant !== "outlined",
  defaultProps = {
      children: "My Button",
      variant: "contained",
      color: "primary",
      size: "medium"
  }
}

```

```jsx
import React  from "react";
import {Card as MaterialCard, CardContent} from "@material-ui/core";
import Text from "./Text";
import Button from "./Button";
import { Canvas, useNode } from "craftjs";


export default function Card() {
  const {connect, drag} = useNode();
  return (
    <MaterialCard ref={ref=> connect(drag(ref))} style={{marginBottom: "20px"}}>
      ...
    </MaterialCard>
  )
}
```


###  Defining Droppable Regions
Our Card component will need to have 2 droppable areas, we can do this by wrapping these areas with the `<Canvas />` component. Since we are defining `Canvas` inside a user-component, hence we must specify the `id`.

```jsx
import React  from "react";
import {Card as MaterialCard, CardContent} from "@material-ui/core";
import Text from "./Text";
import Button from "./Button";
import { Canvas, useNode } from "craftjs";


export default function Card() {
  const {connect, drag} = useNode();
  return (
    <MaterialCard ref={ref=> connect(drag(ref))} style={{marginBottom: "20px"}}>
      <CardContent>
        <Canvas id="main">
          <Text variant="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula est quis dignissim placerat. Pellentesque aliquam ante a molestie porttitor. 
          </Text>
        </Canvas>
        <Canvas id="second">
          <Button variant="contained">Click</Button>
        </Canvas>
      </CardContent>
    </MaterialCard>
  )
}
```
You might be wondering how do we actually define rules for these droppable regions. `<Canvas />` accepts an `is` prop which can be pointed to a React Component. From there, we can add `craft` prop and define the rules. 

Let us create 2 more components for both of droppable regions and set some arbitary rules

```jsx
import React  from "react";
import {Card as MaterialCard, CardContent} from "@material-ui/core";
import Text from "./Text";
import Button from "./Button";
import { Canvas, useNode } from "craftjs";

const MainCanvas = ({children}) => <div>{children}</div>

MainCanvas.craft = {
  rules: (
    canMoveIn: (targetNode, sourceNode) => targetNode.data.type == Text,
    canMoveOut: (targetNode, sourceNode) => sourceNode.data.children.length > 1
  )
}

const SecondCanvas = ({children}) => <div>{children}</div>

SecondCanvas.craft = {
  rules: (
    canMoveIn: (targetNode, sourceNode) => targetNode.data.type == Button,
    canMoveOut: (targetNode, sourceNode) => sourceNode.data.children.length > 1
  )
}

export default function Card() {
  const {connect, drag} = useNode();
  return (
    ...
      <Canvas id="main" is={MainCanvas}> ...  </Canvas>
      <Canvas id="second" is={SecondCanvas}> ... </Canvas>
    ...
  )
}
```
What we have done is simply specify a rule for the first droppable region to only allow `<Text />` components to be dropped in and when a component is being dragged out, it can only be dragged out if the droppable region has more than 1 children. 


### Making the Toolbox work
Let's go back to our Toolbox component and make it so that dragging those Chips into the editor would actually create new instances of the user components they represent. 

We can do this easily by wrapping the Chips with  a `<Selector />`. We need to specify the `render` prop to the JSX of the user component that we wish to render.

```jsx
import React from "react";
import { Paper, Chip, Grid, makeStyles, colors } from "@material-ui/core";
import { Selector } from "craftjs";
import Card from "./user/Card";
import Button from "./user/Button";
import Text from "./user/Text";

const Toolbox = () => {
  ...
  return (
    <Paper>
      <Grid container spacing={3}>
          <Grid item>
            <Selector render={<Card />}>
              <Chip label='Card' variant="outlined" className={chipClasses.root} />
            </Selector>
          </Grid>
          <Grid item>
            <Selector render={<Button />}>
              <Chip label='Button' variant="outlined" className={chipClasses.root} />
            </Selector>
          </Grid>
          <Grid item>
            <Selector render={<Text />}>
              <Chip label='Text' variant="outlined" className={chipClasses.root} />
            </Selector>
          </Grid>
      </Grid>
    </Paper>
  )
}

export default Toolbox;
```

### Configuring the user components
