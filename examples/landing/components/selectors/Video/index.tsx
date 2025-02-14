import { useNode, useEditor } from '@craftjs/core';
import React from 'react';
import YouTube from 'react-youtube';
import { styled } from 'styled-components';

import { VideoSettings } from './VideoSettings';

const YoutubeDiv = styled.div<{ $enabled: boolean }>`
  width: 100%;
  height: 100%;
  > div {
    height: 100%;
  }
  iframe {
    pointer-events: ${(props) => (props.$enabled ? 'none' : 'auto')};
    // width:100%!important;
    // height:100%!important;
  }
`;

export const Video = (props: any) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const { videoId } = props;

  return (
    <YoutubeDiv
      ref={(dom) => {
        connect(dom);
      }}
      $enabled={enabled}
    >
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
        }}
      />
    </YoutubeDiv>
  );
};

Video.craft = {
  displayName: 'Video',
  props: {
    videoId: 'IwzUs1IMdyQ',
  },
  related: {
    toolbar: VideoSettings,
  },
};
