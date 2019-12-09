import React from "react";
import { Paper, Chip, Grid, makeStyles, colors } from "@material-ui/core";
import { Selector } from "craftjs";
import Card from "./user/Card";
import Button from "./user/Button";
import Text from "./user/Text";

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


const Toolbox = () => {
  const classes = useStyles();
  const chipClasses = useChipStyles();

  return (
    <Paper className={classes.root}>
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