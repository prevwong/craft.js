import { TextField, InputAdornment } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { ChromePicker } from 'react-color';

export type ToolbarTextInputProps = {
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
}: ToolbarTextInputProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const [active, setActive] = useState(false);

  React.useEffect(() => {
    let val = value;
    if (type === 'color' || type === 'bg')
      val = `rgba(${Object.values(value)})`;
    setInternalValue(val);
  }, [value, type]);

  return (
    <div
      style={{ width: '100%', position: 'relative' }}
      onClick={() => {
        setActive(true);
      }}
    >
      {(type === 'color' || type === 'bg') && active ? (
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
          if (e.key === 'Enter') {
            onChange((e.target as any).value);
          }
        }}
        onChange={(e) => {
          setInternalValue(e.target.value);
        }}
        margin="dense"
        variant="standard"
        sx={{
          padding: 0,
          width: '100%',
          background: 'transparent',
          borderRadius: '100px',
          border: 'none',
          margin: 0,
          marginTop: 7,
          position: 'relative',
          '.MuiInputBase-input': {
            background: '#e5e5e5',
            borderRadius: '100px',
            fontSize: '0.9rem',
            position: 'relative',
            paddingLeft: '28px',
          },
        }}
        InputProps={{
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
                className="w-2 h-2 inline-block rounded-full relative z-10"
                style={{
                  left: '15px',
                  background: internalValue,
                }}
              />
            </InputAdornment>
          ) : null,
        }}
        InputLabelProps={{
          classes: {},
          shrink: true,
        }}
        {...props}
      />
    </div>
  );
};
