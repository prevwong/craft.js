import React, { useEffect } from 'react';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { TextField, makeStyles, InputAdornment } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    padding: 0,
    width: '100%',
    // background:"#efeff1",
    borderRadius: '100px',
    border: 'none',
    margin: 0,
    marginTop: 7,
    position: 'relative',
  },
  input: {
    background: '#efeff1',
    borderRadius: '100px',
    fontSize: '12px',
    paddingLeft: '28px',
    paddingBottom: '8px',
    paddingTop: '8px',
    margin: 0,
  }, // a style rule
  // notchedOutline: {
  //   borderColor:'transparent',
  //   borderRadius: "100px"
  // }
});

const useLabelStyles = makeStyles({
  root: {
    color: 'rgb(128,128,128)',
  },
  formControl: {
    fontSize: '18px',
    borderRadius: '100px',
    paddingLeft: '0px',
    paddingTop: '3px',
    marginBottom: '3px',
    position: 'relative',
    left: '-12px',
  }, // a style rule
});

export type ToolbarTextInput = {
  prefix?: string;
  label?: string;
  type: string;
  onChange?: (value: any) => void;
  value?: any;
};
export const ToolbarTextInput = ({
  onChange,
  value,
  prefix,
  label,
  type,
  ...props
}: ToolbarTextInput) => {
  const [internalValue, setInternalValue] = useState(value);
  const [active, setActive] = useState(false);
  const classes = useStyles({});
  const labelClasses = useLabelStyles({});
  useEffect(() => {
    // if (value !== internalValue) {
    let val = value;
    if (type == 'color' || type == 'bg') val = `rgba(${Object.values(value)})`;
    setInternalValue(val);
    // }
  }, [value]);

  return (
    <div
      style={{ width: '100%', position: 'relative' }}
      onClick={() => {
        setActive(true);
      }}
    >
      {(type == 'color' || type == 'bg') && active ? (
        <div
          className="absolute"
          style={{
            zIndex: 99999,
            top: 'calc(100% + 10px)',
            left: '-5%',
          }}
        >
          <div
            className="fixed top-0 left-0 w-full h-full cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActive(false);
            }}
          ></div>
          <ChromePicker
            color={value}
            onChange={(color: any) => {
              onChange(color.rgb);
            }}
          />
        </div>
      ) : null}
      <TextField
        label={label}
        style={{ margin: 0, width: '100%' }}
        value={internalValue || ''}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            onChange((e.target as any).value);
          }
        }}
        onChange={(e) => {
          setInternalValue(e.target.value);
        }}
        margin="dense"
        variant="filled"
        InputProps={{
          classes,
          disableUnderline: true,
          startAdornment: ['color', 'bg'].includes(type) ? (
            <InputAdornment
              position="start"
              style={{
                position: 'absolute',
                marginTop: '2px',
                marginRight: '8px',
              }}
            >
              <div
                className="w-2 h-2 inline-block rounded-full relative"
                style={{
                  left: '15px',
                  background: internalValue,
                }}
              />
            </InputAdornment>
          ) : null,
        }}
        InputLabelProps={{
          classes: {
            ...labelClasses,
          },
          shrink: true,
        }}
        {...props}
      />
    </div>
  );
};
