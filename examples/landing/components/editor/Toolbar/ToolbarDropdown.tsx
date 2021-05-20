import { FormControl, InputLabel, Select } from '@material-ui/core';
import React from 'react';

export const ToolbarDropdown = ({ title, value, onChange, children }: any) => {
  return (
    <FormControl>
      <InputLabel>{title}</InputLabel>
      <Select native value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </Select>
    </FormControl>
  );
};
