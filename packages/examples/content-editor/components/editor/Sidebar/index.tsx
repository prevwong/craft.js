import React, {useState} from "react"
import { Layers } from "craftjs-layers";
import { Toolbar } from '../Toolbar';
import {SidebarItem} from "./SidebarItem";
import styled from "styled-components";
import CustomizeIcon from "../../../public/icons/customize.svg";
import LayerIcon from "../../../public/icons/layers.svg";
import { useEditor} from "craftjs";

export const SidebarDiv = styled.div<{ enabled: boolean }>`
  width: ${props => props.enabled ? 270 : 0}px;
  background: #fff;
`;

export const Sidebar = () => {
  const [layersVisible, setLayerVisible] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <SidebarDiv
      enabled={enabled}
      className="transition bg-white w-2"
    >
      <div className="flex flex-col h-full">
        <SidebarItem icon={CustomizeIcon} title="Customize" height={!layersVisible ? "full" : "300px"} onChange={(val) => setToolbarVisible(val)}>
          <Toolbar />
        </SidebarItem>
        <SidebarItem icon={LayerIcon} title="Layers" height={!toolbarVisible ? "full" : "45%"}  onChange={(val) => setLayerVisible(val)}>
          <div className="">
            <Layers />
          </div>
        </SidebarItem>
    </div>
    </SidebarDiv>
  )
}