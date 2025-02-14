import { FormControlLabel, Radio } from '@mui/material';
import React from 'react';

// Inspired by blueprintjs
function StyledRadio(props) {
  return (
    <Radio
      disableRipple
      color="default"
      size="small"
      sx={{
        '&.Mui-checked': {
          color: 'rgb(19, 115, 230)',
        },
      }}
      {...props}
    />
  );
}

export const ToolbarRadio = ({ value, label }: any) => {
  return (
    <FormControlLabel value={value} control={<StyledRadio />} label={label} />
  );
};
