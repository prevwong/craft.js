import { useEditor } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import React, { useState } from 'react';
import { styled } from 'styled-components';

import { SidebarItem } from './SidebarItem';

import CustomizeIcon from '../../../../public/icons/customize.svg';
import LayerIcon from '../../../../public/icons/layers.svg';
import { Toolbar } from '../../Toolbar';

export const SidebarDiv = styled.div<{ $enabled: boolean }>`
  width: 280px;
  opacity: ${(props) => (props.$enabled ? 1 : 0)};
  background: #fff;
  margin-right: ${(props) => (props.$enabled ? 0 : -280)}px;
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
    display: flex;
    align-items: center;
    margin: 0;
    line-height: 1;
    max-width: 30%;
  }

  #carbonads .carbon-img img {
    display: block;
    max-width: 100% !important;
  }

  #carbonads .carbon-text {
    font-size: 12px;
    padding: 10px;
    margin-bottom: 16px;
    line-height: 1.5;
    text-align: right;
    color: #333333;
    font-weight: 400;
    flex: 1;
  }

  #carbonads .carbon-poweredby {
    display: block;
    padding: 6px 8px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    font-size: 9px;
    line-height: 1;
    position: absolute;
    bottom: 0;
    right: 0;
    color: #8f8f8f;
  }
`;

const Carbonads = () => {
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const { current: dom } = domRef;

    if (!dom) {
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('async', 'true');

    script.setAttribute(
      'src',
      '//cdn.carbonads.com/carbon.js?serve=CEAI453N&placement=craftjsorg'
    );
    script.setAttribute('id', '_carbonads_js');

    dom.appendChild(script);

    return () => {
      const ad = dom.querySelector('#carbonads');
      if (ad) {
        dom.removeChild(ad);
      }

      dom.removeChild(script);
    };
  }, []);

  return <CarbonAdsContainer ref={domRef} />;
};

export const Sidebar = () => {
  const [layersVisible, setLayerVisible] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <SidebarDiv $enabled={enabled} className="sidebar transition bg-white w-2">
      <div className="flex flex-col h-full">
        <SidebarItem
          icon={CustomizeIcon}
          title="Customize"
          height={!layersVisible ? 'full' : '55%'}
          visible={toolbarVisible}
          onChange={(val) => setToolbarVisible(val)}
          className="overflow-auto"
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
        <Carbonads />
      </div>
    </SidebarDiv>
  );
};
