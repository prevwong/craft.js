import React, { useEffect } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { Grid, Slider, makeStyles } from '@material-ui/core'
import { useNode } from 'craftjs';
import { EditorTextInput } from './EditorTextInput'
import { withStyles } from '@material-ui/styles';
const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const SliderStyled = withStyles({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '5px 0',
    width: "100%"
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -7,
    marginLeft: -7,
    '&:focus,&:hover,&$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 11px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
})(Slider);

export type EditorItem = {
  prefix?: string;
  label?: string;
    full?: boolean;
    propKey?: string;    type: string
}
export const EditorItem = ({  full = false, propKey, type, ...props }: EditorItem) => {

  const { actions, value } = useNode((node) => ({ value: node.data.props[propKey] }));
    return (
        <Grid item xs={full ? 12 : 6} >
           {
             ['text', 'color', 'bg', 'number'].includes(type) ? (
               <EditorTextInput {...props} type={type} value={value} onChange={(value) => actions.setProp((props: any) => propKey ? props[propKey] = value : false)} />
             ) : type == 'slider' ? (
              <SliderStyled value={value || 0} onChange={(e, value: number) => {
               
                actions.setProp((props: any) => {
                  // console.log("updating", propKey, value)
                  props[propKey] = value
                })
              }} />
             ) : null
           }
        </Grid>
    )
}
