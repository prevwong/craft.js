import React  from "react";
import { useEditor } from "craftjs";
import styled from "styled-components";
import Checkmark from "../../public/icons/check.svg";
import Customize from "../../public/icons/customize.svg";
import cx from "classnames"; 

const HeaderDiv = styled.div<{ enabled: boolean}>`
  width: ${props => props.enabled ? "100%" : "800px"};
  z-index: 99999;
  position: fixed;
  transform: translateX(-50%);
  left: 50%;
  
  ${props => !props.enabled ? `
    backdrop-filter: blur(12px);
    background: #ccccccc2;
    color:#2d2d2d;
  ` : ''}
`;

const Link = styled.a<any>`
  padding: 20px 0px;
  margin-right:35px;
  font-size:13px;
  position: relative;
  opacity:${props => props.selected ? 1 : 0.8};
  cursor:pointer;
  &:hover {
    opacity:1;
  }
  &:after {
    content: " ";
    display:block;
    width:100%;
    height: 2px;
    background:#fff;
    bottom:${props => props.selected ? 0 : "-2"}px;
    opacity:${props => props.selected ? 1 : 0};
    left:0;
    position:absolute;
  }

`;

const Btn = styled.a`
  display:flex;
  align-items:center;
  padding: 5px 15px;
  border-radius:3px;
  color:#fff;
  font-size:13px;
  svg { 
    margin-right: 6px;
    width: 12px;
    height: 12px;
    fill:#fff;
    opacity:0.9;

  }
`;

export const Header = () => {
  const {enabled, actions: {setOptions}} = useEditor((state) => ({
    enabled: state.options.enabled
  }));
  
  return (
    <HeaderDiv enabled={enabled}  className="bg-light-gray-1 text-white transition w-full">
      {/* <button onClick={() => setEnabled(!enabled)}>{enabled ? "Disable" : "Enable"}</button>
      <button onClick={() => {

        const s = query.serialize();
        // const d = query.deserialize(JSON.stringify(s));
        console.log(JSON.stringify(s));
      }}>Serialize</button>  */}
      <div className="items-center flex w-full px-4 ">
       
        <div className="flex-1">
          <h2 className="mr-5" style={{ fontFamily: "Fakt Pro", fontWeight: 500, fontSize: "20px" }}>craft.js</h2>
        </div>
        <div className="flex items-end justify-end">
          <Link selected={true}>Demo</Link>
          <Link>Github</Link>
          <Link>Documentation</Link>
        </div>
        <div className="flex">
          <Btn 
            className={cx(["transition", {
              "bg-green-400" : enabled,
              "bg-primary" : !enabled
            }])}
            onClick={() => setOptions(options => options.enabled = !enabled)}
          >
            {enabled ? <Checkmark /> : <Customize />}
            {
              enabled ? "Finish Editing" : "Edit"
            }
          </Btn>
        </div>
        {/* <a className="font-medium text-sm px-5 py-1 margin-0 rounded-full bg-primary text-white">Documentation</a> */}
      </div>
    </HeaderDiv>
  )
}

