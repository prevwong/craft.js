import { useEditor } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import React, { useState } from 'react';
import styled from 'styled-components';

import { SidebarItem } from './SidebarItem';

import CustomizeIcon from '../../../../public/icons/customize.svg';
import LayerIcon from '../../../../public/icons/layers.svg';
import { Toolbar } from '../../Toolbar';

export const SidebarDiv = styled.div<{ enabled: boolean }>`
  width: 280px;
  opacity: ${(props) => (props.enabled ? 1 : 0)};
  background: #fff;
  margin-right: ${(props) => (props.enabled ? 0 : -280)}px;
`;

const CarbonAdsContainer = styled.div`
  width: 100%;
  margin-top: auto;

  #carbonads * {
    margin: initial;
    padding: initial;
  }

  #carbonads {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial,
      sans-serif;

    padding: 10px 0.5rem;
    border-top: 1px solid rgb(229 231 235);
  }

  #carbonads {
    display: flex;
    width: 100%;
    background-color: transparent;
    z-index: 100;
  }

  #carbonads a {
    color: inherit;
    text-decoration: none;
  }

  #carbonads a:hover {
    color: inherit;
  }

  #carbonads span {
    position: relative;
    display: block;
    overflow: hidden;
  }

  #carbonads .carbon-wrap {
    display: flex;
  }

  #carbonads .carbon-img {
    display: block;
    margin: 0;
    line-height: 1;
  }

  #carbonads .carbon-img img {
    display: block;
  }

  #carbonads .carbon-text {
    font-size: 11px;
    padding: 10px;
    margin-bottom: 16px;
    line-height: 1.5;
    text-align: left;
    color: #333333;
    font-weight: 400;
  }

  #carbonads .carbon-poweredby {
    display: block;
    padding: 6px 8px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    font-size: 8px;
    line-height: 1;
    position: absolute;
    bottom: 0;
    right: 0;
    color: #8f8f8f;
  }
`;

export const Sidebar = () => {
  const [layersVisible, setLayerVisible] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <SidebarDiv enabled={enabled} className="sidebar transition bg-white w-2">
      <div className="flex flex-col h-full">
        <SidebarItem
          icon={CustomizeIcon}
          title="Customize"
          height={!layersVisible ? 'full' : '55%'}
          visible={toolbarVisible}
          onChange={(val) => setToolbarVisible(val)}
        >
          <Toolbar />
        </SidebarItem>
        <SidebarItem
          icon={LayerIcon}
          title="Layers"
          height={!toolbarVisible ? 'full' : '45%'}
          visible={layersVisible}
          onChange={(val) => setLayerVisible(val)}
        >
          <div className="">
            <Layers expandRootOnLoad={true} />
          </div>
        </SidebarItem>
        <CarbonAdsContainer>
          <script
            async
            type="text/javascript"
            src="//cdn.carbonads.com/carbon.js?serve=CEAI453N&placement=craftjsorg"
            id="_carbonads_js"
          ></script>
        </CarbonAdsContainer>
      </div>
    </SidebarDiv>
  );
};
