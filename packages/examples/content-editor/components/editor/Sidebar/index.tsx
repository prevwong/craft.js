import React, {useState} from "react"
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Layers } from "craftjs-layers";
import { Toolbar } from '../Toolbar';
import {SidebarItem} from "./SidebarItem";
import styled from "styled-components";
import CustomizeIcon from "../../../public/icons/customize.svg";
import LayerIcon from "../../../public/icons/layers.svg";

export const SidebarDiv = styled.div`
  width: 270px;
  background: #fff;
`;

export const Sidebar = () => {
  const [layersVisible, setLayerVisible] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);

  return (
    <SidebarDiv
      className="bg-white flex-col flex w-2 h-full overflow-auto"
    >
      <div className="flex flex-col h-full">
        <SidebarItem icon={CustomizeIcon} title="Customize" height={!layersVisible ? "full" : "55%"} onChange={(val) => setToolbarVisible(val)}>
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