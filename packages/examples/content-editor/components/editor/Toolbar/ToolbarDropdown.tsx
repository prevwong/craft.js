import React from 'react';
import { FormControl, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const ToolbarDropdown = ({title, value, onChange, children}: any) => {
  const classes = useStyles({});
  return (
    <FormControl className={classes.formControl}>
      <InputLabel>{title}</InputLabel>
      <Select
        native
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </Select>
    </FormControl>
  )
}