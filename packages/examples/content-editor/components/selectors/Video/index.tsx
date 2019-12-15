import React from "react";
import { Container } from "../Container";
import { Canvas, useNode, useEditor} from "craftjs";
import { Text } from "../Text";
import { VideoSettings } from "./VideoSettings";
import styled from "styled-components";
import cx from "classnames";
import YouTube from 'react-youtube';
const YoutubeDiv = styled.div<any>`
width:100%;
height:100%;
> div { height: 100%; }
iframe {
  pointer-events: ${props => props.enabled ? 'none' : 'auto'};
// width:100%!important;
// height:100%!important;
}
`

export const Video = (props: any) => {
    const {enabled, query} = useEditor((state) => ({ enabled: state.options.enabled }));
    const {setProp, connectors:{connect}, selected} = useNode((node) => ({
        selected: node.events.selected
    }));

    const {text, textComponent, color, videoId, ...otherProps} = props;

    return (
        <YoutubeDiv ref={connect} enabled={enabled}>
          <YouTube
            videoId={videoId}
            opts={{
                width:"100%",
                height:"100%",
                showinfo: 0
            }}
          />
        </YoutubeDiv>
    )
}

Video.craft = {
    defaultProps: {
        videoId: "2g811Eo7K8U",
    },
    related: {
        toolbar: VideoSettings
    }
}
