import React from "react";
import { Grid } from "@material-ui/core";
import { useEditor } from "craftjs";
import Card from "./user/Card";
import Button from "./user/Button";
import Text from "./user/Text";

const Toolbox = () => {
  const { connectors, query } = useEditor();

  return (
    <div>
      <Grid container direction="column" ref={ref=> connectors.create(ref, <Button>New</Button>)}>
        <Button variant="contained">Button</Button>
      </Grid>
      <Grid container direction="column" ref={ref=> connectors.create(ref, <Text />)}>
        <Button variant="contained">Text</Button>
      </Grid>
      <Grid container direction="column" ref={ref=> connectors.create(ref, <Card />)}>
        <Button variant="contained">Card</Button>
      </Grid>
      <a onClick={() => {
        console.log(query.serialize())
      }}>Deserialize</a>
    </div>
  )
}

export default Toolbox;